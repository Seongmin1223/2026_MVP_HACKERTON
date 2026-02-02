// src/main.js
import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

console.log("three.js loaded")

/* =========================
   기본 씬 세팅
========================= */
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xf2f2f2)

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  5000
)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

/* =========================
   컨트롤 / 라이트
========================= */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.add(new THREE.AmbientLight(0xffffff, 0.6))

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
dirLight.position.set(3, 5, 3)
scene.add(dirLight)

// 디버그용 축
scene.add(new THREE.AxesHelper(0.5))

/* =========================
   슬라이더 UI
========================= */
const slider = document.createElement("input")
slider.type = "range"
slider.min = "0"
slider.max = "1"
slider.step = "0.01"
slider.value = "0"
slider.style.position = "fixed"
slider.style.top = "20px"
slider.style.left = "20px"
slider.style.width = "320px"
slider.style.zIndex = "10"
document.body.appendChild(slider)

/* =========================
   GLTF 로딩 준비
========================= */
const loader = new GLTFLoader()

let modelRoot = null
let baseNode = null // 기준: part4

// ✅ “비율(스케일)”로 분해
let EXPLODE_FACTOR = 0.9

// partKey → Set(부품 노드들)
const partsByKey = new Map()

/* =========================
   유틸 함수들
========================= */

// part1_mesh_2 → part1
function normalizePartKey(name) {
  const m = name.match(/^part\d+/)
  if (m) return m[0]
  return name.replace(/_\d+$/, "")
}

// mesh에서 “실제로 움직일 부품 노드” 찾기
function getPartNode(mesh, root) {
  let n = mesh
  for (let i = 0; i < 3; i++) {
    if (!n.parent) break
    if (n.parent === root) break
    n = n.parent
  }
  return n
}

// 오브젝트의 월드 중심 계산(현재 위치 기준)
function getWorldCenter(obj) {
  const box = new THREE.Box3().setFromObject(obj)
  return box.getCenter(new THREE.Vector3())
}

// 카메라 자동 맞춤
function fitCameraToObject(object3d) {
  const box = new THREE.Box3().setFromObject(object3d)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  controls.target.copy(center)
  controls.update()

  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = (camera.fov * Math.PI) / 180
  let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2))
  cameraZ *= 2.2

  camera.position.set(center.x, center.y + maxDim * 0.3, center.z + cameraZ)
  camera.near = maxDim / 100
  camera.far = maxDim * 100
  camera.updateProjectionMatrix()

  return maxDim
}

/* =========================
   ✅ 슬라이더 기준 “초기 조립 상태” 저장/복구
   - 드래그로 움직여도 slider를 건드리면 초기 조립 상태로 돌아가야 함
========================= */

// 모든 노드를 초기 조립 위치로 복구
function restoreAssemblyPose() {
  for (const nodeSet of partsByKey.values()) {
    for (const node of nodeSet) {
      const a = node.userData.assemblyPos
      if (!a) continue
      node.position.copy(a)
    }
  }
  if (modelRoot) modelRoot.updateMatrixWorld(true)
}

// 초기 조립 상태(assemblyPos) 기반으로 explodedPos 계산
function prepareExplodeFromAssembly() {
  if (!baseNode) {
    console.warn("baseNode(part4) not found")
    return
  }

  // ✅ 계산 전에 반드시 “조립 상태”로 맞춘 뒤 계산
  restoreAssemblyPose()

  const baseCenter = getWorldCenter(baseNode)

  // ✅ part별 분해 가중치 (part5~9만 조금 더)
  const PART_EXPLODE_WEIGHT = {
    part5: 1.2,
    part6: 1.35,
    part7: 1.4,
    part8: 1.45,
    part9: 1.5,
  }

  for (const [key, nodeSet] of partsByKey.entries()) {
    for (const node of nodeSet) {
      // 기준 부품(part4)은 slider에서 고정(조립 위치 그대로)
      if (node === baseNode) {
        node.userData.explodedPos = node.userData.assemblyPos.clone()
        continue
      }

      const nodeCenter = getWorldCenter(node)

      // base -> node 벡터(월드)
      const v = new THREE.Vector3().subVectors(nodeCenter, baseCenter)
      if (v.lengthSq() < 1e-10) v.set(0, 1, 0)

      // ✅ part별 가중치 적용
      const weight = PART_EXPLODE_WEIGHT[key] ?? 1.0

      // target = base + v * (1 + EXPLODE_FACTOR * weight)
      const targetWorldCenter = baseCenter.clone().add(
        v.multiplyScalar(1 + EXPLODE_FACTOR * weight)
      )

      // parent 로컬 좌표로 변환
      const parent = node.parent
      if (!parent) continue

      const targetLocal = targetWorldCenter.clone()
      parent.worldToLocal(targetLocal)

      node.userData.explodedPos = targetLocal
    }
  }
}

// slider 적용: 항상 assemblyPos ↔ explodedPos 사이를 보간
function applySlider(t) {
  for (const nodeSet of partsByKey.values()) {
    for (const node of nodeSet) {
      const from = node.userData.assemblyPos
      const to = node.userData.explodedPos
      if (!from || !to) continue
      node.position.lerpVectors(from, to, t)
    }
  }
}

