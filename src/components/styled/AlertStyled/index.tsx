"use client"
import { Alert, AlertProps, cn } from "@heroui/react"
import React from "react"

export function AlertStyled(props: AlertProps) {
    return (
        <Alert
            {...props}
            className={cn("text-sm px-3 py-2 font-[450] text-left", props.className)}
        />
    )
}
