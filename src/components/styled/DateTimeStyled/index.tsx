"use client"

import { cn, DatePicker, DatePickerProps } from "@heroui/react"
import React from "react"

export function DateTimeStyled(props: DatePickerProps) {
    return (
        <div className="w-full flex flex-row gap-4">
            <DatePicker
                hideTimeZone
                hourCycle={24}
                granularity="minute"
                variant="bordered"
                {...props}
                className={cn("font-medium text-base", props.className)}
                classNames={{
                    ...props.classNames,
                    inputWrapper: cn(
                        "border-2 border-gray-200 data-[hover=true]:border-primary data-[focus=true]:border-primary",
                        props.classNames?.inputWrapper
                    ),
                    label: cn("text-gray-700", props.classNames?.label),
                    input: cn("text-gray-900", props.classNames?.input)
                }}
            />
        </div>
    )
}
