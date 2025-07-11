import { typesafeI18nObject } from "typesafe-i18n"

export const locales = ["en-US", "ja"] as const
export const baseLocale: Locales = "ja"
export type Locales = (typeof locales)[number]

const translations = {
  "en-US": {
    documentation: "Documentation",
    docs: "Docs",
    welcome: "Welcome to the Signalize Console Documentation",
    welcome_description:
      "This site is your central guide to understanding, setting up, and using our platform effectively. You'll find what you need right here.",
    get_started: "Get Started",
    search: "Search",
    search_start_typing: "Start typing to search through our documentation",
    search_no_results: "No results found for {query}",
    search_loading: "Loading results for {query}",
    search_character_limit: "Please enter at least 3 characters.",
  },
  ja: {
    documentation: "ドキュメント",
    docs: "ドキュメント",
    welcome: "Signalize Consoleドキュメントへようこそ",
    welcome_description:
      "このサイトは、プラットフォームを効果的に理解し、セットアップし、使用するための中心的なガイドです。",
    get_started: "始めましょう",
    search: "検索",
    search_start_typing: "ドキュメントを検索するために入力を開始します",
    search_no_results: "{query}の結果は見つかりません",
    search_loading: "{query}の結果の読み込み結果",
    search_character_limit: "少なくとも3文字を入力してください。",
  },
} as const

const formatters = {
  /* ... */
}

export const useI18n = (locale: Locales) => {
  return typesafeI18nObject(locale, translations[locale], formatters)
}
