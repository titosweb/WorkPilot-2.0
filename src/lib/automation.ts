/**
 * Automation Center domain model.
 *
 * DEMO RUNTIME: `prepareProposal` composes its output locally from the trigger
 * payload with a deterministic template. No model is called, so every proposal
 * is labelled as demo content in the UI. Swapping in a live provider means
 * replacing `prepareProposal` with a request built from
 * AUTOMATION_PROMPTS[actionId].systemPrompt + buildAutomationRequest(...).
 */

import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Flag,
  ListChecks,
  Mail,
  MessageSquare,
  PlayCircle,
  Search,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { AUTOMATION_PROMPTS, buildAutomationRequest } from "./automation-prompts";
import { demoTranscript, type DemoTask } from "./demo-data";

export type TriggerId =
  | "meeting-summarized"
  | "task-created"
  | "task-deadline"
  | "research-completed"
  | "email-draft"
  | "daily-review"
  | "manual";

export type ActionId =
  | "create-tasks"
  | "prioritize-tasks"
  | "followup-email"
  | "meeting-summary"
  | "research-questions"
  | "daily-summary"
  | "prepare-reminder";

export interface TriggerDef {
  id: TriggerId;
  label: string;
  description: string;
  /** Which WorkPilot module raises this trigger. */
  module: string;
  icon: LucideIcon;
  scheduled?: boolean;
}

export const TRIGGERS: TriggerDef[] = [
  {
    id: "meeting-summarized",
    label: "Meeting Notes Summarized",
    description: "Fires when the Meeting Notes Summarizer finishes a summary.",
    module: "Meeting Notes",
    icon: CalendarCheck,
  },
  {
    id: "task-created",
    label: "New Task Created",
    description: "Fires when a task is added to the Task Planner.",
    module: "Task Planner",
    icon: ListChecks,
  },
  {
    id: "task-deadline",
    label: "Task Approaching Deadline",
    description: "Fires when a task's stated due date is close.",
    module: "Task Planner",
    icon: Timer,
  },
  {
    id: "research-completed",
    label: "Research Completed",
    description: "Fires when the Research Assistant finishes a request.",
    module: "Research Assistant",
    icon: Search,
  },
  {
    id: "email-draft",
    label: "Email Draft Generated",
    description: "Fires when the Email Generator produces a draft.",
    module: "Email Generator",
    icon: Mail,
  },
  {
    id: "daily-review",
    label: "Daily Productivity Review",
    description: "Scheduled once per working day.",
    module: "Workspace",
    icon: Calendar,
    scheduled: true,
  },
  {
    id: "manual",
    label: "Manual Run",
    description: "Only runs when you press Run Now — useful for testing.",
    module: "Workspace Chat",
    icon: PlayCircle,
  },
];

export interface ActionDef {
  id: ActionId;
  label: string;
  description: string;
  /** Which module receives the approved output. */
  target: string;
  icon: LucideIcon;
  /** Sensitive actions can never auto-apply. */
  approvalMandatory: boolean;
}

export const ACTIONS: ActionDef[] = [
  {
    id: "create-tasks",
    label: "Create Tasks",
    description: "Extract action items from meeting notes and prepare tasks for the Task Planner.",
    target: "Task Planner",
    icon: ClipboardList,
    approvalMandatory: true,
  },
  {
    id: "prioritize-tasks",
    label: "Prioritize Tasks",
    description: "Use Task Planner logic to recommend High, Medium or Low priority.",
    target: "Task Planner",
    icon: Flag,
    approvalMandatory: true,
  },
  {
    id: "followup-email",
    label: "Generate Follow-Up Email",
    description: "Draft a professional follow-up email from the meeting information.",
    target: "Email Generator",
    icon: Mail,
    approvalMandatory: true,
  },
  {
    id: "meeting-summary",
    label: "Generate Meeting Follow-Up Summary",
    description: "Concise decisions, action items and follow-up points.",
    target: "Meeting Notes",
    icon: CheckCircle2,
    approvalMandatory: true,
  },
  {
    id: "research-questions",
    label: "Generate Research Follow-Up Questions",
    description: "Questions and next steps that close the evidence gaps.",
    target: "Research Assistant",
    icon: Search,
    approvalMandatory: true,
  },
  {
    id: "daily-summary",
    label: "Generate Daily Productivity Summary",
    description: "Completed, outstanding, high-priority work and upcoming deadlines.",
    target: "Dashboard",
    icon: Calendar,
    approvalMandatory: false,
  },
  {
    id: "prepare-reminder",
    label: "Prepare Reminder",
    description: "Reminder plus a priority recommendation for an approaching deadline.",
    target: "Workplace Chat",
    icon: MessageSquare,
    approvalMandatory: true,
  },
];

