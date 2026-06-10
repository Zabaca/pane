import { useEffect, useId, useRef, useState } from "react"

/**
 * Client-side Mermaid island. Renders a diagram from a string with no
 * Playwright/build dependency. Drop into MDX:
 *
 *   <Mermaid client:visible chart={`graph LR; A-->B;`} />
 */
export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const id = useId().replace(/[:]/g, "")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const mermaid = (await import("mermaid")).default
      mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "loose" })
      try {
        const { svg } = await mermaid.render(`m-${id}`, chart)
        if (!cancelled) setSvg(svg)
      } catch (err) {
        if (!cancelled) setSvg(`<pre class="text-red-600 text-sm">Mermaid error: ${String(err)}</pre>`)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [chart, id])

  return (
    <div
      ref={ref}
      className="my-4 flex justify-center [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
