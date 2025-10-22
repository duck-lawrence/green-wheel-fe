"use client"
import { Table, TableProps, cn } from "@heroui/react"
import React from "react"

export function TableStyled(props: TableProps) {
    return <Table isHeaderSticky {...props} className={cn("w-full", props.className)} />
}
