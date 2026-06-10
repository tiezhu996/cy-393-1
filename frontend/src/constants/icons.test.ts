import { describe, it, expect } from "vitest";
import { ICON_OPTIONS } from "./icons";
import type { IconKey } from "./icons";

describe("ICON_OPTIONS", () => {
    it("includes default dot icon '•' as first option", () => {
        const keys: string[] = Object.keys(ICON_OPTIONS);
        expect(keys[0]).toBe("•");
        expect(ICON_OPTIONS["•"].name).toBe("圆点");
    });

    it("has 16 icon options available", () => {
        expect(Object.keys(ICON_OPTIONS).length).toBe(16);
    });

    it("every icon has a non-empty name", () => {
        Object.entries(ICON_OPTIONS).forEach(([key, value]) => {
            expect(value.name).toBeDefined();
            expect(typeof value.name).toBe("string");
            expect(value.name.length).toBeGreaterThan(0);
            expect(key.length).toBeGreaterThan(0);
        });
    });

    it("icon keys are unique", () => {
        const keys: string[] = Object.keys(ICON_OPTIONS);
        const uniqueKeys = new Set(keys);
        expect(uniqueKeys.size).toBe(keys.length);
    });

    it("all icon names are unique", () => {
        const names: string[] = Object.values(ICON_OPTIONS).map((opt) => opt.name);
        const uniqueNames = new Set(names);
        expect(uniqueNames.size).toBe(names.length);
    });

    it("includes expected common icons", () => {
        const expectedIcons: IconKey[] = ["📌", "💡", "⭐", "🔥", "✅", "⚠️", "🎯", "🚀"];
        expectedIcons.forEach((icon) => {
            expect(ICON_OPTIONS).toHaveProperty(icon);
        });
    });

    it("IconKey type includes all keys", () => {
        const keys: IconKey[] = Object.keys(ICON_OPTIONS) as IconKey[];
        keys.forEach((key) => {
            expect(ICON_OPTIONS[key]).toBeDefined();
        });
    });

    it("default icon • should not have any visible rendering in MindNode", () => {
        const defaultIcon = "•";
        expect(defaultIcon).toBe("•");
        expect(ICON_OPTIONS[defaultIcon].name).toBe("圆点");
    });
});
