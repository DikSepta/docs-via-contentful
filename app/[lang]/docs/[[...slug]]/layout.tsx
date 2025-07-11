import { Locales } from "@/i18n"

import { getDocuments } from "@/lib/contentful/user-guide"
import { Sidebar } from "@/components/navigation/sidebar"

export default async function Documents({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params

  const { hashTbl: DocumentsHashTbl } = await getDocuments({
    locale: lang as Locales,
    select: ["fields.title", "fields.slug", "fields.parentDoc"],
  })

  return (
    <div className="flex items-start gap-14">
      <Sidebar documentsHashTbl={DocumentsHashTbl} />
      <div className="flex-1 px-4 md:flex-[6] md:px-0">{children}</div>
    </div>
  )
}
