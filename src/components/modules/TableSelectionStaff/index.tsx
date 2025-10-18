import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { UserProfileViewRes } from "@/models/user/schema/response"
import React, { useState } from "react"

export default function TableSelectionStaff({
    staffs,
    onChangeSelected
}: {
    staffs: UserProfileViewRes[]
    onChangeSelected?: (selected: string[]) => void
}) {
    const [selectedSatffIds, setSelectedStaffIds] = useState<string[]>([])
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

    const handleSelectionChange = (keys: React.Key[]) => {
        const ids = keys.map(String)
        setSelectedStaffIds(ids)
        onChangeSelected?.(ids)
    }

    return (
        <>
            <TableSelectionStyled
                rows={rows}
                columns={columns}
                selectedKeys={selectedSatffIds}
                onSelectionChange={handleSelectionChange}
            ></TableSelectionStyled>
        </>
    )
}
