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
    "exp.rockFlowH": "Processing pipeline",
    "exp.rockFlow": "The frame loop follows the GUI settings. A detection remains only when a YOLO candidate overlaps frame-difference motion, then the selected display mode is rendered into the output video.",
    "flow.rock.control": "GUI settings and video input",
    "flow.rock.preprocess": "Frame preprocessing",
    "flow.rock.sr": "Optional EDSR ×2",
    "flow.rock.tile": "Full frame or sliding tiles",
    "flow.rock.dual": "Compute two signals independently",
    "flow.rock.yolo": "Rock-class candidate boxes",
    "flow.rock.motion": "Gray · blur · frame diff · dilate · vertical contours",
    "flow.rock.gate": "Keep intersecting candidates",
    "flow.rock.render": "Render, alert and save",
    "flow.rock.display": "Box · center dot · no mark",
    "flow.rock.video": "Timestamped MP4",
    "exp.rockDecisionH": "Technology choice",
    "exp.rockDecision": "I used YOLOv8 for repeated training and inference experiments. Frame differencing filtered static false positives with no complex tracker. Large camera shake remained a weakness.",
    "exp.rockLogContext": "YOLOv8 could identify rock candidates, but lighting shifts and static background objects still produced false positives.",
    "exp.rockLogChosen": "I kept a final rockfall candidate only when a YOLOv8 box overlapped an OpenCV frame-difference motion region.",
    "exp.rockLogRationale": "This combined learned detection with physical motion while fitting the existing video pipeline without a complex tracker.",
    "exp.rockLogTradeoffs": "Object tracking preserves movement across frames but adds tracking failures and tuning. Optical flow captures fine motion but is sensitive to camera shake and compute cost.",
    "exp.rockLogRevisit": "Camera-motion compensation is the current priority. Frame differencing can remain the baseline for a controlled comparison with a lightweight tracker.",
    "exp.rockExpH": "Experiments",
    "exp.rockExp": "I trained YOLOv8 across image-size, batch-size and learning-rate combinations. Recall-focused settings reduced missed small rockfalls. Precision-focused settings reduced false positives.",
    "exp.rockEvidence": "Implementation: YOLOv8·MotionDetector code, IoU/IoM fusion, GUI-based video processing flow.",

    "exp.mwdType": "Anomaly Detection",
    "exp.mwdTitle": "Tunnel MWD Anomaly Detection",
    "exp.mwdSummary": "Linked MWD signals and RMR changes from tunnel sites to estimate ground hazard zones, and compared unsupervised anomaly detection models.",
    "exp.mwdP1": "Role: site-data alignment and preprocessing, three-model experiments, GUI and evaluation pipeline",
    "exp.mwdP2": "Choice: compared unsupervised anomaly detectors because field-validated hazard-zone data was scarce",
    "exp.mwdP3": "Validation: used declining RMR as an indirect reference and evaluated in 0.5 m depth bins",
    "exp.mwdCap": "Hazard-zone detection visualizing MWD signals together with RMR change",
    "exp.mwdRoleH": "My role",
    "exp.mwdRole": "I implemented the analysis flow from depth-based alignment and feature construction through IF/LOF/OCSVM experiments, anomaly-segment post-processing, a GUI, metric calculation and result visualization.",
    "exp.mwdProblemH": "Problem",
    "exp.mwdProblem": "This started from the idea that MWD signals such as boring speed, rotation pressure and feed pressure indirectly reflect ground-condition changes during tunnel excavation. I aligned raw site data by depth and used zones of declining RMR as an indirect reference for hazard zones.",
    "exp.mwdFlowH": "Analysis pipeline",
    "exp.mwdFlow": "The three experiment runners share the same input, segmentation and evaluation structure. Feature sets and model-specific parameters run in parallel, then predicted ranges are compared with RMR decline in 0.5 m bins.",
    "flow.mwd.load": "Normalize two Excel files on depth",
    "flow.mwd.grid": "Feature and model parameter grid",
    "flow.mwd.features": "Seven feature combinations",
    "flow.mwd.models": "Three runners under one evaluation frame",
    "flow.mwd.post": "Convert anomaly points into depth ranges",
    "flow.mwd.merge": "Merge adjacent ranges",
    "flow.mwd.filter": "Minimum-length filter",
    "flow.mwd.rmr": "Expand RMR-decline ranges",
    "flow.mwd.score": "Compare 0.5 m bins",
    "exp.mwdModelH": "Why these models",
    "exp.mwdModel": "Field-validated hazard-zone data was not sufficient for supervised learning, so I used an unsupervised approach. Isolation Forest detects global isolation, LOF detects local-density shifts and One-Class SVM learns the normal boundary. The three assumptions were tested on the same data.",
    "exp.mwdContextLabel": "CONTEXT · Constraints",
    "exp.mwdContext": "There was not enough field-validated hazard-zone data for supervised learning.",
    "exp.mwdSelectedLabel": "CHOSEN · Technology",
    "exp.mwdSelected": "I compared three unsupervised anomaly detectors under the same evaluation method because they did not require confirmed hazard-zone targets for training.",
    "exp.mwdRationaleLabel": "RATIONALE · Why",
    "exp.mwdRationale": "Each model defines anomalies differently, allowing me to inspect how model assumptions changed the detected zones.",
    "exp.mwdIfCompare": "Detected globally isolated values and checked how anomaly zones changed with contamination.",
    "exp.mwdLofCompare": "Detected local density deviations and compared the effect of changing n_neighbors.",
    "exp.mwdSvmCompare": "Learned the normal-region boundary and checked results across gamma and nu combinations.",
    "exp.mwdExcludedLabel": "TRADE-OFFS · Alternatives",
    "exp.mwdExcluded": "Supervised models require confirmed hazard-zone targets, which were insufficient. Unsupervised models avoid that requirement but still depend on an indirect reference for interpretation.",
    "exp.mwdRevisitLabel": "REVISIT · Current choice",
    "exp.mwdRevisit": "With field-validated hazard-zone data, I would add supervised models and an autoencoder under the same depth-bin evaluation.",
    "exp.mwdEvalH": "Evaluation and limitation",
    "exp.mwdEval": "I compared predicted hazard zones with RMR-decline zones in 0.5 m depth bins and computed Precision, Recall, F1 and Accuracy. RMR decline is an indirect reference, not a confirmed hazard judgment. Evaluation is limited to relative feature and model comparisons.",
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
    "proj.n2sFlowH": "Knowledge pipeline",
    "proj.n2sFlow": "GitHub Actions moves external material only as far as the queue. A local workflow handles analysis and draft generation; static audit, provenance verification and human approval are required before assets and AGENTS.md are updated.",
    "flow.n2s.sources": "RSS · ArXiv · company blogs · communities",
    "flow.n2s.dedupe": "Year-scoped URL deduplication",
    "flow.n2s.queue": "Boundary between collection and analysis",
    "flow.n2s.sieve": "Batch analysis · Frontier Sieve",
    "flow.n2s.brief": "Korean daily briefing",
    "flow.n2s.route": "Route to Skill · Diary · Archive · Backlog",
    "flow.n2s.verify": "Static audit and provenance",
    "flow.n2s.signature": "SHA-256 · signature verification",
    "flow.n2s.human": "Human approves promotion",
    "flow.n2s.assets": "Move assets and register the index",
    "proj.n2sDecisionH": "Technology choice",
    "proj.n2sDecision": "GitHub Actions keeps collection history with no separate server. A local LLM analyzes the collected material, and I promote only reviewed results into the knowledge base. Runs are now manual.",
    "proj.n2sLogContext": "This personal project needed collection history without a dedicated server and a gate that kept LLM output from entering the knowledge base automatically.",
    "proj.n2sLogChosen": "I used GitHub Actions for collection and a local LLM for analysis and draft generation. Audit and human approval sit before final promotion.",
    "proj.n2sLogRationale": "Separating collection from analysis keeps externally generated output in staging for review. The repository also retains execution history without another server.",
    "proj.n2sLogTradeoffs": "A cron server is simple but needs direct operational care. Airflow provides retries and dependency management but adds too much setup for this scale. A cloud LLM API is easy to run remotely but adds call costs and another approval boundary.",
    "proj.n2sLogRevisit": "If collection volume and workflow depth grow, queue-based execution and per-job retries are the next targets. Human approval and provenance checks remain the operating boundary.",
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
    "proj.kraftonFlowH": "VideoAgent pipeline",
    "proj.kraftonFlow": "The outer scheduler processes up to five of the 20 video questions at once. Inside each video, up to three five-minute chunks are mapped concurrently; a Pro model reasons over the ordered logs, critiques its answer and emits one letter. The 20-character submission is updated under a lock after every job.",
    "flow.krafton.discover": "Find videoN + promptN pairs",
    "flow.krafton.schedule": "Run up to five video jobs",
    "flow.krafton.worker": "Enter one pipeline per video",
    "flow.krafton.chunk": "Five-minute chunks with absolute time",
    "flow.krafton.events": "Timeline only question-relevant events",
    "flow.krafton.reason": "Reason and eliminate each option",
    "flow.krafton.reflect": "Self-critique, then XML answer",
    "flow.krafton.recover": "Retry chunk calls up to four times and rate-limited video jobs up to three times",
    "flow.krafton.incremental": "Update all 20 slots after every job",
    "proj.kraftonDecisionH": "Technology choice",
    "proj.kraftonDecision": "A single long-video call carried timeout and total-failure risk. I mapped five-minute chunks concurrently and retried inside each chunk call. Each video's answer was saved immediately so later failures would not erase completed work.",
    "proj.kraftonLogContext": "Processing a long video in one call could exceed the time limit or lose the full result after one failure.",
    "proj.kraftonLogChosen": "I used a five-minute Map/Reduce pipeline with per-chunk call retries and immediate per-video result saving.",
    "proj.kraftonLogRationale": "Chunk retries recover failures within a video, while saved answers reduce the loss boundary across the 20 video jobs.",
    "proj.kraftonLogTradeoffs": "A single call is simpler and preserves full context. Chunking supports retries and partial saves but can lose context when chunk results are merged.",
    "proj.kraftonLogRevisit": "The current priorities are hard per-job timeouts, failed-task cancellation, overlapping chunks and a ground-truth evaluation set.",
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
    "collab.busanLogContext": "The mobile web needed to continue after the hackathon, support fast screen changes, keep client state light and display fishing spots on a map.",
    "collab.busanLogChosen": "I built the screens with Vite and React, managed client state with zustand and implemented the map with Leaflet.",
    "collab.busanLogRationale": "The stack supported rapid changes to an SPA-focused mobile flow and kept state structure small. Leaflet displayed fishing points without a commercial map fee.",
    "collab.busanLogTradeoffs": "Next.js is useful when server rendering and search visibility matter, but it adds setup to this app flow. Redux handles large state structures but adds management code here. Commercial maps offer richer Korean place data but add cost and provider dependency.",
    "collab.busanLogRevisit": "Server rendering is the next option if search traffic becomes important. If fishing-point accuracy becomes the priority, a Korean map API can be compared with Leaflet under the same conditions.",
    "collab.busanEvidence": "The live service, Host Voting Award and asset-optimization commits show the result of my work.",
    "collab.openSite": "Open site",

    "collab.checkmateType": "RAG Contract Analysis",
    "collab.checkmateDesc": "A contract-review system built on Azure OpenAI and AI Search RAG. Deterministic rules decide explicit conditions, while legal retrieval and the LLM verify toxic-clause candidates and explain failed rules.",
    "collab.checkmateP1": "Role: PM and backend contributor; implemented OCR-coordinate PII masking and legal RAG",
    "collab.checkmateP2": "Choice: separated deterministic Rule Engine checks from clauses requiring LLM interpretation",
    "collab.checkmateP3": "Result: built a lease and labor contract analysis prototype with reports in eight languages",
    "collab.checkmateScopeH": "My role",
    "collab.checkmateScope": "I served as PM and backend contributor, defining the document-analysis flow and team roles. I mapped Azure Language PII results to OCR coordinates to mask personal data. I also built the Azure AI Search ingestion and retrieval flow for lease and labor-contract legal data.",
    "collab.checkmateArchH": "Architecture",
    "collab.checkmateArch": "FastAPI's PipelineRunner executes the lease and labor analysis stages in order. After OCR and schema normalization, it runs deterministic rules and toxic-clause verification, then maps PII back to source coordinates. It retrieves evidence for failed rules and produces a masked PDF plus multilingual results.",
    "flow.checkmate.lease": "Lease contract + registry + market price",
    "flow.checkmate.labor": "Labor contract",
    "flow.checkmate.intake": "Validate · optimize · OCR · classify",
    "flow.checkmate.coords": "Text + polygon coordinates",
    "flow.checkmate.normalize": "LLM schema normalization",
    "flow.checkmate.judge": "Deterministic rules and toxic-clause review",
    "flow.checkmate.explicit": "Explicit-condition checks",
    "flow.checkmate.toxic": "Verify candidates against laws and cases",
    "flow.checkmate.privacy": "Map PII back to OCR coordinates",
    "flow.checkmate.mask": "Mask boxes at source positions",
    "flow.checkmate.explain": "Retrieve evidence and advise per failed rule",
    "flow.checkmate.translate": "Translate to the selected language",
    "flow.checkmate.render": "Render results with risk locations",
    "collab.checkmateDecisionH": "Technology choice",
    "collab.checkmateDecision": "Masking personal data at its source position required both text and coordinates, so I chose Azure Document Intelligence. Deterministic rules made explicit checks reproducible; RAG and the LLM verified toxic-clause candidates and explained failed rules. I did not obtain a measured cost figure.",
    "collab.checkmateLogContext": "Contracts contained both explicit violations that rules could decide and clauses that required contextual interpretation. Personal data also had to be masked at its original position.",
    "collab.checkmateLogChosen": "Document Intelligence extracted text and coordinates. Deterministic rules decided explicit conditions; RAG and the LLM verified toxic-clause candidates and explained failed rules.",
    "collab.checkmateLogRationale": "Coordinates map personal data back to its original location. Separating rule decisions from LLM interpretation also makes explicit-clause results easier to reproduce.",
    "collab.checkmateLogTradeoffs": "An LLM-only flow is simple but can change its judgment on the same clause and calls the model for every request. A Rule Engine is consistent but requires ongoing legal-rule maintenance. Text-only OCR lacks the coordinates needed for source-position masking.",
    "collab.checkmateLogRevisit": "The current priorities are an expert-labeled evaluation set, retrieval metrics, rule-to-LLM disagreement logs and per-request cost measurement.",
    "collab.checkmateResultH": "Result and limitation",
    "collab.checkmateResult": "I connected lease and labor rule checks, RAG source retrieval, PII masking and reports in eight languages into one prototype. Turning it into a real service would require a larger dataset validated by legal experts.",
    "collab.checkmateEvidence": "Implementation: <code>backend/app/api/endpoints/analysis.py</code>, <code>rule_engine.py</code>, <code>labor_rules.py</code>, <code>rag.py</code>, and README.",

    "collab.airaType": "AI Voice Companion",
    "collab.airaDesc": "A project where I built voice input, tool-calling and vector-memory PoCs separately and integrated them into the team's real-time voice companion backend.",
    "collab.airaP1": "Role: implemented Azure STT, Gemini tool calling, vision and Azure AI Search memory modules",
    "collab.airaP2": "Choice: validated feature PoCs independently before integrating them into the team backend",
    "collab.airaP3": "Structure: real-time flow using FastAPI WebSocket, Gemini Native Audio and an Intent Router",
    "collab.airaScopeH": "My role",
    "collab.airaScope": "In <code>3rd_Project_Modules</code>, I built Azure Speech STT, Gemini tool calling, vision, urgent-message handling and an Azure AI Search memory PoC. I then connected these modules to the team's Intent Router and real-time API flow.",
    "collab.airaArchH": "Architecture",
    "collab.airaArch": "In the personal modules repository, I built Gemini set_timer and capture_visual calls as an independent PoC. The team backend follows a separate execution path: fast rules classify first, unresolved requests become constrained JSON through a GPT Intent Router, and Gemini Native Audio responds after the selected live context is injected.",
    "flow.aira.mine": "Independent module PoCs I implemented",
    "flow.aira.contracts": "Validate input/output contracts, then connect to the team runtime",
    "flow.aira.team": "Team-integrated runtime",
    "flow.aira.route": "Fast rules → GPT Intent Router",
    "flow.aira.routerModel": "Azure OpenAI · GPT-4o mini by default",
    "flow.aira.live": "Live context required by the intent",
    "flow.aira.guard": "Block stale audio and inject context",
    "flow.aira.save": "Save Cosmos memory after session end",
    "collab.airaDecisionH": "Technology choice",
    "collab.airaDecision": "Gemini Tool Calling was a PoC where the model requests an action during conversation. I kept service routing under server control: fast rules handle clear utterances, while GPT maps the rest into a constrained intent JSON before execution.",
    "collab.airaLogContext": "The real-time voice flow had to connect STT, external tools, vision and long-term memory without letting one feature failure stop the full conversation.",
    "collab.airaLogChosen": "I built each feature as an independent PoC, then connected the modules to the team backend through an Intent Router and Orchestrator.",
    "collab.airaLogRationale": "Each module's input, output and failure handling could be checked separately, while the conversation flow invoked only the features it needed.",
    "collab.airaLogTradeoffs": "A single agent has a simpler call structure but makes tool selection, latency and failure scope harder to predict. A modular design has clear boundaries but requires routing rules and interfaces to evolve with every new feature.",
    "collab.airaLogRevisit": "The current priorities are shared rules for tool-input schemas, per-call timeouts, module-state tracking and fallback responses.",
    "collab.airaLimitH": "Contribution boundary",
    "collab.airaLimit": "My personal repository contains the module PoCs I owned. I kept later security and reliability improvements in a separate backend fork.",
    "collab.airaEvidence": "<code>3rd_Project_Modules</code> contains the STT, tool and memory code. The backend fork shows the integrated structure and later improvements.",
    "collab.airaFork": "Backend Fork",
    "collab.aira3rd": "3rd Modules",

    "contact.kicker": "Contact",
    "contact.top": "Back to top",

    "footer.built": "Built with HTML, CSS, JavaScript",

    "decision.context": "CONTEXT · Constraints",
    "decision.chosen": "CHOSEN · Technology",
    "decision.rationale": "RATIONALE · Why",
    "decision.tradeoffs": "TRADE-OFFS · Alternatives",
    "decision.revisit": "REVISIT · Current choice",

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

  /* ---------- Central AI circuit ---------- */
  function initCircuitFlow() {
    const main = document.querySelector("[data-circuit-main]");
    const nodes = Array.from(document.querySelectorAll("[data-circuit-node]"));
    const terminal = main?.querySelector("[data-circuit-end]");
    const terminalDock = terminal?.querySelector("span");
    const branches = Array.from(document.querySelectorAll(
      ".capability-card, .research-topic-card, .project-card, .credential-item"
    ));
    if (!main || !terminal || !terminalDock || nodes.length < 2) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    let ticking = false;

    branches.forEach((branch, index) => {
      branch.classList.add("circuit-branch");
      branch.style.setProperty("--branch-order", String(index));
    });

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      branches.forEach((branch) => branch.classList.add("is-online"));
    } else {
      const branchObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-online");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -18% 0px", threshold: 0.08 }
      );
      branches.forEach((branch) => branchObserver.observe(branch));
    }

    const update = () => {
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const positions = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2;
      });
      const terminalRect = terminalDock.getBoundingClientRect();
      const terminalPosition = terminalRect.top + window.scrollY + terminalRect.height / 2;
      const first = positions[0] - mainTop;
      const last = terminalPosition - mainTop;
      const length = Math.max(last - first, 1);
      const cursor = window.scrollY + window.innerHeight * 0.5;
      const maximumScroll = document.documentElement.scrollHeight - window.innerHeight;
      const isAtBottom = window.scrollY >= maximumScroll - 2;
      const filled = isAtBottom ? length : clamp(cursor - (mainTop + first), 0, length);
      let activeIndex = 0;

      positions.forEach((position, index) => {
        if (cursor >= position) activeIndex = index;
      });
      if (isAtBottom) activeIndex = nodes.length - 1;

      main.style.setProperty("--circuit-start", `${first.toFixed(2)}px`);
      main.style.setProperty("--circuit-length", `${length.toFixed(2)}px`);
      main.style.setProperty("--circuit-filled", `${filled.toFixed(2)}px`);

      nodes.forEach((node, index) => {
        node.classList.toggle("is-active", index === activeIndex);
        node.classList.toggle("is-complete", index < activeIndex);
      });
      terminal.classList.toggle("is-active", isAtBottom || filled >= length - 1);

      ticking = false;
    };

    const scheduleUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    update();
  }

  /* ---------- Project detail modal ---------- */
  function initProjectModal() {
    const dialog = document.querySelector("[data-project-modal]");
    const modalTitle = dialog?.querySelector("[data-project-modal-title]");
    const modalBody = dialog?.querySelector("[data-project-modal-body]");
    const closeButton = dialog?.querySelector("[data-project-modal-close]");
    if (!dialog || !modalTitle || !modalBody || !closeButton || typeof dialog.showModal !== "function") return;

    let lastTrigger = null;
    const traceLabels = [
      ["ROLE", "PROBLEM", "BUILD", "PIPELINE", "DECISION", "TEST", "OUTPUT"],
      ["ROLE", "DATA", "PIPELINE", "DECISION", "EVALUATE", "OUTPUT"],
      ["ROLE", "GATE", "PIPELINE", "DECISION", "OUTPUT"],
      ["CONSTRAINT", "BUILD", "PIPELINE", "DECISION", "OUTPUT"],
      ["ROLE", "UX", "RESULT", "DECISION", "OUTPUT"],
      ["ROLE", "PIPELINE", "DECISION", "RESULT", "OUTPUT"],
      ["ROLE", "ARCHITECTURE", "DECISION", "BOUNDARY", "OUTPUT"]
    ];
    root.classList.add("modal-ready");

    const createElement = (tag, className, text) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (text) element.textContent = text;
      return element;
    };

    const cleanFact = (text) => text.replace(/^[^:：]+[:：]\s*/, "").trim();

    const openCard = (card) => {
      const detail = card.querySelector("details.project-detail");
      const content = detail?.querySelector(":scope > .detail-content");
      const heading = card.querySelector("h3, h4");
      if (!detail || !content || !heading) return;

      detail.open = false;
      modalTitle.textContent = heading.textContent.trim();

      const consoleRoot = createElement("div", "project-console");
      const meta = createElement("div", "project-console-meta");
      const type = card.querySelector(".type")?.cloneNode(true);
      const status = card.querySelector(".status")?.cloneNode(true);
      meta.append(createElement("span", "project-console-id", "PROJECT TRACE"));
      if (type) meta.append(type);
      if (status) meta.append(status);

      const consoleHero = createElement("div", "project-console-hero");
      const visual = createElement("figure", "project-console-visual");
      const sourceImage = card.matches(".project-card")
        ? card.querySelector(":scope > img")
        : content.querySelector(".detail-figure img");
      const sourceCaption = content.querySelector(".detail-figure figcaption");
      if (sourceImage) {
        const image = sourceImage.cloneNode(true);
        image.removeAttribute("loading");
        visual.append(image);
      } else {
        visual.classList.add("no-image");
      }
      if (sourceCaption) visual.append(sourceCaption.cloneNode(true));

      const blocks = Array.from(content.querySelectorAll(":scope > .detail-block"));
      const evidence = content.querySelector(":scope > .detail-evidence");
      const stages = evidence ? [...blocks, evidence] : blocks;
      const labels = traceLabels[Number(card.dataset.traceIndex)] || [];
      const trace = createElement("nav", "project-console-trace");
      trace.setAttribute("aria-label", `${heading.textContent.trim()} execution trace`);
      trace.append(createElement("p", "project-console-trace-title", "EXECUTION NODES"));
      const traceList = createElement("div", "project-console-trace-list");
      const panel = createElement("section", "project-console-panel");
      const panelStep = createElement("p", "project-console-panel-step");
      const panelTitle = createElement("h3", "project-console-panel-title");
      const panelContent = createElement("div", "project-console-panel-content");
      panel.append(panelStep, panelTitle, panelContent);

      const stageButtons = stages.map((source, index) => {
        const label = labels[index] || (index === stages.length - 1 ? "OUTPUT" : `STEP ${index + 1}`);
        const button = createElement("button", "project-console-node");
        button.type = "button";
        button.setAttribute("aria-pressed", "false");
        button.append(
          createElement("span", "project-console-node-index", String(index + 1).padStart(2, "0")),
          createElement("strong", "project-console-node-label", label)
        );
        traceList.append(button);
        return { button, source, label };
      });

      const showStage = (activeIndex) => {
        const active = stageButtons[activeIndex];
        if (!active) return;
        stageButtons.forEach(({ button }, index) => {
          const isActive = index === activeIndex;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });

        const originalTitle = active.source.querySelector?.("strong")?.textContent.trim();
        const sourceBody = active.source.cloneNode(true);
        if (active.label === "DECISION" && sourceBody.matches?.(".detail-block")) {
          sourceBody.querySelector(":scope > p")?.remove();
        }
        panelStep.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${active.label}`;
        const isImplementation = active.source.matches?.(".detail-evidence");
        panelTitle.textContent = originalTitle || (isImplementation
          ? (root.lang === "en" ? "Implementation" : "구현 기록")
          : (root.lang === "en" ? "Project detail" : "프로젝트 상세"));
        panelContent.replaceChildren(sourceBody);
      };

      stageButtons.forEach(({ button }, index) => {
        button.addEventListener("click", () => showStage(index));
      });
      trace.append(traceList);
      consoleHero.append(visual, trace);

      const facts = createElement("div", "project-console-facts");
      const points = Array.from(card.querySelectorAll(".project-points li"));
      const factData = [];
      if (points[0]) factData.push(["MY ROLE", cleanFact(points[0].textContent)]);
      if (points.at(-1)) factData.push(["KEY SIGNAL", cleanFact(points.at(-1).textContent)]);
      const tags = Array.from(card.querySelectorAll(".tags span"));
      if (tags.length) factData.push(["STACK", tags.map((tag) => tag.textContent.trim()).join(" · ")]);
      else if (type) factData.push(["TYPE", type.textContent.trim()]);

      factData.forEach(([label, value]) => {
        const fact = createElement("div", "project-console-fact");
        fact.append(createElement("small", "", label), createElement("strong", "", value));
        facts.append(fact);
      });

      const actions = createElement("div", "project-console-actions");
      card.querySelectorAll("a.detail-link, .card-actions a").forEach((link) => {
        actions.append(link.cloneNode(true));
      });

      consoleRoot.append(meta, consoleHero, facts, panel);
      if (actions.childElementCount) consoleRoot.append(actions);
      modalBody.replaceChildren(consoleRoot);
      showStage(0);
      lastTrigger = detail.querySelector("summary");
      dialog.showModal();
      document.body.classList.add("modal-open");
      closeButton.focus();
    };

    document.querySelectorAll(".project-card, .research-topic-card").forEach((card, index) => {
      if (!card.querySelector("details.project-detail")) return;
      card.classList.add("opens-modal");
      card.dataset.traceIndex = String(index);

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
    initCircuitFlow();
    initProjectModal();

    const tb = themeBtn();
    if (tb) tb.addEventListener("click", toggleTheme);
    const lb = langBtn();
    if (lb) lb.addEventListener("click", toggleLang);
  });
})();
