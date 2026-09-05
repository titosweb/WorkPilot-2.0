import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import {
  generate,
  RunError,
  type RunPayload,
  type RunResult,
  type RunState,
} from "@/lib/ai-runtime";
import type { ModulePromptId } from "@/lib/prompts";

/**
 * Owns the lifecycle of one AI module surface: idle → loading → success | error,
 * plus the editable copy of the output and the copy / regenerate / clear actions.
 * Output comes from a live model call scoped by the module's system prompt.
 */

export function useModuleRun(moduleId: ModulePromptId) {
  const [state, setState] = useState<RunState>("idle");
  const [result, setResult] = useState<RunResult | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState(false);
  const lastPayload = useRef<RunPayload | null>(null);
  const controller = useRef<AbortController | null>(null);

  const run = useCallback(
    async (payload: RunPayload) => {
      lastPayload.current = payload;
      controller.current?.abort();
      const ac = new AbortController();
      controller.current = ac;
      setState("loading");
      setError(null);
      try {
        const next = await generate(moduleId, payload, { signal: ac.signal });
        setResult(next);
        setDraft(next.text);
        setEdited(false);
        setState("success");
      } catch (e) {
        if (e instanceof RunError && !e.recoverable) {
          setState(result ? "success" : "idle");
          return;
        }
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
        setState("error");
      }
    },
    [moduleId, result],
  );

  const regenerate = useCallback(() => {
    if (!lastPayload.current) return;
    void run(lastPayload.current);
  }, [run]);

  const clear = useCallback(() => {
    controller.current?.abort();
    setState("idle");
    setResult(null);
    setDraft("");
    setError(null);
    setEdited(false);
  }, []);

  const updateDraft = useCallback((value: string) => {
    setDraft(value);
    setEdited(true);
  }, []);

  const copy = useCallback(async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      toast.success("Copied to clipboard", {
        description: "Review the content before sending or sharing it.",
      });
    } catch {
      toast.error("Couldn't access the clipboard", {
        description: "Select the text and copy it manually.",
      });
    }
  }, [draft]);

  return {
    state,
    result,
    draft,
    error,
    edited,
    run,
    regenerate,
    clear,
    copy,
    updateDraft,
  };
}
