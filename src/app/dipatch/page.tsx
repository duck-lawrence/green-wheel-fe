import { InputStyled } from "@/components"
import TableSelectionStaff from "@/components/modules/TableSelectionStaff"
import TableSelectionVehicle from "@/components/modules/TableSelectionVehicle/indesx"
import { useGetAllDispatch } from "@/hooks/queries/useDispatch"
import { Textarea } from "@heroui/react"
import React from "react"

export default function Dispatchpage() {
    const { data: dispatchs, isLoading } = useGetAllDispatch({
        params: DispatchQueryParams
    })

    return (
        <>
            <div>
                <InputStyled label="Station" />
                <Textarea></Textarea>
            </div>
            {/* table */}
            <div>
                <TableSelectionStaff staffs={} />
                <TableSelectionVehicle vehicles={} />
            </div>
        </>
    )
}
