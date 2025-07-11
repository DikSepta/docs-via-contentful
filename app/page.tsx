"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { baseLocale } from "@/i18n"

export default function RootRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace(baseLocale)
  }, [])
  return null
}
