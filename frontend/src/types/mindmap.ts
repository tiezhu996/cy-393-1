import type { Edge, Node } from "reactflow";

export interface NodeData {
  label: string;
  icon: string;
  collapsed: boolean;
  bg?: string;
  color?: string;
}

export type MindMapNode = Node<NodeData>;

export interface MindMapFile {
  id: string;
  name: string;
  updatedAt: string;
  nodes: MindMapNode[];
  edges: Edge[];
  theme: string;
}
