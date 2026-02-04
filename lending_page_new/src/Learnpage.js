import { useState, useRef, useCallback, useEffect } from "react";
import "./Shared.css";
import "./Learnpage.css";

/* ════════════════════════════════════════════ */
/*  부품 SVG 아이콘들                           */
/* ════════════════════════════════════════════ */
const PartFan = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" fill="#1a2a3a" stroke="#3a6a8a" strokeWidth="1"/>
    {Array.from({length:10}).map((_,i)=>{
      const a=(i/10)*360, r=a*Math.PI/180;
      return <line key={i} x1={20+3*Math.cos(r)} y1={20+3*Math.sin(r)} x2={20+14*Math.cos(r)} y2={20+14*Math.sin(r)} stroke="#7dd3e0" strokeWidth="2.2" strokeLinecap="round"/>;
    })}
    <circle cx="20" cy="20" r="3.5" fill="#00e5ff"/>
  </svg>
);
const PartCompressor = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect x="4" y="10" width="10" height="20" rx="2" fill="#4a8aaa" opacity="0.7"/>
    <rect x="15" y="8"  width="10" height="24" rx="2" fill="#5aaac4" opacity="0.8"/>
    <rect x="26" y="6"  width="10" height="28" rx="2" fill="#7dd3e0"/>
    <line x1="4" y1="20" x2="36" y2="20" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
  </svg>
);
const PartCombustor = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="22" rx="12" ry="14" fill="#1a2a3a" stroke="#6a4a2a" strokeWidth="1"/>
    <ellipse cx="20" cy="24" rx="7"  ry="8"  fill="#ff8844" opacity="0.7"/>
    <ellipse cx="20" cy="25" rx="4"  ry="5"  fill="#ffcc44" opacity="0.85"/>
    <ellipse cx="20" cy="26" rx="2"  ry="3"  fill="#fff3c0"/>
  </svg>
);
const PartTurbine = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="16" fill="#1a2a3a" stroke="#8a6aaa" strokeWidth="1"/>
    {Array.from({length:8}).map((_,i)=>{
      const a=(i/8)*360+10, r=a*Math.PI/180;
      return <path key={i} d={`M${20+3*Math.cos(r)},${20+3*Math.sin(r)} Q${20+9*Math.cos(r+0.3)},${20+9*Math.sin(r+0.3)} ${20+13*Math.cos(r)},${20+13*Math.sin(r)}`} stroke="#a88bd4" strokeWidth="2.2" fill="none" strokeLinecap="round"/>;
    })}
    <circle cx="20" cy="20" r="3" fill="#c4a8f0"/>
  </svg>
);
const PartNozzle = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <path d="M8,12 L28,8 L32,20 L28,32 L8,28 Z" fill="#2a4060" stroke="#5a8aaa" strokeWidth="1"/>
    <path d="M28,12 L36,14 L36,26 L28,28" fill="#1a3050" stroke="#4a7a8a" strokeWidth="0.8"/>
    <ellipse cx="37" cy="20" rx="4" ry="3" fill="#ffaa44" opacity="0.6"/>
    <ellipse cx="39" cy="20" rx="2" ry="1.5" fill="#fff3c0" opacity="0.7"/>
  </svg>
);
const PartCase = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <ellipse cx="20" cy="20" rx="14" ry="17" fill="#1e3550" stroke="#4a7a9a" strokeWidth="1.2"/>
    <ellipse cx="20" cy="20" rx="5" ry="6" fill="#0a1520" stroke="#2a5570" strokeWidth="0.8"/>
    <path d="M6,20 L2,20" stroke="#5abcd0" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="2" cy="20" r="2" fill="#2a4a6a" stroke="#5abcd0" strokeWidth="0.8"/>
  </svg>
);
const PART_ICONS = [PartFan, PartCompressor, PartCombustor, PartTurbine, PartNozzle, PartCase];

