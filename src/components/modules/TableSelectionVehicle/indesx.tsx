import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { VehicleViewRes } from "@/models/vehicle/schema/response"
import React, { Key, useState } from "react"

export default function TableSelectionVehicle({
    vehicles,
    onChangeSelected
}: {
    vehicles: VehicleViewRes[]
    onChangeSelected?: (selected: string[]) => void
}) {
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([])
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
            key: "model",
            label: "MODeL"
        },
        {
            key: "licensePlate",
            label: "LICENSE PLATE"
        }
    ]

    const handleSelectionChange = (keys: Key[]) => {
        setSelectedKeys(keys)
        onChangeSelected?.(keys.map(String))
    }

    return (
        <>
            <TableSelectionStyled
                rows={rows}
                columns={columns}
                selectedKeys={selectedKeys as any}
                onSelectionChange={handleSelectionChange}
            ></TableSelectionStyled>
        </>
    )
}
