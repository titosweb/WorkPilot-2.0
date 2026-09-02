import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/page-header";
import { OutputPanel } from "@/components/output-panel";
import { PromptInspector } from "@/components/prompt-inspector";
import { DemoModeBadge, ResponsibleAiNotice } from "@/components/ai-notice";
import { useModuleRun } from "@/hooks/use-module-run";
import { demoPlanTasks, type DemoTask } from "@/lib/demo-data";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkPilot AI" },
      {
        name: "description",
        content:
          "Turn a goal into a sequenced, editable plan with indicative estimates, dependencies and risks that you validate.",
      },
      { property: "og:title", content: "AI Task Planner — WorkPilot AI" },
      {
        property: "og:description",
        content: "Turn a goal into a sequenced, editable plan with indicative estimates and risks.",
      },
    ],
  }),
  component: TasksPage,
});

const PRIORITY_STYLE: Record<DemoTask["priority"], string> = {
  P1: "border-destructive/40 bg-destructive/10 text-destructive",
  P2: "border-warning/45 bg-warning/15 text-warning-foreground",
  P3: "border-border bg-muted text-muted-foreground",
};

function TasksPage() {
  const run = useModuleRun("task-planner");
  const [tasks, setTasks] = useState<DemoTask[]>(demoPlanTasks);
  const [form, setForm] = useState({
    goal: "",
    deadline: "",
    capacity: "",
    constraints: "",
    dependencies: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Task Planner"
        description="Describe the goal and the constraints you actually have. WorkPilot proposes a sequence with indicative estimates — you own the priorities, the owners and the commitments."
        icon={ListChecks}
      />

      <ResponsibleAiNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Planning brief</CardTitle>
            <CardDescription>
              No people, budgets or tools are invented — only what you list is used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void run.run(form);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Input
                  id="goal"
                  value={form.goal}
                  placeholder="e.g. Revamp customer onboarding"
                  onChange={(e) => set("goal")(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    value={form.deadline}
                    placeholder="e.g. 6 weeks / 30 Oct"
                    onChange={(e) => set("deadline")(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity per day</Label>
                  <Input
                    id="capacity"
                    value={form.capacity}
                    placeholder="e.g. 3 focused hours"
                    onChange={(e) => set("capacity")(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="constraints">Constraints</Label>
                <Textarea
                  id="constraints"
                  rows={4}
                  value={form.constraints}
                  placeholder={"One per line:\nNo new hires\nLegal review needed before launch"}
                  onChange={(e) => set("constraints")(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependencies">Known dependencies (optional)</Label>
                <Textarea
                  id="dependencies"
                  rows={3}
                  value={form.dependencies}
                  placeholder="e.g. Design system update ships first"
                  onChange={(e) => set("dependencies")(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="submit" disabled={run.state === "loading"}>
                  <Sparkles aria-hidden="true" className="size-4" />
                  {run.state === "loading" ? "Planning…" : "Generate plan"}
                </Button>
                <Button type="button" variant="ghost" onClick={run.clear}>
                  Clear plan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <OutputPanel
            run={run}
            title="Proposed plan"
            emptyTitle="No plan yet"
            emptyDescription="Describe your goal and constraints to get a sequenced plan. Estimates are always indicative and need your validation."
            loadingLabel="Sequencing the work…"
          />
          <PromptInspector moduleId="task-planner" />
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Working task board</CardTitle>
              <CardDescription>
                {done} of {tasks.length} complete · sample plan you can tick through
              </CardDescription>
            </div>
            <DemoModeBadge />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start gap-3 py-3.5">
                <Checkbox
                  id={task.id}
                  checked={task.done}
                  aria-label={`Mark "${task.title}" complete`}
                  onCheckedChange={(checked) =>
                    setTasks((prev) =>
                      prev.map((t) => (t.id === task.id ? { ...t, done: Boolean(checked) } : t)),
                    )
                  }
                  className="mt-0.5"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <label
                    htmlFor={task.id}
                    className={
                      task.done
                        ? "block text-sm font-medium text-muted-foreground line-through"
                        : "block text-sm font-medium"
                    }
                  >
                    {task.title}
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className={PRIORITY_STYLE[task.priority]}>
                      {task.priority}
                    </Badge>
                    <Badge variant="secondary">est. {task.estimate}</Badge>
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                      depends on: {task.dependency}
                    </Badge>
                    <Badge variant="outline" className="font-normal text-muted-foreground">
                      {task.owner}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="pt-3 text-xs text-muted-foreground">
            This board holds sample tasks in memory only — nothing is persisted, and unresolved
            owners stay marked as such rather than being guessed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