/* =========================
   ✅ 부품 클릭/드래그 이동
========================= */
const raycaster = new THREE.Raycaster()
const mouseNDC = new THREE.Vector2()

let draggingNode = null
let dragPlane = new THREE.Plane()
let dragHit = new THREE.Vector3()
let dragOffsetWorld = new THREE.Vector3()

// 클릭한 부품 강조(선택 사항)
let highlightedMeshes = []
function clearHighlight() {
  highlightedMeshes.forEach((m) => {
    if (m.userData.__oldEmissive && m.material?.emissive) {
      m.material.emissive.copy(m.userData.__oldEmissive)
    }
  })
  highlightedMeshes = []
}
function highlightNode(node) {
  clearHighlight()
  node.traverse((obj) => {
    if (!obj.isMesh) return
    const mat = obj.material
    if (!mat || !mat.emissive) return
    obj.userData.__oldEmissive = mat.emissive.clone()
    mat.emissive.set(0x222222)
    highlightedMeshes.push(obj)
  })
}

function setMouseFromEvent(e) {
  const rect = renderer.domElement.getBoundingClientRect()
  mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  mouseNDC.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
}

function pickMeshUnderMouse(e) {
  if (!modelRoot) return null
  setMouseFromEvent(e)
  raycaster.setFromCamera(mouseNDC, camera)
  const hits = raycaster.intersectObject(modelRoot, true)
  if (!hits.length) return null
  return hits[0].object
}

function startDrag(e) {
  if (e.button !== 0) return

  const mesh = pickMeshUnderMouse(e)
  if (!mesh) return

  const node = getPartNode(mesh, modelRoot)

  // ✅ part4도 이동되게 해야 하므로 금지 로직 없음
  draggingNode = node
  highlightNode(draggingNode)

  controls.enabled = false

  // 드래그 평면: 카메라 정면에 수직
  const nodeWorldPos = new THREE.Vector3()
  draggingNode.getWorldPosition(nodeWorldPos)
  const planeNormal = new THREE.Vector3()
  camera.getWorldDirection(planeNormal)
  dragPlane.setFromNormalAndCoplanarPoint(planeNormal, nodeWorldPos)

  setMouseFromEvent(e)
  raycaster.setFromCamera(mouseNDC, camera)
  raycaster.ray.intersectPlane(dragPlane, dragHit)

  dragOffsetWorld.subVectors(nodeWorldPos, dragHit)

  slider.disabled = true
}

function moveDrag(e) {
  if (!draggingNode) return

  setMouseFromEvent(e)
  raycaster.setFromCamera(mouseNDC, camera)

  const hit = new THREE.Vector3()
  const ok = raycaster.ray.intersectPlane(dragPlane, hit)
  if (!ok) return

  const targetWorldPos = hit.add(dragOffsetWorld)

  const parent = draggingNode.parent
  if (!parent) return

  const targetLocal = targetWorldPos.clone()
  parent.worldToLocal(targetLocal)

  draggingNode.position.copy(targetLocal)
}

function endDrag() {
  if (!draggingNode) return
  draggingNode = null
  controls.enabled = true
  slider.disabled = false
}

renderer.domElement.addEventListener("pointerdown", (e) => startDrag(e))
window.addEventListener("pointermove", (e) => moveDrag(e))
window.addEventListener("pointerup", () => endDrag())
window.addEventListener("pointercancel", () => endDrag())

/* =========================
   GLB 로드
========================= */
loader.load(
  "/robot_arm2.glb",
  (gltf) => {
    modelRoot = gltf.scene
    scene.add(modelRoot)

    const maxDim = fitCameraToObject(modelRoot)
    console.log("maxDim:", maxDim)

    // 분해 세기(전체 기본)
    EXPLODE_FACTOR = 0.9
    console.log("explode factor:", EXPLODE_FACTOR)

    // 파트 수집
    modelRoot.traverse((obj) => {
      if (!obj.isMesh) return

      const key = normalizePartKey(obj.name)
      const partNode = getPartNode(obj, modelRoot)

      if (!partsByKey.has(key)) partsByKey.set(key, new Set())
      partsByKey.get(key).add(partNode)
    })

    // ✅ 초기 조립 위치(assemblyPos) 저장
    for (const nodeSet of partsByKey.values()) {
      for (const node of nodeSet) {
        if (!node.userData.assemblyPos) {
          node.userData.assemblyPos = node.position.clone()
        }
      }
    }

    // 기준 부품을 part4로 지정
    if (partsByKey.has("part4")) {
      baseNode = [...partsByKey.get("part4")][0]
      console.log("baseNode set to part4:", baseNode.name)
    } else {
      console.warn("part4 key not found; check naming")
    }

    prepareExplodeFromAssembly()
    applySlider(Number(slider.value))
  },
  undefined,
  (err) => {
    console.error("GLB load error:", err)
  }
)

/* =========================
   슬라이더 이벤트
   - slider를 건드리는 순간: 항상 초기 조립 기준으로 복구/재계산 후 적용
========================= */
slider.addEventListener("input", (e) => {
  const t = Number(e.target.value)

  // ✅ 드래그로 어긋난 거 무시하고 "초기 조립" 기준으로 재계산
  prepareExplodeFromAssembly()

  // ✅ 그 기준으로 slider 적용
  applySlider(t)
})

/* =========================
   렌더 루프
========================= */
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
