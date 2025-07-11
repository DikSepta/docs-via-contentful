"use client"

import React, { useCallback } from "react"
import { useRouter } from "next/navigation"
import { locales, Locales } from "@/i18n"
import { useLocalePathname } from "@/i18n/navigation"
import { LuGlobe } from "react-icons/lu"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

const languageNames: Record<Locales, string> = {
  "en-US": "English",
  ja: "日本語",
}

export default function LanguageSelector() {
  const { locale, pathname } = useLocalePathname()
  const router = useRouter()

  const handleSelectLanguage = useCallback(
    (newLocale: Locales) => {
      router.push(`/${newLocale}${pathname}`)
    },
    [pathname, router]
  )

  return (
    <Select value={locale as Locales} onValueChange={handleSelectLanguage}>
      <SelectTrigger
        className="bg-background w-10 cursor-pointer md:w-[140px]"
        iconClassName="hidden md:block"
      >
        <div className="flex items-center gap-2">
          <LuGlobe className="text-foreground size-4" />
          <SelectValue placeholder="Language" asChild>
            <span data-slot="select-value" className="hidden md:block">
              {languageNames[locale as Locales]}
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        {locales.map((lang) => (
          <SelectItem key={lang} value={lang} className="cursor-pointer">
            {languageNames[lang]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
