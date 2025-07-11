import { LuAlignLeft } from "react-icons/lu"

import { DocumentsHashTbl } from "@/lib/contentful/user-guide"
import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/navigation/logo"
import { NavMenu } from "@/components/navigation/navbar"
import PageMenu from "@/components/navigation/pagemenu"

export function Sidebar({
  documentsHashTbl,
}: {
  documentsHashTbl: DocumentsHashTbl
}) {
  return (
    <aside
      className="sticky top-16 hidden h-[94.5vh] min-w-[250px] flex-[1] flex-col overflow-y-auto border-r pr-2 pl-6 md:flex"
      aria-label="Page navigation"
    >
      <ScrollArea className="py-4">
        <PageMenu documentsHashTbl={documentsHashTbl} />
      </ScrollArea>
    </aside>
  )
}

export function SheetLeft() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="flex cursor-pointer md:hidden"
        >
          <LuAlignLeft className="!size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-0 px-0" side="left">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SheetHeader>
          <SheetClose asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex flex-col gap-4">
          <div className="mx-0 mt-3 flex flex-col gap-2.5 px-5">
            <NavMenu isSheet />
          </div>
          <div className="mx-0 px-5">{/* <PageMenu isSheet /> */}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
