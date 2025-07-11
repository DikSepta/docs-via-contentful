import type { MetadataRoute } from "next"
import { locales } from "@/i18n"

import { Settings } from "@/lib/meta"
import { getPageRoutesWithLocale, PageRoutes } from "@/lib/pageroutes"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  let sitemap: MetadataRoute.Sitemap = []

  locales.forEach((locale) => {
    const result = getPageRoutesWithLocale(locale).map((page) => ({
      url: `${Settings.metadataBase}/${locale}${page.href}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.8 as const,
    }))
    sitemap.push(...result)
  })
  return sitemap
}
