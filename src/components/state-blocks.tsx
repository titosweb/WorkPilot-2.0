import { AlertCircle, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Sparkles aria-hidden="true" className="size-5" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Generating draft…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="space-y-4 rounded-xl border border-border bg-card p-5"
    >
      <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        {label}
      </p>
      <div className="space-y-2.5">
        <Skeleton className="h-3.5 w-2/5" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-11/12" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-5/6" />
      </div>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border border-destructive/40 bg-destructive/8 p-5 text-sm"
    >
      <p className="flex items-start gap-2 font-medium text-destructive">
        <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>{message}</span>
      </p>
      <p className="text-muted-foreground">
        Nothing was saved. You can adjust your input and try again — your draft input is untouched.
      </p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="self-start" onClick={onRetry}>
          <RefreshCw aria-hidden="true" className="size-4" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
