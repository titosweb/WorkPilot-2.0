import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  icon: Icon,
  actions,
  badges,
  className,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  badges?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3.5">
          {Icon ? (
            <span className="mt-0.5 hidden size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:flex">
              <Icon className="size-5" />
            </span>
          ) : null}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
      {badges ? <div className="flex flex-wrap items-center gap-2">{badges}</div> : null}
    </header>
  );
}
