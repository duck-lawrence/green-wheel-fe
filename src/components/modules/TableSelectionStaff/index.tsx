import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { DispatchViewRes } from "@/models/dispatch/schema/response"
import React from "react"

export default function TableSelectionStaff() {
    const dispatch: DispatchViewRes = []

    const rows = dispatch.staffs.map((item) => ({
        key: item.id,
        id: item.id,
        name: `${item.firstName} ${item.lastName}`
    }))

    const columns = [
        {
            key: "id",
            label: "ID"
        },
        {
            key: "name",
            label: "NAME"
        },
        {
            key: "status",
            label: "STATUS"
        }
    ]

    return (
        <>
            <TableSelectionStyled rows={rows} columns={columns}></TableSelectionStyled>
        </>
    )
}
