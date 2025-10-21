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
        name: `${item.firstName} ${item.lastName}`,
        station: item.station?.name
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
            key: "station",
            label: "STATION"
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
