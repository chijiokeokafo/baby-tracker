"use client"

import { useState, useTransition } from "react"
import { ActionButton } from "./action-button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { logEvent } from "@/app/actions"
import { Droplets } from "lucide-react"
import { toast } from "sonner"

interface DiaperFormProps {
  userId?: string
}

export function DiaperForm({ userId }: DiaperFormProps) {
  const [diaperType, setDiaperType] = useState<"wet" | "dirty" | "both">("wet")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!userId) return

    startTransition(async () => {
      await logEvent({
        userId,
        type: "DIAPER",
        startTime: new Date(),
        metadata: { type: diaperType },
      })

      const label = diaperType.charAt(0).toUpperCase() + diaperType.slice(1)
      toast.success("Diaper change logged!", {
        description: `${label} diaper`,
      })
    })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Type</label>
        <ToggleGroup
          type="single"
          value={diaperType}
          onValueChange={(v) => v && setDiaperType(v as typeof diaperType)}
          className="grid grid-cols-3 gap-2"
        >
          <ToggleGroupItem
            value="wet"
            className="data-[state=on]:bg-diaper-muted data-[state=on]:text-diaper data-[state=on]:border-diaper border rounded-lg h-10"
          >
            Wet
          </ToggleGroupItem>
          <ToggleGroupItem
            value="dirty"
            className="data-[state=on]:bg-diaper-muted data-[state=on]:text-diaper data-[state=on]:border-diaper border rounded-lg h-10"
          >
            Dirty
          </ToggleGroupItem>
          <ToggleGroupItem
            value="both"
            className="data-[state=on]:bg-diaper-muted data-[state=on]:text-diaper data-[state=on]:border-diaper border rounded-lg h-10"
          >
            Both
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ActionButton
        colorScheme="diaper"
        icon={<Droplets className="h-5 w-5" />}
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? "Logging..." : "Log Diaper Change"}
      </ActionButton>
    </div>
  )
}
