import { cn } from "@heroui/react"
import React from "react"

export function SpacerStyled({ className = "" }: { className?: string }) {
    return <div className={cn("w-6 flex-shrink-0", className)} />
}
