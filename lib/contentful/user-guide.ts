import { Locales } from "@/i18n"
import { EntrySelectFilterWithFields } from "contentful"
import { snakeCase } from "lodash"

import { client } from "./client"

export type ContentfulDocument = {
  title: string
  slug: string
  content: any
  parentDoc: any
  menu_order: number
}

export type Document = {
  id: string
  title: string
  slug: string
  content: any
  menu_order: number
  parentDocId?: string
}

export type DocumentWithChilds = Document & {
  childIds: string[]
}

export type DocumentsHashTbl = Record<string, Document>

export const getDocuments = async ({
  locale,
  select,
  slug,
}: {
  locale: Locales
  slug?: string
} & EntrySelectFilterWithFields<ContentfulDocument>): Promise<{
  hashTbl: DocumentsHashTbl
  items: Document[]
}> => {
  try {
    const data = await client.getEntries({
      content_type: "userGuide",
      locale,
      select,
      order: ["fields.menu_order"],
      ...(slug && { "fields.slug": slug }),
    })

    const hashedItems: DocumentsHashTbl = {}
    const items: Document[] = []
    data.items.forEach((item) => {
      const result: Document = {
        id: item.sys.id,
        title: (item.fields.title as string) || "",
        slug: (item.fields.slug as string) || "",
        content: item.fields.content,
        parentDocId: (item.fields.parentDoc as any)?.sys.id,
        menu_order: item.fields.menu_order as number,
      }
      hashedItems[item.sys.id] = result
      items.push(result)
    })

    return { hashTbl: hashedItems, items }
  } catch (error) {
    console.error(error)
    return { hashTbl: {}, items: [] }
  }
}

export function convertToDocumentWithChilds(
  DocumentHashTbl: DocumentsHashTbl
): Record<string, DocumentWithChilds> {
  const result: Record<string, DocumentWithChilds> = {}

  // First, initialize the result with all guides and empty childDocId arrays
  for (const [id, guide] of Object.entries(DocumentHashTbl)) {
    result[id] = {
      ...guide,
      childIds: [],
    }
  }

  // Then, populate the childIds arrays
  for (const guide of Object.values(DocumentHashTbl)) {
    const parentId = guide.parentDocId
    if (parentId && result[parentId]) {
      result[parentId].childIds.push(guide.id)
    }
  }

  return result
}

export function getRootDocuments(
  documents: Record<string, DocumentWithChilds>
): DocumentWithChilds[] {
  return Object.values(documents).filter((document) => !document.parentDocId)
}

export function getPreviousNext(
  currentDoc: DocumentWithChilds,
  documents: Record<string, DocumentWithChilds>
): { prev: DocumentWithChilds | null; next: DocumentWithChilds | null } {
  const rootDocuments = getRootDocuments(documents)
  const currentIndex = rootDocuments.findIndex(
    (doc) => doc.id === currentDoc.id
  )

  const prev = currentIndex > 0 ? rootDocuments[currentIndex - 1] : null
  const next =
    currentIndex < rootDocuments.length - 1
      ? rootDocuments[currentIndex + 1]
      : null

  return { prev, next }
}

type TOCItem = {
  href: string
  level: number
  text: string
}

export function extractText(content: any[]): string {
  return content
    .map((node) => {
      if (node.nodeType === "text") {
        return node.value
      } else if (node.content) {
        return extractText(node.content)
      } else {
        return ""
      }
    })
    .join("")
    .trim()
}

export function getTocFromDocumentContent(content: any): TOCItem[] {
  const toc: TOCItem[] = []

  function walk(nodes: any[]) {
    for (const node of nodes) {
      if (node.nodeType?.startsWith("heading-")) {
        const level = parseInt(node.nodeType.split("-")[1], 10)
        const text = extractText(node.content || [])
        const id = snakeCase(text)

        toc.push({
          href: `#${id}`,
          level,
          text,
        })
      }

      if (node.content && Array.isArray(node.content)) {
        walk(node.content)
      }
    }
  }

  walk(content.content || [])
  return toc
}
