import { cn } from "@heroui/react"
import { FileText } from "lucide-react"
import React from "react"

export function SectionStyled({
    title,
    children,
    sectionClassName = "",
    childrenClassName = ""
}: {
    title: string
    children: React.ReactNode
    sectionClassName?: string
    childrenClassName?: string
}) {
    return (
        <div className={cn("mb-10", sectionClassName)}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <FileText size={20} className="text-primary" /> {title}
            </h3>
            <div className={cn(childrenClassName)}>{children}</div>
        </div>
    )
}
