import Image from "next/image"

import { Settings } from "@/lib/meta"

import Anchor from "./anchor"

export function Logo() {
  return (
    <Anchor href="/" className="flex items-center gap-2.5">
      <Image
        src={Settings.siteicon}
        alt={`${Settings.title} main logo`}
        width={34}
        height={34}
        loading="lazy"
        decoding="async"
      />
      <span className="text-md font-semibold">{Settings.title}</span>
    </Anchor>
  )
}
