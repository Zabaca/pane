import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import type { SessionGroup } from "@/lib/panes"

/**
 * Renders sessions as collapsible groups, each containing its responses in
 * order. A "session" is a folder under content/panes/; each response is a file.
 */
export default function SessionIndex({ sessions }: { sessions: SessionGroup[] }) {
  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground">
        No sessions yet. Create <code>content/panes/&lt;session&gt;/&lt;response&gt;.mdx</code>.
      </p>
    )
  }
  return (
    <Accordion type="multiple" defaultValue={sessions.map((s) => s.slug)} className="w-full">
      {sessions.map((s) => (
        <AccordionItem key={s.slug} value={s.slug}>
          <AccordionTrigger className="text-base">
            <span className="flex items-center gap-2">
              {s.title}
              {s.date ? <span className="text-muted-foreground text-xs">{s.date}</span> : null}
              <Badge variant="secondary">{s.panes.length}</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ol className="ml-2 space-y-1">
              {s.panes.map((p) => (
                <li key={p.href} className="flex items-baseline gap-2">
                  <span className="text-muted-foreground tabular-nums text-xs">{p.order}</span>
                  <a className="underline underline-offset-4 hover:text-foreground" href={p.href}>
                    {p.title}
                  </a>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
