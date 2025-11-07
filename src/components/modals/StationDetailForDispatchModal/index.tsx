"use client"
import { InputStyled, ModalStyled, NumberInputStyled, TableStyled } from "@/components"
import { DispatchDescriptionDto } from "@/models/dispatch/schema/response"
import { StationForDispatchRes } from "@/models/station/schema/response"
import {
    ModalBody,
    ModalContent,
    ModalHeader,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"

export function StationDetailForDispatchModal({
    isOpen,
    onOpenChange,
    station,
    dispatchDescription
}: {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    station: StationForDispatchRes
    dispatchDescription: DispatchDescriptionDto
}) {
    const { t } = useTranslation()

    console.log(isOpen)

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={true}
            className="w-fit max-w-screen"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{t("station.detail")}</ModalHeader>
                <ModalBody className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <InputStyled label={t("station.name")} value={station.name} readOnly />
                        <InputStyled
                            label={t("station.address")}
                            value={station.address}
                            isReadOnly
                        />
                    </div>

                    <hr className="text-gray-400 border-2 rounded-2xl" />

                    <div className="flex gap-2 w-xl">
                        <NumberInputStyled
                            labelPlacement="outside"
                            label={t("dispatch.number_staff_need")}
                            className="w-full"
                            value={dispatchDescription?.numberOfStaffs || 0}
                            isReadOnly
                        />
                        <NumberInputStyled
                            labelPlacement="outside"
                            label={t("dispatch.number_staff_assign")}
                            className="w-full"
                            value={station.availableDescription?.numberOfStaffs || 0}
                            isReadOnly
                        />
                    </div>
                    <TableStyled
                        classNames={{
                            base: "max-h-[250px] overflow-scroll"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>{t("vehicle_model.name")}</TableColumn>
                            <TableColumn className="text-center">
                                {t("dispatch.number_vehicle_need")}
                            </TableColumn>
                            <TableColumn className="text-center">
                                {t("dispatch.number_vehicle_assign")}
                            </TableColumn>
                        </TableHeader>
                        <TableBody
                            items={dispatchDescription?.vehicles || []}
                            emptyContent={t("dispatch.no_vehicles_requested")}
                        >
                            {(item) => {
                                const quantityCanAssign =
                                    station.availableDescription.vehicles?.find(
                                        (v) => v.modelId === item.modelId
                                    )?.quantity || 0

                                return (
                                    <TableRow key={item.modelId}>
                                        <TableCell>{item.modelName}</TableCell>
                                        <TableCell className="text-center">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {quantityCanAssign}
                                        </TableCell>
                                    </TableRow>
                                )
                            }}
                        </TableBody>
                    </TableStyled>
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
