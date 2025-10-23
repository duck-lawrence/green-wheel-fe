import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { UserProfileViewRes } from "@/models/user/schema/response"
import React, { useState } from "react"

type TableSelectionStaffProps = {
    selectionBehavior?: "toggle" | "replace"
    staffs: UserProfileViewRes[]
    onChangeSelected?: (selected: string[]) => void
}

export default function TableSelectionStaff({
    selectionBehavior,
    staffs,
    onChangeSelected
}: TableSelectionStaffProps) {
    const [selectedSatffIds, setSelectedStaffIds] = useState<string[]>([])

    const rows = staffs.map((item, index) => ({
        key: item.id,
        id: index + 1,
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
                selectionBehavior={selectionBehavior}
            ></TableSelectionStyled>
        </>
    )
}
