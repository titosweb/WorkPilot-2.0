import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
import {
  demoActivity,
  demoMetrics,
  demoModuleSplit,
  demoUsageSeries,
} from "@/lib/demo-data";
import { navItems } from "@/lib/navigation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkPilot AI" },
      {
        name: "description",
        content:
          "Review queue, module usage and adoption metrics for your WorkPilot AI workspace, with every AI draft clearly labelled.",
      },
      { property: "og:title", content: "Dashboard — WorkPilot AI" },
      {
        property: "og:description",
        content: "Review queue, module usage and adoption metrics for your WorkPilot AI workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const trendIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus };

function Dashboard() {
  const modules = navItems.filter((i) => i.group === "AI modules");
  const maxSplit = Math.max(...demoModuleSplit.map((m) => m.value));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Good day, Frans"
        description="Your workspace at a glance. Every figure on this page is sample data for demonstration — connect a data source to see real activity."
        icon={TrendingUp}
        badges={<DemoModeBadge />}
        actions={
          <Button asChild>
            <Link to="/chat">
              Ask WorkPilot
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        }
      />

      <ResponsibleAiNotice />

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {demoMetrics.map((metric) => {
          const Icon = trendIcon[metric.trend];
          return (
            <Card key={metric.label} className="shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs font-medium tracking-wide uppercase">
                  {metric.label}
                </CardDescription>
                <CardTitle className="text-3xl">{metric.value}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                <p
                  className={
                    metric.trend === "up"
                      ? "flex items-center gap-1 text-sm font-medium text-success"
                      : metric.trend === "down"
                        ? "flex items-center gap-1 text-sm font-medium text-destructive"
                        : "flex items-center gap-1 text-sm font-medium text-muted-foreground"
                  }
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {metric.delta}
                </p>
                <p className="text-xs text-muted-foreground">{metric.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">Drafts created per module</CardTitle>
                <CardDescription>Last six weeks · sample data</CardDescription>
              </div>
              <DemoModeBadge />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoUsageSeries} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="fillEmail" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="fillNotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="week"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.5rem",
                      color: "var(--color-popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="email"
                    name="Email"
                    stroke="var(--color-chart-1)"
                    fill="url(#fillEmail)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="notes"
                    name="Meeting notes"
                    stroke="var(--color-chart-3)"
                    fill="url(#fillNotes)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Module mix</CardTitle>
            <CardDescription>Share of drafts · sample data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoModuleSplit.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted-foreground">{m.value}%</span>
                </div>
                <Progress value={(m.value / maxSplit) * 100} aria-label={`${m.name} ${m.value}%`} />
              </div>
            ))}
            <p className="pt-2 text-xs text-muted-foreground">
              Percentages are illustrative and do not reflect real usage.
            </p>
          </CardContent>
        </Card>
      </div>

      <section aria-label="AI modules" className="space-y-3">
        <h2 className="text-lg font-semibold">Jump into a module</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group rounded-xl border border-border bg-card p-5 shadow-card transition-colors outline-none hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <m.icon aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold">
                    {m.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </p>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Review queue & recent activity</CardTitle>
              <CardDescription>
                Human approval is required before any draft leaves the workspace
              </CardDescription>
            </div>
            <DemoModeBadge />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead className="text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoActivity.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell className="text-muted-foreground">{row.module}</TableCell>
                    <TableCell>
                      <Badge
                        variant={row.status === "Approved" ? "secondary" : "outline"}
                        className={
                          row.status === "Awaiting review"
                            ? "border-ai/40 bg-ai-surface text-ai-foreground"
                            : undefined
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.actor}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{row.when}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-ai/40 bg-ai-surface/50 shadow-card">
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3.5">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ai-foreground" />
            <div className="space-y-1">
              <p className="font-semibold text-ai-foreground">Responsible AI is switched on</p>
              <p className="max-w-xl text-sm text-ai-foreground/80">
                Every module runs a dedicated system prompt with no-fabrication and
                human-oversight rules. Read them, and the audit trail, before you rely on any
                output.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/responsible-ai">Open Responsible AI</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
