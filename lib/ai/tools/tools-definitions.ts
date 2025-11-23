import { type ToolName, toolNameSchema } from "../types";

export const toolsDefinitions: Record<ToolName, ToolDefinition> = {
  createDocument: {
    name: "createDocument",
    description: "Create a new document",
    cost: 5,
  },
  updateDocument: {
    name: "updateDocument",
    description: "Update a document",
    cost: 5,
  },
  requestSuggestions: {
    name: "requestSuggestions",
    description: "Request suggestions for a document",
    cost: 1,
  },
  readDocument: {
    name: "readDocument",
    description: "Read the content of a document",
    cost: 1,
  },
  getHnComments: {
    name: "getHnComments",
    description: "Fetch Hacker News comments for a given item ID or URL",
    cost: 1,
  },
};

export const allTools = toolNameSchema.options;
export type ToolDefinition = {
  name: string;
  description: string;
  cost: number;
};
