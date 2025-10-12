"use client"
// import BrandPicker from "@/components/modules/UserItem/BrandPicker"
import React, { useEffect, useState } from "react"
import { FillterBarOrder, TableStyled } from "@/components"
import { orders } from "@/data/order"
import { useTranslation } from "react-i18next"
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { useRouter } from "next/navigation"

export default function RentalContractPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const [order] = useState(orders)
    const [filters, setFilter] = useState({})

    useEffect(() => {
        if (filters) {
            console.log("data filter gửi BE:", filters)
            //fetch api
        }
    }, [filters])
    return (
        <div className="py-8 px-12 shadow-2xs rounded-2xl bg-white">
            <div className="text-3xl pb-6 font-bold text-center text-primary">
                <p>{t("user.rental_contracts")}</p>
            </div>

            <div className="mb-3">
                <FillterBarOrder onFilterChange={() => setFilter(filters)} />
            </div>

            <TableStyled aria-label="Example static collection table" className="w-full">
                <TableHeader>
                    <TableColumn className="text-xl text-center">{t("table.order")}</TableColumn>
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
                        {t("table.pickup_address")}
                    </TableColumn>
                    <TableColumn className="text-xl text-center">{t("table.status")}</TableColumn>
                </TableHeader>

                <TableBody>
                    {order.map((item) => (
                        <TableRow
                            key={item.order}
                            className="border-b border-gray-300 cursor-pointer"
                            onClick={() => router.push(`/rental-contracts/${item.order}`)}
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
        </div>
    )
}
