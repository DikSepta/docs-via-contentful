"use client"

import { useLocalePathname } from "@/i18n/navigation"

import {
  convertToDocumentWithChilds,
  DocumentsHashTbl,
  getRootDocuments,
} from "@/lib/contentful/user-guide"
import SubLink from "@/components/navigation/sublink"

export default function PageMenu({
  isSheet = false,
  documentsHashTbl,
}: {
  isSheet?: boolean
  documentsHashTbl: DocumentsHashTbl
}) {
  const { pathname } = useLocalePathname()
  if (!pathname.startsWith("/docs")) return null

  const documents = getRootDocuments(
    convertToDocumentWithChilds(documentsHashTbl)
  )

  return (
    <div className="mt-5 flex flex-col gap-3.5 pb-6">
      {documents.map((item, index) => {
        if ("spacer" in item) {
          return (
            <div key={`spacer-${index}`} className="my-2 mr-3">
              <hr className="border-t border-gray-300" />
            </div>
          )
        }
        return (
          <div key={item.title + index} className="mb-0.5">
            <SubLink
              {...{
                ...item,
                href: `/docs/${item.slug}`,
                level: 0,
                isSheet,
                childs: item.childIds,
                documentHashTbl: documentsHashTbl,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
