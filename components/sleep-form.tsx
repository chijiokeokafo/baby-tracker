"use client"

import { useState, useTransition } from "react"
import { ActionButton } from "./action-button"
import { Input } from "@/components/ui/input"
import { logEvent } from "@/app/actions"
import { Moon } from "lucide-react"
import { toast } from "sonner"

interface SleepFormProps {
  userId?: string
}

export function SleepForm({ userId }: SleepFormProps) {
  const [notes, setNotes] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!userId) return

    startTransition(async () => {
      await logEvent({
        userId,
        type: "SLEEP",
        startTime: new Date(),
        metadata: notes ? { notes } : undefined,
      })

      toast.success("Sleep logged!", {
        description: `Started at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      })
      setNotes("")
    })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Notes <span className="text-muted-foreground/60">(optional)</span>
        </label>
        <Input
          placeholder="e.g., fell asleep in car seat"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-11"
        />
      </div>

      <ActionButton
        colorScheme="sleep"
        icon={<Moon className="h-5 w-5" />}
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? "Logging..." : "Log Sleep"}
      </ActionButton>
    </div>
  )
}