export const triggerById = (id: TriggerId): TriggerDef =>
  TRIGGERS.find((t) => t.id === id) ?? (TRIGGERS[6] as TriggerDef);
export const actionById = (id: ActionId): ActionDef =>
  ACTIONS.find((a) => a.id === id) ?? (ACTIONS[0] as ActionDef);

export type AutomationStatus = "active" | "paused";

export interface Automation {
  id: string;
  name: string;
  description: string;
  triggerId: TriggerId;
  actionId: ActionId;
  conditions: string;
  requiresApproval: boolean;
  enabled: boolean;
  lastRun: string | null;
  nextRun: string | null;
  /** Trigger payload used by Run Now in this demo build. */
  samplePayload: string;
}

export type RunStatus =
  | "running"
  | "pending-review"
  | "completed"
  | "failed"
  | "cancelled";

export const RUN_STEPS = [
  "Trigger detected",
  "AI processing",
  "Result generated",
  "Proposed action displayed",
  "User review",
  "User approval",
  "Action completed",
] as const;

export interface AutomationRun {
  id: string;
  automationId: string;
  automationName: string;
  triggerId: TriggerId;
  actionId: ActionId;
  startedAt: string;
  finishedAt: string | null;
  status: RunStatus;
  /** Index into RUN_STEPS the run has reached. */
  step: number;
  proposal: string;
  edited: boolean;
  error: string | null;
  reviewNote: string | null;
  proposedTasks: DemoTask[];
  requestPreview: string;
}

export const AUTOMATION_TEMPLATES: Array<
  Pick<
    Automation,
    "name" | "description" | "triggerId" | "actionId" | "conditions" | "samplePayload"
  >
> = [
  {
    name: "Meeting-to-Tasks",
    description: "Extract action items from a meeting summary and prepare tasks for the Task Planner.",
    triggerId: "meeting-summarized",
    actionId: "create-tasks",
    conditions: "Only when the summary contains at least one action item",
    samplePayload: demoTranscript,
  },
  {
    name: "Meeting Follow-Up",
    description: "Draft a professional follow-up email containing the decisions and action items.",
    triggerId: "meeting-summarized",
    actionId: "followup-email",
    conditions: "Only for external or cross-team meetings",
    samplePayload: demoTranscript,
  },
  {
    name: "Deadline Assistant",
    description: "Prepare a reminder and recommend whether the task should be prioritised higher.",
    triggerId: "task-deadline",
    actionId: "prepare-reminder",
    conditions: "Due within 2 working days",
    samplePayload:
      "Task: Instrument events for the new onboarding steps\nOwner: Nomsa\nDue: 18 Sep\nBlocked by: batching work not yet merged",
  },
  {
    name: "Daily Productivity Review",
    description: "Summarise completed work, outstanding tasks, priorities and upcoming deadlines.",
    triggerId: "daily-review",
    actionId: "daily-summary",
    conditions: "Working days only, 17:00",
    samplePayload:
      "Completed: Audit onboarding funnel; Draft activation checklist\nOutstanding: Rewrite welcome email sequence (P2); Instrument events (P2); Accessibility pass (P1)\nDeadlines: Accessibility pass due 18 Sep",
  },
  {
    name: "Research Follow-Up",
    description: "Generate suggested follow-up questions and recommended next research steps.",
    triggerId: "research-completed",
    actionId: "research-questions",
    conditions: "Only when at least one source was supplied",
    samplePayload:
      "Question: Why are export timeouts rising?\nSources: [1] Support volume review, week 34; [2] Export pipeline timeout post-mortem\nGaps: no data on payload sizes per customer",
  },
  {
    name: "Email Quality Assistant",
    description:
      "Review a generated draft and suggest improvements to clarity, grammar, professionalism, tone and structure. You keep editing rights.",
    triggerId: "email-draft",
    actionId: "followup-email",
    conditions: "Drafts longer than 80 words",
    samplePayload:
      "Draft: Hi Sam, quick one — the renewal is coming up and we need numbers. Can you send? Thanks.",
  },
];

