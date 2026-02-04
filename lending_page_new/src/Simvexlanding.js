import { useState } from "react";
import "./Shared.css";
import "./Simvexlanding.css";

/* ════════════════════════════════════════════ */
/*  SVG ICONS                                   */
/* ════════════════════════════════════════════ */
const Icon3D = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);
const IconAI = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>
);
const IconCommunity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/* ════════════════════════════════════════════ */
/*  ENGINE SVG                                  */
/* ════════════════════════════════════════════ */
const EngineVisual = () => (
  <svg viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="engineBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2a4a6b" /><stop offset="50%" stopColor="#1a2f4a" /><stop offset="100%" stopColor="#0f1e33" />
      </linearGradient>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5eb8d4" /><stop offset="40%" stopColor="#2a8aad" /><stop offset="100%" stopColor="#145e80" />
      </linearGradient>
      <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1a3a2a" /><stop offset="100%" stopColor="#0d2419" />
      </linearGradient>
      <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2a2a3d" /><stop offset="100%" stopColor="#18181f" />
      </linearGradient>
      <linearGradient id="coreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9" /><stop offset="100%" stopColor="#0097a7" stopOpacity="0.6" />
      </linearGradient>
      <radialGradient id="bladeCenter" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#0288d1" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#01579b" stopOpacity="0" />
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="softGlow"><feGaussianBlur stdDeviation="2" /></filter>
    </defs>

    <ellipse cx="240" cy="350" rx="180" ry="18" fill="url(#bladeCenter)" opacity="0.12" filter="url(#softGlow)" />

    <g transform="translate(280,240)">
      <rect x="0" y="0" width="150" height="100" rx="6" fill="url(#pcbGrad)" stroke="#2a5a45" strokeWidth="1" />
      <line x1="10" y1="20" x2="60" y2="20" stroke="#1e6b4a" strokeWidth="1.2" />
      <line x1="60" y1="20" x2="60" y2="50" stroke="#1e6b4a" strokeWidth="1.2" />
      <line x1="60" y1="50" x2="100" y2="50" stroke="#1e6b4a" strokeWidth="1.2" />
      <line x1="20" y1="40" x2="20" y2="70" stroke="#1e6b4a" strokeWidth="1" />
      <line x1="20" y1="70" x2="80" y2="70" stroke="#1e6b4a" strokeWidth="1" />
      <line x1="100" y1="30" x2="130" y2="30" stroke="#1e6b4a" strokeWidth="1" />
      <line x1="130" y1="30" x2="130" y2="60" stroke="#1e6b4a" strokeWidth="1" />
      <line x1="80" y1="80" x2="120" y2="80" stroke="#1e6b4a" strokeWidth="1" />
      <circle cx="10" cy="20" r="3" fill="#3a8a5a" /><circle cx="60" cy="20" r="3" fill="#3a8a5a" />
      <circle cx="100" cy="50" r="3" fill="#3a8a5a" /><circle cx="20" cy="40" r="3" fill="#3a8a5a" />
      <circle cx="20" cy="70" r="3" fill="#3a8a5a" /><circle cx="80" cy="70" r="3" fill="#3a8a5a" />
      <circle cx="100" cy="30" r="3" fill="#3a8a5a" /><circle cx="130" cy="60" r="3" fill="#3a8a5a" />
      <rect x="38" y="32" width="26" height="18" rx="2" fill="url(#chipGrad)" stroke="#3a3a4f" strokeWidth="0.8" />
      <rect x="100" y="55" width="22" height="16" rx="2" fill="url(#chipGrad)" stroke="#3a3a4f" strokeWidth="0.8" />
      <circle cx="140" cy="15" r="2.5" fill="#00e5ff" filter="url(#glow)" />
      <circle cx="148" cy="15" r="2.5" fill="#0f0" opacity="0.7" filter="url(#glow)" />
      <circle cx="140" cy="90" r="2.5" fill="#ff6b35" opacity="0.8" filter="url(#glow)" />
    </g>

    <g transform="translate(340,120)">
      <rect x="0" y="0" width="80" height="55" rx="4" fill="#1c2540" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="6" y="6" width="68" height="14" rx="2" fill="#151d2e" />
      <rect x="6" y="24" width="68" height="14" rx="2" fill="#151d2e" />
      {[12,22,32,42,52,62].map((x,i) => <rect key={`t${i}`} x={x} y="8" width="6" height="10" rx="1" fill="#2a3550" stroke="#3a4a6b" strokeWidth="0.5" />)}
      {[12,22,32,42,52,62].map((x,i) => <rect key={`b${i}`} x={x} y="26" width="6" height="10" rx="1" fill="#2a3550" stroke="#3a4a6b" strokeWidth="0.5" />)}
      <line x1="0" y1="45" x2="-30" y2="55" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <line x1="0" y1="48" x2="-28" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
    </g>

    <g transform="translate(60,100)">
      <ellipse cx="320" cy="85" rx="22" ry="38" fill="#12202e" stroke="#2a4a6a" strokeWidth="1.2" />
      <ellipse cx="320" cy="85" rx="12" ry="22" fill="#0a1520" stroke="#1a3550" strokeWidth="0.8" />
      <line x1="325" y1="70" x2="350" y2="65" stroke="rgba(255,150,50,0.15)" strokeWidth="1.5" />
      <line x1="325" y1="80" x2="355" y2="82" stroke="rgba(255,150,50,0.12)" strokeWidth="1.5" />
      <line x1="325" y1="90" x2="352" y2="95" stroke="rgba(255,150,50,0.1)" strokeWidth="1.5" />
      <line x1="325" y1="100" x2="348" y2="104" stroke="rgba(255,150,50,0.08)" strokeWidth="1.5" />
      <rect x="40" y="50" width="270" height="70" rx="35" fill="url(#engineBody)" stroke="#3a6080" strokeWidth="1.5" />
      <rect x="60" y="52" width="200" height="6" rx="3" fill="rgba(255,255,255,0.06)" />
      <ellipse cx="60" cy="85" rx="30" ry="42" fill="#0d1a28" stroke="#3a6a8a" strokeWidth="1.8" />
      <ellipse cx="60" cy="85" rx="24" ry="34" fill="#091420" stroke="#2a5570" strokeWidth="1" />
      <ellipse cx="58" cy="85" rx="22" ry="32" fill="url(#bladeCenter)" opacity="0.25" />
      {[0,45,90,135,180,225,270,315].map((rot,i) => (
        <path key={i} d="M58,58 Q68,72 62,85 Q68,98 58,112 Q52,98 48,85 Q52,72 58,58"
          fill="url(#bladeGrad)" stroke="#1a6a90" strokeWidth="0.7"
          transform={`rotate(${rot},58,85)`} opacity="0.85" />
      ))}
      <circle cx="58" cy="85" r="8" fill="#1a3045" stroke="#5eb8d4" strokeWidth="1.5" />
      <circle cx="58" cy="85" r="3" fill="url(#coreGlow)" filter="url(#glow)" />
      <rect x="120" y="55" width="8" height="60" rx="2" fill="#1e3350" stroke="#3a6a8a" strokeWidth="0.6" />
      <rect x="170" y="55" width="8" height="60" rx="2" fill="#1e3350" stroke="#3a6a8a" strokeWidth="0.6" />
      <rect x="220" y="55" width="8" height="60" rx="2" fill="#1e3350" stroke="#3a6a8a" strokeWidth="0.6" />
      <circle cx="145" cy="58" r="2.5" fill="#00e5ff" filter="url(#glow)" />
      <circle cx="195" cy="58" r="2.5" fill="#00e5ff" opacity="0.6" filter="url(#glow)" />
      <circle cx="245" cy="60" r="2" fill="#00e5ff" opacity="0.4" filter="url(#glow)" />
      <line x1="150" y1="120" x2="150" y2="155" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
      <line x1="200" y1="120" x2="200" y2="155" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
    </g>

    <path d="M310,230 Q320,250 340,260" stroke="rgba(0,229,255,0.25)" strokeWidth="1.5" fill="none" />
    <path d="M300,228 Q315,245 330,255" stroke="rgba(0,229,255,0.18)" strokeWidth="1" fill="none" />
  </svg>
);

