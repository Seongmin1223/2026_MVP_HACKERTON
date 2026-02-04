import { useState } from "react";
import "./Shared.css";
import "./Productlistpage.css";

/* ════════════════════════════════════════════ */
/*  완제품 SVG 아이콘                            */
/* ════════════════════════════════════════════ */

/* 제트 엔진 */
const JetEngineIcon = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="je-hull" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5a8aaa"/><stop offset="100%" stopColor="#2a4a6a"/></linearGradient>
      <linearGradient id="je-blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7dd3e0"/><stop offset="100%" stopColor="#3a9bbf"/></linearGradient>
      <filter id="je-g"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* 본체 타원 */}
    <ellipse cx="40" cy="42" rx="28" ry="14" fill="url(#je-hull)" stroke="#4a7a9a" strokeWidth="1.2"/>
    {/* 앞 팬 블레이드 원형 */}
    <circle cx="18" cy="42" r="12" fill="#0d1e2e" stroke="#3a6a8a" strokeWidth="0.9"/>
    {Array.from({length:8}).map((_,i)=>{
      const a=(i/8)*360, r=a*Math.PI/180;
      return <line key={`b${i}`} x1={18+2*Math.cos(r)} y1={42+2*Math.sin(r)} x2={18+9*Math.cos(r)} y2={42+9*Math.sin(r)} stroke="url(#je-blade)" strokeWidth="2" strokeLinecap="round"/>;
    })}
    <circle cx="18" cy="42" r="2.5" fill="#00e5ff" filter="url(#je-g)"/>
    {/* 노즐 + 불꽃 */}
    <path d="M62,36 L72,38 L72,46 L62,48 Z" fill="#1e2e44"/>
    <ellipse cx="74" cy="42" rx="5" ry="2.5" fill="#ffaa44" opacity="0.7"/>
    <ellipse cx="76" cy="42" rx="2.5" ry="1.2" fill="#fff3c0" opacity="0.6"/>
    {/* LED 빛 */}
    <circle cx="30" cy="37" r="1" fill="#00e5ff" filter="url(#je-g)" opacity="0.7"/>
    <circle cx="45" cy="36" r="0.8" fill="#44ff88" filter="url(#je-g)" opacity="0.6"/>
  </svg>
);

/* 프로펠러 항공기 */
const PropellerIcon = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="pr-body" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6a9ab5"/><stop offset="100%" stopColor="#2a5a7a"/></linearGradient>
      <linearGradient id="pr-prop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#c4e0ec"/><stop offset="100%" stopColor="#7ab8d0"/></linearGradient>
    </defs>
    {/* 동체 타원 */}
    <ellipse cx="40" cy="42" rx="24" ry="8" fill="url(#pr-body)" stroke="#4a8aaa" strokeWidth="1"/>
    {/* 날개 */}
    <rect x="30" y="26" width="20" height="4" rx="2" fill="#4a7a9a" transform="rotate(-5,40,28)"/>
    {/* 프로펠러 3개 블레이드 */}
    {[0, 120, 240].map((a, i) => {
      const rad = a * Math.PI / 180;
      return <line key={i} x1={14} y1={42} x2={14 + 14*Math.cos(rad)} y2={42 + 14*Math.sin(rad)} stroke="url(#pr-prop)" strokeWidth="3" strokeLinecap="round"/>;
    })}
    <circle cx="14" cy="42" r="3" fill="#1a3050" stroke="#7ab8d0" strokeWidth="1.2"/>
    {/* 꼬날개 */}
    <rect x="60" y="36" width="8" height="3" rx="1.5" fill="#4a7a9a"/>
  </svg>
);

