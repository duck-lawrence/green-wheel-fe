import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { VehicleViewRes } from "@/models/vehicle/schema/response"
import React, { Key, useState } from "react"

type TableSelectionVehicleProps = {
    selectionBehavior?: "toggle" | "replace"
    vehicles: VehicleViewRes[]
    onChangeSelected?: (selected: string[]) => void
}

export default function TableSelectionVehicle({
    selectionBehavior,
    vehicles,
    onChangeSelected
}: TableSelectionVehicleProps) {
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([])
    const rows = vehicles.map((item) => ({
        key: item.id,
        id: item.id,
        model: item.model.name,
        licensePlate: item.licensePlate
    }))

    const columns = [
        {
            key: "id",
            label: "ID"
        },
        {
            key: "model",
            label: "MODEL"
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
                selectionBehavior={selectionBehavior}
            ></TableSelectionStyled>
        </>
    )
}
