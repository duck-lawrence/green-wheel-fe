"use client"
import { Alert, AlertProps, cn } from "@heroui/react"
import React from "react"

export function AlertStyled(props: AlertProps) {
    return <Alert {...props} className={cn("h-10 text-sm", props.className)} />
}
