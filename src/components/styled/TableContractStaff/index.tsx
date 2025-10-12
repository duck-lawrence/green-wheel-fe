"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "../ButtonStyled"
import { RentalContractStatus } from "@/constants/enum"
import { useUpdateSatusRentalContract } from "@/hooks"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"

export function TableContractStaff({ contracts }: { contracts: RentalContractViewRes[] }) {
    const { t } = useTranslation()
    const updateStatusMutation = useUpdateSatusRentalContract({})

    const handleUpdateStatus = useCallback(
        (id: string, status: RentalContractStatus) => {
            updateStatusMutation.mutateAsync({ id, status })
        },
        [updateStatusMutation]
    )

    return (
        <Table aria-label="Example static collection table" className="w-full">
            <TableHeader>
                <TableColumn className="text-xl text-center">{t("table.order")}</TableColumn>
                <TableColumn className="text-xl text-center">
                    {t("table.vehicle_model")}
                </TableColumn>
                <TableColumn className="text-xl text-center">{t("table.pickup_time")}</TableColumn>
                <TableColumn className="text-xl text-center">{t("table.return_time")}</TableColumn>
                <TableColumn className="text-xl text-center">
                    {t("table.pickup_address")}
                </TableColumn>
                <TableColumn className="text-xl text-center">{t("table.status")}</TableColumn>
                <TableColumn className="text-xl text-center"> </TableColumn>
            </TableHeader>

            <TableBody>
                {contracts.map((item) => (
                    <TableRow key={item.id} className="border-b border-gray-300">
                        <TableCell className="text-center">{item.id}</TableCell>
                        <TableCell className="text-center">{item.customerId}</TableCell>
                        <TableCell className="text-center">{item.startDate}</TableCell>
                        <TableCell className="text-center">{item.endDate}</TableCell>
                        <TableCell className="text-center">{item.station.name}</TableCell>
                        <TableCell className="text-center">{item.status}</TableCell>
                        <TableCell className="flex gap-2">
                            <ButtonStyled
                                color="primary"
                                isDisabled={item.status === RentalContractStatus.RequestPending}
                                onPress={() =>
                                    handleUpdateStatus(item.id, RentalContractStatus.PaymentPending)
                                }
                            >
                                Accept
                            </ButtonStyled>
                            <ButtonStyled
                                color="danger"
                                onPress={() =>
                                    handleUpdateStatus(item.id, RentalContractStatus.Cancelled)
                                }
                            >
                                Reject
                            </ButtonStyled>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
