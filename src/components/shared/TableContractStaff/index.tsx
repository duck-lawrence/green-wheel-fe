"use client"
import {
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
} from "@heroui/react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "../../styled/ButtonStyled"
import { RentalContractStatus, VehicleStatus } from "@/constants/enum"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { useConfirmContract, useDay, useGetMe, useName } from "@/hooks"
import { RentalContractStatusLabels, VehicleStatusLabels } from "@/constants/labels"
import { DropdownStyled } from "../../styled/DropdownStyled"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { useRouter } from "next/navigation"
import { TableStyled } from "@/components/styled"
import { ContractQueryParams } from "@/models/rental-contract/schema/request"
import { PaginationParams } from "@/models/common/request"

export function TableContractStaff({
    contracts,
    params,
    pagination
}: {
    contracts: RentalContractViewRes[]
    params: ContractQueryParams
    pagination: PaginationParams
}) {
    const { t } = useTranslation()
    const { toFullName } = useName()
    const router = useRouter()
    const { acceptContract, rejectContract } = useConfirmContract({ params, pagination })
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

    const { data: staff } = useGetMe()

    const handleAccept = useCallback(
        (id: string) => {
            acceptContract.mutateAsync({ id })
        },
        [acceptContract]
    )

    const handleReject = useCallback(
        (id: string, status: VehicleStatus) => {
            rejectContract.mutateAsync({ id, vehicalStatus: status })
        },
        [rejectContract]
    )

    const isLoading = (id: string) => {
        return (
            (acceptContract.isPending && acceptContract.variables?.id === id) ||
            (rejectContract.isPending && rejectContract.variables?.id === id)
        )
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <TableStyled className="min-w-full text-sm md:text-base" removeWrapper>
                <TableHeader>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.no")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-40">
                        {t("table.name")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.vehicle_model")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.pickup_time")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.return_time")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.station")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-36">
                        {t("table.status")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-50">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>

                <TableBody>
                    {contracts.map((item, index) => (
                        <TableRow
                            key={item.id}
                            className="hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                            onClick={() => router.push(`/dashboard/rental-contracts/${item.id}`)}
                        >
                            <TableCell className="text-center text-gray-700">{index + 1}</TableCell>
                            <TableCell className="text-center text-gray-700 font-medium">
                                {toFullName({
                                    firstName: item.customer.firstName,
                                    lastName: item.customer.lastName
                                })}
                            </TableCell>
                            <TableCell className="text-center">{item.vehicle.model.name}</TableCell>
                            <TableCell className="text-center text-gray-600">
                                {item.startDate && formatDateTime({ date: item.startDate })}
                            </TableCell>
                            <TableCell className="text-center text-gray-600">
                                {item.endDate && formatDateTime({ date: item.endDate })}
                            </TableCell>
                            <TableCell className="text-center text-gray-600">
                                {item.station.name}
                            </TableCell>

                            {/* status */}
                            <TableCell className="text-center">
                                <span className="py-1 rounded-full text-xs">
                                    {RentalContractStatusLabels[item.status]}
                                </span>
                            </TableCell>

                            {/* action */}
                            <TableCell className="text-center">
                                {item.status === RentalContractStatus.RequestPending &&
                                staff?.station?.id === item.station.id ? (
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                                        {/* Accept */}
                                        <ButtonStyled
                                            color="primary"
                                            variant="bordered"
                                            className="h-7 w-20 border-1 border-primary hover:text-white hover:bg-primary font-semibold px-5 py-2 rounded-lg"
                                            onPress={() => handleAccept(item.id)}
                                            isLoading={
                                                acceptContract.isPending &&
                                                acceptContract.variables?.id === item.id
                                            }
                                            hidden={isLoading(item.id)}
                                        >
                                            {t("rental_contract.accept")}
                                        </ButtonStyled>

                                        {/* Reject */}
                                        <DropdownStyled
                                            placement="bottom-end"
                                            isDisabled={isLoading(item.id)}
                                        >
                                            <DropdownTrigger>
                                                <ButtonStyled
                                                    className="h-7 w-20 bg-white border-1 border-danger text-danger hover:bg-red-600 hover:text-white font-semibold rounded-lg"
                                                    isLoading={
                                                        rejectContract.isPending &&
                                                        rejectContract.variables?.id === item.id
                                                    }
                                                    hidden={isLoading(item.id)}
                                                >
                                                    {t("rental_contract.reject")}
                                                </ButtonStyled>
                                            </DropdownTrigger>

                                            <DropdownMenu
                                                onAction={(key) => {
                                                    const selected = Number(key)
                                                    handleReject(item.id, selected)
                                                }}
                                            >
                                                {Object.entries(VehicleStatusLabels).map(
                                                    ([key, label]) => (
                                                        <DropdownItem key={key}>
                                                            {label}
                                                        </DropdownItem>
                                                    )
                                                )}
                                            </DropdownMenu>
                                        </DropdownStyled>
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-sm">
                                        {t("rental_contract.no_action")}
                                    </span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </TableStyled>
        </div>
    )
}
