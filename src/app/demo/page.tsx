"use client"
import { ButtonStyled, SpinnerStyled, TableStyled } from "@/components"
import { useGetAllDispatch, useGetMe } from "@/hooks"
import { Chip, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "recharts"

export default function DispatchAllPage() {
    const { t } = useTranslation()
    const { data: user } = useGetMe()

    const { data: dispaths, isLoading } = useGetAllDispatch({
        params: { toStation: user?.station?.id },
        enabled: true
    })

    if (isLoading) return <SpinnerStyled />

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <TableStyled className="min-w-full text-sm md:text-base" removeWrapper>
                <TableHeader>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        STT
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        From station
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        vehicle
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        staff
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        des
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        Action
                    </TableColumn>
                </TableHeader>

                <TableBody>
                    {dispaths!.map((item, index) => {
                        return (
                            <TableRow
                                key={item.id}
                                className="hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                            >
                                <TableCell className="text-center text-gray-700">
                                    {index + 1}
                                </TableCell>
                                <TableCell className="text-center text-gray-700 font-medium">
                                    {item.toStationId}
                                </TableCell>
                                {/* <TableCell className="text-center text-gray-700 font-medium">
                                    {item.staffs}
                                </TableCell>
                                <TableCell className="text-center text-gray-600">
                                    {item.vehicles}
                                </TableCell> */}
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {item.staffs.slice(0, 3).map((s) => (
                                            <Chip
                                                key={s.id}
                                                size="sm"
                                                color="primary"
                                                variant="flat"
                                            >
                                                {s.firstName}
                                            </Chip>
                                        ))}
                                        {item.staffs.length > 3 && (
                                            <Tooltip
                                                content={item.staffs.slice(3).map((s) => (
                                                    <p key={s.id}>
                                                        {s.firstName} {s.lastName}
                                                    </p>
                                                ))}
                                            >
                                                <Chip size="sm" color="default" variant="bordered">
                                                    +{item.staffs.length - 3}
                                                </Chip>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {item.vehicles.slice(0, 3).map((s) => (
                                            <Chip
                                                key={s.id}
                                                size="sm"
                                                color="primary"
                                                variant="flat"
                                            >
                                                {s.licensePlate}
                                            </Chip>
                                        ))}
                                        {item.vehicles.length > 3 && (
                                            <Tooltip
                                                content={item.vehicles.slice(3).map((s) => (
                                                    <p key={s.id}></p>
                                                ))}
                                            >
                                                <Chip size="sm" color="default" variant="bordered">
                                                    +{item.vehicles.length - 3}
                                                </Chip>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>

                                <TableCell className="text-center text-gray-600">
                                    {item.description}
                                </TableCell>

                                {/* action */}
                                <TableCell className="text-center">
                                    {item.status  ?? (
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                                            {/* Approved */}
                                            <ButtonStyled
                                                color="primary"
                                                variant="bordered"
                                                className="h-7 w-20 border-1 border-primary hover:text-white hover:bg-primary font-semibold px-5 py-2 rounded-lg"
                                                onPress={() => handleAccept(item.id)}
                                                hidden={isLoading(item.id)}
                                            >
                                                {t("rental_contract.accept")}
                                            </ButtonStyled>

                                            {/* Reject */}
                                            <ButtonStyled
                                                color="primary"
                                                variant="bordered"
                                                className="h-7 w-20 border-1 border-primary hover:text-white hover:bg-primary font-semibold px-5 py-2 rounded-lg"
                                                onPress={() => handleAccept(item.id)}
                                                hidden={isLoading(item.id)}
                                            >
                                                {t("rental_contract.accept")}
                                            </ButtonStyled>

                                            {/* Cancel */}
                                            <ButtonStyled
                                                color="primary"
                                                variant="bordered"
                                                className="h-7 w-20 border-1 border-primary hover:text-white hover:bg-primary font-semibold px-5 py-2 rounded-lg"
                                                onPress={() => handleAccept(item.id)}
                                                hidden={isLoading(item.id)}
                                            >
                                                {t("rental_contract.accept")}
                                            </ButtonStyled>

                                            {/* Received */}
                                            <ButtonStyled
                                                color="primary"
                                                variant="bordered"
                                                className="h-7 w-20 border-1 border-primary hover:text-white hover:bg-primary font-semibold px-5 py-2 rounded-lg"
                                                onPress={() => handleAccept(item.id)}
                                                hidden={isLoading(item.id)}
                                            >
                                                {t("rental_contract.accept")}
                                            </ButtonStyled>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            {t("rental_contract.no_action")}
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </TableStyled>
        </div>
    )
}
