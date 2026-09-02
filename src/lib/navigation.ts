import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  Mail,
  ListChecks,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof Mail;
  description: string;
  group: "Workspace" | "AI modules" | "Governance";
}

export const navItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Activity, usage and review queue",
    group: "Workspace",
  },
  {
    to: "/chat",
    label: "Workplace Chat",
    icon: Bot,
    description: "General assistant with module hand-off",
    group: "Workspace",
  },
  {
    to: "/email",
    label: "Email Generator",
    icon: Mail,
    description: "Draft workplace email from bullet points",
    group: "AI modules",
  },
  {
    to: "/meeting-notes",
    label: "Meeting Notes",
    icon: CalendarCheck,
    description: "Decisions, actions and risks from raw notes",
    group: "AI modules",
  },
  {
    to: "/tasks",
    label: "Task Planner",
    icon: ListChecks,
    description: "Turn a goal into an editable plan",
    group: "AI modules",
  },
  {
    to: "/research",
    label: "Research Assistant",
    icon: Search,
    description: "Source-bound findings, no invented citations",
    group: "AI modules",
  },
  {
    to: "/responsible-ai",
    label: "Responsible AI",
    icon: ShieldCheck,
    description: "Prompts, guardrails and audit trail",
    group: "Governance",
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    description: "Workspace, model and review preferences",
    group: "Governance",
  },
];

export const navGroups = ["Workspace", "AI modules", "Governance"] as const;
