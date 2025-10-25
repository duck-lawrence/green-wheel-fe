"use client"

import { Autocomplete, AutocompleteProps, cn } from "@heroui/react"
import React from "react"

// type AutocompleteStyleProps = {
//     value: string | null
//     onChange: (value: string | null) => void
//     className?: string
// }
// cần truyền fetch data vào đang hard code
// export function AutocompleteStyled({ value, onChange, className }: AutocompleteStyleProps) {

export function AutocompleteStyled(props: AutocompleteProps) {
    return (
        <Autocomplete
            // defaultItems={locals}
            variant="bordered"
            // className="max-w-55 h-14 mr-0"
            // selectedKey={value ?? undefined}
            // onSelectionChange={(key) => {
            //     onChange(key as string)
            //     console.log("Selected:", key)
            // }}
            {...props}
            className={cn(props.className)}
            inputProps={{
                ...props.inputProps,
                classNames: {
                    ...props.inputProps?.classNames,
                    label: cn("text-gray-700", props.inputProps?.classNames?.label),
                    input: cn("text-gray-900", props.inputProps?.classNames?.input),
                    inputWrapper: cn(
                        "border-2 border-gray-200 data-[hover=true]:border-primary data-[focus=true]:border-primary",
                        props.inputProps?.classNames?.inputWrapper
                    )
                }
            }}
        />
    )
}
