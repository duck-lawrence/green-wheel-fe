"use client"
import { CreateVehicleSegmentModal, UpdateVehicleSegmentModal } from "@/components/modals"
import { ButtonStyled, TableStyled } from "@/components/styled"
import { useGetAllVehicleSegments } from "@/hooks"
import {
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@heroui/react"
import { Pencil, PlusCircle } from "lucide-react"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

export function VehicleSegment() {
    const { t } = useTranslation()
    const { onOpen: onOpenCreate, onClose: onCloseCreate, isOpen: isOpenCreate } = useDisclosure()
    const { onOpen: onOpenUpdate, onClose: onCloseUpdate, isOpen: isOpenUpdate } = useDisclosure()

    const [selectedId, setSelectedId] = useState<string | null>(null)

    const { data: vehicleSegments, isLoading } = useGetAllVehicleSegments()

    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <div className="flex justify-end">
                <ButtonStyled
                    color="primary"
                    onPress={onOpenCreate}
                    className="m-2 btn-gradient btn-gradient:hover btn-gradient:active"
                >
                    <PlusCircle size={18} />
                    {t("common.create")}
                </ButtonStyled>
            </div>

            <div
                className="overflow-x-auto overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm"
                style={{ maxHeight: "550px" }}
            >
                <TableStyled className="min-w-full text-sm md:text-base" removeWrapper>
                    <TableHeader className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 shadow-sm">
                        <TableColumn className="text-center text-gray-700 font-semibold">
                            No.
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold">
                            {t("table.name")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold">
                            {t("table.description")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold w-36">
                            {t("table.action")}
                        </TableColumn>
                    </TableHeader>

                    <TableBody>
                        {vehicleSegments!.map((item, index) => (
                            <TableRow
                                key={item.id}
                                className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                            >
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="text-center">{item.name}</TableCell>
                                <TableCell className="text-center max-w-[250px] truncate break-words">
                                    {item.description}
                                </TableCell>
                                <TableCell className="text-center">
                                    {/* <ButtonStyled
                                        color="primary"
                                        variant="bordered"
                                        className="h-8 w-18 font-medium rounded-full"
                                        onPress={() => {
                                            setSelectedId(item.id)
                                            onOpenUpdate()
                                        }}
                                    >
                                        <Pencil size={15} className="mr-1" />
                                        {t("common.update")}
                                    </ButtonStyled> */}
                                    <ButtonStyled
                                        variant="flat"
                                        className="h-8 w-auto px-4 rounded-full border border-primary text-green-600 hover:bg-green-100transition"
                                        onPress={() => {
                                            setSelectedId(item.id)
                                            onOpenUpdate()
                                        }}
                                    >
                                        <Pencil size={15} className="mr-1" />
                                        {t("common.update")}
                                    </ButtonStyled>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableStyled>
            </div>

            {/* Modal */}
            <CreateVehicleSegmentModal isOpen={isOpenCreate} onClose={onCloseCreate} />
            <UpdateVehicleSegmentModal
                isOpen={isOpenUpdate}
                onClose={onCloseUpdate}
                id={selectedId!}
            />
        </div>
    )
}
