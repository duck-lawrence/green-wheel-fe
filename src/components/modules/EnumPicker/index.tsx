"use client"
import { Autocomplete, AutocompleteItem } from "@heroui/react"
import React from "react"

type EnumPickerProps<T extends number> = {
    value: T | null
    onChange: (value: T) => void
    labels: Record<T, string> // map enum → label (ví dụ OrderStatusLabels)
    label?: string // nhãn hiển thị cho Autocomplete
    className?: string
    isReadOnly?: boolean
}

export function EnumPicker<T extends number>({
    value,
    onChange,
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
            items={items}
            isReadOnly={isReadOnly}
            variant="bordered"
            className={className}
            // className="max-w-55 h-14"
            label={label}
            selectedKey={value !== null ? String(value) : undefined}
            onSelectionChange={(key) => {
                if (key !== null) {
                    onChange(Number(key) as T)
                }
            }}
            isClearable
        >
            {(item) => (
                <AutocompleteItem key={item.key}>{item.label as React.ReactNode}</AutocompleteItem>
            )}
        </Autocomplete>
    )
}
