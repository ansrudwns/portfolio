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

    "hero.eyebrow": "Problem Framing · AI Engineering · Validation",
    "hero.subtitle": "Portfolio",
    "hero.text": "I structure the problem, implement the AI it needs and validate the result. Through geotechnical hazard detection, contract RAG, voice agents and an AI R&D pipeline, I have connected data, models and human judgment.",
    "hero.viewProjects": "View Projects",

    "panel.portfolio": "Portfolio",
    "panel.univDept": "Dept. of Energy & Resources Engineering",
    "panel.gpa": "Major GPA 3.98 / 4.5",
    "panel.ssafyDesc": "Samsung SW Academy for Youth · Cohort 16",
    "panel.aiChipDesc": "AI Semiconductor Training · GPU/NPU",

    "cred.kicker": "Credentials",
    "train.kicker": "Training",
    "train.title": "Training & Courses",
    "skills.kicker": "Core Skills",
    "skills.title": "Core competencies — plan · build · run",
    "skills.aiTitle": "AX Planning",
    "skills.aiDesc": "I structure user problems into input, decision, validation and operation stages. On CheckMate, I served as PM and backend contributor, defining the analysis flow and role boundaries.",
    "skills.beTitle": "AI Implementation",
    "skills.beDesc": "I implement AI structures that fit the problem: YOLO plus motion, IF/LOF/OCSVM comparisons, Azure RAG, and voice tool and memory modules.",
    "skills.cloudTitle": "Cloud / Operations",
    "skills.cloudDesc": "Implemented Azure OpenAI, AI Search and Document Intelligence integrations plus GitHub Actions workflows. Expanding AWS architecture and Bedrock experience through formal training.",

    "exp.kicker": "Experience",
    "exp.title": "Research experience",
    "exp.role": "Undergraduate Research Assistant · 2024.11 - 2025.07",
    "exp.lab": "Rock Mechanics & Underground Space Lab",
    "exp.labDesc": "Conducted research detecting hazard zones at rock slopes and tunnel construction sites from data.",

    "exp.rockType": "Computer Vision",
    "exp.rockTitle": "CCTV-based Rockfall Detection",
    "exp.rockSummary": "Built a research prototype that filters rockfall candidates by combining YOLOv8 object detection with frame-difference motion detection.",
    "exp.rockP1": "Role: training experiments, inference pipeline, MotionDetector fusion and tuning GUI",
    "exp.rockP2": "Choice: filtered YOLO-only false positives using actual motion as a second signal",
    "exp.rockP3": "Validation: measured precision and recall changes across training conditions and thresholds",
    "exp.rockCap": "Rockfall candidate detection combining YOLOv8 with motion detection",
    "exp.rockRoleH": "My role",
    "exp.rockRole": "I implemented the full research prototype: field-video dataset preparation, YOLOv8 training experiments, video inference, OpenCV motion fusion and a GUI for inspecting results.",
    "exp.rockProblemH": "Problem",
    "exp.rockProblem": "Small, fast rockfalls, lighting shifts and background shake created false positives. I kept candidates only where YOLOv8 boxes overlapped frame-difference motion regions.",
    "exp.rockImplH": "Approach",
    "exp.rockImpl": "Processing frames sequentially, YOLOv8 produced rock candidate boxes while an OpenCV-based MotionDetector computed motion boxes. Only boxes meeting an IoU/IoM threshold were kept as final candidates, and a GUI allowed adjusting confidence, IoU threshold, tile size, step and display mode (box/dot/none).",
    "exp.rockDecisionH": "Technology choice",
    "exp.rockDecision": "I used YOLOv8 for repeated training and inference experiments. Frame differencing filtered static false positives with no complex tracker. Large camera shake remained a weakness.",
    "exp.rockExpH": "Experiments",
    "exp.rockExp": "I trained YOLOv8 across image-size, batch-size and learning-rate combinations. Recall-focused settings reduced missed small rockfalls. Precision-focused settings reduced false positives.",
    "exp.rockEvidence": "Implementation: YOLOv8·MotionDetector code, IoU/IoM fusion, GUI-based video processing flow.",

    "exp.mwdType": "Anomaly Detection",
    "exp.mwdTitle": "Tunnel MWD Anomaly Detection",
    "exp.mwdSummary": "Linked MWD signals and RMR changes from tunnel sites to estimate ground hazard zones, and compared unsupervised anomaly detection models.",
    "exp.mwdP1": "Role: site-data alignment and preprocessing, three-model experiments, GUI and evaluation pipeline",
    "exp.mwdP2": "Choice: compared unsupervised anomaly detectors because reliable ground-truth labels were scarce",
    "exp.mwdP3": "Validation: used declining RMR as a proxy label and evaluated in 0.5 m depth bins",
    "exp.mwdCap": "Hazard-zone detection visualizing MWD signals together with RMR change",
    "exp.mwdRoleH": "My role",
    "exp.mwdRole": "I implemented the analysis flow from depth-based alignment and feature construction through IF/LOF/OCSVM experiments, anomaly-segment post-processing, a GUI, metric calculation and result visualization.",
    "exp.mwdProblemH": "Problem",
    "exp.mwdProblem": "This started from the idea that MWD signals such as boring speed, rotation pressure and feed pressure indirectly reflect ground-condition changes during tunnel excavation. I aligned raw site data by depth and defined zones of declining RMR as proxy labels for hazard zones.",
    "exp.mwdModelH": "Why these models",
    "exp.mwdModel": "Sparse expert labels led to an unsupervised approach. Isolation Forest detects global isolation, LOF detects local-density shifts and One-Class SVM learns the normal boundary. The three assumptions were tested on the same data.",
    "exp.mwdEvalH": "Evaluation and limitation",
    "exp.mwdEval": "I compared predicted hazard zones with RMR-decline zones in 0.5 m depth bins and computed Precision, Recall, F1 and Accuracy. RMR decline is a proxy label. Evaluation is limited to relative feature and model comparisons.",
    "exp.mwdEvidence": "Implementation: IF/LOF/OCSVM experiment GUI, depth-bin evaluation, result CSVs and visualization graphs.",

    "proj.kicker": "Personal Project",
    "proj.title": "Personal projects",
    "proj.n2sType": "AI R&D Pipeline",
    "proj.n2sDesc": "A personal R&D pipeline that turns AI trends into reviewable drafts and reusable Skills and design records.",
    "proj.n2sP1": "Role: designed and implemented the full collection, analysis, audit, approval and promotion pipeline",
    "proj.n2sP2": "Choice: separated GitHub Actions candidate collection from local LLM analysis",
    "proj.n2sP3": "Operation: blocks automatic promotion and requires static audit, provenance checks and human approval",
    "proj.n2sScopeH": "My role",
    "proj.n2sScope": "As a personal project, I designed and implemented the data collectors, GitHub Actions, local LLM workflows, audit and approval gates, and the Skills and Diaries storage structure end to end.",
    "proj.n2sTrustH": "Trust mechanisms",
    "proj.n2sTrust": "LLM-generated assets stay in staging. Only results that pass static audit, provenance checks, downgrade prevention and human approval are promoted into knowledge assets.",
    "proj.n2sDecisionH": "Technology choice",
    "proj.n2sDecision": "GitHub Actions keeps collection history with no separate server. A local LLM analyzes the collected material, and I promote only reviewed results into the knowledge base. Runs are now manual.",
    "proj.n2sEvidence": "Implementation: <code>.github/workflows</code>, <code>scripts/sign_drafts.py</code>, <code>scripts/audit_index.py</code>, <code>.agents/workflows</code>.",

    "proj.kraftonType": "AI R&D Hackathon",
    "proj.kraftonDesc": "My KRAFTON AI R&D Hackathon archive: what I tried, what failed and what I changed on the way to the finals.",
    "proj.kraftonP1": "Role: competed individually across mathematical, modeling and multimodal problems in prelims and finals",
    "proj.kraftonP2": "Choice: used Transformers, GF(2), probabilistic models and a Gemini video pipeline by problem type",
    "proj.kraftonP3": "Result: reached the finals and separated contest submissions, rerun code and next improvements",
    "proj.kraftonOrgH": "My role and constraints",
    "proj.kraftonOrg": "I competed alone and had to understand each problem, build the solution and submit code under a time limit. The public repository keeps contest code, code I reran immediately afterward and the next changes in separate folders.",
    "proj.kraftonRepH": "Technology and representative problem",
    "proj.kraftonRep": "Right after the contest, I rebuilt VideoAgent on Vertex AI and added retries, incremental result saving and file cleanup. Repeated runs took about 190–666 seconds. Hard timeouts, failed-task cancellation and a ground-truth evaluation set are still incomplete.",
    "proj.kraftonDecisionH": "Technology choice",
    "proj.kraftonDecision": "Sending a long video in one call caused timeout and total-failure risk. I split videos and processed chunks in parallel so failed chunks could run again. I also saved intermediate results because merging can lose information.",
    "proj.kraftonEvidence": "Implementation: per-problem READMEs, VideoAgent FFmpeg processing code, BattlePredict <code>correct_solve.py</code>, and a SparseTap GF(2) solution.",

    "collab.kicker": "Team Experience",
    "collab.title": "Collaboration projects",

    "collab.busanType": "Hackathon · Service",
    "collab.busanStatus": "Award",
    "collab.busanDesc": "Winner of the Busan Ralphton Host Voting Award. After the event, we developed it into a live Busan fishing-information service.",
    "collab.busanP1": "Role: mobile UI/UX restructuring, brand visuals and frontend implementation",
    "collab.busanP2": "Choice: built a lightweight mobile web flow with React, zustand and Leaflet",
    "collab.busanP3": "Result: won the Host Voting Award and continued into live web service operation",
    "collab.busanScopeH": "My role",
    "collab.busanScope": "I redesigned the information hierarchy and the preparation, log, eobo, collection and sharing flows across the <code>/app</code> mobile screens. I also owned the brand visuals and frontend implementation. Teammates handled LLM calls, payments, the DB schema and server APIs.",
    "collab.busanApproachH": "Problem and approach",
    "collab.busanApproach": "For information-dense mobile screens, I prioritized essential content and moved details into collapsible or popup structures. I also removed unused assets and converted representative images to WebP to reduce initial load weight.",
    "collab.busanResultH": "Verified result",
    "collab.busanResult": "Reduced <code>public/assets</code> from 13.3 MB to 5.78 MB and a representative sample image from 909.7 KB to 30.2 KB. The team won the Host Voting Award and continued development into the currently operating live service.",
    "collab.busanDecisionH": "Technology choice",
    "collab.busanDecision": "I built the mobile screens with Vite and React and managed state with zustand. Leaflet displayed fishing points with no commercial map fee.",
    "collab.busanEvidence": "The live service, Host Voting Award and asset-optimization commits show the result of my work.",
    "collab.openSite": "Open site",

    "collab.checkmateType": "RAG Contract Analysis",
    "collab.checkmateDesc": "A system that reviews unfair contract clauses with RAG on Azure OpenAI and AI Search. The flow uses a Rule Engine for clear violations and sends only ambiguous clauses to the LLM, constraining calls and evidence handling.",
    "collab.checkmateP1": "Role: PM and backend contributor; implemented OCR-coordinate PII masking and legal RAG",
    "collab.checkmateP2": "Choice: separated deterministic Rule Engine checks from clauses requiring LLM interpretation",
    "collab.checkmateP3": "Result: built a lease and labor contract analysis prototype with reports in eight languages",
    "collab.checkmateScopeH": "My role",
    "collab.checkmateScope": "I served as PM and backend contributor, defining the document-analysis flow and team roles. I mapped Azure Language PII results to OCR coordinates to mask personal data. I also built the Azure AI Search ingestion and retrieval flow for lease and labor-contract legal data.",
    "collab.checkmateArchH": "Architecture",
    "collab.checkmateArch": "Uploaded contract documents from the frontend are received by a FastAPI backend and passed to Azure Document Intelligence for text and coordinate extraction. Then PII masking, Rule-Engine first-pass validation, Azure AI Search RAG and Azure OpenAI report generation produce user-understandable analysis and multilingual summaries.",
    "collab.checkmateDecisionH": "Technology choice",
    "collab.checkmateDecision": "Masking personal data at its original position required both text and coordinates, so I chose Azure Document Intelligence. The Rule Engine handled clear violations, and the LLM handled clauses that needed interpretation. I did not obtain a measured cost-reduction figure.",
    "collab.checkmateResultH": "Result and limitation",
    "collab.checkmateResult": "I connected lease and labor rule checks, RAG evidence retrieval, PII masking and reports in eight languages into one prototype. Turning it into a real service would require a larger dataset validated by legal experts.",
    "collab.checkmateEvidence": "Implementation: <code>backend/app/api/endpoints/analysis.py</code>, <code>rule_engine.py</code>, <code>labor_rules.py</code>, <code>rag.py</code>, and README.",

    "collab.airaType": "AI Voice Companion",
    "collab.airaDesc": "A project where I built voice input, tool-calling and vector-memory PoCs separately and integrated them into the team's real-time voice companion backend.",
    "collab.airaP1": "Role: implemented Azure STT, Gemini tool calling, vision and Azure AI Search memory modules",
    "collab.airaP2": "Choice: validated feature PoCs independently before integrating them into the team backend",
    "collab.airaP3": "Structure: real-time flow using FastAPI WebSocket, Gemini Native Audio and an Intent Router",
    "collab.airaScopeH": "My role",
    "collab.airaScope": "In <code>3rd_Project_Modules</code>, I built Azure Speech STT, Gemini tool calling, vision, urgent-message handling and an Azure AI Search memory PoC. I then connected these modules to the team's Intent Router and real-time API flow.",
    "collab.airaArchH": "Architecture",
    "collab.airaArch": "A FastAPI WebSocket acts as the central gateway for voice conversations and Gemini Native Audio generates real-time responses. An Intent Router and Orchestrator branch on utterance intent, combining Seoul real-time info, TMAP/ODSay transit, news, weather and memory context to raise response quality.",
    "collab.airaDecisionH": "Technology choice",
    "collab.airaDecision": "I built STT, tools and memory as independent modules first. This let me verify each input, output and failure path before launching the full service. During integration, the Intent Router reduced the chance that one module failure would break the full conversation.",
    "collab.airaLimitH": "Evidence boundary",
    "collab.airaLimit": "My personal repository contains the module PoCs I owned. I kept later security and reliability improvements in a separate backend fork.",
    "collab.airaEvidence": "<code>3rd_Project_Modules</code> contains the STT, tool and memory code. The backend fork shows the integrated structure and later improvements.",
    "collab.airaFork": "Backend Fork",
    "collab.aira3rd": "3rd Modules",

    "contact.kicker": "Contact",
    "contact.top": "Back to top",

    "footer.built": "Built with HTML, CSS, JavaScript",

    "common.details": "View details",
    "common.close": "Close"
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

  /* ---------- Project detail modal ---------- */
  function initProjectModal() {
    const dialog = document.querySelector("[data-project-modal]");
    const modalTitle = dialog?.querySelector("[data-project-modal-title]");
    const modalBody = dialog?.querySelector("[data-project-modal-body]");
    const closeButton = dialog?.querySelector("[data-project-modal-close]");
    if (!dialog || !modalTitle || !modalBody || !closeButton || typeof dialog.showModal !== "function") return;

    let lastTrigger = null;
    root.classList.add("modal-ready");

    const openCard = (card) => {
      const detail = card.querySelector("details.project-detail");
      const content = detail?.querySelector(":scope > .detail-content");
      const heading = card.querySelector("h3, h4");
      if (!detail || !content || !heading) return;

      detail.open = false;
      modalTitle.textContent = heading.textContent.trim();
      modalBody.replaceChildren(content.cloneNode(true));
      lastTrigger = detail.querySelector("summary");
      dialog.showModal();
      document.body.classList.add("modal-open");
      closeButton.focus();
    };

    document.querySelectorAll(".project-card, .research-topic-card").forEach((card) => {
      if (!card.querySelector("details.project-detail")) return;
      card.classList.add("opens-modal");

      card.addEventListener("click", (event) => {
        if (event.defaultPrevented || (event.button != null && event.button !== 0)) return;
        if (event.target.closest("a, button")) return;
        if (window.getSelection && window.getSelection().toString()) return;

        event.preventDefault();
        openCard(card);
      });
    });

    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
      modalBody.replaceChildren();
      lastTrigger?.focus({ preventScroll: true });
      lastTrigger = null;
    });
  }

  /* ---------- Boot ---------- */
  window.addEventListener("DOMContentLoaded", () => {
    renderIcons();
    initTheme();
    initLang();
    initMobileNav();
    initScrollSpy();
    initReveal();
    initProjectModal();

    const tb = themeBtn();
    if (tb) tb.addEventListener("click", toggleTheme);
    const lb = langBtn();
    if (lb) lb.addEventListener("click", toggleLang);
  });
})();
