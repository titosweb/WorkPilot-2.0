import { AlertTriangle, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/** Prominent, non-dismissible label for anything a model produced. */
export function AiGeneratedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ai/40 bg-ai-surface px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-ai-foreground uppercase",
        className,
      )}
    >
      <AlertTriangle aria-hidden="true" className="size-3" />
      AI generated · review required
    </span>
  );
}

export function DemoModeBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-secondary-foreground uppercase",
        className,
      )}
    >
      <Info aria-hidden="true" className="size-3" />
      Demo data
    </span>
  );
}

export function ResponsibleAiNotice({
  variant = "default",
  children,
  className,
}: {
  variant?: "default" | "strict";
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="note"
      aria-label="Responsible AI notice"
      className={cn(
        "flex gap-3 rounded-xl border p-3.5 text-sm leading-relaxed",
        variant === "strict"
          ? "border-ai/45 bg-ai-surface text-ai-foreground"
          : "border-border bg-muted/60 text-muted-foreground",
        className,
      )}
    >
      <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>
        {children ?? (
          <>
            No live AI model is connected in this build. Output shown is{" "}
            <strong className="font-semibold">clearly-labelled demo content</strong> assembled from
            your own input. When a model is connected, every draft still requires human review — the
            assistant never sends, files or schedules anything on your behalf.
          </>
        )}
      </p>
    </div>
  );
}
