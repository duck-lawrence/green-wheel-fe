import React from "react"
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    getKeyValue,
    cn
} from "@heroui/react"

export type Column = {
    key: string
    label: string
}

export type Row = Record<string, any>

export type TableSelectionStyledProps = {
    columns: Column[]
    rows: Row[]
    className?: string
    selectedKeys?: React.Key[] | "all"
    onSelectionChange?: (keys: React.Key[]) => void
}

export default function TableSelectionStyled({
    columns,
    rows,
    className,
    selectedKeys,
    onSelectionChange
}: TableSelectionStyledProps) {
    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <Table
                aria-label="Selection behavior table example with dynamic content"
                selectionBehavior="toggle"
                selectionMode="multiple"
                selectedKeys={selectedKeys as any}
                onSelectionChange={(keys) => {
                    const selected = Array.isArray(keys) ? keys : Array.from(keys as Set<React.Key>)
                    onSelectionChange?.(selected)
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={rows}>
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
