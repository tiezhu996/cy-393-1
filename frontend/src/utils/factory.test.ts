import { describe, it, expect } from "vitest";
import { createNode, defaultFile } from "./factory";
import { ICON_OPTIONS } from "../constants/icons";

describe("factory functions", () => {
    describe("createNode", () => {
        it("creates node with default icon •", () => {
            const node = createNode("测试节点", 100, 200);
            expect(node.data.label).toBe("测试节点");
            expect(node.data.icon).toBe("•");
            expect(node.data.collapsed).toBe(false);
            expect(node.position.x).toBe(100);
            expect(node.position.y).toBe(200);
            expect(node.type).toBe("default");
            expect(node.id).toBeDefined();
            expect(typeof node.id).toBe("string");
            expect(node.id.length).toBeGreaterThan(0);
        });

        it("generates unique ids for different nodes", () => {
            const node1 = createNode("节点1", 0, 0);
            const node2 = createNode("节点2", 0, 0);
            expect(node1.id).not.toBe(node2.id);
        });

        it("creates node with valid icon from ICON_OPTIONS", () => {
            const node = createNode("测试", 0, 0);
            expect(Object.keys(ICON_OPTIONS)).toContain(node.data.icon);
        });
    });

    describe("defaultFile", () => {
        it("creates file with default theme 'business'", () => {
            const file = defaultFile();
            expect(file.theme).toBe("business");
            expect(file.name).toBe("未命名导图");
            expect(file.nodes.length).toBe(2);
            expect(file.edges.length).toBe(1);
        });

        it("creates root and child nodes with default icon •", () => {
            const file = defaultFile();
            expect(file.nodes[0].data.icon).toBe("•");
            expect(file.nodes[1].data.icon).toBe("•");
            expect(file.nodes[0].data.label).toBe("中心主题");
            expect(file.nodes[1].data.label).toBe("第一分支");
        });

        it("creates edge connecting root to child", () => {
            const file = defaultFile();
            const root = file.nodes[0];
            const child = file.nodes[1];
            const edge = file.edges[0];
            expect(edge.source).toBe(root.id);
            expect(edge.target).toBe(child.id);
            expect(edge.animated).toBe(true);
        });

        it("generates unique file id", () => {
            const file1 = defaultFile();
            const file2 = defaultFile();
            expect(file1.id).not.toBe(file2.id);
        });

        it("sets updatedAt to a valid ISO string", () => {
            const before = new Date().toISOString();
            const file = defaultFile();
            const after = new Date().toISOString();
            expect(file.updatedAt >= before && file.updatedAt <= after).toBe(true);
            expect(() => new Date(file.updatedAt)).not.toThrow();
        });
    });
});
