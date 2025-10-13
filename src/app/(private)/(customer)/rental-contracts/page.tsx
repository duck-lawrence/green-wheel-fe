"use client"
// import BrandPicker from "@/components/modules/UserItem/BrandPicker"
import React, { useEffect, useState } from "react"
import { FillterBarOrder, TableStyled } from "@/components"
import { useTranslation } from "react-i18next"
import { Spinner, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useGetMyContract } from "@/hooks"
import { RentalContractStatus } from "@/constants/enum"
import { BackendError } from "@/models/common/response"
import toast from "react-hot-toast"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

export default function RentalContractPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [filters, setFilter] = useState<{ status?: RentalContractStatus }>({})

    const {
        data: contracts,
        isLoading: isContractsLoading,
        error: contractsError
    } = useGetMyContract({ status: 1 })

    useEffect(() => {
        if (filters) {
            console.log("data filter gửi BE:", filters)
            //fetch api
        }
    }, [filters])

    useEffect(() => {
        if (contractsError) {
            const backendErr = contractsError as BackendError
            toast.error(translateWithFallback(t, backendErr.detail))
        }
    }, [contractsError, t])

    return (
        <div className="py-8 px-12 shadow-2xs rounded-2xl bg-white text-center">
            <div className="text-3xl pb-6 font-bold text-center text-primary">
                <p>{t("user.rental_contracts")}</p>
            </div>

            <div className="mb-3">
                <FillterBarOrder onFilterChange={() => setFilter(filters)} />
            </div>

            {isContractsLoading ? (
                <Spinner />
            ) : (
                <TableStyled aria-label="Example static collection table" className="w-full">
                    <TableHeader>
                        <TableColumn className="text-xl text-center">
                            {t("table.order")}
                        </TableColumn>
                        <TableColumn className="text-xl text-center">
                            {t("table.vehicle_model")}
                        </TableColumn>
                        <TableColumn className="text-xl text-center">
                            {t("table.pickup_time")}
                        </TableColumn>
                        <TableColumn className="text-xl text-center">
                            {t("table.return_time")}
                        </TableColumn>
                        <TableColumn className="text-xl text-center">
                            {t("table.station")}
                        </TableColumn>
                        <TableColumn className="text-xl text-center">
                            {t("table.status")}
                        </TableColumn>
                    </TableHeader>

                    <TableBody>
                        {contracts.map((item) => (
                            <TableRow
                                key={item.id}
                                className="border-b border-gray-300 cursor-pointer"
                                onClick={() => router.push(`/rental-contracts/${item.id}`)}
                            >
                                <TableCell className="text-center">{item.order}</TableCell>
                                <TableCell className="text-center">{item.model}</TableCell>
                                <TableCell className="text-center">{item.pickupTime}</TableCell>
                                <TableCell className="text-center">{item.returnTime}</TableCell>
                                <TableCell className="text-center">{item.pickupAddress}</TableCell>
                                <TableCell className="text-center">{item.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableStyled>
            )}
        </div>
    )
}
