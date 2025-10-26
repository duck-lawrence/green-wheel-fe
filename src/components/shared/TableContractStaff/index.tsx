"use client"
import {
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Spinner
} from "@heroui/react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { useConfirmContract, useDay, useGetMe, useName } from "@/hooks"
import { RentalContractStatusLabels, VehicleStatusLabels } from "@/constants/labels"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { useRouter } from "next/navigation"
import { ButtonIconStyled, DropdownStyled, TableStyled } from "@/components/styled"
import { ConfirmContractReq, ContractQueryParams } from "@/models/rental-contract/schema/request"
import { PaginationParams } from "@/models/common/request"
import { RentalContractStatus } from "@/constants/enum"
import { Check, X } from "@phosphor-icons/react"
import { STATUS_STYLES } from "@/constants/statusStyled"

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
    // const { acceptContract, rejectContract } = useConfirmContract({ params, pagination })
    const confirmContract = useConfirmContract({ params, pagination })
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

    const { data: staff } = useGetMe()

    // ======= Action =======
    // const handleAccept = useCallback(
    //     (id: string) => {
    //         acceptContract.mutateAsync({ id })
    //     },
    //     [acceptContract]
    // )

    // const handleReject = useCallback(
    //     (id: string, status: VehicleStatus) => {
    //         rejectContract.mutateAsync({ id, vehicalStatus: status })
    //     },
    //     [rejectContract]
    // )

    // const isLoading = (id: string) => {
    //     return (
    //         (acceptContract.isPending && acceptContract.variables?.id === id) ||
    //         (rejectContract.isPending && rejectContract.variables?.id === id)
    //     )
    // }
    // const [hasVehicle, setHasVehicle] = useState<boolean>(false)

    const handleConfirm = useCallback(
        (id: string, req: ConfirmContractReq) => {
            confirmContract.mutateAsync({ id, req })
        },
        [confirmContract]
    )

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
                    <TableColumn className="text-center text-gray-700 font-semibold w-28">
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
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                                        ${STATUS_STYLES[item.status]}`}
                                >
                                    {RentalContractStatusLabels[item.status]}
                                </span>
                            </TableCell>

                            {/* action */}
                            <TableCell className="text-center">
                                {item.status === RentalContractStatus.RequestPending &&
                                staff?.station?.id === item.station.id ? (
                                    <div className="flex items-center justify-center gap-2">
                                        {confirmContract.isPending ? (
                                            <Spinner />
                                        ) : (
                                            <>
                                                {/* Accept */}
                                                <ButtonIconStyled
                                                    color="primary"
                                                    variant="ghost"
                                                    className="py-2 px-4"
                                                    onPress={() => {
                                                        handleConfirm(item.id, { hasVehicle: true })
                                                    }}
                                                >
                                                    <Check size={16} weight="bold" />
                                                </ButtonIconStyled>

                                                {/* Reject */}
                                                <DropdownStyled placement="bottom-end">
                                                    <DropdownTrigger>
                                                        <ButtonIconStyled
                                                            color="danger"
                                                            variant="ghost"
                                                            className="py-2 px-4"
                                                        >
                                                            <X size={16} weight="bold" />
                                                        </ButtonIconStyled>
                                                    </DropdownTrigger>

                                                    <DropdownMenu
                                                        onAction={(key) => {
                                                            const selected = Number(key)
                                                            handleConfirm(item.id, {
                                                                hasVehicle: false,
                                                                vehicleStatus: selected
                                                            })
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
                                            </>
                                        )}
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
