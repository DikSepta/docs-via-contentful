import { usePathname } from "next/navigation"

import { Locales } from "."

export function useLocalePathname() {
  const pathname = usePathname()
  const locale = pathname.split("/")[1] as Locales

  const actualPathname = pathname.replace(`/${locale}`, "")

  return { pathname: actualPathname, locale }
}
