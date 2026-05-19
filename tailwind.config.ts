import type { Config } from "tailwindcss";

/**
 * Ryu Keiri デザイントークン
 * 値の正本: docs/DESIGN.md §A-5。色は globals.css の CSS 変数（R G B 三値）を参照し、
 * rgb(var(--x) / <alpha-value>) で不透明度ユーティリティ（例: bg-primary/10）に対応。
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "24px", // ページ横パディング（§A-5）
    },
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)", // アプリ背景 #F6F7F9
        surface: "rgb(var(--surface) / <alpha-value>)", // 面 #FFFFFF
        border: "rgb(var(--border) / <alpha-value>)", // 罫線 #E5E7EB
        input: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--primary) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)", // 本文 #111827
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)", // 弱い面 #F3F4F6
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)", // 補助テキスト #6B7280
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)", // #0F766E
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        sidebar: {
          DEFAULT: "rgb(var(--sidebar) / <alpha-value>)", // #24272E
          foreground: "rgb(var(--sidebar-foreground) / <alpha-value>)",
          active: "rgb(var(--sidebar-active) / <alpha-value>)", // #3A3D45
        },
        // ステータス色のみ意味を持たせる（§A-4 / 方針）
        success: "rgb(var(--success) / <alpha-value>)", // #16A34A
        warning: "rgb(var(--warning) / <alpha-value>)", // #D97706
        danger: "rgb(var(--danger) / <alpha-value>)", // #DC2626
        info: "rgb(var(--info) / <alpha-value>)", // #2563EB
      },
      borderRadius: {
        sm: "6px",
        md: "8px", // 入力・ボタン
        lg: "12px", // カード（§A-5）
        xl: "16px",
      },
      spacing: {
        // 8px グリッド補助トークン（§A-5）
        sidebar: "264px",
        "sidebar-collapsed": "72px",
        topbar: "56px",
        page: "24px",
        input: "40px",
        "table-row": "44px",
        "table-head": "40px",
        "drawer-sm": "420px",
        "drawer-md": "520px",
        "drawer-lg": "720px",
        "drawer-xl": "920px",
      },
      maxWidth: {
        // Drawer 幅（§A-5）。maxWidth は spacing スケールと別管理のため明示。
        "drawer-sm": "420px",
        "drawer-md": "520px",
        "drawer-lg": "720px",
        "drawer-xl": "920px",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        // 実務向け：本文 14px / テーブル 13px を基準
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["13px", { lineHeight: "18px" }],
        base: ["14px", { lineHeight: "20px" }],
        md: ["15px", { lineHeight: "22px" }],
        lg: ["16px", { lineHeight: "24px" }],
        xl: ["18px", { lineHeight: "26px" }],
        "2xl": ["20px", { lineHeight: "28px" }],
        "3xl": ["24px", { lineHeight: "32px" }],
      },
      boxShadow: {
        // 控えめな影（方針）
        card: "0 1px 2px 0 rgb(16 24 40 / 0.04), 0 1px 3px 0 rgb(16 24 40 / 0.06)",
        popover:
          "0 4px 12px -2px rgb(16 24 40 / 0.10), 0 1px 3px 0 rgb(16 24 40 / 0.06)",
        drawer: "-8px 0 28px -6px rgb(16 24 40 / 0.14)",
      },
      keyframes: {
        "overlay-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "overlay-out": { from: { opacity: "1" }, to: { opacity: "0" } },
        "drawer-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "drawer-out": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        "overlay-in": "overlay-in 180ms ease-out",
        "overlay-out": "overlay-out 150ms ease-in",
        "drawer-in": "drawer-in 220ms cubic-bezier(0.32,0.72,0,1)",
        "drawer-out": "drawer-out 180ms ease-in",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
