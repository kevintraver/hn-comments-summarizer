import type {
  InferUITool,
  LanguageModelUsage,
  UIMessage,
  UIMessageStreamWriter,
} from "ai";
import { z } from "zod";
import type { getHnComments } from "@/lib/ai/tools/get-hn-comments";
import type { readDocument } from "@/lib/ai/tools/read-document";
import type { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import type { updateDocument } from "@/lib/ai/tools/update-document";
import type { Suggestion } from "@/lib/db/schema";
import type { ArtifactKind } from "../artifacts/artifact-kind";
import type { AppModelId } from "./app-models";
import type { createDocumentTool as createDocument } from "./tools/create-document";
import type { ResearchUpdate } from "./tools/research-updates-schema";

export const toolNameSchema = z.enum([
  "createDocument",
  "updateDocument",
  "requestSuggestions",
  "readDocument",
  "getHnComments",
]);

const _ = toolNameSchema.options satisfies ToolName[];

type ToolNameInternal = z.infer<typeof toolNameSchema>;

export const frontendToolsSchema = z.enum(["createDocument"]);

const __ = frontendToolsSchema.options satisfies ToolNameInternal[];

export type UiToolName = z.infer<typeof frontendToolsSchema>;
export const messageMetadataSchema = z.object({
  createdAt: z.date(),
  parentMessageId: z.string().nullable(),
  selectedModel: z.custom<AppModelId>((val) => typeof val === "string"),
  isPartial: z.boolean().optional(),
  selectedTool: frontendToolsSchema.optional(),
  usage: z.custom<LanguageModelUsage | undefined>((_val) => true).optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type createDocumentTool = InferUITool<ReturnType<typeof createDocument>>;
type updateDocumentTool = InferUITool<ReturnType<typeof updateDocument>>;
type requestSuggestionsTool = InferUITool<
  ReturnType<typeof requestSuggestions>
>;
type readDocumentTool = InferUITool<ReturnType<typeof readDocument>>;
type getHnCommentsTool = InferUITool<typeof getHnComments>;

export type ChatTools = {
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  requestSuggestions: requestSuggestionsTool;
  readDocument: readDocumentTool;
  getHnComments: getHnCommentsTool;
};

type FollowupSuggestions = {
  suggestions: string[];
};

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  messageId: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
  researchUpdate: ResearchUpdate;
  followupSuggestions: FollowupSuggestions;
};

export type ChatMessage = Omit<
  UIMessage<MessageMetadata, CustomUIDataTypes, ChatTools>,
  "metadata"
> & {
  metadata: MessageMetadata;
};

export type ToolName = keyof ChatTools;

export type StreamWriter = UIMessageStreamWriter<ChatMessage>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};
