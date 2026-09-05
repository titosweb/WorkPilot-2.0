import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";
import { DemoModeBadge, ResponsibleAiNotice } from "@/components/ai-notice";
import { MODULE_PROMPT_LIST } from "@/lib/prompts";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkPilot AI" },
      {
        name: "description",
        content:
          "Configure workspace defaults, model placeholders, review requirements and data retention for WorkPilot AI.",
      },
      { property: "og:title", content: "Settings — WorkPilot AI" },
      {
        property: "og:description",
        content: "Workspace defaults, model placeholders, review requirements and data retention.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [workspace, setWorkspace] = useState("Frans Phala · Operations");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [temperature, setTemperature] = useState([30]);
  const [requireReview, setRequireReview] = useState(true);
  const [labelOutput, setLabelOutput] = useState(true);
  const [retainInputs, setRetainInputs] = useState(false);
  const [retentionDays, setRetentionDays] = useState("30");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Workspace defaults and governance controls. Nothing here is persisted in this build — changes live in the current session only."
        icon={SettingsIcon}
        badges={<DemoModeBadge />}
      />

      <ResponsibleAiNotice />

      <Tabs defaultValue="workspace">
        <TabsList className="flex-wrap">
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="model">Model</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="mt-5">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Defaults</CardTitle>
              <CardDescription>Applied as the starting point in every module.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workspace">Workspace name</Label>
                  <Input
                    id="workspace"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default language</Label>
                  <Input
                    id="default-language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 sm:max-w-xs">
                <Label htmlFor="default-tone">Default email tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="default-tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Professional", "Friendly", "Direct", "Diplomatic", "Formal"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => toast.success("Preferences updated for this session")}>
                Save preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model" className="mt-5">
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">Model connection</CardTitle>
                  <CardDescription>
                    No provider is connected. These controls are placeholders for integration.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-ai/40 bg-ai-surface text-ai-foreground">
                  Not connected
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 sm:max-w-sm">
                <Label htmlFor="provider">Provider</Label>
                <Select defaultValue="none" disabled>
                  <SelectTrigger id="provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No provider connected</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Every module runs live through the connected AI service, called securely on the
                  server so no key is ever exposed in your browser.
                </p>
              </div>

              <div className="space-y-3 sm:max-w-sm">
                <Label htmlFor="temperature">
                  Creativity ({((temperature[0] ?? 30) / 100).toFixed(2)})
                </Label>
                <Slider
                  id="temperature"
                  value={temperature}
                  onValueChange={setTemperature}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">
                  Lower values favour faithfulness to your input. Recommended below 0.40 for
                  workplace drafting.
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="text-sm font-medium">Pinned prompt versions</p>
                <ul className="space-y-2">
                  {MODULE_PROMPT_LIST.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2.5 text-sm"
                    >
                      <span className="font-medium">{p.name}</span>
                      <Badge variant="secondary" className="font-mono text-[11px]">
                        {p.version}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="mt-5">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Human oversight</CardTitle>
              <CardDescription>Controls that keep a person in the loop.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <SettingRow
                id="require-review"
                title="Require human review before export"
                description="Drafts must be opened and acknowledged before they can be copied out."
                checked={requireReview}
                onChange={setRequireReview}
                locked
              />
              <Separator />
              <SettingRow
                id="label-output"
                title="Label all AI-generated content"
                description="Adds the 'AI generated — review required' badge to every generated block."
                checked={labelOutput}
                onChange={setLabelOutput}
                locked
              />
              <Separator />
              <p className="pt-3 text-xs text-muted-foreground">
                These two controls are enforced by policy in this build and cannot be switched off.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-5">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Data handling</CardTitle>
              <CardDescription>
                Nothing leaves your browser in this build — no network calls are made by the modules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <SettingRow
                id="retain-inputs"
                title="Retain module inputs"
                description="Keep briefs and transcripts so drafts can be regenerated later."
                checked={retainInputs}
                onChange={setRetainInputs}
              />
              <Separator />
              <div className="space-y-2 sm:max-w-xs">
                <Label htmlFor="retention">Generated content retention (days)</Label>
                <Input
                  id="retention"
                  type="number"
                  min={1}
                  max={365}
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => toast.success("Session data cleared", {
                  description: "Module inputs and drafts in this session were discarded.",
                })}
              >
                Clear session data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingRow({
  id,
  title,
  description,
  checked,
  onChange,
  locked = false,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div className="space-y-1">
        <Label htmlFor={id} className="text-sm font-medium">
          {title}
          {locked ? (
            <Badge variant="secondary" className="ml-2 text-[10.5px]">
              Enforced
            </Badge>
          ) : null}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} disabled={locked} onCheckedChange={onChange} />
    </div>
  );
}