let seq = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(seq += 1)}`;

export function automationFromTemplate(
  template: (typeof AUTOMATION_TEMPLATES)[number],
  overrides: Partial<Automation> = {},
): Automation {
  return {
    id: uid("auto"),
    name: template.name,
    description: template.description,
    triggerId: template.triggerId,
    actionId: template.actionId,
    conditions: template.conditions,
    requiresApproval: true,
    enabled: true,
    lastRun: null,
    nextRun: triggerById(template.triggerId).scheduled ? "Tomorrow, 17:00" : null,
    samplePayload: template.samplePayload,
    ...overrides,
  };
}

export const seedAutomations: Automation[] = [
  automationFromTemplate(AUTOMATION_TEMPLATES[0]!, {
    id: "auto-meeting-tasks",
    lastRun: "Today, 09:12",
  }),
  automationFromTemplate(AUTOMATION_TEMPLATES[1]!, {
    id: "auto-meeting-followup",
    lastRun: "Today, 09:14",
  }),
  automationFromTemplate(AUTOMATION_TEMPLATES[2]!, {
    id: "auto-deadline",
    lastRun: "Yesterday, 16:40",
  }),
  automationFromTemplate(AUTOMATION_TEMPLATES[3]!, {
    id: "auto-daily",
    lastRun: "Yesterday, 17:00",
    nextRun: "Today, 17:00",
  }),
  automationFromTemplate(AUTOMATION_TEMPLATES[4]!, {
    id: "auto-research",
    enabled: false,
  }),
  automationFromTemplate(AUTOMATION_TEMPLATES[5]!, {
    id: "auto-email-quality",
    enabled: false,
  }),
];

export const seedRuns: AutomationRun[] = [
  {
    id: "run-seed-1",
    automationId: "auto-meeting-tasks",
    automationName: "Meeting-to-Tasks",
    triggerId: "meeting-summarized",
    actionId: "create-tasks",
    startedAt: "2026-09-04T07:12:00.000Z",
    finishedAt: "2026-09-04T07:12:04.000Z",
    status: "completed",
    step: 7,
    proposal:
      "DEMO PROPOSAL — 3 tasks prepared from the platform sync summary and approved by you.",
    edited: true,
    error: null,
    reviewNote: "Approved with 1 edit",
    proposedTasks: [],
    requestPreview: "",
  },
  {
    id: "run-seed-2",
    automationId: "auto-meeting-followup",
    automationName: "Meeting Follow-Up",
    triggerId: "meeting-summarized",
    actionId: "followup-email",
    startedAt: "2026-09-04T07:14:00.000Z",
    finishedAt: null,
    status: "pending-review",
    step: 5,
    proposal:
      "DEMO PROPOSAL — follow-up email drafted from the platform sync summary. Awaiting your review.",
    edited: false,
    error: null,
    reviewNote: null,
    proposedTasks: [],
    requestPreview: "",
  },
  {
    id: "run-seed-3",
    automationId: "auto-deadline",
    automationName: "Deadline Assistant",
    triggerId: "task-deadline",
    actionId: "prepare-reminder",
    startedAt: "2026-09-03T14:40:00.000Z",
    finishedAt: "2026-09-03T14:40:03.000Z",
    status: "failed",
    step: 2,
    proposal: "",
    edited: false,
    error: "Trigger payload had no stated due date, so no reminder could be prepared.",
    reviewNote: null,
    proposedTasks: [],
    requestPreview: "",
  },
  {
    id: "run-seed-4",
    automationId: "auto-daily",
    automationName: "Daily Productivity Review",
    triggerId: "daily-review",
    actionId: "daily-summary",
    startedAt: "2026-09-03T15:00:00.000Z",
    finishedAt: "2026-09-03T15:00:05.000Z",
    status: "cancelled",
    step: 4,
    proposal: "DEMO PROPOSAL — daily summary prepared, then cancelled before review.",
    edited: false,
    error: null,
    reviewNote: "Cancelled by you",
    proposedTasks: [],
    requestPreview: "",
  },
];

export class AutomationError extends Error {}

const DEMO_BANNER =
  "DEMO PROPOSAL — composed locally from the trigger payload by a template, not by an AI model. No automation service is connected.";

function lines(raw: string): string[] {
  return raw
    .split(/\n|;|•/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function actionLines(raw: string): string[] {
  return lines(raw).filter((l) =>
    /will |needs to|owner|action|i'?ll|by (mon|tue|wed|thu|fri|\d)|due/i.test(l),
  );
}

export interface Proposal {
  text: string;
  tasks: DemoTask[];
  requestPreview: string;
}

/** Deterministic local stand-in for a live automation run. */
export function prepareProposal(automation: Automation, payload: string): Proposal {
  if (!payload.trim()) {
    throw new AutomationError(
      "The trigger payload was empty, so nothing could be prepared. Nothing was applied.",
    );
  }
  if (payload.toLowerCase().includes("/fail")) {
    throw new AutomationError(
      "Simulated automation failure — the proposal step did not complete. Nothing was applied.",
    );
  }

  const trigger = triggerById(automation.triggerId);
  const requestPreview = buildAutomationRequest({
    actionId: automation.actionId,
    triggerId: automation.triggerId,
    triggerLabel: trigger.label,
    automationName: automation.name,
    conditions: automation.conditions,
    payload,
  });

  const items = actionLines(payload);
  const tasks: DemoTask[] =
    automation.actionId === "create-tasks"
      ? (items.length ? items : lines(payload)).slice(0, 5).map((item, i) => ({
          id: uid("ptask"),
          title: item.replace(/^[A-Z][a-z]+:\s*/, ""),
          priority: i === 0 ? "P1" : i < 3 ? "P2" : "P3",
          estimate: `${2 + i * 2}h`,
          dependency: i === 0 ? "none" : "previous item",
          owner: /(^|\s)([A-Z][a-z]+):/.exec(item)?.[2] ?? "[owner not stated]",
          done: false,
        }))
      : [];

  return { text: composeProposal(automation, payload, tasks), tasks, requestPreview };
}

function composeProposal(automation: Automation, payload: string, tasks: DemoTask[]): string {
  const prompt = AUTOMATION_PROMPTS[automation.actionId];
  const head = `${DEMO_BANNER}

