import { cn } from "@heroui/react"
import { FileText } from "lucide-react"
import React from "react"

export function SectionStyled({
    title,
    children,
    className = ""
}: {
    title: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("mb-10", className)}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" /> {title}
            </h3>
            <div>{children}</div>
        </div>
    )
}
