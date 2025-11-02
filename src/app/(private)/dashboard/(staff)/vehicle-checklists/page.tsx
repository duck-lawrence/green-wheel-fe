"use client"
// import BrandPicker from "@/components/modules/UserItem/BrandPicker"
import React, { useState } from "react"
import { EnumPicker, PaginationStyled, TableStyled } from "@/components"
import { useTranslation } from "react-i18next"
import {
    Chip,
    Spinner,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react"
import { useRouter } from "next/navigation"
import { useGetAllVehicleChecklists, useUserHelper } from "@/hooks"
import { VehicleChecklistType } from "@/constants/enum"
import { VehicleChecklistTypeLabels } from "@/constants/labels"
import { GetAllVehicleChecklistParams } from "@/models/checklist/schema/request"
import { PaginationParams } from "@/models/common/request"
import { VehicleChecklistTypeColorMap } from "@/constants/colorMap"

export default function VehicleChecklistPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { toFullName } = useUserHelper()
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })
    const [filters, setFilter] = useState<GetAllVehicleChecklistParams>({})

    const {
        data,
        isLoading: isChecklistsLoading,
        refetch: refetchChecklists
    } = useGetAllVehicleChecklists({ query: filters, pagination })

    return (
        <div className="px-3 py-2 md:py-8 md:px-12 shadow-2xs rounded-2xl bg-white ">
            <div className="text-3xl mb-3 px-4 font-bold">
                <p>{t("vehicle_checklist.checklist")}</p>
            </div>

            <div className="mb-3 flex gap-2 px-4">
                <EnumPicker
                    label={t("table.type")}
                    labels={VehicleChecklistTypeLabels}
                    value={filters.type}
                    onChange={async (key) => {
                        setFilter((prev) => {
                            return {
                                ...prev,
                                type: key as VehicleChecklistType | undefined
                            }
                        })
                        await refetchChecklists()
                    }}
                    className="max-w-48"
                />
            </div>

            {isChecklistsLoading ? (
                <Spinner className="" />
            ) : (
                <>
                    <TableStyled className="w-full">
                        <TableHeader>
                            <TableColumn className="text-sm text-center w-44">
                                {t("table.id")}
                            </TableColumn>
                            <TableColumn className="text-sm text-center w-30">
                                {t("table.vehicle")}
                            </TableColumn>
                            <TableColumn className="text-sm text-center w-34">
                                {t("table.staff")}
                            </TableColumn>
                            <TableColumn className="text-sm text-center w-34">
                                {t("table.customer")}
                            </TableColumn>
                            <TableColumn className="text-sm text-center w-44">
                                {t("table.contract_id")}
                            </TableColumn>
                            <TableColumn className="text-sm text-center">
                                {t("table.type")}
                            </TableColumn>
                        </TableHeader>

                        <TableBody>
                            {(data?.items || []).map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="border-b border-gray-300 cursor-pointer hover:bg-gray-50"
                                    onClick={() =>
                                        router.push(`/dashboard/vehicle-checklists/${item.id}`)
                                    }
                                >
                                    <TableCell className="text-center w-fit">{item.id}</TableCell>
                                    <TableCell className="text-center">
                                        {item.vehicle.licensePlate}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {toFullName({
                                            firstName: item.staff.firstName,
                                            lastName: item.staff.lastName
                                        })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.customer &&
                                            toFullName({
                                                firstName: item.customer.firstName,
                                                lastName: item.customer.lastName
                                            })}
                                    </TableCell>
                                    <TableCell className="text-center">{item.contractId}</TableCell>
                                    <TableCell className="text-center">
                                        <Chip
                                            variant="bordered"
                                            color={VehicleChecklistTypeColorMap[item.type]}
                                        >
                                            {VehicleChecklistTypeLabels[item.type]}
                                        </Chip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </TableStyled>
                    <div className="mt-6 flex justify-center">
                        <PaginationStyled
                            page={data?.pageNumber ?? 1}
                            total={data?.totalPages ?? 10}
                            onChange={(page: number) =>
                                setPagination((prev) => {
                                    return {
                                        ...prev,
                                        pageNumber: page
                                    }
                                })
                            }
                        />
                    </div>
                </>
            )}
        </div>
    )
}
