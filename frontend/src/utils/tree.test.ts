import { describe, it, expect } from "vitest";
import type { Edge } from "reactflow";
import { subtreeIds, toMarkdown } from "./tree";
import type { MindMapNode } from "../types/mindmap";

function makeNode(id: string, label: string, icon: string = "•"): MindMapNode {
    return {
        id,
        type: "default",
        position: { x: 0, y: 0 },
        data: { label, icon, collapsed: false },
    };
}

describe("tree utilities", () => {
    describe("subtreeIds", () => {
        it("returns single id when node has no children", () => {
            const edges: Edge[] = [];
            expect(subtreeIds("a", edges)).toEqual(["a"]);
        });

        it("returns all descendant ids in a chain", () => {
            const edges: Edge[] = [
                { id: "1", source: "a", target: "b" },
                { id: "2", source: "b", target: "c" },
                { id: "3", source: "c", target: "d" },
            ];
            expect(subtreeIds("a", edges)).toEqual(["a", "b", "c", "d"]);
        });

        it("returns only the subtree starting from given id", () => {
            const edges: Edge[] = [
                { id: "1", source: "a", target: "b" },
                { id: "2", source: "a", target: "c" },
                { id: "3", source: "b", target: "d" },
            ];
            const result = subtreeIds("b", edges);
            expect(result).toContain("b");
            expect(result).toContain("d");
            expect(result).not.toContain("a");
            expect(result).not.toContain("c");
        });

        it("handles multiple children at same level", () => {
            const edges: Edge[] = [
                { id: "1", source: "a", target: "b" },
                { id: "2", source: "a", target: "c" },
                { id: "3", source: "a", target: "d" },
            ];
            const result = subtreeIds("a", edges);
            expect(result).toEqual(expect.arrayContaining(["a", "b", "c", "d"]));
            expect(result.length).toBe(4);
        });
    });

    describe("toMarkdown", () => {
        it("returns empty string when no nodes provided", () => {
            expect(toMarkdown([], [])).toBe("");
        });

        it("exports single root node with default icon", () => {
            const nodes: MindMapNode[] = [makeNode("a", "中心主题", "•")];
            const edges: Edge[] = [];
            const result = toMarkdown(nodes, edges);
            expect(result).toBe("- 中心主题");
            expect(result).not.toContain("•");
        });

        it("exports single root node with custom icon", () => {
            const nodes: MindMapNode[] = [makeNode("a", "中心主题", "📌")];
            const edges: Edge[] = [];
            const result = toMarkdown(nodes, edges);
            expect(result).toBe("- 📌 中心主题");
            expect(result).toContain("📌");
        });

        it("omits default icon • from markdown output", () => {
            const nodes: MindMapNode[] = [
                makeNode("a", "中心主题", "•"),
                makeNode("b", "第一分支", "•"),
            ];
            const edges: Edge[] = [{ id: "1", source: "a", target: "b" }];
            const result = toMarkdown(nodes, edges);
            expect(result).toBe("- 中心主题\n  - 第一分支");
            expect(result).not.toContain("•");
        });

        it("preserves custom emoji icons in markdown", () => {
            const nodes: MindMapNode[] = [
                makeNode("a", "中心主题", "📌"),
                makeNode("b", "灵感记录", "💡"),
                makeNode("c", "重要事项", "🔥"),
            ];
            const edges: Edge[] = [
                { id: "1", source: "a", target: "b" },
                { id: "2", source: "a", target: "c" },
            ];
            const result = toMarkdown(nodes, edges);
            expect(result).toContain("- 📌 中心主题");
            expect(result).toContain("  - 💡 灵感记录");
            expect(result).toContain("  - 🔥 重要事项");
        });

        it("handles mixed default and custom icons", () => {
            const nodes: MindMapNode[] = [
                makeNode("a", "中心主题", "📌"),
                makeNode("b", "普通分支", "•"),
                makeNode("c", "重点分支", "⭐"),
                makeNode("d", "待办分支", "•"),
            ];
            const edges: Edge[] = [
                { id: "1", source: "a", target: "b" },
                { id: "2", source: "a", target: "c" },
                { id: "3", source: "a", target: "d" },
            ];
            const result = toMarkdown(nodes, edges);
            expect(result).toContain("- 📌 中心主题");
            expect(result).toContain("  - 普通分支");
            expect(result).toContain("  - ⭐ 重点分支");
            expect(result).toContain("  - 待办分支");
        });

        it("handles deeply nested nodes with various icons", () => {
            const nodes: MindMapNode[] = [
                makeNode("a", "项目规划", "🎯"),
                makeNode("b", "需求分析", "📝"),
                makeNode("c", "技术选型", "🔧"),
                makeNode("d", "React", "•"),
                makeNode("e", "TypeScript", "✅"),
            ];
            const edges: Edge[] = [
                { id: "1", source: "a", target: "b" },
                { id: "2", source: "a", target: "c" },
                { id: "3", source: "c", target: "d" },
                { id: "4", source: "c", target: "e" },
            ];
            const result = toMarkdown(nodes, edges);
            expect(result).toContain("- 🎯 项目规划");
            expect(result).toContain("  - 📝 需求分析");
            expect(result).toContain("  - 🔧 技术选型");
            expect(result).toContain("    - React");
            expect(result).toContain("    - ✅ TypeScript");
        });

        it("treats empty string icon as default (no icon in output)", () => {
            const nodes: MindMapNode[] = [makeNode("a", "测试节点", "")];
            const edges: Edge[] = [];
            const result = toMarkdown(nodes, edges);
            expect(result).toBe("- 测试节点");
            expect(result).not.toContain("  ");
            expect(result.startsWith("- ")).toBe(true);
            expect(result.endsWith("测试节点")).toBe(true);
        });

        it("uses first node as root when no explicit root exists", () => {
            const nodes: MindMapNode[] = [
                makeNode("a", "孤立节点", "⚠️"),
                makeNode("b", "另一个节点", "💬"),
            ];
            const edges: Edge[] = [];
            const result = toMarkdown(nodes, edges);
            expect(result).toBe("- ⚠️ 孤立节点");
        });

        it("handles complex tree structure with all icon types", () => {
            const nodes: MindMapNode[] = [
                makeNode("root", "产品路线图", "🚀"),
                makeNode("q1", "Q1 目标", "📌"),
                makeNode("q2", "Q2 目标", "📌"),
                makeNode("feat1", "用户系统", "⭐"),
                makeNode("feat2", "支付系统", "🔑"),
                makeNode("feat3", "数据分析", "�"),
                makeNode("bug", "性能优化", "⚠️"),
                makeNode("done", "已完成项", "✅"),
            ];
            const edges: Edge[] = [
                { id: "1", source: "root", target: "q1" },
                { id: "2", source: "root", target: "q2" },
                { id: "3", source: "q1", target: "feat1" },
                { id: "4", source: "q1", target: "feat2" },
                { id: "5", source: "q1", target: "done" },
                { id: "6", source: "q2", target: "feat3" },
                { id: "7", source: "q2", target: "bug" },
            ];
            const result = toMarkdown(nodes, edges);
            const expected = [
                "- 🚀 产品路线图",
                "  - 📌 Q1 目标",
                "    - ⭐ 用户系统",
                "    - 🔑 支付系统",
                "    - ✅ 已完成项",
                "  - 📌 Q2 目标",
                "    - � 数据分析",
                "    - ⚠️ 性能优化",
            ].join("\n");
            expect(result).toBe(expected);
        });
    });
});
