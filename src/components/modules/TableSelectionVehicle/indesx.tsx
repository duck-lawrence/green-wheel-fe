import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { VehicleViewRes } from "@/models/vehicle/schema/response"
import React, { useState } from "react"

export default function TableSelectionVehicle({
    vehicles,
    onChangeSelected
}: {
    vehicles: VehicleViewRes[]
    onChangeSelected?: (selected: string[]) => void
}) {
    const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([])
    const rows = vehicles.map((item) => ({
        key: item.id,
        id: item.id,
        modal: item.model.name,
        licensePlate: item.licensePlate
    }))

    const columns = [
        {
            key: "id",
            label: "ID"
        },
        {
            key: "modal",
            label: "MODAL"
        },
        {
            key: "licensePlate",
            label: "LICENSE PLATE"
        }
    ]

    const handleSelectionChange = (keys: React.Key[]) => {
        const ids = keys.map(String) // ép về string[]
        setSelectedVehicleIds(ids)
        onChangeSelected?.(ids) // quăng ra ngoài
    }

    return (
        <>
            <TableSelectionStyled
                rows={rows}
                columns={columns}
                selectedKeys={selectedVehicleIds}
                onSelectionChange={handleSelectionChange}
            ></TableSelectionStyled>
        </>
    )
}
