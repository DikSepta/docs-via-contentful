import { notFound } from "next/navigation"
import { locales, Locales } from "@/i18n"
import documentJson from "@/public/documents.json"

import {
  Document,
  getDocuments,
  getTocFromDocumentContent,
} from "@/lib/contentful/user-guide"
import { Settings } from "@/lib/meta"
import { getBreadcrumbTitles, getSlugs } from "@/lib/pageroutes"
import { Separator } from "@/components/ui/separator"
import { Typography } from "@/components/ui/typography"
import RichText from "@/components/contentful/rich-text"
import { BackToTop } from "@/components/navigation/backtotop"
import Feedback from "@/components/navigation/feedback"
import PageBreadcrumb from "@/components/navigation/pagebreadcrumb"
import Toc from "@/components/navigation/toc"

type PageProps = {
  params: Promise<{ slug: string[]; lang: string }>
}

export default async function Pages({ params }: PageProps) {
  const { slug = [], lang } = await params
  const pathName = slug.join("/")

  const { items } = await getDocuments({
    locale: lang as Locales,
    slug: slug[slug.length - 1],
  })

  if (!items || items.length === 0) notFound()

  const document: Document = {
    id: items[0].id,
    title: items[0].title as string,
    slug: items[0].slug as string,
    content: items[0].content,
    parentDocId: items[0].parentDocId,
    menu_order: items[0].menu_order,
  }

  console.log("TOC content", {
    toc: getTocFromDocumentContent(document.content),
    documentContent: document.content,
  })

  return (
    <div className="flex items-start gap-14">
      <section className="flex-[3] pt-10">
        <PageBreadcrumb
          titles={getBreadcrumbTitles(document, documentJson[lang as Locales])}
          paths={slug}
        />
        <Typography>
          <h1 className="!mb-2 text-3xl !font-semibold">
            {document.title || ""}
          </h1>
          {/* <p className="-mt-4 text-sm">{Document.description}</p> */}
          <Separator className="my-6" />
          <section>
            <RichText content={document.content} />
          </section>
          {/* <Pagination pathname={pathName} /> */}
        </Typography>
      </section>

      {Settings.rightbar && (
        <aside
          className="toc sticky top-16 hidden h-[94.5vh] min-w-[230px] gap-3 py-8 xl:flex xl:flex-col"
          aria-label="Table of contents"
        >
          {Settings.toc && (
            <Toc tocs={getTocFromDocumentContent(document.content)} />
          )}
          {Settings.feedback && (
            <Feedback slug={pathName} title={document.title || ""} />
          )}
          {Settings.totop && (
            <BackToTop className="mt-6 self-start text-sm text-neutral-800 dark:text-neutral-300/85" />
          )}
        </aside>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug = [], lang } = await params

  const { items } = await getDocuments({
    locale: lang as Locales,
    slug: slug[slug.length - 1],
    select: ["fields.title"],
  })

  let title = ""
  try {
    title = String(items[0].title)
  } catch (error) {
    console.error(error)
  }

  return {
    title: `${title} - ${Settings.title}`,
    // description: Document.description,
    // keywords: Document.title || "",
    // ...(lastUpdated && {
    //   lastModified: new Date(lastUpdated).toISOString(),
    // }),
  }
}

export async function generateStaticParams() {
  const allParams = await Promise.all(
    locales.map(async (locale) => {
      try {
        const { items, hashTbl } = await getDocuments({
          locale,
          select: ["fields.title", "fields.slug", "fields.parentDoc"],
        })

        return items.map((item: any) => ({
          lang: locale,
          slug: getSlugs(item, hashTbl),
        }))
      } catch (error) {
        console.error(`Error processing locale ${locale}:`, error)
        return []
      }
    })
  )
  console.log("allParams", allParams.flat())

  return allParams.flat()
}
