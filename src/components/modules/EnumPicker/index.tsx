"use client"
import { Autocomplete, AutocompleteItem } from "@heroui/react"
import React from "react"
import type { Key } from "@react-types/shared"

type EnumPickerProps<T extends number> = {
    value?: Key | null
    onChange: (value: Key | null) => void
    onKeyDown?: () => void
    labels: Record<T, string> // map enum → label (ví dụ OrderStatusLabels)
    label?: string // nhãn hiển thị cho Autocomplete
    className?: string
    isReadOnly?: boolean
}

export function EnumPicker<T extends number>({
    value,
    onChange,
    onKeyDown = undefined,
    labels,
    label,
    className,
    isReadOnly = false
}: EnumPickerProps<T>) {
    // Lấy items từ labels
    const items = Object.entries(labels).map(([key, label]) => ({
        key,
        label
    }))

    return (
        <Autocomplete
            label={label}
            items={items}
            isReadOnly={isReadOnly}
            isClearable
            variant="bordered"
            className={className}
            // className="max-w-55 h-14"
            selectedKey={value !== null ? String(value) : null}
            onSelectionChange={onChange}
            onKeyDown={onKeyDown}
            classNames={{
                popoverContent: "min-w-fit"
            }}
        >
            {(item) => (
                <AutocompleteItem key={item.key}>{item.label as React.ReactNode}</AutocompleteItem>
            )}
        </Autocomplete>
    )
}