/* ════════════════════════════════════════════ */
/*  3D 뷰어 엔진 SVG                           */
/* ════════════════════════════════════════════ */
const ViewerEngineSVG = () => (
  <svg viewBox="0 0 380 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vHull" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3a5a7a"/><stop offset="40%" stopColor="#2a4060"/><stop offset="100%" stopColor="#122440"/>
      </linearGradient>
      <linearGradient id="vBl1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7dd3e0"/><stop offset="60%" stopColor="#4aafc4"/><stop offset="100%" stopColor="#2a7a9a"/>
      </linearGradient>
      <linearGradient id="vBl2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8c8d8"/><stop offset="60%" stopColor="#6a9ab5"/><stop offset="100%" stopColor="#3d6e8a"/>
      </linearGradient>
      <linearGradient id="vBl3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4e8f0"/><stop offset="60%" stopColor="#8bbccc"/><stop offset="100%" stopColor="#5a9aaa"/>
      </linearGradient>
      <linearGradient id="vFlame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff7a0" stopOpacity="0.9"/><stop offset="50%" stopColor="#ffaa44" stopOpacity="0.5"/><stop offset="100%" stopColor="#ff6622" stopOpacity="0"/>
      </linearGradient>
      <filter id="vG"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <filter id="vS"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="vD"><feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.45"/></filter>
    </defs>
    <ellipse cx="190" cy="195" rx="130" ry="80" fill="rgba(0,188,212,0.05)" filter="url(#vS)"/>
    <ellipse cx="100" cy="85"  rx="70"  ry="45" fill="rgba(0,188,212,0.04)" filter="url(#vS)"/>
    <g transform="translate(28,18)" filter="url(#vD)">
      <circle cx="20" cy="20" r="18" fill="#1a2a3a" stroke="#3a6080" strokeWidth="1.1"/>
      {Array.from({length:8}).map((_,i)=>{
        const a=(i/8)*360, r=a*Math.PI/180;
        return <line key={`ef1-${i}`} x1={20+3*Math.cos(r)} y1={20+3*Math.sin(r)} x2={20+14*Math.cos(r)} y2={20+14*Math.sin(r)} stroke="url(#vBl2)" strokeWidth="2.8" strokeLinecap="round" opacity="0.85"/>;
      })}
      <circle cx="20" cy="20" r="3.8" fill="#1a3a50" stroke="#5abcd0" strokeWidth="1.1"/>
    </g>
    <g transform="translate(78,12)" filter="url(#vD)">
      <circle cx="13" cy="13" r="12" fill="#1c2c3c" stroke="#3a6080" strokeWidth="0.9"/>
      {Array.from({length:7}).map((_,i)=>{
        const a=(i/7)*360+15, r=a*Math.PI/180;
        return <line key={`ef2-${i}`} x1={13+2*Math.cos(r)} y1={13+2*Math.sin(r)} x2={13+9*Math.cos(r)} y2={13+9*Math.sin(r)} stroke="url(#vBl3)" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>;
      })}
      <circle cx="13" cy="13" r="2.5" fill="#1a3a50" stroke="#5abcd0" strokeWidth="0.9"/>
    </g>
    <g transform="translate(100,22)" filter="url(#vD)">
      <circle cx="36" cy="36" r="34" fill="#16243a" stroke="#4a7a9a" strokeWidth="1.4"/>
      <circle cx="36" cy="36" r="32" fill="url(#vBl1)" opacity="0.12"/>
      {Array.from({length:14}).map((_,i)=>{
        const a=(i/14)*360, r=a*Math.PI/180;
        return <line key={`ef3-${i}`} x1={36+5*Math.cos(r)} y1={36+5*Math.sin(r)} x2={36+28*Math.cos(r)} y2={36+28*Math.sin(r)} stroke="url(#vBl1)" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>;
      })}
      <circle cx="36" cy="36" r="34" fill="none" stroke="url(#vBl1)" strokeWidth="1.4" opacity="0.4"/>
      <circle cx="36" cy="36" r="5.5" fill="#1a3a50" stroke="#5abcd0" strokeWidth="1.4"/>
      <circle cx="36" cy="36" r="2.2" fill="#00e5ff" filter="url(#vG)"/>
    </g>
    <g filter="url(#vD)">
      <ellipse cx="195" cy="215" rx="100" ry="52" fill="url(#vHull)" stroke="#4a7a9a" strokeWidth="1.7"/>
      <path d="M108,188 Q195,181 282,188" stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none"/>
      <path d="M105,200 Q195,194 285,200" stroke="rgba(255,255,255,0.04)" strokeWidth="0.7" fill="none"/>
      <path d="M105,230 Q195,237 285,230" stroke="rgba(255,255,255,0.04)" strokeWidth="0.7" fill="none"/>
      <ellipse cx="175" cy="194" rx="32" ry="11" fill="rgba(255,255,255,0.035)"/>
      <ellipse cx="120" cy="215" rx="9" ry="42" fill="#0d1e2e" stroke="#3a6a8a" strokeWidth="1.1"/>
      {Array.from({length:12}).map((_,i)=>{
        const a=(i/12)*360, r=a*Math.PI/180;
        return <line key={`mb1-${i}`} x1={120+5*Math.cos(r)} y1={215+5*Math.sin(r)} x2={120+34*Math.cos(r)} y2={215+34*Math.sin(r)} stroke="url(#vBl1)" strokeWidth="3.2" strokeLinecap="round" opacity="0.88"/>;
      })}
      <circle cx="120" cy="215" r="5.5" fill="#1a3a50" stroke="#5abcd0" strokeWidth="1.3"/>
      <circle cx="120" cy="215" r="2.2" fill="#00e5ff" filter="url(#vG)"/>
      <circle cx="120" cy="215" r="42" fill="none" stroke="url(#vBl1)" strokeWidth="1.1" opacity="0.38"/>
      <ellipse cx="172" cy="215" rx="6.5" ry="30" fill="#0d1e2e" stroke="#3a6a8a" strokeWidth="0.85"/>
      {Array.from({length:9}).map((_,i)=>{
        const a=(i/9)*360+20, r=a*Math.PI/180;
        return <line key={`mb2-${i}`} x1={172+4*Math.cos(r)} y1={215+4*Math.sin(r)} x2={172+24*Math.cos(r)} y2={215+24*Math.sin(r)} stroke="url(#vBl2)" strokeWidth="2.6" strokeLinecap="round" opacity="0.82"/>;
      })}
      <circle cx="172" cy="215" r="4.2" fill="#1a3a50" stroke="#5abcd0" strokeWidth="0.9"/>
      <circle cx="172" cy="215" r="1.6" fill="#00e5ff" filter="url(#vG)"/>
      <ellipse cx="210" cy="215" rx="4.8" ry="21" fill="#0d1e2e" stroke="#3a6a8a" strokeWidth="0.65"/>
      {Array.from({length:7}).map((_,i)=>{
        const a=(i/7)*360+25, r=a*Math.PI/180;
        return <line key={`mb3-${i}`} x1={210+3*Math.cos(r)} y1={215+3*Math.sin(r)} x2={210+17*Math.cos(r)} y2={215+17*Math.sin(r)} stroke="url(#vBl3)" strokeWidth="2" strokeLinecap="round" opacity="0.78"/>;
      })}
      <circle cx="210" cy="215" r="3" fill="#1a3a50" stroke="#5abcd0" strokeWidth="0.75"/>
      <ellipse cx="90" cy="215" rx="11" ry="36" fill="#162535" stroke="#3a5a75" strokeWidth="1.1"/>
      <ellipse cx="90" cy="215" rx="3.8" ry="9.5" fill="#0a1520" stroke="#2a4a60" strokeWidth="0.65"/>
      <path d="M79,215 L62,215" stroke="#3a6a8a" strokeWidth="1.7" strokeLinecap="round"/>
      <circle cx="60" cy="215" r="2.8" fill="#2a4a6a" stroke="#5abcd0" strokeWidth="0.85"/>
      <path d="M283,192 L314,183 L314,247 L283,238 Z" fill="#1e2e44" stroke="rgba(255,255,255,0.07)" strokeWidth="0.75"/>
      <path d="M314,183 L338,190 L338,240 L314,247 Z" fill="#162638" stroke="rgba(255,255,255,0.05)" strokeWidth="0.55"/>
      <ellipse cx="343" cy="215" rx="18" ry="7.5" fill="url(#vFlame)" opacity="0.7"/>
      <ellipse cx="348" cy="215" rx="9"  ry="3.5" fill="#ffe88a" opacity="0.5"/>
      <ellipse cx="155" cy="240" rx="22" ry="11" fill="#1a1510" stroke="#6a5030" strokeWidth="0.55" opacity="0.6"/>
      <ellipse cx="155" cy="240" rx="13" ry="5.5" fill="#ff8844" opacity="0.32"/>
      <ellipse cx="155" cy="240" rx="6"  ry="2.8" fill="#ffcc44" opacity="0.28"/>
      <circle cx="140" cy="178" r="1.7" fill="#00e5ff" filter="url(#vG)" opacity="0.7"/>
      <circle cx="183" cy="176" r="1.5" fill="#00e5ff" filter="url(#vG)" opacity="0.55"/>
      <circle cx="232" cy="181" r="1.3" fill="#44ff88" filter="url(#vG)" opacity="0.45"/>
    </g>
    {[[22,150],[335,95],[48,275],[315,265],[175,10],[275,22]].map(([x,y],i)=>(
      <circle key={`pt${i}`} cx={x} cy={y} r="0.95" fill="#00e5ff" opacity={0.12+(i%3)*0.08} filter="url(#vG)"/>
    ))}
  </svg>
);