/* 헬리콥터 */
const HelicopterIcon = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="hc-body" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5a8aaa"/><stop offset="100%" stopColor="#2a4a6a"/></linearGradient>
      <linearGradient id="hc-blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#a8d8e8"/><stop offset="100%" stopColor="#5aaccc"/></linearGradient>
    </defs>
    {/* 메인 회전자 블레이드 (X자) */}
    <line x1="12" y1="28" x2="68" y2="28" stroke="url(#hc-blade)" strokeWidth="4" strokeLinecap="round"/>
    <line x1="20" y1="18" x2="60" y2="38" stroke="url(#hc-blade)" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    <circle cx="40" cy="28" r="3" fill="#1a3050" stroke="#5aaccc" strokeWidth="1.2"/>
    {/* 동체 */}
    <path d="M24,34 Q24,50 32,58 L54,58 Q62,50 62,40 L62,34 Z" fill="url(#hc-body)" stroke="#4a7a9a" strokeWidth="1"/>
    {/* 꼬날개 축 */}
    <line x1="54" y1="44" x2="72" y2="38" stroke="#4a7a9a" strokeWidth="2" strokeLinecap="round"/>
    {/* 꼬회전자 */}
    <line x1="72" y1="32" x2="72" y2="44" stroke="url(#hc-blade)" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="72" cy="38" r="1.8" fill="#1a3050" stroke="#5aaccc" strokeWidth="0.9"/>
    {/* 스키드 */}
    <line x1="28" y1="58" x2="24" y2="64" stroke="#4a7a9a" strokeWidth="2" strokeLinecap="round"/>
    <line x1="50" y1="58" x2="54" y2="64" stroke="#4a7a9a" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="64" x2="56" y2="64" stroke="#4a7a9a" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

/* 로켓 엔진 */
const RocketEngineIcon = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="re-body" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3a5a7a"/><stop offset="100%" stopColor="#6a9ab5"/></linearGradient>
      <linearGradient id="re-flame" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#fff3c0"/><stop offset="50%" stopColor="#ffaa44"/><stop offset="100%" stopColor="#ff6622" stopOpacity="0"/></linearGradient>
      <filter id="re-g"><feGaussianBlur stdDeviation="2"/></filter>
    </defs>
    {/* 엔진 본체 원통 */}
    <rect x="26" y="16" width="28" height="36" rx="6" fill="url(#re-body)" stroke="#4a7a9a" strokeWidth="1.2"/>
    {/* 내부 chamber */}
    <rect x="32" y="24" width="16" height="20" rx="3" fill="#0d1e2e" stroke="#3a6a8a" strokeWidth="0.8"/>
    {/* 연소 글로우 */}
    <ellipse cx="40" cy="40" rx="5" ry="4" fill="#ff8844" opacity="0.5"/>
    <ellipse cx="40" cy="40" rx="2.5" ry="2" fill="#ffcc44" opacity="0.6"/>
    {/* 노즐 (아래) */}
    <path d="M30,52 L24,68 L56,68 L50,52 Z" fill="#2a4a6a" stroke="#4a7a9a" strokeWidth="1"/>
    {/* 불꽃 */}
    <ellipse cx="40" cy="72" rx="6" ry="4" fill="url(#re-flame)" filter="url(#re-g)" opacity="0.8"/>
    <ellipse cx="40" cy="70" rx="3" ry="3" fill="#fff3c0" opacity="0.7"/>
    {/* 측면 스트럭트 */}
    <rect x="24" y="28" width="3" height="20" rx="1.5" fill="#4a7a9a" opacity="0.7"/>
    <rect x="53" y="28" width="3" height="20" rx="1.5" fill="#4a7a9a" opacity="0.7"/>
  </svg>
);

