// Featured AI projects. Copy is pulled from the canonical write-ups:
//   AI Task Pipeline -> ai-task-manager/portfolio.md
//   Jobs Desktop     -> jobs-desktop/jobapp-portfolio.md
// Honesty labels (prototype / synthetic data / not deployed / local-only) are
// kept as written. Do not generalize claims beyond what these files state.

export interface DesignDecision {
  /** The reasoning headline (always visible, the skimmable part). */
  title: string;
  /** The why (revealed on click). */
  body: string;
}

export interface FeaturedProject {
  id: string;
  title: string;
  /** One-line "what it is". */
  tagline: string;
  /** Honest status line, kept verbatim in spirit from the write-up. */
  status: string;
  /**
   * Demo video. Paste a Loom share/embed link or a direct .mp4/.webm URL.
   * Leave "" to show the placeholder. Loom /share/ links are auto-converted
   * to /embed/.
   */
  demoVideoUrl: string;
  whatItDoes: string;
  /** Optional inline architecture diagram. */
  diagram?: { src: string; alt: string };
  designDecisions: DesignDecision[];
  stack: string;
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: "ai-task-pipeline",
    title: "AI Task Pipeline",
    tagline:
      "Reads team conversations, extracts the action items with an LLM, and turns the approved ones into Jira tickets and pull requests, with a person approving each step.",
    status:
      "Personal prototype. Runs on synthetic data and is not deployed. I built it solo to test the idea.",
    demoVideoUrl: "", // <-- DROP AI TASK PIPELINE DEMO LINK HERE
    whatItDoes:
      "It reads team conversations (Slack threads, a meeting transcript, a calendar event), extracts the action items with an LLM, and turns the approved ones into deduplicated Jira tickets with a generated PRD. A person approves at each step. For the simple tickets, an agent makes the code change, opens a pull request, and revises it from review feedback. I wanted to see whether an LLM could watch those surfaces, propose the work it found, and let a person approve before anything became a ticket.",
    diagram: {
      src: "/ai-pipeline-architecture.svg",
      alt: "Architecture of the AI Task Pipeline: ingest Slack, meeting, and calendar sources; extract action items with an LLM; human approval Gate 1; two-layer keyword-then-embedding dedup; create Jira tickets with a generated PRD; Gate 2; rule-based assignment; Gate 3; agent code edit in an isolated worktree opening a pull request; Gate 4 review with a rework loop and merge. A three-layer agent memory feeds the agent stage.",
    },
    designDecisions: [
      {
        title: "Source-specific chunking",
        body: "Each source has a different natural unit, so I chunk each one differently instead of running one splitter over everything. A Slack thread stays whole, a meeting transcript is split into topic segments on transition cues with a token cap, and a calendar event becomes one chunk. A uniform chunker would either cut a thread in half and lose the back-and-forth that makes an item clear, or hand the model a whole transcript as one blob so several items collapse into one.",
      },
      {
        title: "Full-context LLM judgment, no keyword pre-filter",
        body: "I pass the whole chunk to the model and ask for implicit items as well as explicit ones, with no regex gate in front. Most action items are implicit: \"we still haven't merged that PR\" is work, and it never says TODO. A keyword filter keys on the surface form and drops exactly the items a person would also miss. The cost is more model calls and a real chance of over-extraction, which is why a human gate sits right after.",
      },
      {
        title: "Two-layer dedup, keyword then embedding",
        body: "Before creating a ticket I check for an existing one in two passes. Layer 1 is a fast JQL keyword search that narrows the field. Layer 2 embeds the new task and each candidate and compares by cosine similarity: at or above 0.90 I skip it as a duplicate, 0.85 to 0.90 I create it but flag it for the human, below 0.85 I create it normally. Embedding every open ticket on every task is slow and costs money, so the cheap keyword pass narrows to a few candidates first. Embeddings catch semantic duplicates that reworded titles hide. They run on Gemini because Claude has no embedding model, and results are cached in Redis.",
      },
      {
        title: "Blocking human gates with timeouts",
        body: "The pipeline stops and waits for a person at each gate and does not proceed until they approve. The extractor over-produces on purpose, so a person prunes false positives before anything becomes a ticket. Making the gate blocking is what enforces the ordering: the pipeline cannot create Jira tickets from an unreviewed extraction. Each gate has a timeout that auto-approves so a forgotten review never wedges the pipeline forever (24 hours for the task list, 4 hours for tickets).",
      },
      {
        title: "Structured extraction via tool use",
        body: "I get structured output by forcing a tool call whose input schema is the task schema, instead of asking for \"JSON only\" and parsing the reply. Asking a model for raw JSON is fragile: it adds prose, code fences, or a trailing comma, and the parse breaks. Forcing a tool call makes the model fill a typed schema, so the output is structured by construction with no brittle parsing step. A guard throws if no tool-use block comes back.",
      },
      {
        title: "Isolated git worktrees for parallel agents",
        body: "When more than one ticket is actionable the agents run in parallel, each doing its edit, commit, and push inside its own git worktree rather than checking out a branch in the shared working directory. A shared working directory cannot hold two branches at once, so parallel agents would stomp each other. A worktree gives each agent an isolated checkout, so they never collide and the main directory is never left on a feature branch.",
      },
      {
        title: "Conversational editing in Slack threads",
        body: "Rather than build a button or modal for every kind of edit, a reviewer replies in the gate's Slack thread in plain language (\"drop the third task\", \"add a PagerDuty requirement to that ticket's PRD\") and the model applies it. A fixed set of buttons can only express the edits I anticipated. A thread reply can express anything, and the model maps it onto the task list or the ticket.",
      },
      {
        title: "Three memory layers, each for a different lifetime",
        body: "The agent's memory is split by how long the information needs to live. Layer 1 is fixed project context. Layer 2 is lessons that persist across tasks: after a task the model extracts a few reusable notes, embeds them, and a new task retrieves the most similar ones. Layer 3 is the in-task log used by the rework loop, compressed when it grows too long. Splitting them scopes each retrieval to the right horizon instead of dumping everything into one context.",
      },
    ],
    stack:
      "Node.js, no web framework. Claude via the Anthropic SDK (claude-sonnet-4-6) for extraction, the PRD, the agent edits, and the conversational edits. Gemini via the Google Generative AI SDK (gemini-embedding-001) for dedup embeddings. Slack Bolt in Socket Mode for the interactive gates. The Jira REST v3 API over axios. The GitHub CLI (gh) for pull requests. Redis for gate state, the embedding cache, the lesson store, and the ingestion watermark. Every external service has a deterministic mock fallback, so the whole pipeline runs offline with no keys.",
  },
  {
    id: "jobs-desktop",
    title: "Jobs Desktop",
    tagline:
      "A local desktop app that finds job postings across applicant tracking systems, turns each raw posting into structured data with an LLM, and scores it against my resume.",
    status:
      "Solo prototype, run locally from source. A working app, not a shipped one: no release pipeline, code signing, notarization, auto-update, or CI. It needs three API keys (Serper, OpenRouter, Apify) supplied at runtime.",
    demoVideoUrl: "", // <-- DROP JOBS DESKTOP DEMO LINK HERE
    whatItDoes:
      "Job postings live on a dozen ATS platforms (Greenhouse, Lever, Ashby, Workday, iCIMS, Workable, SmartRecruiters) plus LinkedIn, each with its own page structure. The app discovers the listings, fetches pages that may be client-rendered or already dead, extracts a consistent schema out of inconsistent markup, ranks everything against a single resume, and drafts a tailored version of my resume per job. The interesting problem is extraction reliability and cost/latency control on the LLM and scraping layers, not the act of applying.",
    designDecisions: [
      {
        title: "Search by Google operator, not per-platform scrapers",
        body: "Discovery runs through Serper (a Google search API) with a site:greenhouse.io-style operator per platform, paginated up to 100 results. Writing and maintaining a bespoke search crawler for seven ATS vendors is a losing battle. Letting Google index them and querying with site: filters means one code path covers every Serper-backed platform, and adding a platform is a one-line entry in a PLATFORMS constant. LinkedIn is the exception and goes through a hosted Apify actor, because you cannot reach its listings with a plain Google query.",
      },
      {
        title: "Two-layer page fetch with a hard time budget",
        body: "Each posting page is fetched first with Cheerio over a plain HTTP request (fast, no browser), and only falls back to a headless Playwright Chromium load when the page needs JavaScript to render. The whole per-item extraction is capped at 10 seconds via an AbortSignal.timeout combined with the run's cancel signal, so one slow or hanging page can never monopolize a worker. Paying the browser cost only when the cheap path fails keeps the common case fast while still handling fully client-rendered pages.",
      },
      {
        title: "LLM extraction with an enforced JSON schema, plus a \"not a job\" escape hatch",
        body: "extractJobData sends up to 8000 characters of page content to google/gemini-3.1-flash-lite-preview through OpenRouter and gets back a strict structured object. Job extraction uses OpenRouter's json_schema response format, so the model is constrained to the exact schema rather than free text I parse defensively. The prompt does normalization that would otherwise be brittle hand-written code: hourly pay to a yearly equivalent, locations to \"City, Province/State, Country\", seniority into a fixed five-level enum. A notAJob boolean lets the model filter out homepages, expired listings, and login walls before anything reaches the database. I chose a small fast Flash-lite model on purpose, because extraction is high-volume and latency-sensitive.",
      },
      {
        title: "Matching is a transparent heuristic, not an embedding",
        body: "computeCheapScore ranks a structured job against my parsed resume with a pure, no-I/O function that returns 0 to 100 from three dimensions: skill overlap (60 points), title-word overlap (25), and level alignment (15). Skills are weighted by where they appear and by tier; a secondary skill in the title actually subtracts points, because a role centered on something I am weak in is a worse fit. I deliberately did not reach for embeddings or a vector store. The signal I want is explainable and cheap to compute, and a keyword heuristic I can read and tune beats an opaque cosine similarity I cannot. The LLM does the hard part of turning messy HTML into clean fields; the ranking stays simple and deterministic so the score is debuggable.",
      },
      {
        title: "Resume parsing and tailoring with anti-hallucination guardrails",
        body: "extractCvData parses an uploaded resume into a structured CV with an explicit instruction to extract faithfully and not embellish. tailorResume takes that plus a job description and returns a rewritten CV and a markdown reasoning block explaining what it trimmed, rewrote, and which JD keywords it incorporated. The tailoring prompt forbids claiming experience the candidate does not have (it reframes the closest real work instead), bans resume-mill filler, and asks for an honest strong/moderate/weak fit assessment including gaps. Returning the reasoning is a trust choice, and the original CV is versioned and snapshotted before tailoring so nothing is lost.",
      },
      {
        title: "Two throttled queues separate the two bottlenecks",
        body: "Page fetching and LLM calls have different limits, so they get different queues. Per-platform extraction runs through a throttle set to 1.5s between starts and 2 concurrent, which respects the scraped sites. All LLM calls share one global queue capped at 10 concurrent with no added delay, because OpenRouter can take the parallelism. Cancellation is wired through with an AbortController per run, so hitting cancel aborts in-flight fetches rather than waiting them out.",
      },
      {
        title: "Local-first, no server, no accounts",
        body: "Everything persists to a local SQLite database through Drizzle ORM. There is no backend service and no user authentication; an earlier Clerk integration was removed. For a single-user tool that holds my resume and runs my own API keys, a local SQLite file is the honest architecture: no auth surface, and no data leaves the machine except the specific page text sent to the extraction API. A built-in scheduler re-runs due searches every 15 minutes so the job list stays current.",
      },
    ],
    stack:
      "Electrobun 1.16 (a Bun-runtime desktop framework): the backend runs on Bun, the UI is a web view. Frontend: React 18, Vite 6, TypeScript, Tailwind, Radix UI, TanStack React Query, Sonner. Backend: Bun with typed RPC between the web view and the Bun process. Data: SQLite via Drizzle ORM, better-sqlite3. Scraping: Cheerio for the fast path, Playwright (headless Chromium) for the fallback. External APIs: Serper (Google search), Apify (LinkedIn actor), OpenRouter serving google/gemini-3.1-flash-lite-preview. Resume/PDF: unpdf, @react-pdf/renderer. Tooling: Biome, Knip, Pino, Bun's test runner (19 test files covering scoring, parsing, pipelines, and services).",
  },
];
