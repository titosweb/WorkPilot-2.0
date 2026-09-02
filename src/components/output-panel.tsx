import { Copy, Eraser, Pencil, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiGeneratedBadge, ResponsibleAiNotice } from "@/components/ai-notice";
import { EmptyState, ErrorState, LoadingState } from "@/components/state-blocks";
import type { useModuleRun } from "@/hooks/use-module-run";

type Run = ReturnType<typeof useModuleRun>;

export function OutputPanel({
  run,
  title = "Generated draft",
  emptyTitle,
  emptyDescription,
  loadingLabel,
  rows = 18,
}: {
  run: Run;
  title?: string;
  emptyTitle: string;
  emptyDescription: string;
  loadingLabel?: string;
  rows?: number;
}) {
  return (
    <Card className="shadow-card">
      <CardHeader className="gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">{title}</CardTitle>
          {run.state === "success" ? <AiGeneratedBadge /> : null}
        </div>
        {run.state === "success" && run.result ? (
          <p className="text-xs text-muted-foreground">
            Demo runtime · prompt {run.result.promptVersion} ·{" "}
            {new Date(run.result.generatedAt).toLocaleTimeString()} · {run.result.latencyMs} ms
            {run.edited ? " · edited by you" : ""}
          </p>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4">
        {run.state === "idle" ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : null}

        {run.state === "loading" ? <LoadingState label={loadingLabel} /> : null}

        {run.state === "error" && run.error ? (
          <ErrorState message={run.error} onRetry={run.regenerate} />
        ) : null}

        {run.state === "success" ? (
          <>
            <ResponsibleAiNotice variant="strict">
              This is a <strong className="font-semibold">demo draft</strong>, not real AI output and
              not a source of truth. Edit it freely below, verify every name, date and figure, and
              take responsibility for anything you send.
            </ResponsibleAiNotice>

            <div className="space-y-2">
              <label
                htmlFor="generated-draft"
                className="flex items-center gap-1.5 text-sm font-medium"
              >
                <Pencil aria-hidden="true" className="size-3.5" />
                Editable draft
              </label>
              <Textarea
                id="generated-draft"
                value={run.draft}
                rows={rows}
                onChange={(e) => run.updateDraft(e.target.value)}
                className="resize-y font-mono text-[13px] leading-relaxed"
                aria-describedby="generated-draft-help"
              />
              <p id="generated-draft-help" className="text-xs text-muted-foreground">
                Your edits stay in this panel until you copy them out. Nothing is sent anywhere.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void run.copy()}>
                <Copy aria-hidden="true" className="size-4" />
                Copy
              </Button>
              <Button variant="outline" onClick={run.regenerate}>
                <RefreshCw aria-hidden="true" className="size-4" />
                Regenerate
              </Button>
              <Button variant="ghost" onClick={run.clear}>
                <Eraser aria-hidden="true" className="size-4" />
                Clear
              </Button>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