/* ════════════════════════════════════════════ */
/*  데이터                                      */
/* ════════════════════════════════════════════ */
const INIT_CHAT = [
  { role: "ai", text: "안녕하세요! 제트 엔진의 작동 원리나 구성 부품에 대해 궁금한 점이 있으신가요?" }
];

const INFO_SECTIONS = [
  { title: "압축기", desc: "공기를 흡입하여 고압으로 압축하여 연소실로 보냅니다." },
  { title: "연소실", desc: "압축된 공기와 연료를 혼합하여 폭발적으로 연소시킵니다." },
  { title: "터빈",   desc: "연소실에서 나온 고온의 가스를 이용하여 회전하며, 이 회전으로 압축기를 구동시킵니다." },
];

const PRODUCT_INFO = {
  title: "제트 엔진 — 완제품 개요",
  desc: "제트 엔진은 가스 터빈 원리를 이용한 항공기 추진 장치로, 공기를 흡입→압축→연소→배기하는 순환 구조입니다.",
  sections: [
    { title: "작동 원리", desc: "브레이톤 순환(Brayton Cycle)을 기반으로 작동합니다. 앞부분의 압축기가 공기를 고압으로 압축하고, 연소실에서 연료와 혼합하여 폭발시킵니다." },
    { title: "주요 적용 분야", desc: "상업 항공기, 군용 전투기, 헬리콜터, 가스 터빈 발전소 등 다양한 분야에 사용됩니다." },
    { title: "효율 및 성능", desc: "현재 최신형 제트 엔진의 열효율은 약 40~50% 수준으로, 이중축 구조와 첨단 재료 기술로 끊임없이 개선 중입니다." },
    { title: "유지 및 관리", desc: "정기 점검과 부품 교체가 필수적입니다. 블레이드, 베어링, 씨일 등 주요 소모품을 주기별로 교체해야 합니다." },
  ]
};

