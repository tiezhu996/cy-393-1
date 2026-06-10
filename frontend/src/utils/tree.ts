import type { Edge } from "reactflow";
import type { MindMapNode } from "../types/mindmap";

export function subtreeIds(rootId: string, edges: Edge[]): string[] {
  const ids = new Set([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    edges.forEach((edge) => {
      if (ids.has(edge.source) && !ids.has(edge.target)) { ids.add(edge.target); changed = true; }
    });
  }
  return Array.from(ids);
}

export function toMarkdown(nodes: MindMapNode[], edges: Edge[]): string {
  const root = nodes.find((node) => !edges.some((edge) => edge.target === node.id)) ?? nodes[0];
  const lines: string[] = [];
  function walk(id: string, depth: number): void {
    const node = nodes.find((item) => item.id === id);
    if (!node) return;
    const icon: string = node.data.icon;
    const hasCustomIcon: boolean = icon !== "" && icon !== "•";
    const prefix: string = hasCustomIcon ? `${icon} ` : "";
    lines.push(`${"  ".repeat(depth)}- ${prefix}${node.data.label}`);
    edges.filter((edge) => edge.source === id).forEach((edge) => walk(edge.target, depth + 1));
  }
  if (root) walk(root.id, 0);
  return lines.join("\n");
}
