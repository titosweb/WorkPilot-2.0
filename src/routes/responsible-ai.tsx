import { createFileRoute } from "@tanstack/react-router";
import { Ban, Eye, FileWarning, Lock, ShieldCheck, UserCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { DemoModeBadge, ResponsibleAiNotice } from "@/components/ai-notice";
import { GLOBAL_GUARDRAILS, MODULE_PROMPT_LIST } from "@/lib/prompts";
import { demoAuditLog } from "@/lib/demo-data";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — WorkPilot AI" },
      {
        name: "description",
        content:
          "The guardrails behind WorkPilot AI: no fabrication, human oversight, per-module system prompts and an audit trail.",
      },
      { property: "og:title", content: "Responsible AI — WorkPilot AI" },
      {
        property: "og:description",
        content: "No fabrication, human oversight, per-module system prompts and an audit trail.",
      },
    ],
  }),
  component: ResponsibleAiPage,
});

const PRINCIPLES = [
  {
    icon: Ban,
    title: "No fabrication",
    body: "Models may not invent facts, names, numbers, dates, citations or links. Missing information becomes a bracketed placeholder or an explicit gap.",
  },
  {
    icon: UserCheck,
    title: "Human oversight",
    body: "WorkPilot produces drafts only. It never sends, files, schedules or shares. A person reviews and takes responsibility for every output.",
  },
  {
    icon: Eye,
    title: "Transparency",
    body: "Every generated block carries an 'AI generated — review required' label, the prompt version, and the assumptions used.",
  },
  {
    icon: Lock,
    title: "Data minimisation",
    body: "Only the input you provide is processed. No credentials or secrets are requested, echoed or retained by the modules.",
  },
  {
    icon: FileWarning,
    title: "Scope limits",
    body: "Legal, medical, financial and HR determinations are declined and routed to a qualified human.",
  },
  {
    icon: ShieldCheck,
    title: "Auditability",
    body: "Approvals, discards, prompt-version pins and retention changes are recorded so behaviour can be reviewed after the fact.",
  },
];

function ResponsibleAiPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Responsible AI"
        description="How WorkPilot AI is constrained. These are the rules every module inherits, the exact prompts that enforce them, and the record of what humans did with the output."
        icon={ShieldCheck}
        badges={<DemoModeBadge />}
      />

      <ResponsibleAiNotice variant="strict">
        Every module now runs against a <strong className="font-semibold">live AI model</strong>,
        called server-side with the dedicated system prompt shown below. Output is always labelled as
        AI generated and always requires human review before it is used or sent.
      </ResponsibleAiNotice>

      <section aria-label="Principles" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <Card key={p.title} className="shadow-card">
            <CardHeader className="pb-2">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <p.icon aria-hidden="true" className="size-5" />
              </span>
              <CardTitle className="pt-2 text-base">{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Global guardrails</CardTitle>
          <CardDescription>
            Prepended to every module system prompt. One source of truth, versioned with the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-4 text-[12.5px] leading-relaxed whitespace-pre-wrap">
            {GLOBAL_GUARDRAILS}
          </pre>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Module prompts</CardTitle>
          <CardDescription>
            Each module owns a dedicated, versioned prompt with its own output contract.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {MODULE_PROMPT_LIST.map((prompt) => (
              <AccordionItem key={prompt.id} value={prompt.id}>
                <AccordionTrigger className="text-left">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{prompt.name}</span>
                    <Badge variant="secondary" className="font-mono text-[11px]">
                      {prompt.version}
                    </Badge>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{prompt.purpose}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.inputs.map((input) => (
                      <Badge key={input} variant="outline" className="text-[11px] font-normal">
                        {input}
                      </Badge>
                    ))}
                  </div>
                  <pre className="max-h-72 overflow-auto rounded-lg bg-muted p-3.5 text-[12px] leading-relaxed whitespace-pre-wrap">
                    {prompt.systemPrompt}
                  </pre>
                  <p className="text-xs text-muted-foreground">
                    <strong className="font-semibold text-foreground">Output contract:</strong>{" "}
                    {prompt.outputContract}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Oversight audit trail</CardTitle>
              <CardDescription>What humans did with generated content</CardDescription>
            </div>
            <DemoModeBadge />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead className="text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoAuditLog.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.event}</TableCell>
                    <TableCell className="text-muted-foreground">{row.module}</TableCell>
                    <TableCell className="text-muted-foreground">{row.actor}</TableCell>
                    <TableCell className="text-muted-foreground">{row.detail}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{row.when}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="pt-3 text-xs text-muted-foreground">
            Sample entries. A connected workspace records real approvals, discards and prompt
            changes here.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Known limitations</CardTitle>
          <CardDescription>Read this before relying on any output</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>• Language models can be confidently wrong. Structure is not accuracy.</li>
            <li>• Summaries can drop nuance, especially disagreement and conditional statements.</li>
            <li>• Estimates in the planner are planning aids, not commitments.</li>
            <li>• The research module cannot verify a source it has not been given.</li>
            <li>• Tone controls change phrasing, not the underlying facts you supplied.</li>
            <li>• Accessibility, legal and compliance review remain human responsibilities.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
