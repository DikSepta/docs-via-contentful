import { Locales, locales, useI18n } from "@/i18n"
import { Link } from "lib/transition"

import { PageRoutes } from "@/lib/pageroutes"
import { buttonVariants } from "@/components/ui/button"

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const LL = useI18n(lang as Locales)

  return (
    <section className="flex min-h-[86.5vh] flex-col px-8 py-16 sm:px-24 md:max-w-1/2 md:px-16">
      <h5 className="text-muted-foreground mb-4 text-xl font-semibold">
        {LL.documentation()}
      </h5>
      <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{LL.welcome()}</h1>
      <p className="mb-4 text-lg">{LL.welcome_description()}</p>

      <div className="flex items-center gap-5">
        <Link
          href={`/${lang}${PageRoutes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          {LL.get_started()}
        </Link>
      </div>
    </section>
  )
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }))
}
