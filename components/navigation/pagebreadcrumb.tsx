import { Fragment } from "react"
import { Link } from "lib/transition"
import { LuHouse } from "react-icons/lu"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import Anchor from "./anchor"

export default function PageBreadcrumb({
  paths,
  titles,
}: {
  paths: string[]
  titles: string[]
}) {
  return (
    <div className="pb-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <LuHouse className="h-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>

          {paths.length > 2 ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Anchor href={`/docs/${paths[0]}`}>{titles[0]}</Anchor>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis className="h-1" />
              </BreadcrumbItem>

              {paths.slice(-1).map((path, i) => {
                const index = paths.length - 1 + i
                const href = `/docs/${paths.slice(0, index + 1).join("/")}`

                return (
                  <Fragment key={path}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {index < paths.length - 1 ? (
                        <BreadcrumbLink asChild>
                          <Anchor href={href}>{titles[index]}</Anchor>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="b">
                          {titles[index]}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                )
              })}
            </>
          ) : (
            paths.map((path, index) => {
              const href = `/docs/${paths.slice(0, index + 1).join("/")}`

              return (
                <Fragment key={path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index < paths.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Anchor href={href}>{titles[index]}</Anchor>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="b">
                        {titles[index]}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}

function toTitleCase(input: string): string {
  const words = input.split("-")
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  )
  return capitalizedWords.join(" ")
}
