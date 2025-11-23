import type { ModelId } from "@airegistry/vercel-gateway";
import type { FileUIPart, ModelMessage } from "ai";
import { createDocumentTool } from "@/lib/ai/tools/create-document";
import { getHnComments } from "@/lib/ai/tools/get-hn-comments";
import { readDocument } from "@/lib/ai/tools/read-document";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { updateDocument } from "@/lib/ai/tools/update-document";
import type { Session } from "@/lib/auth";
import type { StreamWriter } from "../types";

export function getTools({
  dataStream,
  session,
  messageId,
  selectedModel,
  contextForLLM,
}: {
  dataStream: StreamWriter;
  session: Session;
  messageId: string;
  selectedModel: ModelId;
  attachments: FileUIPart[];
  lastGeneratedImage: { imageUrl: string; name: string } | null;
  contextForLLM: ModelMessage[];
}) {
  return {
    getHnComments,
    createDocument: createDocumentTool({
      session,
      dataStream,
      contextForLLM,
      messageId,
      selectedModel,
    }),
    updateDocument: updateDocument({
      session,
      dataStream,
      messageId,
      selectedModel,
    }),
    requestSuggestions: requestSuggestions({
      session,
      dataStream,
    }),
    readDocument: readDocument({
      session,
      dataStream,
    }),
  };
}
