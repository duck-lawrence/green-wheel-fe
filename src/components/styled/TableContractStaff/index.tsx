"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "../ButtonStyled"
import { RentalContractStatus, VehicleStatus } from "@/constants/enum"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { useConfirmContract } from "@/hooks"
import { EnumPicker } from "@/components/modules"
import { VehicleStatusLabels } from "@/constants/labels"

export function TableContractStaff({ contracts }: { contracts: RentalContractViewRes[] }) {
    const { t } = useTranslation()
    const [vehicalStatus, setVehicalStatus] = useState<VehicleStatus | null>(null)
    const { acceptContract, rejectContract } = useConfirmContract({})

    const handleAccept = useCallback(
        (id: string) => {
            acceptContract.mutateAsync({ id })
        },
        [acceptContract]
    )

    const handleReject = useCallback(
        (id: string) => {
            if (!vehicalStatus) return
            rejectContract.mutateAsync({ id, vehicalStatus })
        },
        [rejectContract, vehicalStatus]
    )

    return (
        <Table aria-label="Example static collection table" className="w-full">
            <TableHeader>
                <TableColumn className="text-xl text-center">{t("table.id")}</TableColumn>
                <TableColumn className="text-xl text-center">
                    {t("table.vehicle_model")}
                </TableColumn>
                <TableColumn className="text-xl text-center">{t("table.pickup_time")}</TableColumn>
                <TableColumn className="text-xl text-center">{t("table.return_time")}</TableColumn>
                <TableColumn className="text-xl text-center">
                    {t("table.pickup_address")}
                </TableColumn>
                <TableColumn className="text-xl text-center">{t("table.status")}</TableColumn>
                <TableColumn className="text-xl text-center">Action</TableColumn>
            </TableHeader>

            <TableBody>
                {contracts.map((item) => (
                    <TableRow key={item.id} className="border-b border-gray-300">
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell className="text-center">{`${item.customer.firstName} ${item.customer.lastName}`}</TableCell>
                        <TableCell className="text-center">{item.startDate}</TableCell>
                        <TableCell className="text-center">{item.endDate}</TableCell>
                        <TableCell className="text-center">{item.station.name}</TableCell>
                        <TableCell className="text-center">{item.status}</TableCell>
                        <TableCell className=" flex flex-col gap-2">
                            {item.status == RentalContractStatus.RequestPending && (
                                <>
                                    <ButtonStyled
                                        color="primary"
                                        onPress={() => handleAccept(item.id)}
                                    >
                                        Accept
                                    </ButtonStyled>
                                    <div className=" flex gap-2">
                                        <ButtonStyled
                                            color="danger"
                                            onPress={() => handleReject(item.id)}
                                        >
                                            Reject
                                        </ButtonStyled>
                                        <EnumPicker
                                            // label="Status"
                                            labels={VehicleStatusLabels}
                                            value={vehicalStatus ?? null}
                                            onChange={(val: VehicleStatus) => setVehicalStatus(val)}
                                        />
                                    </div>
                                </>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
