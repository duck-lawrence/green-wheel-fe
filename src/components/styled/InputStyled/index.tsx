"use client"
import { Input, InputProps, cn } from "@heroui/react"
import React from "react"

type SlotOverrides = NonNullable<InputProps["classNames"]>

const DEFAULT_CLASSNAMES: SlotOverrides = {
    label: "text-slate-700 text-sm font-medium",
    inputWrapper:
        "border border-slate-200 bg-white transition-colors data-[hover=true]:border-slate-300 data-[focus=true]:border-primary data-[focus-visible=true]:border-primary data-[focus=true]:shadow-[0_0_0_1px_theme(colors.primary.DEFAULT)] data-[focus-visible=true]:shadow-[0_0_0_1px_theme(colors.primary.DEFAULT)]",
    input: "text-slate-900 placeholder:text-slate-400",
    helperWrapper: "",
    description: "",
    errorMessage: ""
}

const mergeClassNames = (overrides?: SlotOverrides): SlotOverrides => {
    if (!overrides) return DEFAULT_CLASSNAMES
    const merged: Partial<SlotOverrides> = {}
    for (const key of Object.keys(DEFAULT_CLASSNAMES) as Array<keyof SlotOverrides>) {
        merged[key] = overrides[key]
            ? cn(DEFAULT_CLASSNAMES[key], overrides[key])
            : DEFAULT_CLASSNAMES[key]
    }
    return merged as SlotOverrides
}

// export function InputStyled({ className, classNames, ...props }: InputProps) {
//     const mergedClassNames = mergeClassNames(classNames)
//     return (
//         <Input
//             variant="bordered"
//             {...props}
//             className={cn(className)}
//             classNames={mergedClassNames}
//         />
//     )
// }

interface InputStyledPropes extends InputProps {
    isIncludeTax?: boolean
}

export function InputStyled(props: InputStyledPropes) {
    // const mergedClassNames = mergeClassNames(props.classNames)
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
            // classNames={mergedClassNames}
        />
    )
}
