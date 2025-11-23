"use client";

import { useChatStoreApi } from "@ai-sdk-tools/store";
import { memo } from "react";
import type { ChatMessage } from "@/lib/ai/types";
import {
  useMessagePartByPartIdx,
  useMessagePartTypesById,
} from "@/lib/stores/hooks-message-parts";
import { isLastArtifact } from "./is-last-artifact";
import { DocumentToolResult } from "./part/document-common";
import { DocumentPreview } from "./part/document-preview";
import { MessageReasoning } from "./part/message-reasoning";
import { ReadDocument } from "./part/read-document";
import { RequestSuggestionsMessage } from "./part/request-suggestions-message";
import { TextMessagePart } from "./part/text-message-part";
import { UpdateDocumentMessage } from "./part/update-document-message";

type MessagePartsProps = {
  messageId: string;
  isLoading: boolean;
  isReadonly: boolean;
};

// Render a single part by index with minimal subscriptions
function PureMessagePart({
  messageId,
  partIdx,
  isReadonly,
}: {
  messageId: string;
  partIdx: number;
  isReadonly: boolean;
}) {
  const part = useMessagePartByPartIdx(messageId, partIdx);
  const { type } = part;
  const chatStore = useChatStoreApi<ChatMessage>();

  if (type === "tool-createDocument") {
    const { toolCallId, state } = part;
    if (state === "input-available") {
      const { input } = part;
      return (
        <div key={toolCallId}>
          <DocumentPreview
            args={input}
            isReadonly={isReadonly}
            messageId={messageId}
          />
        </div>
      );
    }

    if (state === "output-available") {
      const { output, input } = part;
      const shouldShowFullPreview = isLastArtifact(
        chatStore.getState().getInternalMessages(),
        toolCallId
      );

      if ("error" in output) {
        return (
          <div className="rounded border p-2 text-red-500" key={toolCallId}>
            Error: {String(output.error)}
          </div>
        );
      }

      return (
        <div key={toolCallId}>
          {shouldShowFullPreview ? (
            <DocumentPreview
              args={input}
              isReadonly={isReadonly}
              messageId={messageId}
              result={output}
              type="create"
            />
          ) : (
            <DocumentToolResult
              isReadonly={isReadonly}
              messageId={messageId}
              result={output}
              type="create"
            />
          )}
        </div>
      );
    }
  }

  if (part.type === "tool-updateDocument") {
    return (
      <UpdateDocumentMessage
        isReadonly={isReadonly}
        key={part.toolCallId}
        messageId={messageId}
        tool={part}
      />
    );
  }

  if (part.type === "tool-requestSuggestions") {
    return (
      <RequestSuggestionsMessage
        isReadonly={isReadonly}
        key={part.toolCallId}
        messageId={messageId}
        tool={part}
      />
    );
  }

  if (part.type === "tool-readDocument") {
    return <ReadDocument key={part.toolCallId} tool={part} />;
  }

  return null;
}

const MessagePart = memo(PureMessagePart);

// Render a single reasoning part by index
function PureReasoningPart({
  messageId,
  isLoading,
  partIdx,
}: {
  messageId: string;
  isLoading: boolean;
  partIdx: number;
}) {
  const part = useMessagePartByPartIdx(messageId, partIdx);
  if (part.type !== "reasoning") {
    return null;
  }

  return <MessageReasoning content={part.text} isLoading={isLoading} />;
}

const ReasoningPart = memo(PureReasoningPart);

export function PureMessageParts({
  messageId,
  isLoading,
  isReadonly,
}: MessagePartsProps) {
  const types = useMessagePartTypesById(messageId);

  return types.map((t, i) => {
    if (t === "reasoning") {
      const key = `message-${messageId}-reasoning-${i}`;
      const isLast = i === types.length - 1;
      return (
        <ReasoningPart
          isLoading={isLoading && isLast}
          key={key}
          messageId={messageId}
          partIdx={i}
        />
      );
    }

    if (t === "text") {
      const key = `message-${messageId}-text-${i}`;
      return <TextMessagePart key={key} messageId={messageId} partIdx={i} />;
    }

    const key = `message-${messageId}-part-${i}-${t}`;
    return (
      <MessagePart
        isReadonly={isReadonly}
        key={key}
        messageId={messageId}
        partIdx={i}
      />
    );
  });
}

export const MessageParts = memo(PureMessageParts);
