"use client"

import {
    ButtonStyled,
    DispatchInfo,
    SectionStyled,
    SpinnerStyled,
    TableSelectionStaff,
    TableSelectionVehicle
} from "@/components"
import { DispatchRequestStatus } from "@/constants/enum"
import { useGetDispatchById, useGetMe, useUpdateDispatch } from "@/hooks"
import { UserSwitch, Car } from "@phosphor-icons/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchDetailPage() {
    const { t } = useTranslation()
    const { id } = useParams()
    const dispatchId = id?.toString()
    const { data: user } = useGetMe()
    const stationIdNow = user?.station?.id || ""
    const { data: dispatch } = useGetDispatchById({ id: dispatchId!, enabled: true })

    // Update
    const updateDispatch = useUpdateDispatch({})
    const handleUpdateDispatch = useCallback(
        async (status: DispatchRequestStatus) => {
            if (!dispatch?.id) return
            await updateDispatch.mutateAsync({ id: dispatch.id, req: { status } })
        },
        [dispatch?.id, updateDispatch]
    )

    // Display conditions
    const pendingApproveDisplay =
        dispatch?.status === DispatchRequestStatus.Pending &&
        stationIdNow === dispatch?.fromStationId
    const cancelDisplay =
        dispatch?.status === DispatchRequestStatus.Pending && stationIdNow === dispatch?.toStationId
    const confirmDisplay =
        (dispatch?.status === DispatchRequestStatus.Approved ||
            dispatch?.status === DispatchRequestStatus.ConfirmApproved) &&
        stationIdNow === dispatch?.toStationId

    if (!dispatchId || !dispatch) return <SpinnerStyled />

    return (
        <div className="max-w-6xl mx-auto w-full">
            <DispatchInfo dispatch={dispatch} />

            {/* Tables */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <SectionStyled
                    title={t("dispatch.assigned_staff")}
                    icon={UserSwitch}
                    sectionClassName="w-full mb-0"
                >
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                        <TableSelectionStaff
                            stationId={stationIdNow}
                            staffs={dispatch.dispatchRequestStaffs}
                            selectionBehavior="replace"
                        />
                    </div>
                </SectionStyled>

                <div className="hidden sm:block w-[5px] bg-default self-stretch"></div>

                <SectionStyled
                    title={t("dispatch.assigned_vehicle")}
                    icon={Car}
                    sectionClassName="w-full mb-0"
                >
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                        <TableSelectionVehicle
                            stationId={stationIdNow}
                            vehicles={dispatch.dispatchRequestVehicles}
                            selectionBehavior="replace"
                        />
                    </div>
                </SectionStyled>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
                {pendingApproveDisplay && (
                    <>
                        <Link href={`/dashboard/dispatchs/${dispatch.id}/approve`}>
                            <ButtonStyled className="btn-gradient px-6 py-2">
                                {t("dispatch.open_approve_page")}
                            </ButtonStyled>
                        </Link>

                        <ButtonStyled
                            variant="ghost"
                            color="danger"
                            className="font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                            onPress={() => handleUpdateDispatch(DispatchRequestStatus.Cancelled)}
                        >
                            {t("enum.rejected")}
                        </ButtonStyled>
                    </>
                )}
                {cancelDisplay && (
                    <ButtonStyled
                        variant="ghost"
                        className="font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                        onPress={() => handleUpdateDispatch(DispatchRequestStatus.Cancelled)}
                    >
                        {t("enum.cancelled")}
                    </ButtonStyled>
                )}
                {confirmDisplay && dispatch.status === DispatchRequestStatus.Approved ? (
                    <>
                        <ButtonStyled
                            className="btn-gradient
                                    text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                            onPress={() =>
                                handleUpdateDispatch(DispatchRequestStatus.ConfirmApproved)
                            }
                        >
                            {t("enum.confirm_approved")}
                        </ButtonStyled>
                        <ButtonStyled
                            variant="ghost"
                            className="font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                            onPress={() => handleUpdateDispatch(DispatchRequestStatus.Cancelled)}
                        >
                            {t("enum.cancelled")}
                        </ButtonStyled>
                    </>
                ) : (
                    dispatch.status === DispatchRequestStatus.ConfirmApproved && (
                        <>
                            <ButtonStyled
                                className="btn-gradient
                                            text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                                onPress={() => handleUpdateDispatch(DispatchRequestStatus.Received)}
                            >
                                {t("enum.received")}
                            </ButtonStyled>
                        </>
                    )
                )}
            </div>
        </div>
    )
}
