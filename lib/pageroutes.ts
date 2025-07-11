import { baseLocale, Locales } from "@/i18n"
import documentJson from "@/public/documents.json"

import { Document, DocumentsHashTbl } from "./contentful/user-guide"

export type Paths =
  | {
      title: string
      href: string
      noLink?: true
      heading?: string
      items?: Paths[]
      childs?: string[]
    }
  | {
      spacer: true
    }

type Page = { title: string; href: string }

export function getSlugs(item: Document, items: DocumentsHashTbl): string[] {
  const slugs = [item.slug]
  if (!item.parentDocId) {
    return slugs
  }

  return [...getSlugs(items[item.parentDocId], items), ...slugs]
}

export function getSlugsString(
  item: Document,
  items: DocumentsHashTbl
): string {
  return getSlugs(item, items).join("/")
}

export function getBreadcrumbTitles(
  item: Document,
  items: DocumentsHashTbl
): string[] {
  const titles = [item.title]
  if (!item.parentDocId) {
    return titles
  }

  return [...getBreadcrumbTitles(items[item.parentDocId], items), ...titles]
}

export function getPageRoutesWithLocale(locale: Locales): Page[] {
  return Object.values(documentJson[locale]).map((it) => ({
    title: it.title,
    href: `/docs/${getSlugsString(it, documentJson[locale])}`,
  }))
}

export const PageRoutes: Page[] = getPageRoutesWithLocale(baseLocale)
