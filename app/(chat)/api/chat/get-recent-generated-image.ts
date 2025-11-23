import type { ChatMessage } from "@/lib/ai/types";

export function getRecentGeneratedImage(
  _messages: ChatMessage[]
): { imageUrl: string; name: string } | null {
  return null;
}
