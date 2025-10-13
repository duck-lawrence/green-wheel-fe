"use client"
// import BrandPicker from "@/components/modules/UserItem/BrandPicker"
import React, { useEffect, useState } from "react"
import { EnumPicker, TableStyled } from "@/components"
import { useTranslation } from "react-i18next"
import { Spinner, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useDay, useGetMyContract } from "@/hooks"
import { RentalContractStatus } from "@/constants/enum"
import { BackendError } from "@/models/common/response"
import toast from "react-hot-toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { RentalContractStatusLabels } from "@/constants/labels"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"

export default function RentalContractPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const [filters, setFilter] = useState<{ status?: RentalContractStatus }>({})

    const {
        data: contracts,
        isLoading: isContractsLoading,
        error: contractsError,
        refetch: refetchContracts
    } = useGetMyContract(filters)

    useEffect(() => {
        if (contractsError) {
            const backendErr = contractsError as BackendError
            toast.error(translateWithFallback(t, backendErr.detail))
        }
    }, [contractsError, t])

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

            <div className="mb-3 flex">
                <EnumPicker
                    label={t("table.status")}
                    labels={RentalContractStatusLabels}
                    onChange={async (key) => {
                        setFilter({
                            status: key == null ? undefined : (key as RentalContractStatus)
                        })
                        await refetchContracts()
                        // filterFormik.handleSubmit()
                    }}
                    className="max-w-48"
                />

                {/* <form onSubmit={filterFormik.handleSubmit} className="flex gap-4 max-h-12">
                    <DateRangePickerStyled
                        label={t("table.pickup_return_time")}
                        onChange={(val) => {
                            if (!val) {
                                filterFormik.setFieldValue("start", null)
                                filterFormik.setFieldValue("end", null)
                                return
                            }

                            const startStr = val.start
                                ? dayjs(val.start.toDate(DEFAULT_TIMEZONE)).format("YYYY-MM-DD")
                                : ""
                            const endStr = val.end
                                ? dayjs(val.end.toDate(DEFAULT_TIMEZONE)).format("YYYY-MM-DD")
                                : ""

                            filterFormik.setFieldValue("start", startStr)
                            filterFormik.setFieldValue("end", endStr)
                            filterFormik.handleSubmit()
                        }}
                    />
                </form> */}
            </div>

            {isContractsLoading ? (
                <Spinner className="min-w-[60rem]" />
            ) : (
                <TableStyled className="w-full min-w-[60rem]">
                    <TableHeader>
                        <TableColumn className="text-sm text-center">{t("table.id")}</TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.vehicle_model")}
                        </TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.pickup_time")}
                        </TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.return_time")}
                        </TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.station")}
                        </TableColumn>
                        <TableColumn className="text-sm text-center">
                            {t("table.status")}
                        </TableColumn>
                    </TableHeader>

                    <TableBody>
                        {contracts!.map((item) => (
                            <TableRow
                                key={item.id}
                                className="border-b border-gray-300 cursor-pointer"
                                onClick={() => router.push(`/rental-contracts/${item.id}`)}
                            >
                                <TableCell className="text-center w-fit">{item.id}</TableCell>
                                <TableCell className="text-center">
                                    {item.vehicle.model.name}
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatDateTime({ date: item.startDate })}
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatDateTime({ date: item.endDate })}
                                </TableCell>
                                <TableCell className="text-center">{item.station.name}</TableCell>
                                <TableCell className="text-center">
                                    {RentalContractStatusLabels[item.status]}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableStyled>
            )}
        </div>
    )
}
