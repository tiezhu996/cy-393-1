import type { NodeProps } from "reactflow";
import type { NodeData } from "../../types/mindmap";

export function MindNode({ data, selected }: NodeProps<NodeData>) {
  const isDefaultIcon: boolean = data.icon === "•";
  return <div className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 shadow-sm ${selected ? "ring-2 ring-blue-500" : ""}`} style={{ background: data.bg, color: data.color }}>
    {!isDefaultIcon && <span className="text-base leading-none">{data.icon}</span>}
    <span>{data.label}</span>
  </div>;
}
