/**
 * Mock AI runtime.
 *
 * There is NO live model behind this file. Every string it returns is composed
 * locally from the user's own input by a deterministic template, so it can be
 * labelled honestly in the UI as demo output.
 *
 * Integration point: replace `demoGenerate` with a real call that sends
 * MODULE_PROMPTS[moduleId].systemPrompt as the system message and the same
 * payload as the user message. The public shape below (RunState, RunResult,
 * RunError) is what the UI depends on and should not need to change.
 */

import { MODULE_PROMPTS, type ModulePromptId } from "./prompts";

export type RunState = "idle" | "loading" | "success" | "error";

export interface RunResult {
  moduleId: ModulePromptId;
  text: string;
  promptVersion: string;
  generatedAt: string;
  latencyMs: number;
  /** Always true in this build — no live provider is connected. */
  isDemo: boolean;
}

export class RunError extends Error {
  constructor(
    message: string,
    readonly recoverable = true,
  ) {
    super(message);
    this.name = "RunError";
  }
}

export type RunPayload = Record<string, string>;

const MIN_LATENCY = 700;
const MAX_LATENCY = 1500;

/** Type "/fail" anywhere in an input to exercise the error state. */
const FAILURE_TRIGGER = "/fail";

export async function demoGenerate(
  moduleId: ModulePromptId,
  payload: RunPayload,
  signal?: AbortSignal,
): Promise<RunResult> {
  const started = Date.now();
  const joined = Object.values(payload).join(" ").trim();

  if (!joined) {
    throw new RunError("Add some input first — there is nothing to work from yet.");
  }

  const latency = MIN_LATENCY + Math.round(Math.random() * (MAX_LATENCY - MIN_LATENCY));
  await wait(latency, signal);

  if (joined.toLowerCase().includes(FAILURE_TRIGGER)) {
    throw new RunError(
      "Simulated generation failure. This is the demo error state — no request left your browser.",
    );
  }

  return {
    moduleId,
    text: compose(moduleId, payload),
    promptVersion: MODULE_PROMPTS[moduleId].version,
    generatedAt: new Date().toISOString(),
    latencyMs: Date.now() - started,
    isDemo: true,
  };
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new RunError("Generation cancelled.", false));
    });
  });
}

const DEMO_BANNER = "DEMO OUTPUT — assembled from your input by a local template, not by an AI model.";

function bullets(raw = "", fallback = "[no detail supplied]"): string[] {
  const items = raw
    .split(/\n|;|•|(?:^|\s)-\s/)
    .map((line) => line.trim())
    .filter(Boolean);
  return items.length ? items : [fallback];
}

function compose(moduleId: ModulePromptId, p: RunPayload): string {
  switch (moduleId) {
    case "email":
      return composeEmail(p);
    case "meeting-notes":
      return composeNotes(p);
    case "task-planner":
      return composePlan(p);
    case "research":
      return composeResearch(p);
    case "chat":
      return composeChat(p);
  }
}

function composeEmail(p: RunPayload): string {
  const points = bullets(p["points"], "[key points not supplied]");
  const tone = p["tone"] || "Professional";
  const recipient = p["recipient"]?.trim() || "[recipient]";
  const purpose = p["purpose"]?.trim() || "[purpose not stated]";
  const subject = purpose.length > 60 ? `${purpose.slice(0, 57)}…` : purpose;

  return `${DEMO_BANNER}

Subject: ${subject}

Hi ${recipient},

I'm writing regarding ${purpose.toLowerCase()}.

${points.map((pt) => `• ${pt}`).join("\n")}

${
  tone === "Friendly"
    ? "Would love your thoughts when you get a moment — happy to jump on a quick call."
    : tone === "Direct"
      ? "Please confirm by [date] so we can proceed."
      : "Could you confirm whether this works on your side by [date]?"
}

Best regards,
[Your name]
${p["signature"]?.trim() ? p["signature"].trim() : "[role] · [team]"}

Assumptions & open questions
• Tone applied: ${tone}. Length target: ${p["length"] || "Medium"}. Language: ${p["language"] || "English"}.
• [assumption] Recipient relationship treated as "${p["relationship"] || "colleague"}".
• Placeholders left for you to fill: [date], and any figures or links not in your brief.
• No facts were added beyond your key points. Verify names, dates and commitments before sending.`;
}

