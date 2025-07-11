// scripts/generate-guides.js

import fs from "fs"
import path from "path"

import "dotenv/config"

import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer"

import { Locales, locales } from "../i18n"
import { DocumentsHashTbl, getDocuments } from "../lib/contentful/user-guide"

const FOLDER_PATH = path.join(process.cwd(), "public/")
const OUTPUT_PATH = path.join(FOLDER_PATH, "documents.json")

function cleanContentForSearch(content: string): string {
  let cleanedContent = content

  cleanedContent = cleanedContent.replace(/```[\s\S]*?```/g, " ")
  cleanedContent = cleanedContent.replace(/`([^`]+)`/g, "$1")
  cleanedContent = cleanedContent.replace(/#{1,6}\s+(.+)/g, "$1")
  cleanedContent = cleanedContent
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")

  cleanedContent = cleanedContent.replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
  cleanedContent = cleanedContent.replace(/\|.*\|[\r\n]?/gm, (match) => {
    return match
      .split("|")
      .filter((cell) => cell.trim())
      .map((cell) => cell.trim())
      .join(" ")
  })

  cleanedContent = cleanedContent.replace(
    /<(?:Note|Card|Step|FileTree|Folder|File|Mermaid)[^>]*>([\s\S]*?)<\/(?:Note|Card|Step|FileTree|Folder|File|Mermaid)>/g,
    "$1"
  )

  cleanedContent = cleanedContent
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^\s*\[[x\s]\]\s+/gm, "")
    .replace(/^\s*>\s+/gm, "")

  cleanedContent = cleanedContent
    .replace(/[^\w\s-:]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim()

  return cleanedContent
}

async function generate() {
  let guides: Record<Locales, DocumentsHashTbl> = {
    "en-US": {},
    ja: {},
  }

  for (const locale of locales) {
    const { items } = await getDocuments({ locale })
    guides[locale] = items.reduce((acc, { content, ...item }) => {
      acc[item.id] = {
        ...item,
        content: documentToPlainTextString(content),
      }
      return acc
    }, {} as DocumentsHashTbl)
    console.log(`✅ guides.json generated in public/ for ${locale}`)
  }
  if (!fs.existsSync(FOLDER_PATH)) {
    fs.mkdirSync(FOLDER_PATH)
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(guides, null, 2))
}

generate().catch((err) => {
  console.error("❌ Failed to generate guides.json:", err)
  process.exit(1)
})
