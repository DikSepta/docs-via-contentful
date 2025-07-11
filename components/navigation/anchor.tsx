"use client"

import { ComponentProps } from "react"
import { useLocalePathname } from "@/i18n/navigation"
import { Link } from "lib/transition"

import { cn } from "@/lib/utils"

type AnchorProps = ComponentProps<typeof Link> & {
  absolute?: boolean
  activeClassName?: string
  disabled?: boolean
}

export default function Anchor({
  absolute,
  className = "",
  activeClassName = "",
  disabled,
  children,
  ...props
}: AnchorProps) {
  const { locale, pathname: path } = useLocalePathname()
  let isMatch = absolute
    ? props.href.toString().split("/")[1] == path.split("/")[1]
    : path === props.href

  if (disabled)
    return <div className={cn(className, "cursor-not-allowed")}>{children}</div>

  return (
    <Link
      className={cn(className, isMatch && activeClassName)}
      {...props}
      href={`/${locale}${props.href.toString()}`}
    >
      {children}
    </Link>
  )
}