/* 퀴즈 문항 데이터 */
const QUIZ_DATA = [
  { question: "제트 엔진의 주요 구성 요소가 아닌 것은?", options: ["압축기 (Compressor)", "연소실 (Combustion Chamber)", "터빈 (Turbine)", "프로펠러 (Propeller)"], answer: 3 },
  { question: "브레이톤 순환에서 압축기의 역할은 무엇인가요?", options: ["연료를 점화시킴", "공기를 고압으로 압축", "배기가스를 배출", "회전력을 생성"], answer: 1 },
  { question: "제트 엔진의 연소실에서 무엇이 발생하는가요?", options: ["공기 압축", "열 교환", "연료와 공기의 혼합 연소", "가스 배출"], answer: 2 },
  { question: "터빈의 주요 기능은 무엇인가요?", options: ["공기를 흡입", "고온 가스로 회전력 생성", "연료를 저장", "배기구 형성"], answer: 1 },
  { question: "제트 엔진의 노즐(Nozzle)의 역할은 무엇인가요?", options: ["공기 흡입", "연료 저장", "고속 배기가스 후방 배출", "압축기 구동"], answer: 2 },
];

const INIT_MEMOS = [
  { label: "기계공학", title: "공학 용어학", content: "• p: 압축\n• σ: 응력\n• ν: 포아송 비율의 정의\n• ε: 변형율 정의\n• F: 열 강도\n• E: 탄성계수 정의\n\n1. 공 관계식\n2. 공학 용어학 관계식 정리" },
  { label: "재료과학", title: "합금의학", content: "• L: 합금\n• ν: 지표 조건 정의\n• T: 열곳 관계\n• CL: 합금 강도\n• R: 공기 강도" },
  { label: "재료학",  title: "재료학",  content: "• 공학강성\n• 결정 구조의\n• 열처리" },
];