Action: ${prompt.name} · prompt ${prompt.version}
Trigger: ${triggerById(automation.triggerId).label}
Conditions: ${automation.conditions.trim() || "none specified"}
`;
  const src = lines(payload);
  const decisions = src.filter((l) => /decision|agreed|approved|we (will|ship)/i.test(l));
  const items = actionLines(payload);

  switch (automation.actionId) {
    case "create-tasks":
      return `${head}
Proposed tasks (nothing is added to the Task Planner until you approve)
${tasks.map((t) => `• ${t.title} — owner: ${t.owner} — due: [no due date] — priority suggestion: ${t.priority}`).join("\n")}

MISSING
${tasks
  .filter((t) => t.owner.startsWith("["))
  .map((t) => `• Owner not stated for "${t.title}"`)
  .join("\n") || "• Nothing missing beyond the due dates above."}

Open questions
• Confirm every owner and due date with the attendees before approving.`;

    case "prioritize-tasks":
      return `${head}
Priority recommendations (for human confirmation)
${(items.length ? items : src).slice(0, 5).map((l, i) => `• ${l} — ${i === 0 ? "High" : i < 3 ? "Medium" : "Low"} — reason: ${i === 0 ? "blocker referenced in the payload" : "no urgency stated in the payload"}`).join("\n")}

Priorities are recommendations for human confirmation.`;

    case "followup-email":
      return `${head}
Subject: Follow-up and next steps

Hi [recipient],

Thanks for your time. Here is what was captured:

${(decisions.length ? decisions : src.slice(0, 3)).map((d) => `• ${d}`).join("\n")}

Next steps:
${(items.length ? items : ["• [no action items stated in the payload]"]).map((i) => (i.startsWith("•") ? i : `• ${i}`)).join("\n")}

Could you confirm the owners and dates by [date]?

Best regards,
[Your name]

Assumptions & open questions
• [assumption] Recipient not stated in the payload — placeholder left.
• Suggested improvements to the source text: tighten the ask, name the owner, state a date.
• You keep full editing rights — review before sending.`;

    case "meeting-summary":
      return `${head}
Decisions
${decisions.map((d) => `• ${d}`).join("\n") || "• No explicit decisions recorded."}

Action items
${items.map((i) => `• ${i} — owner: [see payload] — due: [no due date]`).join("\n") || "• None stated."}

Follow-up points
${src.slice(-3).map((s) => `• ${s}`).join("\n")}

Unclear or missing
• Anything not written down above was not inferred.`;

    case "research-questions":
      return `${head}
Follow-up questions
${src.slice(0, 4).map((s, i) => `${i + 1}. What does the payload line "${s}" leave unresolved, and which document answers it?`).join("\n")}

Evidence gaps
• No claim can be verified without opening the supplied sources.

Suggested next steps
• Retrieve the named documents and re-run with their content attached.
• No citation, URL or statistic has been generated — nothing outside the payload is referenced.`;

    case "daily-summary":
      return `${head}
Completed
${src.filter((l) => /^completed/i.test(l)).map((l) => `• ${l}`).join("\n") || "• Nothing marked complete in the payload."}

Outstanding
${src.filter((l) => /^outstanding/i.test(l)).map((l) => `• ${l}`).join("\n") || "• Nothing listed."}

High priority
${src.filter((l) => /p1|high/i.test(l)).map((l) => `• ${l}`).join("\n") || "• No priority flags in the payload."}

Upcoming deadlines
${src.filter((l) => /due|deadline/i.test(l)).map((l) => `• ${l}`).join("\n") || "• No dates stated."}

Recommended next steps
• Start with the highest-priority item above; nothing was invented or estimated.`;

    case "prepare-reminder":
      return `${head}
Reminder (draft — you decide whether to send it)
"Heads up: ${src[0] ?? "[task not stated]"} is approaching its stated deadline. ${src.find((l) => /due/i.test(l)) ?? "[no due date in the payload]"}."

Priority recommendation
• Raise to High — reason: ${src.find((l) => /block/i.test(l)) ?? "no blocker stated, so this is a judgement call for you"}.

Open questions
• Confirm the deadline is still valid and who owns the task.`;
  }
}
