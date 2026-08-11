import { InfoIcon, AlertTriangleIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const ICONS = {
  info: InfoIcon,
  warning: AlertTriangleIcon,
  success: CheckCircle2Icon,
  error: XCircleIcon,
} as const

type Variant = keyof typeof ICONS

/**
 * Agent-facing callout box. Drop into MDX:
 *   <Callout type="info" title="Heads up">Body text.</Callout>
 */
export default function Callout({
  type = "info",
  title,
  children,
}: {
  type?: Variant
  title?: string
  children?: React.ReactNode
}) {
  const Icon = ICONS[type] ?? InfoIcon
  return (
    <Alert className="my-4" variant={type === "error" ? "destructive" : "default"}>
      <Icon className="size-4" />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