/* 터보프롭 엔진 */
const TurboPropIcon = () => (
  <svg viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="tp-body" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5a8aaa"/><stop offset="100%" stopColor="#2a4a6a"/></linearGradient>
      <linearGradient id="tp-blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7dd3e0"/><stop offset="100%" stopColor="#3a9bbf"/></linearGradient>
    </defs>
    {/* 엔진 본체 타원 */}
    <ellipse cx="42" cy="42" rx="22" ry="11" fill="url(#tp-body)" stroke="#4a7a9a" strokeWidth="1.2"/>
    {/* 앞 프로펠러 축 */}
    <circle cx="22" cy="42" r="9" fill="#0d1e2e" stroke="#3a6a8a" strokeWidth="0.8"/>
    {/* 프로펠러 블레이드 4개 */}
    {[0, 90, 180, 270].map((a, i) => {
      const rad = a * Math.PI / 180;
      return <line key={i} x1={22 + 2*Math.cos(rad)} y1={42 + 2*Math.sin(rad)} x2={22 + 8*Math.cos(rad)} y2={42 + 8*Math.sin(rad)} stroke="url(#tp-blade)" strokeWidth="2.5" strokeLinecap="round"/>;
    })}
    <circle cx="22" cy="42" r="2.5" fill="#00e5ff" opacity="0.8"/>
    {/* 뒤 배기 */}
    <path d="M62,38 L72,40 L72,44 L62,46 Z" fill="#2a4a6a" stroke="#4a7a9a" strokeWidth="0.7"/>
    <ellipse cx="73" cy="42" rx="3" ry="1.5" fill="#ffaa44" opacity="0.5"/>
    {/* 중간 터빈 표시 */}
    <ellipse cx="42" cy="42" rx="4" ry="9" fill="#0d1e2e" stroke="#3a6a8a" strokeWidth="0.7"/>
    {Array.from({length:6}).map((_,i)=>{
      const a=(i/6)*360, r=a*Math.PI/180;
      return <line key={`tb${i}`} x1={42+2*Math.cos(r)} y1={42+2*Math.sin(r)} x2={42+6*Math.cos(r)} y2={42+6*Math.sin(r)} stroke="url(#tp-blade)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>;
    })}
  </svg>
);

/* ════════════════════════════════════════════ */
/*  분야별 완제품 데이터                         */
/* ════════════════════════════════════════════ */
const FIELD_PRODUCTS = {
  "기계 공학": [
    { icon: <JetEngineIcon/>,      title: "제트 엔진",        desc: "가스 터빈 기술을 이용한 고출력 항공용 엔진으로, 압축-연소-배기 순환 구조를 사용하여 강력한 추진력을 발생시킵니다." },
    { icon: <RocketEngineIcon/>,   title: "로켓 엔진",        desc: "연료와 산화제를 혼합하여 폭발적으로 연소하여 강렬한 추진력을 만드는 우주 탐사용 고출력 엔진입니다." },
    { icon: <TurboPropIcon/>,      title: "터보프롭 엔진",    desc: "가스 터빈 엔진과 프로펠러를 결합한 구조로, 저속에서도 높은 효율을 보여주는 항공용 엔진입니다." },
  ],
  "전기 전자 공학": [
    { icon: <JetEngineIcon/>,      title: "전자 제어 시스템",  desc: "항공기 엔진의 전자 제어 및 모니터링을 위한 고신뢰성 ECU와 센서 네트워크로 구성된 시스템입니다." },
    { icon: <TurboPropIcon/>,      title: "터빈 제어 모듈",   desc: "터빈 회전수와 온도를 실시간으로 감지하여 최적의 작동 조건을 유지하는 스마트 제어 장치입니다." },
  ],
  "항공 우주 공학": [
    { icon: <JetEngineIcon/>,      title: "제트 엔진",        desc: "항공기 추진의 핵심인 가스 터빈 엔진으로, 공기를 흡입→압축→연소→배기하는 브레이톤 순환 구조입니다." },
    { icon: <PropellerIcon/>,      title: "프로펠러",         desc: "회전 블레이드가 공기를 후방으로 밀어내여 추진력을 발생시키는 항공기의 주요 추진 장치입니다." },
    { icon: <HelicopterIcon/>,     title: "헬리콥터 로터",    desc: "수직 비행과 제자리 비행을 가능하게 하는 회전자 블레이드 시스템으로, 복잡한 공기 역학 원리를 적용합니다." },
    { icon: <RocketEngineIcon/>,   title: "로켓 엔진",        desc: "우주 탐사 및 위성 발사를 위한 초고온·초고압 연소 엔진으로, 강렬한 추진력과 내열성이 핵심입니다." },
    { icon: <TurboPropIcon/>,      title: "터보프롭 엔진",    desc: "가스 터빈과 프로펠러를 결합한 효율형 엔진으로, 군용·여객 항공기에 폭넓게 사용됩니다." },
  ],
  "재료 과학": [
    { icon: <JetEngineIcon/>,      title: "고온 합금 블레이드", desc: "터빈 블레이드에 사용되는 초고온 내열 합금 소재로, 1000°C 이상에서도 강도와 내산화성을 유지합니다." },
    { icon: <RocketEngineIcon/>,   title: "세라믹 라이너",    desc: "로켓 엔진 내부의 극한 온도를 견딜 수 있는 세라믹 복합 재료로 제작된 내열 라이너입니다." },
  ],
  "화학 공학": [
    { icon: <RocketEngineIcon/>,   title: "연료 처리 시스템",  desc: "로켓 및 항공 엔진의 연료를 정제·저장·공급하는 화학 공정 기반의 고정밀 처리 시스템입니다." },
    { icon: <TurboPropIcon/>,      title: "润滑 오일 시스템",  desc: "엔진 내부의 고속 회전 부품을 润滑하고 냉却하는 특수 합성 오일과 순환 공급 시스템입니다." },
  ],
  "토목 공학": [
    { icon: <HelicopterIcon/>,     title: "공항 관제 타워",   desc: "항공기의 안전한 이착륙을 관리하는 공항 관제 시스템과 구조물 설계를 담당하는 핵심 시설입니다." },
    { icon: <PropellerIcon/>,      title: "활주로 구조",      desc: "항공기의 이착륙 하중을 견딜 수 있는 강화 콘크리트와 아스팔트 복합 구조의 활주로 설계입니다." },
  ],
};

