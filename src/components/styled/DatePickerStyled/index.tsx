"use client"
import { cn, DatePicker, DatePickerProps } from "@heroui/react"
import React from "react"
export function DatePickerStyled(props: DatePickerProps) {
    return (
        <DatePicker
            showMonthAndYearPickers
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
    )
}
