import TableSelectionStyled from "@/components/styled/TableSelectionStyled"
import { DispatchViewRes } from "@/models/dispatch/schema/response"
import React from "react"

export default function TableSelectionVehicle() {
    const dispatch: DispatchViewRes = []

    const rows = dispatch.vehicles.map((item) => ({
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
