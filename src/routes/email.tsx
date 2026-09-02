import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkPilot AI" },
      {
        name: "description",
        content:
          "Turn bullet points into a reviewable workplace email draft, with tone control and no invented facts.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkPilot AI" },
      {
        property: "og:description",
        content: "Turn bullet points into a reviewable workplace email draft with tone control.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Direct", "Diplomatic", "Formal"];
const LENGTHS = ["Short", "Medium", "Detailed"];
const RELATIONSHIPS = ["colleague", "manager", "client", "vendor", "candidate", "cross-team"];

function EmailPage() {
  const run = useModuleRun("email");
  const [form, setForm] = useState({
    recipient: "",
    relationship: "colleague",
    purpose: "",
    points: "",
    tone: "Professional",
    length: "Medium",
    language: "English",
    signature: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Email Generator"
        description="Give the brief, keep the judgement. WorkPilot turns your bullet points into a draft you edit and send yourself — it never invents a fact, a figure or a commitment."
        icon={Mail}
      />

      <ResponsibleAiNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
            <CardDescription>
              Anything you leave out becomes a bracketed placeholder — never a guess.
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    value={form.recipient}
                    placeholder="e.g. Nomsa"
                    onChange={(e) => set("recipient")(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select value={form.relationship} onValueChange={set("relationship")}>
                    <SelectTrigger id="relationship">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIPS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input
                  id="purpose"
                  value={form.purpose}
                  placeholder="e.g. Confirm the vendor renewal timeline"
                  onChange={(e) => set("purpose")(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points">Key points</Label>
                <Textarea
                  id="points"
                  rows={6}
                  value={form.points}
                  placeholder={"One point per line:\nRenewal quote arrived, 8% higher\nNeed sign-off before month end\nAsk for a two-year option"}
                  onChange={(e) => set("points")(e.target.value)}
                  aria-describedby="points-help"
                />
                <p id="points-help" className="text-xs text-muted-foreground">
                  Only these facts are used. Type <code className="font-mono">/fail</code> to preview
                  the error state.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={form.tone} onValueChange={set("tone")}>
                    <SelectTrigger id="tone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Select value={form.length} onValueChange={set("length")}>
                    <SelectTrigger id="length">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LENGTHS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={form.language}
                    onChange={(e) => set("language")(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signature">Sign-off details (optional)</Label>
                <Input
                  id="signature"
                  value={form.signature}
                  placeholder="Role · team"
                  onChange={(e) => set("signature")(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="submit" disabled={run.state === "loading"}>
                  <Sparkles aria-hidden="true" className="size-4" />
                  {run.state === "loading" ? "Generating…" : "Generate draft"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setForm({
                      recipient: "",
                      relationship: "colleague",
                      purpose: "",
                      points: "",
                      tone: "Professional",
                      length: "Medium",
                      language: "English",
                      signature: "",
                    });
                    run.clear();
                  }}
                >
                  Reset form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <OutputPanel
            run={run}
            title="Email draft"
            emptyTitle="No draft yet"
            emptyDescription="Fill in the brief and generate a draft. It will appear here as fully editable text with a review reminder."
            loadingLabel="Drafting your email…"
          />
          <PromptInspector moduleId="email" />
        </div>
      </div>
    </div>
  );
}
