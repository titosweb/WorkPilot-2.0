/**
 * DEMO DATA — static, clearly labelled sample content.
 * Nothing here comes from a live AI model or a real workspace.
 */

export const DEMO_MODE = true;

export interface DemoMetric {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  hint: string;
}

export const demoMetrics: DemoMetric[] = [
  {
    label: "Drafts reviewed",
    value: "128",
    delta: "+12%",
    trend: "up",
    hint: "Drafts a human approved before sending",
  },
  {
    label: "Hours saved (est.)",
    value: "34.5",
    delta: "+6%",
    trend: "up",
    hint: "Self-reported by the team, not measured",
  },
  {
    label: "Meetings summarised",
    value: "42",
    delta: "-4%",
    trend: "down",
    hint: "Transcripts processed this cycle",
  },
  {
    label: "Edits before approval",
    value: "1.8",
    delta: "flat",
    trend: "flat",
    hint: "Average human edits per draft",
  },
];

export const demoUsageSeries = [
  { week: "W1", email: 18, notes: 6, planner: 4, research: 3 },
  { week: "W2", email: 24, notes: 9, planner: 7, research: 5 },
  { week: "W3", email: 21, notes: 11, planner: 9, research: 4 },
  { week: "W4", email: 30, notes: 14, planner: 12, research: 8 },
  { week: "W5", email: 27, notes: 12, planner: 15, research: 11 },
  { week: "W6", email: 35, notes: 16, planner: 18, research: 13 },
];

export const demoModuleSplit = [
  { name: "Email", value: 38 },
  { name: "Meeting notes", value: 24 },
  { name: "Planner", value: 21 },
  { name: "Research", value: 17 },
];

export interface DemoActivity {
  id: string;
  module: string;
  title: string;
  status: "Approved" | "Awaiting review" | "Discarded";
  actor: string;
  when: string;
}

export const demoActivity: DemoActivity[] = [
  {
    id: "a1",
    module: "Email",
    title: "Vendor renewal follow-up draft",
    status: "Awaiting review",
    actor: "You",
    when: "12 min ago",
  },
  {
    id: "a2",
    module: "Meeting notes",
    title: "Q3 platform sync — decisions & actions",
    status: "Approved",
    actor: "N. Dlamini",
    when: "1 h ago",
  },
  {
    id: "a3",
    module: "Planner",
    title: "Onboarding revamp — 6 week plan",
    status: "Approved",
    actor: "You",
    when: "3 h ago",
  },
  {
    id: "a4",
    module: "Research",
    title: "Accessibility audit scope brief",
    status: "Discarded",
    actor: "T. Mokoena",
    when: "Yesterday",
  },
  {
    id: "a5",
    module: "Email",
    title: "Client status update — sprint 14",
    status: "Approved",
    actor: "You",
    when: "Yesterday",
  },
];

export interface DemoTask {
  id: string;
  title: string;
  priority: "P1" | "P2" | "P3";
  estimate: string;
  dependency: string;
  owner: string;
  done: boolean;
}

export const demoPlanTasks: DemoTask[] = [
  {
    id: "t1",
    title: "Audit current onboarding funnel and list drop-off points",
    priority: "P1",
    estimate: "6h",
    dependency: "none",
    owner: "Product analyst",
    done: false,
  },
  {
    id: "t2",
    title: "Draft revised activation checklist",
    priority: "P1",
    estimate: "4h",
    dependency: "Audit funnel",
    owner: "Product designer",
    done: false,
  },
  {
    id: "t3",
    title: "Rewrite welcome email sequence",
    priority: "P2",
    estimate: "5h",
    dependency: "Activation checklist",
    owner: "Content lead",
    done: false,
  },
  {
    id: "t4",
    title: "Instrument events for the new steps",
    priority: "P2",
    estimate: "8h",
    dependency: "Activation checklist",
    owner: "Engineer",
    done: false,
  },
  {
    id: "t5",
    title: "Accessibility pass on new screens",
    priority: "P1",
    estimate: "3h",
    dependency: "Draft screens",
    owner: "[owner not stated]",
    done: false,
  },
];

export const demoTranscript = `Platform sync — 14:00, 35 min
Attendees: Nomsa (eng lead), Tebogo (design), Frans (PM), Ayanda (support)

Frans: the migration slipped again, the API rate limits are the blocker.
Nomsa: we can batch the writes, that gets us under the limit. Needs about two days.
Tebogo: the empty states still aren't designed, I'll have them Thursday.
Ayanda: support tickets about the export timeout are up, roughly 20 this week.
Frans: decision — we ship behind a flag on the 18th, full rollout only after the batching lands.
Nomsa: someone needs to own the rollback runbook. Unclear who.
Ayanda: also the pricing page copy question from last week is still open.`;

export const demoResearchSources = `[1] Internal doc — "Support volume review, week 34" (uploaded by Ayanda)
[2] Internal doc — "Export pipeline timeout post-mortem" (uploaded by Nomsa)`;

export const demoChatSeed = [
  {
    id: "c0",
    role: "assistant" as const,
    content:
      "Hi Frans — I'm WorkPilot AI. Ask me anything about your work, or I can hand you off to a specialist module: **Email**, **Meeting Notes**, **Task Planner** or **Research**.\n\nRight now no live model is connected, so my replies are clearly-labelled demo responses.",
  },
];

export const demoAuditLog = [
  {
    id: "l1",
    event: "Draft approved",
    module: "Email",
    actor: "You",
    when: "12:04",
    detail: "Vendor renewal follow-up — 2 human edits before approval",
  },
  {
    id: "l2",
    event: "Output discarded",
    module: "Research",
    actor: "T. Mokoena",
    when: "11:31",
    detail: "Unsupported claim flagged by reviewer",
  },
  {
    id: "l3",
    event: "Prompt version pinned",
    module: "Meeting notes",
    actor: "Admin",
    when: "09:15",
    detail: "v1.2.0 pinned for the workspace",
  },
  {
    id: "l4",
    event: "Retention window changed",
    module: "Workspace",
    actor: "Admin",
    when: "Mon",
    detail: "Generated content retention set to 30 days",
  },
];
