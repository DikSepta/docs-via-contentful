import { baseLocale, Locales } from "@/i18n"
import documentJson from "@/public/documents.json"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { getSlugsString } from "@/lib/pageroutes"

import { DocumentsHashTbl } from "./contentful/user-guide"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type SearchMatch = {
  foundMatch: boolean
  type: "title" | "content"
  index: number
  foundString: string
}

export type SearchResult = {
  title: string
  href: string
  snippet?: string
  description?: string
  relevance?: {
    score: number
    searchResult: SearchMatch
  }
}

function calculateRelevance(
  query: string,
  title: string,
  content: string
): {
  score: number
  searchResult: SearchMatch
} {
  const lowerQuery = query.toLowerCase().trim()
  const lowerTitle = title.toLowerCase()
  const queryWords = lowerQuery.split(/\s+/)
  let searchResult: SearchMatch = {
    foundMatch: false,
    type: "title",
    index: 0,
    foundString: "",
  }

  function setSearchResult(
    type: "title" | "content",
    foundString: string,
    index: number
  ) {
    if (searchResult.foundMatch) return
    searchResult = {
      foundMatch: true,
      foundString,
      type,
      index,
    }
  }

  let score = 0

  if (lowerTitle === lowerQuery) {
    score += 50
    setSearchResult("title", lowerQuery, 0)
  } else if (lowerTitle.includes(lowerQuery)) {
    score += 30
    setSearchResult("title", lowerQuery, lowerTitle.indexOf(lowerQuery))
  }

  const foundExactMatchIndex = content.toLowerCase().indexOf(lowerQuery)
  if (foundExactMatchIndex !== -1) {
    setSearchResult("content", lowerQuery, foundExactMatchIndex)
    score += 50
  }

  queryWords.forEach((word) => {
    const foundIndex = lowerTitle.indexOf(word)
    if (foundIndex !== -1) {
      setSearchResult("title", word, foundIndex)
      score += 15
    }
  })

  queryWords.forEach((word) => {
    const foundIndex = content.toLowerCase().indexOf(word)
    if (foundIndex !== -1) {
      setSearchResult("content", word, foundIndex)
      score += 5
    }
  })

  return { score: score / Math.log(content.length + 1), searchResult }
}

function extractSnippet(
  content: string,
  query: string,
  searchResult: SearchMatch
): string {
  if (searchResult.index === 0 || searchResult.type === "title") {
    return content.slice(0, 160)
  }

  const snippetLength = 160
  const contextLength = Math.floor((snippetLength - query.length) / 2)
  const start = Math.max(0, searchResult.index - contextLength)
  const end = Math.min(searchResult.index + contextLength, content.length)

  let snippet = content.slice(start, end)
  if (start > 0) snippet = `...${snippet}`
  if (end < content.length) snippet += "..."

  return snippet
}

export function advanceSearch(query: string, locale: Locales = baseLocale) {
  const lowerQuery = query.toLowerCase().trim()
  const queryWords = lowerQuery.split(/\s+/).filter((word) => word.length >= 3)

  if (queryWords.length === 0) return []

  const documents = documentJson[locale] as DocumentsHashTbl
  const chunks = chunkArray(Object.values(documents), 100)

  const results = chunks.flatMap((chunk) =>
    chunk
      .map((doc) => {
        const relevanceScore = calculateRelevance(
          queryWords.join(" "),
          doc.title,
          doc.content
        )

        const snippet = extractSnippet(
          doc.content,
          lowerQuery,
          relevanceScore.searchResult
        )
        const highlightedSnippet = highlight(snippet, queryWords.join(" "))

        return {
          title: doc.title,
          href: `/${getSlugsString(doc, documents)}`,
          snippet: highlightedSnippet,
          relevance: relevanceScore,
        }
      })
      .filter(
        (doc) =>
          doc.relevance.score > 0 && doc.relevance.searchResult.foundMatch
      )
      .sort((a, b) => b.relevance.score - a.relevance.score)
  )

  return results.slice(0, 10)
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

function formatDateHelper(
  dateStr: string,
  options: Intl.DateTimeFormatOptions
): string {
  const [day, month, year] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("en-US", options)
}

export function formatDate(dateStr: string): string {
  return formatDateHelper(dateStr, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDate2(dateStr: string): string {
  return formatDateHelper(dateStr, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function stringToDate(date: string) {
  const [day, month, year] = date.split("-").map(Number)
  return new Date(year, month - 1, day)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null
  let rafId: number | null = null
  let lastCallTime: number | null = null

  const later = (time: number) => {
    const remaining = wait - (time - (lastCallTime || 0))
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
      func(...(lastArgs as Parameters<T>))
      lastArgs = null
      lastCallTime = null
    } else {
      rafId = requestAnimationFrame(later)
    }
  }

  return (...args: Parameters<T>) => {
    lastArgs = args
    lastCallTime = performance.now()
    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      rafId = requestAnimationFrame(later)
    }, wait)
    if (callNow) func(...args)
  }
}

export function highlight(snippet: string, searchTerms: string): string {
  if (!snippet || !searchTerms) return snippet

  const terms = searchTerms
    .split(/\s+/)
    .filter((term) => term.trim().length > 0)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

  if (terms.length === 0) return snippet

  const regex = new RegExp(`(${terms.join("|")})`, "gi")
  return snippet.replace(regex, "<span class='highlight'>$1</span>")
}