function composeNotes(p: RunPayload): string {
  const lines = bullets(p["notes"], "[no notes supplied]");
  const decisions = lines.filter((l) => /decision|agreed|we (will|ship)|approved/i.test(l));
  const actions = lines.filter((l) => /will |needs to|owner|action|by (mon|tue|wed|thu|fri|\d)/i.test(l));
  const risks = lines.filter((l) => /blocker|risk|slip|up \d|delay|timeout|unclear/i.test(l));
  const unclear = lines.filter((l) => /unclear|open|tbd|not sure|still/i.test(l));

  return `${DEMO_BANNER}

Summary
${lines
  .slice(0, 5)
  .map((l) => `• ${l}`)
  .join("\n")}

Decisions
${decisions.length ? decisions.map((l) => `• ${l}`).join("\n") : "• No explicit decisions recorded."}

Action items
${
  actions.length
    ? actions.map((l) => `• ${l} — owner: [see notes] — due: [no due date]`).join("\n")
    : "• No action items stated in the notes."
}

Risks & blockers
${risks.length ? risks.map((l) => `• ${l}`).join("\n") : "• None raised."}

Unclear or missing
${unclear.length ? unclear.map((l) => `• ${l}`).join("\n") : "• Nothing flagged as ambiguous."}
• Meeting type: ${p["meetingType"] || "[not specified]"}. Depth: ${p["depth"] || "Standard"}.
• Owners and dates are only ever copied from your notes — never inferred. Confirm them with attendees.`;
}

function composePlan(p: RunPayload): string {
  const goal = p["goal"]?.trim() || "[goal not stated]";
  const constraints = bullets(p["constraints"], "None supplied");
  const steps = [
    "Clarify scope and success criteria",
    "Audit the current state and collect the inputs you need",
    "Draft the change and review it with stakeholders",
    "Build / execute the core work",
    "Validate, including an accessibility and quality pass",
    "Roll out and capture learnings",
  ];

  return `${DEMO_BANNER}

Plan summary
• Approach: break "${goal}" into six sequenced milestones sized to ${p["capacity"] || "[capacity not stated]"} per day.
• Critical path: scope → audit → build → validate. Slippage in the audit moves everything after it.

Milestones (target labels derived only from your deadline: ${p["deadline"] || "[no deadline supplied]"})
${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Tasks — estimates are indicative and require human validation
${steps
  .map(
    (s, i) =>
      `• ${s} — ${i < 2 ? "P1" : i < 4 ? "P2" : "P3"} — est. ${4 + i * 2}h — dependency: ${
        i === 0 ? "none" : steps[i - 1]
      } — suggested role: [assign a person]`,
  )
  .join("\n")}

Risks & assumptions
${constraints.map((c) => `• Constraint carried through: ${c}`).join("\n")}
• [assumption] No approvals, budget or tooling beyond what you listed.
• If ${p["deadline"] || "the deadline"} cannot absorb the estimates above, cut the roll-out learnings step first.`;
}

function composeResearch(p: RunPayload): string {
  const question = p["question"]?.trim() || "[question not stated]";
  const hasSources = Boolean(p["sources"]?.trim());

  return `${DEMO_BANNER}

Question
${question}

What the supplied sources support
${
  hasSources
    ? bullets(p["sources"])
        .map((s) => `• Source registered: ${s} — no claim can be extracted without a live model reading it.`)
        .join("\n")
    : "No sources supplied — nothing can be verified."
}

General background (unverified)
• [unverified] This demo runtime does not have model knowledge, so no background is offered.
• [unverified] A live integration would place clearly-tagged, non-citable background here.

Evidence gaps
• Primary documents, data or interviews covering: ${question}
• Scope boundaries: ${p["scope"]?.trim() || "[scope not stated]"}. Depth requested: ${p["depth"] || "Standard"}.

Suggested next steps
• Collect the specific documents that would answer the question and attach them as sources.
• Identify the person or team who owns this area and confirm the framing with them.
• Never cite anything this tool produces — citations must come from sources you can open.`;
}

function composeChat(p: RunPayload): string {
  const message = p["message"]?.trim() || "";
  const routed = /email|write to|reply/i.test(message)
    ? "Smart Email Generator"
    : /meeting|transcript|notes/i.test(message)
      ? "Meeting Notes Summarizer"
      : /plan|deadline|roadmap|tasks?/i.test(message)
        ? "AI Task Planner"
        : /research|sources?|evidence/i.test(message)
          ? "AI Research Assistant"
          : null;

  return `**Demo reply** — no live model is connected, so this response is generated locally from your message.

You asked: "${message}"

Here is how a connected assistant would handle it:
• Restate your goal in one line and confirm any missing detail.
• Answer using only what you provided, marking anything inferred as [assumption].
• Leave the decision and the send/submit action with you.
${routed ? `\nThis looks like a job for the **${routed}** module — it has a dedicated system prompt for exactly this task.` : ""}`;
}
