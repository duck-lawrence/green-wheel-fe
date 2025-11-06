"use client"
import { AlertModal, ButtonStyled, SectionStyled, SpinnerStyled, TableStyled } from "@/components"
import { DispatchRequestStatus } from "@/constants/enum"
import {
    useConfirmDispatch,
    useGetDispatchById,
    useGetValidStationsForDispatch
} from "@/hooks/queries/useDispatch"
import {
    Spinner,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure
} from "@heroui/react"
import { useParams, useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchApprovePage() {
    const { t } = useTranslation()
    const router = useRouter()

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
    const confirmMutation = useConfirmDispatch({
        onSuccess: () => router.push(`/dashboard/dispatchs/${dispatchId}`)
    })
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

    useEffect(() => {
        if (dispatch && dispatch.status !== DispatchRequestStatus.Pending) {
            router.replace(`/dashboard/dispatchs/${dispatch.id}`)
        }
    }, [dispatch, router])

    if (!dispatch) return <SpinnerStyled />

    return (
        <>
            <SectionStyled title={t("dispatch.valid_station")}>
                {/* Table valid stations */}
                <TableStyled
                    color="primary"
                    selectionMode="single"
                    onSelectionChange={(keys) => {
                        const id = Array.from(keys)[0]
                        setSelectedStationId(id ? String(id) : undefined)
                    }}
                    classNames={{
                        base: "max-h-[400px] overflow-scroll"
                    }}
                >
                    <TableHeader>
                        <TableColumn className="w-sm py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {t("table.id")}
                        </TableColumn>
                        <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {t("table.name")}
                        </TableColumn>
                        <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                            {t("station.address")}
                        </TableColumn>
                    </TableHeader>

                    <TableBody
                        items={validStations || []}
                        loadingContent={<Spinner />}
                        loadingState={isValidStationsLoading ? "loading" : "idle"}
                        emptyContent={t("dispatch.no_valid_station")}
                    >
                        {(item) => (
                            <TableRow key={item.id} className="transition-colors hover:bg-slate-50">
                                <TableCell className="py-3 px-4 text-slate-700">
                                    {item.id}
                                </TableCell>
                                <TableCell className="py-3 px-4 text-slate-700">
                                    {item.name}
                                </TableCell>
                                <TableCell className="py-3 px-4 text-slate-700">
                                    {item.address}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </TableStyled>
            </SectionStyled>

            <div className="flex justify-center items-center gap-2">
                {confirmMutation.isPending ? (
                    <Spinner />
                ) : (
                    <>
                        <ButtonStyled
                            className="btn-gradient px-6 py-2"
                            isDisabled={!selectedStationId}
                            onPress={onOpen}
                        >
                            {t("dispatch.approve")}
                        </ButtonStyled>

                        <ButtonStyled
                            variant="ghost"
                            color="danger"
                            className="font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                            onPress={() => handleConfirm(DispatchRequestStatus.Rejected)}
                        >
                            {t("dispatch.reject")}
                        </ButtonStyled>
                    </>
                )}
            </div>
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
        </>
    )
}
