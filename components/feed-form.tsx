"use client"

import { useState, useTransition } from "react"
import { ActionButton } from "./action-button"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { logEvent } from "@/app/actions"
import { Utensils, Minus, Plus } from "lucide-react"
import { toast } from "sonner"

interface FeedFormProps {
  userId?: string
}

export function FeedForm({ userId }: FeedFormProps) {
  const [feedType, setFeedType] = useState<"bottle" | "breast" | "solid">("bottle")
  const [amount, setAmount] = useState(120)
  const [isPending, startTransition] = useTransition()

  const adjustAmount = (delta: number) => {
    setAmount((prev) => Math.max(0, Math.min(500, prev + delta)))
  }

  const handleSubmit = () => {
    if (!userId) return

    startTransition(async () => {
      await logEvent({
        userId,
        type: "FEED",
        startTime: new Date(),
        metadata: { type: feedType.toUpperCase(), amount },
      })

      toast.success("Feed logged!", {
        description: `${feedType.charAt(0).toUpperCase() + feedType.slice(1)} - ${amount}ml`,
      })
    })
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Type</label>
        <ToggleGroup
          type="single"
          value={feedType}
          onValueChange={(v) => v && setFeedType(v as typeof feedType)}
          className="grid grid-cols-3 gap-2"
        >
          <ToggleGroupItem
            value="bottle"
            className="data-[state=on]:bg-feed-muted data-[state=on]:text-feed data-[state=on]:border-feed border rounded-lg h-10"
          >
            Bottle
          </ToggleGroupItem>
          <ToggleGroupItem
            value="breast"
            className="data-[state=on]:bg-feed-muted data-[state=on]:text-feed data-[state=on]:border-feed border rounded-lg h-10"
          >
            Breast
          </ToggleGroupItem>
          <ToggleGroupItem
            value="solid"
            className="data-[state=on]:bg-feed-muted data-[state=on]:text-feed data-[state=on]:border-feed border rounded-lg h-10"
          >
            Solid
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {feedType !== "breast" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Amount {feedType === "solid" ? "(g)" : "(ml)"}
          </label>
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => adjustAmount(-30)}
              className="h-12 w-12 rounded-full shrink-0"
            >
              <Minus className="h-5 w-5" />
            </Button>
            <div className="text-center min-w-[80px]">
              <span className="text-4xl font-bold tabular-nums">{amount}</span>
              <span className="text-lg text-muted-foreground ml-1">
                {feedType === "solid" ? "g" : "ml"}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => adjustAmount(30)}
              className="h-12 w-12 rounded-full shrink-0"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <ActionButton
        colorScheme="feed"
        icon={<Utensils className="h-5 w-5" />}
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? "Logging..." : "Log Feed"}
      </ActionButton>
    </div>
  )
}
