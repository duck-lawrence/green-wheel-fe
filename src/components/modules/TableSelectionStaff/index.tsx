import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { UserProfileViewRes } from "@/models/user/schema/response"
import React from "react"

export default function TableSelectionStaff({ staffs }: { staffs: UserProfileViewRes[] }) {
    const rows = staffs.map((item) => ({
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
