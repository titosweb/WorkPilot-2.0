import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Search, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { OutputPanel } from "@/components/output-panel";
import { PromptInspector } from "@/components/prompt-inspector";
import { ResponsibleAiNotice } from "@/components/ai-notice";
import { useModuleRun } from "@/hooks/use-module-run";
import { demoResearchSources } from "@/lib/demo-data";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — WorkPilot AI" },
      {
        name: "description",
        content:
          "Structure a research question and separate what your sources support from unverified background. No invented citations, ever.",
      },
      { property: "og:title", content: "AI Research Assistant — WorkPilot AI" },
      {
        property: "og:description",
        content: "Separate what your sources support from unverified background — no invented citations.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick scan", "Standard", "Deep dive"];

function ResearchPage() {
  const run = useModuleRun("research");
  const [form, setForm] = useState({
    question: "",
    scope: "",
    depth: "Standard",
    sources: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Research Assistant"
        description="The strictest module in WorkPilot. Findings must trace back to sources you supplied; anything else is separated out and tagged unverified."
        icon={Search}
        actions={
          <Button variant="outline" onClick={() => set("sources")(demoResearchSources)}>
            <BookOpen aria-hidden="true" className="size-4" />
            Load demo sources
          </Button>
        }
      />

      <div
        role="note"
        className="flex gap-3 rounded-xl border border-ai/45 bg-ai-surface p-3.5 text-sm leading-relaxed text-ai-foreground"
      >
        <ShieldAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>
          <strong className="font-semibold">Never cite this tool.</strong> Citations must come from
          documents you can open yourself. This module will not produce a URL, author, title or
          statistic that was not in your supplied material. Verify every claim against
          the sources you provided.
        </p>
      </div>

      <ResponsibleAiNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Research brief</CardTitle>
            <CardDescription>
              Paste source excerpts or references. Without them, nothing can be verified.
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
                <Label htmlFor="question">Research question</Label>
                <Input
                  id="question"
                  value={form.question}
                  placeholder="e.g. Why are export timeouts rising for enterprise accounts?"
                  onChange={(e) => set("question")(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scope">Scope</Label>
                  <Input
                    id="scope"
                    value={form.scope}
                    placeholder="e.g. Last quarter, enterprise tier only"
                    onChange={(e) => set("scope")(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">Depth</Label>
                  <Select value={form.depth} onValueChange={set("depth")}>
                    <SelectTrigger id="depth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPTHS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sources">Supplied sources</Label>
                <Textarea
                  id="sources"
                  rows={8}
                  value={form.sources}
                  placeholder={"One source per line — title, owner and any excerpt you want considered."}
                  onChange={(e) => set("sources")(e.target.value)}
                  className="font-mono text-[13px]"
                  aria-describedby="sources-help"
                />
                <p id="sources-help" className="text-xs text-muted-foreground">
                  Leave empty to see how the module refuses to make claims without evidence.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="submit" disabled={run.state === "loading"}>
                  <Sparkles aria-hidden="true" className="size-4" />
                  {run.state === "loading" ? "Structuring…" : "Structure findings"}
                </Button>
                <Button type="button" variant="ghost" onClick={run.clear}>
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <OutputPanel
            run={run}
            title="Findings & gaps"
            emptyTitle="No findings yet"
            emptyDescription="Add a question and your sources. You'll get supported findings, clearly-tagged unverified background, and an explicit list of evidence gaps."
            loadingLabel="Organising the question…"
          />
          <PromptInspector moduleId="research" />
        </div>
      </div>
    </div>
  );
}