/* ════════════════════════════════════════════ */
/*  MAIN                                        */
/* ════════════════════════════════════════════ */
export default function SimvexLanding({ onStart, onLab, onTest }) {
  const [activeNav, setActiveNav] = useState("Home");
  const navItems = ["Home", "Study", "CAD", "Lab", "Test"];

  // Study 클릭 시에도 학습페이지로
  const handleNav = (item) => {
    setActiveNav(item);
    if (item === "Study") onStart();
    if (item === "Lab") onLab?.();
    if (item === "Test") onTest?.();
  };

  const cards = [
    { icon: <Icon3D />,        title: "실감 나는 3D 학습",  desc: "실제 엔진과 동일한 구조로 제공되는 3D 모델을 통해 학습 과정을 더 깊게 체험하세요." },
    { icon: <IconAI />,        title: "AI 맞춤형 가이드",   desc: "AI 기반의 맞춤형 학습 경험을 통해 학습자의 수준에 맞게 최적화된 도움을 받습니다." },
    { icon: <IconCommunity />, title: "커뮤니티와 협업",    desc: "동료 학습자와의 협업과 토론을 통해 실험 및 프로젝트를 함께 진행할 수 있습니다." },
  ];

  return (
    <>
      <div className="noise-overlay" />
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />

      <div className="page-wrapper">
        <nav className="nav">
          <div className="inner">
            <div className="nav-logo">
              <div className="nav-logo-icon">
                <svg viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <circle cx="9" cy="9" r="3" /><path d="M9 2v2M9 14v2M2 9h2M14 9h2" />
                </svg>
              </div>
              <span className="nav-logo-text">SIMVEX</span>
            </div>
            <div className="nav-links">
              {navItems.map((item) => (
                <button key={item} className={`nav-link${activeNav === item ? " active" : ""}`} onClick={() => handleNav(item)}>{item}</button>
              ))}
            </div>
          </div>
        </nav>

        <section className="hero">
          <div className="inner">
            <div className="hero-content">
              <h1 className="hero-title">
                미래의 엔지니어를 위한<br />혁신적인 학습 플랫폼,<br /><span className="highlight">SIMVEX</span>
              </h1>
              <p className="hero-sub">공대생과 과학기술 학습자를 위한 최고의<br />도구와 리소스를 경험하세요.</p>
              <button className="hero-btn" onClick={onStart}>지금 시작하기</button>
            </div>
            <div className="hero-visual">
              <div className="engine-scene">
                <EngineVisual />
                <div className="scene-glow" />
              </div>
            </div>
          </div>
        </section>

        <section className="cards-section">
          <div className="inner">
            {cards.map((c, i) => (
              <div key={i} className="card">
                <div className="card-icon-wrap">{c.icon}</div>
                <h3 className="card-title">{c.title}</h3>
                <p className="card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div className="inner">
            <div className="footer-links">
              {navItems.map((item) => (
                <button key={item} onClick={() => handleNav(item)}>{item}</button>
              ))}
            </div>
            <div className="footer-right">
              <span>문의 및 연락</span><span>010-235-7890</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}