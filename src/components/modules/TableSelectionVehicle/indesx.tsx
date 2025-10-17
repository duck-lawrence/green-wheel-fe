import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { VehicleViewRes } from "@/models/vehicle/schema/response"
import React from "react"

export default function TableSelectionVehicle({ vehicles }: { vehicles: VehicleViewRes[] }) {
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

    return (
        <>
            <TableSelectionStyled rows={rows} columns={columns}></TableSelectionStyled>
        </>
    )
}
