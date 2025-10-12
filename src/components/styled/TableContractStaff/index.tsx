"use client"
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "../ButtonStyled"

type TableStyledProps = {
    data: {
        order: string
        model: string
        pickupTime: string
        returnTime: string
        pickupAddress: string
        status: string
    }[]
    loading: boolean
}

export function TableContractStaff({ data, loading }: TableStyledProps) {
    const { t } = useTranslation()

    if (loading) return <div className="text-center">Loading order...</div>
    if (!data || data.length === 0) return <div className="text-center">No order</div>
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
                {data.map((item) => (
                    <TableRow key={item.order} className="border-b border-gray-300">
                        <TableCell className="text-center">{item.order}</TableCell>
                        <TableCell className="text-center">{item.model}</TableCell>
                        <TableCell className="text-center">{item.pickupTime}</TableCell>
                        <TableCell className="text-center">{item.returnTime}</TableCell>
                        <TableCell className="text-center">{item.pickupAddress}</TableCell>
                        <TableCell className="text-center">{item.status}</TableCell>
                        <TableCell className="flex gap-2">
                            <ButtonStyled color="primary" onPress={() => item.status}>
                                Accept
                            </ButtonStyled>
                            <ButtonStyled color="danger">Reject</ButtonStyled>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
