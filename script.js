/* =========================================================
   문경준 Portfolio — interactions
   - Lucide icons
   - Mobile nav (hamburger)
   - Dark / Light theme toggle (localStorage + prefers-color-scheme)
   - KO / EN language toggle (localStorage)
   - Scroll-spy active nav
   - IntersectionObserver reveal-on-scroll
   ========================================================= */

(function () {
  "use strict";

  const root = document.documentElement;

  /* ---------- Lucide icons ---------- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ---------- Theme ---------- */
  const THEME_KEY = "portfolio-theme";
  const themeBtn = () => document.querySelector("[data-theme-toggle]");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f5f0" : "#101114");
    const btn = themeBtn();
    if (btn) {
      const isLight = theme === "light";
      btn.setAttribute("aria-pressed", String(isLight));
      btn.setAttribute("aria-label", isLight ? "다크 모드로 전환" : "라이트 모드로 전환");
      // Lucide replaces <i data-lucide> with <svg>, so rebuild a fresh <i> each time.
      btn.innerHTML = '<i data-lucide="' + (isLight ? "sun" : "moon") + '"></i>';
      renderIcons();
    }
  }

  function initTheme() {
    let theme;
    try {
      theme = localStorage.getItem(THEME_KEY);
    } catch (e) {
      theme = null;
    }
    if (!theme) {
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      theme = prefersLight ? "light" : "dark";
    }
    applyTheme(theme);
  }

  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {}
  }

  /* ---------- Language (i18n) ---------- */
  const LANG_KEY = "portfolio-lang";

  // English strings keyed by data-i18n. Korean stays as the in-HTML default.
  const EN = {
    "a11y.skip": "Skip to content",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.collaboration": "Collaboration",
    "nav.contact": "Contact",

    "hero.eyebrow": "AI Engineering · AX Planning · Cloud",
    "hero.subtitle": "Portfolio",
    "hero.text": "From planning to implementation to cloud operations — I design AI services end-to-end. Starting from resource and geotechnical field data, I built RAG, anomaly-detection and computer-vision services and operated them on Azure and AWS.",
    "hero.viewProjects": "View Projects",

    "panel.portfolio": "Portfolio",
    "panel.univDept": "Dept. of Energy & Resources Engineering",
    "panel.gpa": "Major GPA 3.98 / 4.5",
    "panel.ssafyDesc": "Samsung SW Academy for Youth · Cohort 16",
    "panel.aiChipDesc": "AI Semiconductor Training · GPU/NPU",

    "about.kicker": "About",
    "about.title": "Plan, build, run — one continuous flow",
    "about.subtitle": "One person connecting AX planning, AI implementation and cloud operations.",
    "about.body": "Starting from the geotechnical and tunnel field data I handled in energy & resources engineering, I am an engineer who plans, builds and operates cloud AI services. I connect problem definition and architecture design (AX planning), RAG / anomaly-detection / computer-vision model implementation (AI), and Azure/AWS-based deployment and operation (Cloud) into one flow. Working with field data taught me that data quality and labeling criteria drive model performance, so I focus on designing not just the model but the data, experiment conditions and service structure together.",

    "cred.kicker": "Credentials",
    "train.kicker": "Training",
    "train.title": "Training & Courses",
    "skills.kicker": "Core Skills",
    "skills.title": "Core competencies — plan · build · run",
    "skills.aiTitle": "AX Planning",
    "skills.aiDesc": "Problem definition · service planning · architecture design. Led the RAG contract-analysis project (CheckMate) as PM, owning the flow and role split.",
    "skills.beTitle": "AI Implementation",
    "skills.beDesc": "RAG, anomaly detection, computer vision (YOLO), agentic & generative AI. End-to-end implementation on FastAPI.",
    "skills.cloudTitle": "Cloud / Operations",
    "skills.cloudDesc": "Operating Azure OpenAI · AI Search · Container Apps. Design on AWS (Bedrock · Solutions Architect).",

    "exp.kicker": "Experience",
    "exp.title": "Research experience",
    "exp.role": "Undergraduate Research Assistant · 2024.11 - 2025.07",
    "exp.lab": "Rock Mechanics & Underground Space Lab",
    "exp.labDesc": "Conducted research detecting hazard zones at rock slopes and tunnel construction sites from data.",

    "exp.rockType": "Computer Vision",
    "exp.rockTitle": "CCTV-based Rockfall Detection",
    "exp.rockSummary": "Built a research prototype that filters rockfall candidates by combining YOLOv8 object detection with frame-difference motion detection.",
    "exp.rockCap": "Rockfall candidate detection combining YOLOv8 with motion detection",
    "exp.rockProblemH": "Problem",
    "exp.rockProblem": "Rockfall detection is a video problem where small objects move fast and false positives arise easily from lighting changes or background shake. To reduce this, I did not use raw YOLOv8 detections directly, but also extracted regions of actual movement via frame differencing.",
    "exp.rockImplH": "Implementation",
    "exp.rockImpl": "Processing frames sequentially, YOLOv8 produced rock candidate boxes while an OpenCV-based MotionDetector computed motion boxes. Only boxes meeting an IoU/IoM threshold were kept as final candidates, and a GUI allowed adjusting confidence, IoU threshold, tile size, step and display mode (box/dot/none).",
    "exp.rockExpH": "Experiments",
    "exp.rockExp": "I ran YOLOv8 training experiments across image size, batch size and learning-rate combinations, and examined the trade-off between recall-focused settings that avoid missing small rockfalls and precision-focused settings that reduce false positives.",
    "exp.rockEvidence": "Implementation: YOLOv8·MotionDetector code, IoU/IoM fusion, GUI-based video processing flow.",

    "exp.mwdType": "Anomaly Detection",
    "exp.mwdTitle": "Tunnel MWD Anomaly Detection",
    "exp.mwdSummary": "Linked MWD signals and RMR changes from tunnel sites to estimate ground hazard zones, and compared unsupervised anomaly detection models.",
    "exp.mwdCap": "Hazard-zone detection visualizing MWD signals together with RMR change",
    "exp.mwdProblemH": "Problem",
    "exp.mwdProblem": "This started from the idea that MWD signals such as boring speed, rotation pressure and feed pressure indirectly reflect ground-condition changes during tunnel excavation. I aligned raw site data by depth and defined zones of declining RMR as proxy labels for hazard zones.",
    "exp.mwdModelH": "Model comparison",
    "exp.mwdModel": "I compared Isolation Forest, Local Outlier Factor and One-Class SVM, varying feature combinations and parameters such as contamination, n_neighbors, gamma and nu. To turn results into interpretable hazard zones, I merged nearby anomalies and filtered out segments that were too short.",
    "exp.mwdEvalH": "Evaluation",
    "exp.mwdEval": "I compared predicted hazard zones against RMR-decline zones in 0.5 m depth bins, computing Precision, Recall, F1 and Accuracy. The experiments showed how feature combinations and model choices changed detection results within each site's data.",
    "exp.mwdEvidence": "Implementation: IF/LOF/OCSVM experiment GUI, depth-bin evaluation, result CSVs and visualization graphs.",

    "proj.kicker": "Personal Project",
    "proj.title": "Personal projects",
    "proj.n2sType": "AI R&D Pipeline",
    "proj.n2sDesc": "A personal R&D knowledge pipeline that collects AI tech trends and turns them into actionable Skills and design records.",
    "proj.n2sP1": "Designed a manually triggered AI-news collection flow on GitHub Actions with local LLM agent processing",
    "proj.n2sP2": "Added a human-in-the-loop approval step to control absorption into the knowledge base",
    "proj.n2sP3": "Controlled how generated assets are applied through static audit, provenance verification and downgrade prevention",
    "proj.n2sScopeH": "Scope",
    "proj.n2sScope": "Designed a pipeline where GitHub Actions is run on demand to collect AI-news candidates, then a local LLM workflow handles analysis, draft generation, human approval and knowledge-asset promotion.",
    "proj.n2sTrustH": "Trust mechanisms",
    "proj.n2sTrust": "Static audit, provenance verification and downgrade-prevention checks ensure LLM-generated assets pass human approval and verification before being applied.",
    "proj.n2sEvidence": "Implementation: <code>.github/workflows</code>, <code>scripts/sign_drafts.py</code>, <code>scripts/audit_index.py</code>, <code>.agents/workflows</code>.",

    "proj.kraftonType": "AI R&D Hackathon",
    "proj.kraftonDesc": "A personal archive organizing my KRAFTON AI R&D Hackathon finals experience into per-problem solutions and retrospectives.",
    "proj.kraftonP1": "Solutions for prelim MultiplierBoard, SparseTap and finals Written Exam, BattlePredict, VideoAgent",
    "proj.kraftonP2": "Separated contest submissions from post-contest code that I implemented and reran to document changes and limits",
    "proj.kraftonP3": "Clearly marked the organizer-review-based version as a follow-up plan rather than a completed implementation",
    "proj.kraftonOrgH": "How it is organized",
    "proj.kraftonOrg": "The archive separates contest submissions, post-contest improvements implemented and run before the organizer review, and follow-up plans based on that review.",
    "proj.kraftonRepH": "Representative problems",
    "proj.kraftonRep": "After the contest I rebuilt VideoAgent on Vertex AI and added retries, incremental result saving and file cleanup. The improved variants recorded repeated run times of about 190–666 seconds; hard timeouts, failed-task cancellation and a ground-truth evaluation set remain follow-up work.",
    "proj.kraftonEvidence": "Implementation: per-problem READMEs, VideoAgent FFmpeg processing code, BattlePredict <code>correct_solve.py</code>, and a SparseTap GF(2) solution.",

    "collab.kicker": "Team Experience",
    "collab.title": "Collaboration projects",

    "collab.busanType": "Hackathon · Service",
    "collab.busanStatus": "Award",
    "collab.busanDesc": "A Busan fishing-info service planned and built with a team at the Busan Ralphton hackathon hosted by the Codex community. After winning the Host Voting Award, we developed it beyond a one-off demo into an operating web service.",
    "collab.busanP1": "Joined a team across service planning and development",
    "collab.busanP2": "Won the hackathon's Host Voting Award",
    "collab.busanP3": "Continued development after the event and now operate it as a live web service",
    "collab.openSite": "Open site",

    "collab.checkmateType": "RAG Contract Analysis",
    "collab.checkmateDesc": "A system that reviews unfair contract clauses with RAG on Azure OpenAI and AI Search. Combining a Rule Engine with the LLM cut cost and improved the stability of evidence-grounded responses.",
    "collab.checkmateScopeH": "My role",
    "collab.checkmateScope": "Using Azure Language PII I extracted the locations of personal data in contracts and visualized them as masked images mapped to OCR coordinates. I also loaded lease and labor-contract legal data into Azure AI Search so RAG retrieval could supply the evidence needed to explain contract risk.",
    "collab.checkmateArchH": "Architecture",
    "collab.checkmateArch": "Uploaded contract documents from the frontend are received by a FastAPI backend and passed to Azure Document Intelligence for text and coordinate extraction. Then PII masking, Rule-Engine first-pass validation, Azure AI Search RAG and Azure OpenAI report generation produce user-understandable analysis and multilingual summaries.",

    "collab.airaType": "AI Voice Companion",
    "collab.airaDesc": "A real-time voice companion extended from the STT, tool-calling and RAG-memory modules separated out in 3rd Project Modules. It includes FastAPI WebSocket, Gemini Native Audio, conversation memory and a Next.js frontend flow.",
    "collab.airaScopeH": "My role",
    "collab.airaScope": "I first implemented my assigned voice-input processing, intent routing, tool calling and long-term memory as modules in the 3rd_Project_Modules repo. I then integrated that structure into the Aira backend to classify user utterances in real time and inject external context such as transit, news, weather and schedule into responses.",
    "collab.airaArchH": "Architecture",
    "collab.airaArch": "A FastAPI WebSocket acts as the central gateway for voice conversations and Gemini Native Audio generates real-time responses. An Intent Router and Orchestrator branch on utterance intent, combining Seoul real-time info, TMAP/ODSay transit, news, weather and memory context to raise response quality.",
    "collab.aira3rd": "3rd Modules",

    "collab.snapqType": "Computer Vision Estimate",
    "collab.snapqDesc": "An AI service that analyzes vehicle-damage images to produce damage type, area and probability-based repair-cost ranges. I joined as UI/UX planning and frontend development.",
    "collab.snapqScopeH": "My role",
    "collab.snapqScope": "I handled UI/UX planning and frontend development. I designed the screen flow from image upload to viewing damage-analysis results, and shaped the service experience so AI inference results are understandable to users.",
    "collab.snapqArchH": "Architecture",
    "collab.snapqArch": "The linked GitHub repo is the FastAPI-based AI inference engine within the full SNAP-Q service. Vehicle-damage images arriving via a React frontend and Spring Boot server are classified by Azure Custom Vision, damage regions are detected with Mask R-CNN, and a repair-estimate JSON and visualization image are returned.",

    "contact.kicker": "Contact",
    "contact.top": "Back to top",

    "footer.built": "Built with HTML, CSS, JavaScript",

    "common.details": "Details"
  };

  const langBtn = () => document.querySelector("[data-lang-toggle]");
  let koCache = null;

  function cacheKorean() {
    if (koCache) return;
    koCache = {};
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      koCache[el.getAttribute("data-i18n")] = el.innerHTML;
    });
  }

  function applyLang(lang) {
    cacheKorean();
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (lang === "en" && EN[key] != null) {
        el.innerHTML = EN[key];
      } else if (koCache[key] != null) {
        el.innerHTML = koCache[key];
      }
    });
    root.setAttribute("lang", lang);
    const btn = langBtn();
    if (btn) {
      btn.textContent = lang === "en" ? "KO" : "EN";
      btn.setAttribute("aria-label", lang === "en" ? "한국어로 보기" : "View in English");
    }
    renderIcons();
  }

  function initLang() {
    let lang;
    try {
      lang = localStorage.getItem(LANG_KEY);
    } catch (e) {
      lang = null;
    }
    applyLang(lang === "en" ? "en" : "ko");
  }

  function toggleLang() {
    const next = root.getAttribute("lang") === "en" ? "ko" : "en";
    applyLang(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch (e) {}
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Scroll-spy ---------- */
  function initScrollSpy() {
    const sections = ["experience", "projects", "collaboration", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const links = new Map();
    document.querySelectorAll('#primary-nav a[href^="#"]').forEach((a) => {
      links.set(a.getAttribute("href").slice(1), a);
    });
    if (!sections.length || !links.size) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((a) => a.classList.remove("active"));
            const active = links.get(entry.target.id);
            if (active) active.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    // NOTE: .hero-panel is intentionally excluded — animating it composited the
    // small, heavily downscaled profile photo and softened it. Keep it static.
    const items = document.querySelectorAll(
      ".section, .hero-copy, .project-card, .capability-card, .credential-item, .research-topic-card"
    );
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    items.forEach((el) => el.classList.add("reveal"));
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    items.forEach((el) => obs.observe(el));
  }

  /* ---------- Boot ---------- */
  window.addEventListener("DOMContentLoaded", () => {
    renderIcons();
    initTheme();
    initLang();
    initMobileNav();
    initScrollSpy();
    initReveal();

    const tb = themeBtn();
    if (tb) tb.addEventListener("click", toggleTheme);
    const lb = langBtn();
    if (lb) lb.addEventListener("click", toggleLang);
  });
})();
