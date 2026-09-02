import { Braces } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MODULE_PROMPTS, type ModulePromptId } from "@/lib/prompts";

/**
 * Transparency surface: shows the exact system prompt that governs this module,
 * so reviewers can audit behaviour before a live model is connected.
 */
export function PromptInspector({ moduleId }: { moduleId: ModulePromptId }) {
  const prompt = MODULE_PROMPTS[moduleId];

  return (
    <Collapsible className="rounded-xl border border-border bg-card shadow-card">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto w-full justify-between gap-3 px-4 py-3.5 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Braces aria-hidden="true" className="size-4 text-muted-foreground" />
            System prompt for this module
          </span>
          <Badge variant="secondary" className="font-mono text-[11px]">
            {prompt.version}
          </Badge>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 border-t border-border px-4 py-4">
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
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
