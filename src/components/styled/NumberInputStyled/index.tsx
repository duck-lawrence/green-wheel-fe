"use client"
import { NumberInput, NumberInputProps, cn } from "@heroui/react"
import React from "react"

export function NumberInputStyled(props: NumberInputProps) {
    return <NumberInput variant="bordered" {...props} className={cn(props.className)} />
}
