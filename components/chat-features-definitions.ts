import { Edit3, type LucideIcon } from "lucide-react";
import type { ToolName, UiToolName } from "@/lib/ai/types";

export type ToolDefinition = {
  name: string;
  description: string;
  icon: LucideIcon;
  key: ToolName;
  shortName: string;
};

export const toolDefinitions: Record<UiToolName, ToolDefinition> = {
  createDocument: {
    key: "createDocument",
    name: "Write or code",
    description: "Create documents, code, or run code in a sandbox.",
    icon: Edit3,
    shortName: "Write",
  },
};

export const enabledTools: UiToolName[] = ["createDocument"];