/* ════════════════════════════════════════════ */
/*  LearnPage                                   */
/* ════════════════════════════════════════════ */
export default function LearnPage({ onHome, onStudy, onLab, onTest }) {
  const [activeNav, setActiveNav]   = useState("Study");
  const [activeTab, setActiveTab]   = useState("조립품");
  const [activePart, setActivePart] = useState(3);
  const [showInfoPanel, setShowInfoPanel]       = useState(true);
  const [showProductPanel, setShowProductPanel] = useState(true);
  const [memos, setMemos]           = useState(INIT_MEMOS);
  const [expandedMemo, setExpandedMemo] = useState(null);

  /* ── 퀴즈 state ── */
  const [quizIdx, setQuizIdx]             = useState(0);
  const [quizSelected, setQuizSelected]   = useState(null);
  const [quizResults, setQuizResults]     = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFinished, setQuizFinished]   = useState(false);

  /* ── AI 채팅 ── */
  const [chatMsgs, setChatMsgs]     = useState(INIT_CHAT);
  const [chatInput, setChatInput]   = useState("");
  const chatBottomRef               = useRef(null);

  const navItems = ["Home", "Study", "CAD", "Lab", "Test"];
  const tabs     = ["단일부품", "조립품", "퀴즈", "시뮬레이터"];

  /* ── 드래그 스크롤 ── */
  const scrollRef  = useRef(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown  = useCallback((e) => {
    if (e.target.tagName === "TEXTAREA") return;
    isDragging.current = true;
    startX.current     = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  }, []);
  const onMouseLeave = useCallback(() => { isDragging.current = false; }, []);
  const onMouseUp    = useCallback(() => { isDragging.current = false; }, []);
  const onMouseMove  = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    scrollRef.current.scrollLeft = scrollLeft.current - (e.pageX - scrollRef.current.offsetLeft - startX.current);
  }, []);

  /* ── 퀴즈 로직 ── */
  const resetQuiz = () => {
    setQuizIdx(0); setQuizSelected(null);
    setQuizResults([]); setQuizSubmitted(false); setQuizFinished(false);
  };
  const handleTabClick = (t) => {
    setActiveTab(t);
    if (t === "퀴즈") resetQuiz();
  };

  const handleNav = (item) => {
    setActiveNav(item);
    if (item === "Home")  onHome();
    if (item === "Study") onStudy();
    if (item === "Lab") onLab?.();
    if (item === "Test") onTest?.();
  };

  /* ── AI 모의 응답 ── */
  const AI_REPLIES = [
    "좋은 질문입니다! 제트 엔진의 압축기는 공기를 고압으로 압축하여 연소실로 전달하는 핵심 부품입니다.",
    "터빈부는 연소실에서 나온 고온·고압 가스를 이용하여 회전력을 만들고, 이 회전으로 압축기를 구동시킵니다.",
    "제트 엔진은 브레이톤 순환 원리로 작동하며, 흡입→압축→연소→膨張 4단계를 반복합니다.",
    "배기부(Nozzle)는 고속 배기가스를 후방으로 강제 배출하여 뉴턴 제3법칙에 의해 추진력을 발생시킵니다.",
    "현재 최신형 제트 엔진의 열효율은 약 40~50% 수준으로, 이중축 구조와 첨단 재료 기술로 개선 중입니다."
  ];
  const replyIdx = useRef(0);

  const sendChat = () => {
    const msg = chatInput.trim();
    if (!msg) return;
    setChatInput("");
    const userMsg = { role: "user", text: msg };
    const aiMsg   = { role: "ai",  text: AI_REPLIES[replyIdx.current % AI_REPLIES.length] };
    replyIdx.current += 1;
    setChatMsgs(prev => [...prev, userMsg]);
    setTimeout(() => setChatMsgs(prev => [...prev, aiMsg]), 600);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  const addMemo = () => {
    setMemos(prev => [{ label: "새 메모", title: "", content: "" }, ...prev]);
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollLeft = 0; }, 0);
  };
  const deleteMemo = (idx) => {
    setMemos(prev => prev.filter((_,i) => i !== idx));
    if (expandedMemo === idx) setExpandedMemo(null);
    else if (expandedMemo !== null && expandedMemo > idx) setExpandedMemo(expandedMemo - 1);
  };
  const updateMemo = (idx, field, val) => setMemos(prev => prev.map((m,i) => i===idx ? {...m,[field]:val} : m));

  /* ── 퀴즈 핸들러 ── */
  const scoreCount = quizResults.filter((r,i) => r === QUIZ_DATA[i]?.answer).length;

  const handleSubmit = () => {
    setQuizSubmitted(true);
    setQuizResults(prev => { const n=[...prev]; n[quizIdx]=quizSelected; return n; });
  };
  const handleNext = () => {
    if (quizIdx < QUIZ_DATA.length - 1) {
      const next = quizIdx + 1;
      setQuizIdx(next);
      setQuizSelected(quizResults[next] !== undefined ? quizResults[next] : null);
      setQuizSubmitted(quizResults[next] !== undefined);
    } else {
      setQuizFinished(true);
    }
  };
  const handlePrev = () => {
    if (quizIdx > 0) {
      const prev = quizIdx - 1;
      setQuizIdx(prev);
      setQuizSelected(quizResults[prev] !== undefined ? quizResults[prev] : null);
      setQuizSubmitted(quizResults[prev] !== undefined);
    }
  };

  return (
    <>
      <div className="noise-overlay" />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <div className="page-wrapper">
        {/* NAV */}
        <nav className="nav">
          <div className="inner">
            <div className="nav-logo" onClick={onHome}>
              <div className="nav-logo-icon">
                <svg viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <circle cx="9" cy="9" r="3"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2"/>
                </svg>
              </div>
              <span className="nav-logo-text">SIMVEX</span>
            </div>
            <div className="nav-links">
              {navItems.map(item => (
                <button key={item} className={`nav-link${activeNav===item?" active":""}`} onClick={()=>handleNav(item)}>{item}</button>
              ))}
            </div>
          </div>
        </nav>

        {/* LEARN BODY */}
        <section className="learn-body">
          <div className="inner">
            {/* 탭 바 + PDF */}
            <div className="learn-top-bar">
              <div className="learn-tabs">
                {tabs.map(t => (
                  <button key={t} className={`learn-tab${activeTab===t?" active":""}`} onClick={()=>handleTabClick(t)}>{t}</button>
                ))}
              </div>
              <button className="learn-pdf-btn">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 1v10M5 8l3 3 3-3"/><path d="M2 13h12"/>
                </svg>
                PDF 리포트 생성
              </button>
            </div>

            {/* 메인 2열 */}
            <div className="learn-layout">

              {/* ═══ 왼쪽: 뷰어 패널 (퀴즈 or 3D) ═══ */}
              <div className="viewer-panel">

                {activeTab === "퀴즈" ? (
                  /* ════ 퀴즈 모드 ════ */
                  <div className="quiz-wrap">
                    {quizFinished ? (
                      /* 결과 화면 */
                      <div className="quiz-result">
                        <div className="quiz-result-icon">
                          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="30" fill="rgba(37,99,235,0.1)" stroke="#2563eb" strokeWidth="2.5"/>
                            <path d="M18 33l9 9 19-19" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          </svg>
                        </div>
                        <div className="quiz-result-title">퀴즈 완료!</div>
                        <div className="quiz-result-score">
                          <span className="quiz-result-num">{scoreCount}</span>
                          <span className="quiz-result-den">/ {QUIZ_DATA.length} 정답</span>
                        </div>
                        <div className="quiz-result-msg">
                          {scoreCount >= 4 ? "훌륭합니다! 제트 엔진에 대한 깊은 이해를 보여주셨습니다."
                            : scoreCount >= 2 ? "좋은 출발입니다! 복습을 통해 더 깊이 이해해보세요."
                            : "다시 학습해보고 재도전해보세요!"}
                        </div>
                        <button className="quiz-btn-restart" onClick={resetQuiz}>다시 도전하기</button>
                      </div>
                    ) : (
                      /* 진행 중 */
                      <>
                        {/* 타이틀 */}
                        <div className="quiz-title">제트 엔진 퀴즈</div>

                        {/* 진행률 바 */}
                        <div className="quiz-progress-row">
                          <div className="quiz-progress-bar-bg">
                            <div className="quiz-progress-bar-fill" style={{width:`${((quizIdx + 1) / QUIZ_DATA.length)*100}%`}}/>
                          </div>
                          <span className="quiz-progress-num">{quizIdx+1}/{QUIZ_DATA.length}</span>
                        </div>

                        {/* 질문 */}
                        <div className="quiz-question">{QUIZ_DATA[quizIdx].question}</div>

                        {/* 선택지 2×2 */}
                        <div className="quiz-options">
                          {QUIZ_DATA[quizIdx].options.map((opt, oi) => {
                            let cls = "quiz-option";
                            if (quizSelected === oi) {
                              if (quizSubmitted) cls += (oi === QUIZ_DATA[quizIdx].answer) ? " correct" : " wrong";
                              else cls += " selected";
                            }
                            if (quizSubmitted && oi === QUIZ_DATA[quizIdx].answer && quizSelected !== oi) cls += " correct";
                            return (
                              <button key={oi} className={cls} disabled={quizSubmitted} onClick={()=>setQuizSelected(oi)}>
                                <span className="quiz-option-num">{oi+1}.</span> {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* 정답 해설 (제출 후만) */}
                        {quizSubmitted && (
                          <div className={`quiz-feedback ${quizSelected === QUIZ_DATA[quizIdx].answer ? "correct" : "wrong"}`}>
                            <span className="quiz-feedback-icon">{quizSelected === QUIZ_DATA[quizIdx].answer ? "✓" : "✕"}</span>
                            <span className="quiz-feedback-text">
                              정답 해설 – {quizSelected === QUIZ_DATA[quizIdx].answer
                                ? "정답을 맞히셨습니다."
                                : <>정답은 <strong>{QUIZ_DATA[quizIdx].options[QUIZ_DATA[quizIdx].answer]}</strong>입니다.</>
                              }
                            </span>
                          </div>
                        )}

                        {/* 하단 버튼: 이전 문제 + 제출/다음 */}
                        <div className="quiz-btns">
                          <button className="quiz-btn-prev" disabled={quizIdx === 0} onClick={handlePrev}>이전 문제</button>
                          {!quizSubmitted ? (
                            <button className="quiz-btn-submit" disabled={quizSelected === null} onClick={handleSubmit}>제출하기</button>
                          ) : (
                            <button className="quiz-btn-next" onClick={handleNext}>
                              {quizIdx < QUIZ_DATA.length - 1 ? "다음 문제" : "결과 확인"}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  /* ════ 기존 3D 뷰어 모드 ════ */
                  <div className="viewer-body-row">

                    {/* 왼쪽 완제품 패널 */}
                    {showProductPanel && (
                      <div className="viewer-product">
                        <div className="viewer-product-header">
                          <div className="viewer-product-title">완제품 개요</div>
                          <button className="viewer-info-close" onClick={()=>setShowProductPanel(false)}>✕</button>
                        </div>
                        <div className="viewer-product-body">
                          <div className="viewer-info-product-desc">{PRODUCT_INFO.desc}</div>
                          {PRODUCT_INFO.sections.map((sec,i) => (
                            <div key={i} className="viewer-info-section">
                              <div className="viewer-info-section-title">{sec.title}</div>
                              <div className="viewer-info-section-desc">{sec.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3D 모델 영역 */}
                    <div className={`viewer-3d${(!showInfoPanel && !showProductPanel) ? " expanded" : ""}`}>
                      <div className="viewer-3d-svg">
                        <ViewerEngineSVG />
                      </div>
                      {!showProductPanel && (
                        <button className="viewer-panel-restore viewer-panel-restore-left" onClick={()=>setShowProductPanel(true)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M5 2l5 5-5 5"/>
                          </svg>
                        </button>
                      )}
                      {!showInfoPanel && (
                        <button className="viewer-panel-restore viewer-panel-restore-right" onClick={()=>setShowInfoPanel(true)}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 2L4 7l5 5"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* 오른쪽 부품 패널 */}
                    {showInfoPanel && (
                      <div className="viewer-info">
                        <div className="viewer-info-header">
                          <div className="viewer-info-title">부품 설명</div>
                          <button className="viewer-info-close" onClick={()=>setShowInfoPanel(false)}>✕</button>
                        </div>
                        <div className="viewer-parts-grid">
                          {PART_ICONS.map((Icon,i) => (
                            <div key={i} className={`viewer-part-thumb${activePart===i?" active":""}`} onClick={()=>setActivePart(i)}>
                              <Icon />
                            </div>
                          ))}
                        </div>
                        <div className="viewer-info-body">
                          {INFO_SECTIONS.map((sec,i) => (
                            <div key={i} className="viewer-info-section">
                              <div className="viewer-info-section-title">{sec.title}</div>
                              <div className="viewer-info-section-desc">{sec.desc}</div>
                            </div>
                          ))}
                        </div>
                        <div className="viewer-difficulty">
                          <div className="viewer-difficulty-label">난이도</div>
                          <div className="viewer-difficulty-sub">현재 학습 단계별 난이도 표시</div>
                          <div className="viewer-diff-bar-wrap">
                            <div className="viewer-diff-bar"/>
                            <div className="viewer-diff-marker"/>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>{/* viewer-panel 끝 */}

              {/* ═══ 오른쪽: AI + 메모장 ═══ */}
              <div className="right-panel">
                <div className="ai-card">
                  <div className="ai-card-header">
                    <div className="ai-card-title">
                      <span className="ai-status-dot"/>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ai-sparkle-icon">
                        <path d="M8 1l1.8 4.2L14 7l-4.2 1.8L8 13l-1.8-4.2L2 7l4.2-1.8z" fill="#00e5ff" opacity="0.85"/>
                        <path d="M13 1l0.7 1.3L15 3l-1.3.7L13 5l-.7-1.3L11 3l1.3-.7z" fill="#00e5ff" opacity="0.5"/>
                      </svg>
                      AI 어시스턴트
                    </div>
                    <span className="ai-active-badge">Active</span>
                  </div>
                  <div className="ai-chat-body">
                    {chatMsgs.map((msg, i) => (
                      <div key={i} className={`ai-chat-msg ${msg.role}`}>
                        <div className="ai-chat-bubble">{msg.text}</div>
                      </div>
                    ))}
                    <div ref={chatBottomRef}/>
                  </div>
                </div>

                {/* 메모장 */}
                <div className="memo-card">
                  <div className="memo-header">
                    <button className="memo-header-note-tab">Note</button>
                    <button className="memo-header-add" onClick={addMemo}>+</button>
                  </div>
                  <div className="memo-notes-scroll"
                    ref={scrollRef}
                    onMouseDown={onMouseDown}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                  >
                    {memos.map((memo, idx) => (
                      <div key={idx} className="memo-note">
                        <div className="memo-note-top">
                          <span className="memo-note-label">{memo.label}</span>
                          <div className="memo-note-actions">
                            <button className="memo-note-expand" onClick={()=>setExpandedMemo(idx)}>↗</button>
                            <button className="memo-note-delete" onClick={()=>deleteMemo(idx)}>×</button>
                          </div>
                        </div>
                        <div className="memo-note-body">
                          <textarea className="memo-note-title-input" placeholder="제목..." value={memo.title} onChange={e=>updateMemo(idx,"title",e.target.value)} rows={1}/>
                          <div className="memo-note-divider"/>
                          <textarea className="memo-note-content-input" placeholder="내용을 입력하세요..." value={memo.content} onChange={e=>updateMemo(idx,"content",e.target.value)}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 아래 입력 바 */}
            <div className="learn-input-bar">
              <div className="learn-input-label">무엇이 궁금하신가요?</div>
              <div className="learn-input-wrap">
                <div className="learn-input-plus">+</div>
                <input className="learn-input-field" type="text" placeholder="질문을 입력하세요..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()}/>
              </div>
              <button className="learn-send-btn" onClick={sendChat}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2L7 9M14 2l-4 12-3-5-5-3 12-4z"/>
                </svg>
              </button>
              <button className="learn-web-btn">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="6" cy="6" r="4.5"/><path d="M1.5 6h9M6 1.5c-1.5 1-2.5 2.8-2.5 4.5s1 3.5 2.5 4.5M6 1.5c1.5 1 2.5 2.8 2.5 4.5s-1 3.5-2.5 4.5"/>
                </svg>
                Web에서 찾아보기
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="inner">
            <div className="footer-links">{navItems.map(item=><button key={item} onClick={()=>handleNav(item)}>{item}</button>)}</div>
            <div className="footer-right"><span>문의 및 연락</span><span>010-235-7890</span></div>
          </div>
        </footer>
      </div>

      {/* 메모 확대 모달 */}
      {expandedMemo !== null && memos[expandedMemo] && (
        <div className="memo-modal-overlay" onClick={()=>setExpandedMemo(null)}>
          <div className="memo-modal" onClick={e=>e.stopPropagation()}>
            <div className="memo-modal-header">
              <span className="memo-modal-label">{memos[expandedMemo].label}</span>
              <div className="memo-modal-header-actions">
                <button className="memo-modal-delete" onClick={()=>deleteMemo(expandedMemo)}>삭제</button>
                <button className="memo-modal-close" onClick={()=>setExpandedMemo(null)}>✕</button>
              </div>
            </div>
            <textarea className="memo-modal-title" placeholder="제목..." value={memos[expandedMemo].title} onChange={e=>updateMemo(expandedMemo,"title",e.target.value)}/>
            <div className="memo-modal-divider"/>
            <textarea className="memo-modal-content" placeholder="내용을 입력하세요..." value={memos[expandedMemo].content} onChange={e=>updateMemo(expandedMemo,"content",e.target.value)}/>
          </div>
        </div>
      )}
    </>
  );
}