/* ════════════════════════════════════════════ */
/*  ProductListPage                             */
/* ════════════════════════════════════════════ */
export default function ProductListPage({ field, onHome, onBack, onLearn, onLab, onTest }) {
  const [activeNav, setActiveNav] = useState("Study");
  const navItems = ["Home", "Study", "CAD", "Lab", "Test"];

  const handleNav = (item) => {
    setActiveNav(item);
    if (item === "Home")  onHome();
    if (item === "Study") onBack();
    if (item === "Lab") onLab?.();
    if (item === "Test") onTest?.();
  };

  const products = FIELD_PRODUCTS[field] || FIELD_PRODUCTS["항공 우주 공학"];

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

        {/* BODY */}
        <section className="pl-body">
          <div className="inner">

            {/* 상단 헤더 행: 타이틀 + AI 버튼 */}
            <div className="pl-header">
              <div className="pl-header-left">
                <button className="pl-back-btn" onClick={onBack}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M10 2L4 8l6 6"/>
                  </svg>
                </button>
                <h2 className="pl-title">{field} 완제품 목록</h2>
              </div>
              <button className="pl-ai-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l1.8 4.2L14 7l-4.2 1.8L8 13l-1.8-4.2L2 7l4.2-1.8z" fill="#fff" opacity="0.9"/>
                </svg>
                AI 어시스턴트
              </button>
            </div>

            {/* 구분선 */}
            <div className="pl-divider"/>

            {/* 완제품 카드 리스트 */}
            <div className="pl-list">
              {products.map((p, i) => (
                <div key={i} className="pl-card" onClick={onLearn} style={{animationDelay:`${i*0.07}s`}}>
                  {/* 왼쪽 이미지 */}
                  <div className="pl-card-img">
                    {p.icon}
                  </div>
                  {/* 오른쪽 텍스트 */}
                  <div className="pl-card-info">
                    <div className="pl-card-title">{p.title}</div>
                    <div className="pl-card-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
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
    </>
  );
}