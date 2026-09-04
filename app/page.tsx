"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

/* ─── CONFIG ─── */
const PHONE = "01117322733";
const PHONE_DISPLAY = "01117322733";
const PHONE_INTL = "+201117322733";
const WA_NUMBER = "201117322733";
const WA_MSG = "مرحباً، أرغب في الاستفسار عن هاسيندا رأس الحكمة - بالم هيلز";
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MSG)}`;
const WEB3_KEY = "9ccc38bd-3017-4286-a082-e3aae869c3fa";

/* ─── هوية المعلن — لازم تطابق اسم الحساب في Google Ads Advertiser Verification ─── */
const AGENT_AR = "نورلاين";
const AGENT_EN = "Nurline";
const AGENT_EMAIL = "info@nurlinebrokerage.com";
const AGENT_ADDRESS = "التجمع الخامس - شارع التسعين الشمالي، القاهرة الجديدة";
const AGENT_HOURS = "السبت — الخميس · 10 ص إلى 8 م (بتوقيت القاهرة)";

const NAV_LINKS = [
  { label: "عن المشروع", href: "#overview" },
  { label: "الوحدات", href: "#units" },
  { label: "خطة السداد", href: "#payment" },
  { label: "معرض الصور", href: "#gallery" },
  { label: "المرافق", href: "#facilities" },
  { label: "الموقع", href: "#location" },
  { label: "من نحن", href: "#about-agent" },
  { label: "احجز وحدتك", href: "#contact" },
];

type UnitType = "all" | "beach" | "chalet" | "twin" | "villa";
interface Unit { name: string; en: string; price: string; type: UnitType; }

const UNITS: Unit[] = [
  { name: "بيتش هوم - غرفة نوم واحدة", en: "1 Bedroom Beach Home", price: "11.7 مليون جنيه", type: "beach" },
  { name: "بيتش هوم - غرفتي نوم", en: "2 Bedroom Beach Home", price: "15 مليون جنيه", type: "beach" },
  { name: "بيتش هوم - ثلاث غرف نوم", en: "3 Bedroom Beach Home", price: "18 مليون جنيه", type: "beach" },
  { name: "شاليه جونيور", en: "Junior Chalet", price: "23 مليون جنيه", type: "chalet" },
  { name: "شاليه سينيور", en: "Senior Chalet", price: "28 مليون جنيه", type: "chalet" },
  { name: "توين هاوس", en: "Twin House", price: "44 مليون جنيه", type: "twin" },
  { name: "فيلا - الصف الرابع", en: "Villa - Fourth Row", price: "125 مليون جنيه", type: "villa" },
  { name: "فيلا - الصف الثالث", en: "Villa - Third Row", price: "165 مليون جنيه", type: "villa" },
  { name: "فيلا - الصف الثاني", en: "Villa - Second Row", price: "195 مليون جنيه", type: "villa" },
  { name: "فيلا - الصف الأول", en: "Villa - First Row", price: "450 مليون جنيه", type: "villa" },
];

const FAQS = [
  { q: "أين يقع مشروع هاسيندا رأس الحكمة؟", a: "يقع المشروع عند الكيلو 238 على الطريق الساحلي الدولي في منطقة رأس الحكمة بالساحل الشمالي، وهي واحدة من أجمل مناطق البحر المتوسط." },
  { q: "ما أنواع الوحدات المتاحة في المشروع؟", a: "يتوفر بيتش هومز (1-3 غرف نوم)، شاليهات جونيور وسينيور، توين هاوس، وفيلات بإطلالات بحرية مباشرة من الصف الأول إلى الرابع." },
  { q: "ما هو السعر الذي تبدأ منه الوحدات؟", a: "تبدأ الأسعار من 11.7 مليون جنيه مصري لبيتش هوم غرفة واحدة، وحتى 450 مليون جنيه لفيلات الصف الأول على البحر مباشرة." },
  { q: "ما هي خطة السداد المتاحة؟", a: "5% مقدم و5% بعد فترة مع تقسيط حتى 10 سنوات. أول 4 صفوف من الفيلات على 8 سنوات. الأجانب يدفعون مثل المصريين." },
  { q: "ما هي مساحة المشروع وأبرز مميزاته؟", a: "المشروع على مساحة 1,400 فدان مع 4.8 كم بيتش فرونت و84% مساحات مائية وخضراء. تشطيبات كاملة + تكييفات + مطابخ." },
  { q: "ما قيمة جدية الحجز (EOI)؟", a: "بيتش هوم: 250,000 جنيه — شاليهات: 500,000 جنيه — فيلات وتوين هاوس: 1,000,000 جنيه. جميع المبالغ مستردة بالكامل." },
  { q: "من هو الوكيل المعتمد؟", a: "هذا الموقع تديره شركة نورلاين (Nurline)، وكيل مبيعات معتمد لدى بالم هيلز للتطوير العقاري. لسنا الشركة المطوّرة. نقدم استشارة عقارية مجانية ونساعدك في اختيار الوحدة وإتمام الحجز، والتعاقد والسداد يتمّان مع المطوّر مباشرة وبعقوده المعتمدة." },
];

/* Icons */
const PhoneIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const MenuIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>);
const ChevronDown = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>);

/* ─── PAGE ─── */
export default function Home() {
  const [filter, setFilter] = useState<UnitType>("all");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showCookie, setShowCookie] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const popupFormRef = useRef<HTMLFormElement>(null);
  const popupShownRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const els = document.querySelectorAll(".animate-in");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));

    // Cookie banner
    try { if (!localStorage.getItem("cookie_ok")) setShowCookie(true); } catch { setShowCookie(true); }

    return () => obs.disconnect();
  }, []);

  // Popup trigger
  useEffect(() => {
    if (popupShownRef.current) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const pct = (window.scrollY || doc.scrollTop) / (doc.scrollHeight - window.innerHeight);
      if (pct >= 0.55) openPopup();
    };
    const timer = setTimeout(() => openPopup(), 15000);
    window.addEventListener("scroll", onScroll, { passive: true });
    function openPopup() {
      if (popupShownRef.current) return;
      popupShownRef.current = true;
      setShowPopup(true);
      document.body.classList.add("popup-open");
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    }
    return () => { window.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, []);

  const filtered = filter === "all" ? UNITS : UNITS.filter((u) => u.type === filter);

  function trackWA() { const g = (window as unknown as { trackWhatsapp?: () => void }).trackWhatsapp; if (g) g(); }
  function trackCall() { const g = (window as unknown as { trackCall?: () => void }).trackCall; if (g) g(); }

  function closePopup() { setShowPopup(false); document.body.classList.remove("popup-open"); }

  async function submitForm(ref: React.RefObject<HTMLFormElement | null>, setStatus: (s: "idle"|"sending"|"sent"|"error") => void) {
    if (!ref.current) return;
    setStatus("sending");
    const fd = new FormData(ref.current);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => (payload[k] = v.toString()));
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
        ref.current.reset();
        const g = (window as unknown as { trackFormLead?: () => void }).trackFormLead;
        if (g) g();
      } else throw new Error();
    } catch { setStatus("error"); }
  }

  function acceptCookies() {
    setShowCookie(false);
    try { localStorage.setItem("cookie_ok", "1"); } catch {}
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (g) g("consent", "update", {
      ad_storage: "granted", ad_user_data: "granted",
      ad_personalization: "granted", analytics_storage: "granted",
    });
  }

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <a className="header-brand" href="#hero">
            <span className="header-brand-mark" aria-hidden="true" />
            <div>
              <div className="header-brand-text">هاسيندا رأس الحكمة</div>
              <div className="header-brand-sub">الكيلو 238 · وكيل معتمد</div>
            </div>
          </a>
          <nav className="header-nav">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
          <div className="header-actions">
            <a className="btn-call-header" href={`tel:${PHONE_INTL}`} onClick={trackCall}><PhoneIcon /><span>{PHONE_DISPLAY}</span></a>
            <a className="btn-register-header" href="#contact">سجل اهتمامك</a>
            <button className="mobile-menu-btn" onClick={() => setMobileNav(!mobileNav)} aria-label="القائمة"><MenuIcon /></button>
          </div>
        </div>
        {mobileNav && (
          <div style={{ background: "var(--color-navy-deep)", padding: "14px 24px", borderTop: "1px solid rgba(184,134,11,0.1)" }}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileNav(false)}
                style={{ display: "block", padding: "11px 0", color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{l.label}</a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg"><img src="/images/hacienda-hero.webp" alt="هاسيندا رأس الحكمة بالم هيلز الساحل الشمالي" /><div className="hero-overlay" /></div>
        <div className="hero-content">
          <span className="hero-badge">مشروع من Palm Hills Developments</span>
          <h1 className="hero-title">هاسيندا رأس الحكمة</h1>
          <p className="hero-subtitle">تحفة معمارية في قلب الساحل الشمالي — الكيلو ٢٣٨</p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-val">1,400 فدان</div><div className="hero-stat-lbl">مساحة المشروع</div></div>
            <div className="hero-stat"><div className="hero-stat-val">4.8 كم بيتش فرونت</div><div className="hero-stat-lbl">شاطئ مباشر</div></div>
            <div className="hero-stat"><div className="hero-stat-val">تقسيط حتى 10 سنوات</div><div className="hero-stat-lbl">أنظمة سداد مرنة</div></div>
          </div>
          <div className="hero-ctas">
            <a className="btn-outline" href="#units">استكشف الوحدات</a>
            <a className="btn-primary" href="#contact">احجز الآن</a>
          </div>
          <p className="hero-disclosure">
            موقع تسويقي لوكيل مبيعات معتمد — ليس الموقع الرسمي لشركة بالم هيلز للتطوير العقاري.
            الأسعار استرشادية والتعاقد يتم مع المطوّر مباشرة.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about" id="overview">
        <div className="section-inner">
          <div className="animate-in" style={{ textAlign: "center" }}>
            <span className="section-badge">A Masterpiece of Coastal Living</span>
            <h2 className="section-title" style={{ textAlign: "center" }}>عن المشروع</h2>
            <p className="section-desc center">هاسيندا رأس الحكمة وجهة ساحلية فريدة في قلب رأس الحكمة عند الكيلو 238. مجتمع مسوّر متكامل على البحر مباشرةً يجمع بين البحيرات الكريستالية والمساحات الخضراء الواسعة والتشطيبات الفاخرة.</p>
          </div>
          <div className="about-grid animate-in">
            <div className="about-features">
              {[
                { icon: "🏖", title: "1,400 فدان", desc: "من المجتمع الساحلي المسوّر بإطلالات بحرية مباشرة" },
                { icon: "🌊", title: "4.8 كيلومتر بيتش فرونت", desc: "على أحد أجمل شواطئ رأس الحكمة" },
                { icon: "🌿", title: "84% مياه وبحيرات وخضرة", desc: "لتجربة سكنية ساحلية فريدة" },
                { icon: "🏡", title: "صفوف فيلات بطابق واحد", desc: "للحفاظ على إطلالات البحر والخصوصية" },
              ].map((f, i) => (
                <div key={i} className="about-feature"><div className="about-feature-icon">{f.icon}</div><div><h3>{f.title}</h3><p>{f.desc}</p></div></div>
              ))}
            </div>
            <div className="about-img"><img src="/images/hacienda-launching.webp" alt="هاسيندا رأس الحكمة - منظر جوي" /></div>
          </div>
          <div className="stats-bar animate-in">
            {[
              { val: "1,400", unit: "فدان", label: "مساحة الأرض" },
              { val: "4.8", unit: "كم", label: "بيتش فرونت مباشر" },
              { val: "84", unit: "%", label: "مياه وخضرة" },
              { val: "كيلو 238", unit: "", label: "رأس الحكمة" },
            ].map((s, i) => (
              <div key={i} className="stat-card"><div className="stat-val">{s.val}{s.unit && <span>{s.unit}</span>}</div><div className="stat-lbl">{s.label}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* UNITS */}
      <section className="section units" id="units">
        <div className="section-inner animate-in" style={{ textAlign: "center" }}>
          <h2 className="section-title" style={{ textAlign: "center" }}>الوحدات المتاحة</h2>
          <p className="section-desc center">بيتش هومز وشاليهات وتوين هاوس وفيلات بإطلالات بحرية مباشرة وتشطيبات فاخرة بالكامل</p>
          <div className="units-filters">
            {([["all","الكل"],["beach","بيتش هوم"],["chalet","شاليهات"],["twin","توين هاوس"],["villa","فيلات"]] as [UnitType,string][]).map(([key,label]) => (
              <button key={key} className={`filter-btn ${filter===key?"active":""}`} onClick={() => setFilter(key)}>{label}</button>
            ))}
          </div>
          <div className="units-grid">
            {filtered.map((u, i) => (
              <div key={i} className="unit-card"><div className="unit-card-body">
                <h3>{u.name}</h3><span className="unit-en">{u.en}</span>
                <span className="unit-price-label">يبدأ من</span><div className="unit-price">{u.price}</div>
                <span className="unit-finish">تشطيب كامل + تكييفات + مطبخ</span>
                <a href={WA_URL} target="_blank" rel="noopener" onClick={trackWA} className="btn-unit" style={{ display:"block", textAlign:"center", textDecoration:"none" }}>استفسر الآن</a>
              </div></div>
            ))}
          </div>
          <p className="units-note">الأسعار استرشادية وقابلة للتغيير — يُرجى التواصل معنا للحصول على آخر قائمة أسعار رسمية قبل الحجز</p>
          <div style={{ marginTop: 28 }}><a className="btn-green" href={WA_URL} target="_blank" rel="noopener" onClick={trackWA}>💬 تحدث مع مستشارينا على واتساب</a></div>
        </div>
      </section>

      {/* PAYMENT */}
      <section className="section payment" id="payment">
        <div className="section-inner animate-in" style={{ textAlign: "center" }}>
          <h2 className="section-title" style={{ textAlign: "center" }}>خطة السداد</h2>
          <p className="section-desc center">أنظمة سداد مرنة وميسّرة تناسب احتياجاتك مع مقدّم بسيط وتقسيط طويل الأمد</p>
          <div className="payment-grid" style={{ textAlign: "right" }}>
            <div className="payment-card">
              <h3>نظام التقسيط</h3>
              <ul className="payment-list">
                <li>5% مقدم</li><li>5% بعد فترة</li><li>تقسيط حتى 10 سنوات</li>
                <li>أول 4 صفوف على 8 سنوات</li><li>الأجانب يدفعون مثل المصريين</li>
              </ul>
              <div style={{ marginTop: 20 }}><a className="btn-primary" href={WA_URL} target="_blank" rel="noopener" onClick={trackWA} style={{ width:"100%", justifyContent:"center" }}>اطلب تفاصيل السداد</a></div>
            </div>
            <div className="payment-card">
              <h3>قيمة جدية الحجز (EOI)</h3>
              <div className="eoi-table">
                {[["البيتش هوم","250K EGP"],["الشاليهات","500K EGP"],["الفيلات والتوين هاوس","1M EGP"]].map(([t,v],i) => (
                  <div key={i} className="eoi-row"><span className="eoi-type">{t}</span><span className="eoi-val">{v}</span></div>
                ))}
              </div>
              <p className="payment-note">مبالغ EOI مستردة بالكامل — تواصل معنا للحصول على آخر قائمة الوحدات والأسعار قبل سداد جدية الحجز.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section gallery" id="gallery">
        <div className="section-inner animate-in" style={{ textAlign: "center" }}>
          <h2 className="section-title" style={{ textAlign: "center" }}>معرض الصور والماستر بلان</h2>
          <p className="section-desc center">استكشف تجربة الحياة الساحلية في هاسيندا رأس الحكمة</p>
          <div className="gallery-grid">
            {[
              { src: "/images/hacienda-hero.webp", cap: "هاسيندا رأس الحكمة - الإطلالة الرئيسية" },
              { src: "/images/hacienda-launching.webp", cap: "هاسيندا رأس الحكمة - منظر جوي" },
              { src: "/images/hacienda-master-plan.webp", cap: "هاسيندا رأس الحكمة - الماستر بلان" },
              { src: "/images/hacienda-beach.webp", cap: "شاطئ رأس الحكمة" },
            ].map((g, i) => (
              <div key={i} className="gallery-item"><img src={g.src} alt={g.cap} /><div className="gallery-item-caption">{g.cap}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="facilities" id="facilities">
        <div className="facilities-bg"><img src="/images/hacienda-beach.webp" alt="Hacienda facilities" /></div>
        <div className="facilities-content animate-in">
          <div style={{ textAlign: "center" }}>
            <h3 className="section-title" style={{ color: "#fff", textAlign: "center" }}>المرافق والخدمات</h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, maxWidth: 580, margin: "0 auto" }}>تجربة معيشية ساحلية فاخرة بمرافق عالمية</p>
          </div>
          <div className="facilities-grid">
            {[{i:"🏋️",n:"نادي رياضي"},{i:"💎",n:"بحيرات كريستالية"},{i:"🏠",n:"كلوب هاوس"},{i:"🔒",n:"كمبوند مسوّر"},{i:"🏖",n:"بيتش فرونت مباشر"},{i:"💧",n:"مسطحات مائية"},{i:"🌳",n:"مساحات خضراء"},{i:"✨",n:"تشطيبات فاخرة"}].map((f,i) => (
              <div key={i} className="facility-card"><div className="facility-icon">{f.i}</div><div className="facility-name">{f.n}</div></div>
            ))}
          </div>
          <div className="future-section" style={{ textAlign: "center" }}>
            <h3 className="section-title" style={{ color: "#fff", textAlign: "center", fontSize: "clamp(20px,3vw,32px)" }}>مستقبل رأس الحكمة</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, maxWidth: 560, margin: "0 auto" }}>رأس الحكمة وجهة المتوسط المستقبلية بمرافق ضخمة وبنية تحتية متكاملة</p>
            <div className="future-grid">
              {[{i:"✈️",n:"مطار دولي"},{i:"⛵",n:"مارينا دولية"},{i:"🏢",n:"منطقة حرة"},{i:"📡",n:"مدينة ذكية"},{i:"🏗",n:"حي أعمال مركزي"},{i:"🌐",n:"منظومة متكاملة"}].map((f,i) => (
                <div key={i} className="future-card"><div className="future-card-icon">{f.i}</div><div className="future-card-name">{f.n}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="section location" id="location">
        <div className="section-inner animate-in" style={{ textAlign: "center" }}>
          <h2 className="section-title" style={{ textAlign: "center" }}>الموقع</h2>
          <p className="section-desc center">رأس الحكمة، الساحل الشمالي - الكيلو 238</p>
          <div className="location-grid" style={{ textAlign: "right" }}>
            <div className="location-img"><img src="/images/hacienda-master-plan.webp" alt="موقع هاسيندا رأس الحكمة" /></div>
            <div className="location-facts">
              {[{ t: "الكيلو 238", d: "على الطريق الساحلي الدولي" },{ t: "رأس الحكمة", d: "أحد أجمل شواطئ الساحل الشمالي" },{ t: "قريب من", d: "المطار الدولي والمارينا المخططة" }].map((f,i) => (
                <div key={i} className="location-fact"><h4>{f.t}</h4><p>{f.d}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq" id="faq">
        <div className="section-inner animate-in" style={{ textAlign: "center" }}>
          <h2 className="section-title" style={{ textAlign: "center" }}>الأسئلة الشائعة</h2>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div key={i} className="faq-item">
                <button className={`faq-q ${openFaq===i?"open":""}`} onClick={() => setOpenFaq(openFaq===i?null:i)}><span>{f.q}</span><span className="arrow"><ChevronDown /></span></button>
                <div className={`faq-a ${openFaq===i?"open":""}`}><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENT DISCLOSURE — Google Ads compliance */}
      <section className="agent-section" id="about-agent">
        <div className="agent-inner animate-in">
          <span className="section-badge">من نحن</span>
          <h3>{AGENT_AR} — وكيل مبيعات معتمد</h3>
          <p><strong>{AGENT_AR} ({AGENT_EN})</strong> شركة تسويق ووساطة عقارية، وكيل مبيعات معتمد لدى شركة بالم هيلز للتطوير العقاري. نقدّم استشارة عقارية مجانية ونساعدك في اختيار الوحدة المناسبة وإتمام إجراءات الحجز.</p>
          <p><strong>لسنا الشركة المطوّرة.</strong> هذا الموقع ليس الموقع الرسمي لبالم هيلز. التعاقد والسداد يتمّان مع المطوّر مباشرة وبعقوده وحساباته البنكية الرسمية، ولا نتقاضى من المشتري أي عمولة أو رسوم فوق السعر المعلن.</p>
          <p>جميع الأسعار وأنظمة السداد المذكورة استرشادية وقابلة للتغيير من قِبل المطوّر دون إشعار مسبق، ولا تُعد عرضاً ملزماً. الأسعار النهائية وشروط التعاقد تُحدد من المطوّر عند التعاقد.</p>
          <p style={{ fontSize: 12.5 }}>«بالم هيلز» و«هاسيندا» و«Hacienda Ras El Hekma» علامات تجارية مملوكة لشركة Palm Hills Developments S.A.E، وتُستخدم هنا لتعريف المشروع المعروض فقط دون أي ادعاء ملكية أو رعاية.</p>
          <p style={{ marginTop: 14 }}>
            <strong>التواصل:</strong>{" "}
            <a href={`tel:${PHONE_INTL}`} onClick={trackCall} style={{ color: "var(--color-gold)", fontWeight: 700 }}>{PHONE_DISPLAY}</a>
            {" · "}
            <a href={`mailto:${AGENT_EMAIL}`} style={{ color: "var(--color-gold)" }}>{AGENT_EMAIL}</a>
            <br />{AGENT_ADDRESS}
            <br />{AGENT_HOURS}
          </p>
          <span className="agent-badge">{AGENT_EN} · وكيل مبيعات معتمد</span>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section contact" id="contact">
        <div className="section-inner animate-in" style={{ textAlign: "center" }}>
          <h2 className="section-title">سجل اهتمامك</h2>
          <p className="section-desc" style={{ color: "rgba(255,255,255,0.65)", margin: "0 auto" }}>املأ النموذج وسيتواصل معك مستشار المبيعات للحصول على آخر الأسعار وقائمة الوحدات</p>
          <form className="contact-form" ref={formRef} onSubmit={(e: FormEvent) => { e.preventDefault(); submitForm(formRef, setFormStatus); }} style={{ textAlign: "right" }}>
            <input type="hidden" name="access_key" value={WEB3_KEY} />
            <input type="hidden" name="subject" value="Lead — هاسيندا رأس الحكمة بالم هيلز" />
            <input type="hidden" name="from_name" value="Hacienda Landing - Grandeur Spaces" />
            <input type="checkbox" name="botcheck" style={{ display: "none" }} />
            <div className="form-row">
              <div className="form-field"><label>الاسم الكامل *</label><input name="name" type="text" placeholder="أدخل اسمك" required /></div>
              <div className="form-field"><label>رقم الهاتف *</label><input name="phone" type="tel" dir="ltr" placeholder="01012345678" required /></div>
            </div>
            <div className="form-row">
              <div className="form-field"><label>البريد الإلكتروني</label><input name="email" type="email" dir="ltr" placeholder="email@example.com" /></div>
              <div className="form-field"><label>نوع الوحدة</label>
                <select name="unit_type"><option value="غير محدد">اختر نوع الوحدة</option><option value="بيتش هوم">بيتش هوم</option><option value="شاليه">شاليه</option><option value="توين هاوس">توين هاوس</option><option value="فيلا">فيلا</option></select>
              </div>
            </div>
            {formStatus === "sent" ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}><div style={{ fontSize: 44, marginBottom: 10 }}>✓</div><p style={{ color: "var(--color-gold)", fontSize: 17, fontWeight: 700 }}>تم استلام بياناتك بنجاح</p><p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 6 }}>سيتواصل معك مستشار المبيعات قريباً</p></div>
            ) : (
              <button type="submit" className="btn-submit" disabled={formStatus==="sending"}>{formStatus==="sending" ? "جاري الإرسال..." : "إرسال"}</button>
            )}
            {formStatus === "error" && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", marginTop: 10 }}>حدث خطأ — <a href={WA_URL} target="_blank" rel="noopener" onClick={trackWA} style={{ color: "var(--color-gold)" }}>تواصل واتساب</a></p>}
          </form>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 16, maxWidth: 500, margin: "16px auto 0" }}>
            بإرسال هذا النموذج أنت توافق على <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "var(--color-gold)", textDecoration: "underline", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-sans)" }}>سياسة الخصوصية</button> الخاصة بنا.
            بياناتك لن تُشارك مع أي طرف ثالث.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-brand-name">{AGENT_EN}</span>
            <span className="footer-brand-sub">{AGENT_AR} · وكيل مبيعات معتمد</span>
          </div>
          <p className="footer-text">
            موقع تسويقي تديره {AGENT_AR} لعرض وحدات مشروع هاسيندا رأس الحكمة من بالم هيلز للتطوير العقاري
            عند الكيلو 238 بالساحل الشمالي. <strong style={{ color: "rgba(255,255,255,0.72)" }}>لسنا الشركة المطوّرة وهذا ليس موقعها الرسمي.</strong>
          </p>
          <p className="footer-contact">
            {AGENT_ADDRESS} · <a href={`mailto:${AGENT_EMAIL}`}>{AGENT_EMAIL}</a> · {AGENT_HOURS}
          </p>
          <div className="footer-links">
            <a className="footer-link" href={`tel:${PHONE_INTL}`} onClick={trackCall}><PhoneIcon /><span>اتصل بنا {PHONE_DISPLAY}</span></a>
            <a className="footer-link" href={WA_URL} target="_blank" rel="noopener" onClick={trackWA}><span>💬 واتساب</span></a>
          </div>
          <div className="footer-legal">
            <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 11, textDecoration: "underline", cursor: "pointer", fontFamily: "var(--font-sans)" }}>سياسة الخصوصية</button>
            <a href="#about-agent">من نحن</a>
            <a href="#contact">تواصل معنا</a>
          </div>
          <p className="footer-trademark">
            «بالم هيلز» و«Palm Hills» و«هاسيندا رأس الحكمة» علامات تجارية مملوكة لشركة Palm Hills Developments S.A.E،
            وتُستخدم على هذا الموقع لغرض تعريف المشروع المعروض فقط. الصور مواد تسويقية صادرة عن المطوّر وذات طبيعة تعبيرية.
          </p>
          <p className="footer-credit">© 2026 {AGENT_EN} — {AGENT_AR}. جميع الأسعار استرشادية وقابلة للتغيير من المطوّر.</p>
        </div>
      </footer>

      {/* POPUP */}
      <div className={`popup-backdrop ${showPopup?"open":""}`} onClick={closePopup} />
      <div className={`popup-dialog ${showPopup?"open":""}`} role="dialog">
        <button className="popup-close" onClick={closePopup}>✕</button>
        <span className="popup-badge">هاسيندا رأس الحكمة · الكيلو 238</span>
        <h2 className="popup-title">احجز مكانك في هاسيندا رأس الحكمة</h2>
        <p className="popup-desc">سيب بياناتك ونبعتلك آخر تحديث للوحدات المتاحة والأسعار المعلنة من المطوّر</p>
        <ul className="popup-perks"><li>آخر قائمة وحدات ومواقع متاحة على الماستر بلان</li><li>نظام سداد معلن: 5% مقدم وتقسيط حتى 10 سنوات</li><li>مستشار مبيعات يتواصل معك في أقرب وقت</li></ul>
        {popupStatus === "sent" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}><div style={{ fontSize: 44, marginBottom: 10 }}>✓</div><p style={{ color: "var(--color-gold)", fontSize: 17, fontWeight: 700 }}>تم استلام بياناتك</p></div>
        ) : (
          <form className="popup-form" ref={popupFormRef} onSubmit={(e: FormEvent) => { e.preventDefault(); submitForm(popupFormRef, setPopupStatus).then(() => { if (popupFormRef.current) setTimeout(closePopup, 2500); }); }}>
            <input type="hidden" name="access_key" value={WEB3_KEY} /><input type="hidden" name="subject" value="Popup Lead — هاسيندا رأس الحكمة" /><input type="hidden" name="from_name" value="Hacienda Popup - Grandeur Spaces" /><input type="checkbox" name="botcheck" style={{ display: "none" }} />
            <div className="form-field"><label>الاسم *</label><input name="name" type="text" placeholder="الاسم الكامل" required /></div>
            <div className="form-field"><label>رقم الموبايل *</label><input name="phone" type="tel" dir="ltr" placeholder="01012345678" required /></div>
            <div className="form-field"><label>نوع الوحدة</label><select name="unit_type"><option value="غير محدد">اختر</option><option value="بيتش هوم">بيتش هوم</option><option value="شاليه">شاليه</option><option value="توين هاوس">توين هاوس</option><option value="فيلا">فيلا</option></select></div>
            <button type="submit" className="popup-submit" disabled={popupStatus==="sending"}>{popupStatus==="sending" ? "جاري الإرسال..." : "اطلب التفاصيل"}</button>
            {popupStatus === "error" && <p style={{ color: "#ef4444", fontSize: 12, textAlign: "center", marginTop: 6 }}>حدث خطأ — جرب تاني</p>}
            <a className="popup-wa-link" href={WA_URL} target="_blank" rel="noopener" onClick={trackWA}>💬 تواصل واتساب</a>
          </form>
        )}
      </div>

      {/* PRIVACY MODAL */}
      {showPrivacy && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={() => setShowPrivacy(false)} />
          <div style={{ position: "fixed", zIndex: 301, top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(600px,92vw)", maxHeight: "85vh", overflowY: "auto", background: "#fff", borderRadius: 20, padding: "36px 28px", color: "var(--color-navy)" }}>
            <button onClick={() => setShowPrivacy(false)} style={{ position: "absolute", top: 14, left: 14, background: "var(--color-cream)", border: "none", borderRadius: "50%", width: 34, height: 34, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700, marginBottom: 16 }}>سياسة الخصوصية وإخلاء المسؤولية</h2>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: "var(--color-muted)" }}>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>١. البيانات التي نجمعها:</strong> الاسم، رقم الهاتف، البريد الإلكتروني، ونوع الوحدة المفضلة — فقط عند تعبئة نموذج الاتصال.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>٢. الاستخدام:</strong> نستخدم بياناتك حصرياً للتواصل معك بخصوص استفسارك عن وحدات هاسيندا رأس الحكمة وتقديم العروض والمعلومات ذات الصلة.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>٣. الحماية:</strong> يتم إرسال البيانات عبر اتصال مشفر (HTTPS) وتخزينها بشكل آمن عبر خدمة Web3Forms. لا نبيع أو نشارك بياناتك مع أطراف ثالثة.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>٤. ملفات الارتباط:</strong> نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وقياس أداء الموقع.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>٥. حقوقك:</strong> يحق لك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها أو الاعتراض على استخدامها في أي وقت.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>٦. مدة الاحتفاظ:</strong> نحتفظ ببيانات التواصل مدة أقصاها 24 شهراً من آخر تفاعل، ثم تُحذف. يمكنك طلب الحذف الفوري في أي وقت.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>٧. صفة مشغّل الموقع:</strong> هذا الموقع تديره {AGENT_AR} ({AGENT_EN})، وكيل مبيعات معتمد لدى بالم هيلز للتطوير العقاري. الموقع ليس الموقع الرسمي للمطوّر ولسنا مملوكين له.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>٨. الأسعار والعروض:</strong> كل الأسعار وأنظمة السداد وقيم جدية الحجز المعروضة استرشادية ومستقاة من المواد المعلنة من المطوّر وقت النشر، وقابلة للتغيير دون إشعار. لا تُعد عرضاً ملزماً ولا تنشئ التزاماً تعاقدياً. توافر الوحدات مرهون بمخزون المطوّر لحظة الحجز.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>٩. العلامات التجارية:</strong> «بالم هيلز» و«هاسيندا رأس الحكمة» وما يتصل بها من شعارات مملوكة لشركة Palm Hills Developments S.A.E، وتُستخدم هنا لغرض وصفي بحت لتعريف المشروع، دون ادعاء أي ملكية أو رعاية.</p>
              <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--color-navy)" }}>١٠. الصور:</strong> الصور والمخططات مواد تسويقية صادرة عن المطوّر وذات طبيعة تعبيرية، وقد تختلف عن الشكل النهائي للوحدات.</p>
              <p><strong style={{ color: "var(--color-navy)" }}>١١. التواصل:</strong> لأي استفسار بخصوص بياناتك الشخصية أو محتوى الموقع، تواصل معنا على <a href={`tel:${PHONE_INTL}`} onClick={trackCall} style={{ color: "var(--color-gold)" }}>{PHONE_DISPLAY}</a> أو <a href={`mailto:${AGENT_EMAIL}`} style={{ color: "var(--color-gold)" }}>{AGENT_EMAIL}</a></p>
            </div>
            <p style={{ fontSize: 11, color: "#999", marginTop: 16 }}>آخر تحديث: سبتمبر 2026 · {AGENT_EN} ({AGENT_AR}) — وكيل مبيعات معتمد لدى بالم هيلز للتطوير العقاري</p>
          </div>
        </>
      )}

      {/* COOKIE CONSENT */}
      {showCookie && (
        <div className="cookie-banner">
          <p>نستخدم ملفات تعريف الارتباط (cookies) لتحسين تجربتك على الموقع. بالمتابعة أنت توافق على <button onClick={() => setShowPrivacy(true)} style={{ background: "none", border: "none", color: "var(--color-gold)", textDecoration: "underline", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-sans)" }}>سياسة الخصوصية</button>.</p>
          <div className="cookie-btns">
            <button className="cookie-accept" onClick={acceptCookies}>موافق</button>
            <button className="cookie-decline" onClick={() => setShowCookie(false)}>رفض</button>
          </div>
        </div>
      )}

      {/* MOBILE BAR */}
      <nav className="mobile-bar">
        <div className="mobile-bar-inner">
          <a className="bar-call" href={`tel:${PHONE_INTL}`} onClick={trackCall}><PhoneIcon /><span>{PHONE_DISPLAY}</span></a>
          <a className="bar-wa" href={WA_URL} target="_blank" rel="noopener" onClick={trackWA}>💬 واتساب</a>
          <a className="bar-register" href="#contact">سجل</a>
        </div>
      </nav>
    </>
  );
}
