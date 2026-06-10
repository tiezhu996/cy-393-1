export const ICON_OPTIONS = {
    "•": { name: "圆点" },
    "📌": { name: "图钉" },
    "💡": { name: "灵感" },
    "⭐": { name: "收藏" },
    "🔥": { name: "重点" },
    "✅": { name: "完成" },
    "❓": { name: "疑问" },
    "⚠️": { name: "警告" },
    "🎯": { name: "目标" },
    "📝": { name: "笔记" },
    "🚀": { name: "进展" },
    "🔧": { name: "工具" },
    "💬": { name: "讨论" },
    "❤️": { name: "重要" },
    "🔑": { name: "关键" },
    "📦": { name: "资源" },
} as const;

export type IconKey = keyof typeof ICON_OPTIONS;
