"use client"
import { cn, Input, InputProps } from "@heroui/react"
import React from "react"

interface InputStyledPropes extends InputProps {
    isIncludeTax?: boolean
}

export function InputStyled(props: InputStyledPropes) {
    return (
        <Input
            variant="bordered"
            endContent={
                props.isIncludeTax ? (
                    <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-3xl">*</span>
                    </div>
                ) : (
                    <></>
                )
            }
            {...props}
            className={cn(props.className)}
        />
    )
}
