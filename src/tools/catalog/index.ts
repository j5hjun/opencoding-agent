import { listTool } from "./list";
import { searchTool } from "./search";
import { fetchTool } from "./fetch";

export const catalogTools = {
  "subagent-catalog:list": listTool,
  "subagent-catalog:search": searchTool,
  "subagent-catalog:fetch": fetchTool,
};
