"use client"
// import BrandPicker from "@/components/modules/UserItem/BrandPicker"
import React, { useEffect, useState } from "react"
import { AutocompleteStyle, EnumPicker, TableStyled } from "@/components"
import { useTranslation } from "react-i18next"
import {
    AutocompleteItem,
    Spinner,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react"
import { useRouter } from "next/navigation"
import { useGetAllStations, useGetAllVehicleChecklists, useName } from "@/hooks"
import { VehicleChecklistType } from "@/constants/enum"
import { BackendError } from "@/models/common/response"
import toast from "react-hot-toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { VehicleChecklistTypeLabels } from "@/constants/labels"
import { GetAllVehicleChecklistParams } from "@/models/checklist/schema/request"
import { MapPinAreaIcon } from "@phosphor-icons/react"

export default function VehicleChecklistPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { toFullName } = useName()
    const [filters, setFilter] = useState<GetAllVehicleChecklistParams>({})

    const { data: stations, error: stationsError } = useGetAllStations()

    const {
        data: checklists,
        isLoading: isChecklistsLoading,
        error: checklistsError,
        refetch: refetchChecklists
    } = useGetAllVehicleChecklists({ query: filters })

    useEffect(() => {
        if (checklistsError || stationsError) {
            const backendErr = (checklistsError || stationsError) as BackendError
            toast.error(translateWithFallback(t, backendErr.detail))
        }
    }, [checklistsError, stationsError, t])

    // const filterFormik = useFormik({
    //     initialValues: {
    //         status: filters.status
    //         // start: "",
    //         // end: ""
    //     },
    //     validationSchema: Yup.object().shape({
    //         status: Yup.number()
    //         // start: Yup.string(),
    //         // end: Yup.string()
    //     }),
    //     onSubmit: async (values) => {
    //         console.log(values.status || undefined)

    //         setFilter({ status: values.status || undefined })
    //         await refetchContracts()
    //     }
    // })

    return (
        <div className="py-8 px-12 shadow-2xs rounded-2xl bg-white text-center">
            <div className="text-3xl pb-6 font-bold text-center text-primary">
                <p>{t("user.rental_contracts")}</p>
            </div>

            <div className="mb-3 flex gap-2">
                <AutocompleteStyle
                    label={t("vehicle_model.station")}
                    items={stations}
                    startContent={<MapPinAreaIcon className="text-xl" />}
                    selectedKey={filters.contractId}
                    onSelectionChange={async (key) => {
                        setFilter((prev) => {
                            return {
                                ...prev,
                                contractId: key as string | undefined
                            }
                        })
                        await refetchChecklists()
                    }}
                    className="max-w-60 h-20 mr-0"
                >
                    {(stations ?? []).map((item) => (
                        <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                    ))}
                </AutocompleteStyle>
                <EnumPicker
                    label={t("table.status")}
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
                <Spinner className="min-w-[60rem]" />
            ) : (
                <TableStyled className="w-full min-w-[60rem]">
                    <TableHeader>
                        <TableColumn className="text-sm text-center">{t("table.id")}</TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.vehicle")}
                        </TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.staff")}
                        </TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.customer")}
                        </TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.contract_id")}
                        </TableColumn>
                        <TableColumn className="text-sm text-center">{t("table.type")}</TableColumn>
                    </TableHeader>

                    <TableBody>
                        {checklists!.map((item) => (
                            <TableRow
                                key={item.id}
                                className="border-b border-gray-300 cursor-pointer"
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
                                    {VehicleChecklistTypeLabels[item.type]}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableStyled>
            )}
        </div>
    )
}
