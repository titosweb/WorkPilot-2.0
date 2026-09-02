import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, FileText, Sparkles } from "lucide-react";
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
import { demoTranscript } from "@/lib/demo-data";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkPilot AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into decisions, action items, risks and open questions — owners are copied, never invented.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkPilot AI" },
      {
        property: "og:description",
        content: "Turn raw meeting notes into decisions, action items, risks and open questions.",
      },
    ],
  }),
  component: NotesPage,
});

const MEETING_TYPES = ["Team sync", "Client call", "1:1", "Planning", "Retrospective", "Interview"];
const DEPTHS = ["Brief", "Standard", "Detailed"];

function NotesPage() {
  const run = useModuleRun("meeting-notes");
  const [form, setForm] = useState({
    notes: "",
    meetingType: "Team sync",
    attendees: "",
    depth: "Standard",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. You get a structured summary with decisions, action items, risks and an explicit list of what was unclear — owners and dates are only ever copied from your text."
        icon={CalendarCheck}
        actions={
          <Button variant="outline" onClick={() => set("notes")(demoTranscript)}>
            <FileText aria-hidden="true" className="size-4" />
            Load demo transcript
          </Button>
        }
      />

      <ResponsibleAiNotice />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Raw notes or transcript</CardTitle>
            <CardDescription>
              Speaker labels help attribution. Nothing is inferred about individuals.
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
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={14}
                  value={form.notes}
                  placeholder="Paste your notes here, or load the demo transcript above."
                  onChange={(e) => set("notes")(e.target.value)}
                  className="font-mono text-[13px]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meetingType">Meeting type</Label>
                  <Select value={form.meetingType} onValueChange={set("meetingType")}>
                    <SelectTrigger id="meetingType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEETING_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">Summary depth</Label>
                  <Select value={form.depth} onValueChange={set("depth")}>
                    <SelectTrigger id="depth">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPTHS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendees">Attendees (optional)</Label>
                <Input
                  id="attendees"
                  value={form.attendees}
                  placeholder="Nomsa, Tebogo, Frans, Ayanda"
                  onChange={(e) => set("attendees")(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button type="submit" disabled={run.state === "loading"}>
                  <Sparkles aria-hidden="true" className="size-4" />
                  {run.state === "loading" ? "Summarising…" : "Summarise notes"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    set("notes")("");
                    run.clear();
                  }}
                >
                  Clear notes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <OutputPanel
            run={run}
            title="Structured summary"
            emptyTitle="Nothing summarised yet"
            emptyDescription="Paste notes on the left and summarise. Decisions, actions, risks and unclear points will appear here for you to verify."
            loadingLabel="Reading your notes…"
          />
          <PromptInspector moduleId="meeting-notes" />
        </div>
      </div>
    </div>
  );
}
