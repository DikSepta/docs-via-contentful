import React from "react"
import {
  documentToReactComponents,
  Options,
} from "@contentful/rich-text-react-renderer"
import { BLOCKS } from "@contentful/rich-text-types"
import { snakeCase } from "lodash"

import { extractText } from "@/lib/contentful/user-guide"

export default function RichText({ content }: { content: any }) {
  const options: Options = {
    renderNode: {
      [BLOCKS.HEADING_1]: (node, children) => (
        <h1 id={snakeCase(extractText(node.content))}>{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <h2 id={snakeCase(extractText(node.content))}>{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node, children) => (
        <h3 id={snakeCase(extractText(node.content))}>{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (node, children) => (
        <h4 id={snakeCase(extractText(node.content))}>{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (node, children) => (
        <h5 id={snakeCase(extractText(node.content))}>{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node, children) => (
        <h6 id={snakeCase(extractText(node.content))}>{children}</h6>
      ),
    },
  }

  return <div>{documentToReactComponents(content, options)}</div>
}
