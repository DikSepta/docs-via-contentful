import { useEffect, useState } from "react"
import { useLocalePathname } from "@/i18n/navigation"
import { LuChevronRight } from "react-icons/lu"

import { DocumentsHashTbl } from "@/lib/contentful/user-guide"
import { Paths } from "@/lib/pageroutes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SheetClose } from "@/components/ui/sheet"
import Anchor from "@/components/navigation/anchor"

function isRoute(
  item: Paths
): item is Extract<Paths, { title: string; href: string }> {
  return "title" in item && "href" in item
}

export default function SubLink(
  props: Paths & {
    level: number
    isSheet: boolean
    documentHashTbl: DocumentsHashTbl
  }
) {
  const { pathname: path } = useLocalePathname()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (
      isRoute(props) &&
      props.href &&
      path !== props.href &&
      path.includes(props.href)
    ) {
      setIsOpen(true)
    }
  }, [path, props])

  if (!isRoute(props)) {
    return null
  }

  const { title, href, childs, noLink, level, isSheet, documentHashTbl } = props

  const Comp = (
    <Anchor
      className="flex-1"
      activeClassName="text-primary text-sm font-semibold"
      href={href}
    >
      {title}
    </Anchor>
  )

  const titleOrLink = !noLink ? (
    isSheet ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <h2 className="text-primary font-medium sm:text-sm">{title}</h2>
  )

  if (!childs || childs.length === 0) {
    return (
      <div className="hover:bg-accent hover:text-accent-foreground flex w-full flex-col rounded-md px-3 py-2 text-sm">
        {titleOrLink}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm">
          {titleOrLink}
          <CollapsibleTrigger asChild>
            <Button className="h-6 w-6" variant="link" size="icon">
              <LuChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen ? "rotate-90" : ""
                )}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="CollapsibleContent">
          <div
            className={cn(
              "mt-0.5 ml-3 flex flex-col items-start border-l pl-1 text-sm text-neutral-800 dark:text-neutral-300/85",
              level > 0 && "ml-1 border-l pl-4"
            )}
          >
            {childs?.map((childId) => {
              const child = documentHashTbl[childId]
              if (!child) {
                return null
              }

              const modifiedItems = {
                ...child,
                href: `${href}/${child.slug}`,
                level: level + 1,
                isSheet,
                documentHashTbl,
              }

              return <SubLink key={modifiedItems.href} {...modifiedItems} />
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
