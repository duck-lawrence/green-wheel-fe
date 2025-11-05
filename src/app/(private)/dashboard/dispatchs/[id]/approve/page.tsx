"use client"
import { AlertModal, ButtonStyled, SpinnerStyled, TableStyled } from "@/components"
import { DispatchRequestStatus } from "@/constants/enum"
import {
    useConfirmDispatch,
    useGetDispatchById,
    useGetValidStationsForDispatch
} from "@/hooks/queries/useDispatch"
import {
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@heroui/react"
import { useParams } from "next/navigation"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchApprovePage() {
    const { t } = useTranslation()
    const { id } = useParams()
    const dispatchId = id?.toString()
    const { data: dispatch } = useGetDispatchById({ id: dispatchId!, enabled: true })
    const { data: validStations, isLoading: isValidStationsLoading } =
        useGetValidStationsForDispatch({
            id: dispatchId!,
            enabled: !!dispatchId
        })

    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()

    const [selectedStationId, setSelectedStationId] = useState<string>()
    const confirmMutation = useConfirmDispatch({})
    const handleConfirm = useCallback(
        (status: DispatchRequestStatus) => {
            // if (!selectedStationId) return
            confirmMutation.mutate({
                id: dispatchId!,
                req: {
                    status,
                    fromStationId: selectedStationId
                }
            })
        },
        [confirmMutation, dispatchId, selectedStationId]
    )

    if (isValidStationsLoading || !dispatch) return <SpinnerStyled />

    return (
        <>
            {/* Table valid stations */}
            <TableStyled
                color="primary"
                selectionMode="single"
                onSelectionChange={(keys) => {
                    const id = Array.from(keys)[0]
                    setSelectedStationId(id ? String(id) : undefined)
                }}
                classNames={{
                    base: "max-h-[400px] overflow-scroll",
                    table: "min-h-[300px]"
                }}
            >
                <TableHeader>
                    <TableColumn>{t("table.id")}</TableColumn>
                    <TableColumn>{t("table.name")}</TableColumn>
                    <TableColumn>{t("station.address")}</TableColumn>
                </TableHeader>

                <TableBody
                    items={validStations || []}
                    emptyContent={t("dispatch.no_valid_station")}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.address}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </TableStyled>

            <div className="flex justify-center items-center gap-2">
                <ButtonStyled
                    className="btn-gradient px-6 py-2"
                    isDisabled={!selectedStationId}
                    onPress={onOpen}
                >
                    {t("dispatch.approve")}
                </ButtonStyled>
                <AlertModal
                    header={t("common.confirm_to_submit")}
                    body={t("common.confirm_to_submit_body")}
                    isOpen={isOpen && !!selectedStationId}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                    onConfirm={() => {
                        handleConfirm(DispatchRequestStatus.Approved)
                    }}
                />
                <ButtonStyled
                    variant="ghost"
                    color="danger"
                    className="font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                    onPress={() => handleConfirm(DispatchRequestStatus.Rejected)}
                >
                    {t("dispatch.reject")}
                </ButtonStyled>
            </div>
        </>
    )
}
