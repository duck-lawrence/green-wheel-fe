"use client"

import {
    ButtonStyled,
    InputStyled,
    SectionStyled,
    SpinnerStyled,
    TableSelectionStaff,
    TableSelectionVehicle,
    TextareaStyled
} from "@/components"
import { DispatchRequestStatusColorMap } from "@/constants/colorMap"
import { DispatchRequestStatus } from "@/constants/enum"
import { DispatchRequestStatusLabels } from "@/constants/labels"
import { useGetDispatchById, useGetMe, useUpdateDispatch } from "@/hooks"
import { Chip } from "@heroui/react"
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
            {/* Header */}
            <div className="text-center mb-10 space-y-2">
                <h1 className="text-3xl font-bold text-primary tracking-wide">
                    {t("dispatch.dispatch_detail")}
                </h1>
                <Chip variant="bordered" color={DispatchRequestStatusColorMap[dispatch.status]}>
                    {DispatchRequestStatusLabels[dispatch.status]}
                </Chip>
            </div>

            {/* Station Info */}
            <SectionStyled title={t("dispatch.station_information")}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                    <div className="flex flex-col gap-3 w-full">
                        <h3 className="text-gray-800 font-semibold mb-1">
                            {t("dispatch.form_station")}
                        </h3>
                        <InputStyled
                            label={t("dispatch.station_id")}
                            value={dispatch?.fromStationId}
                            readOnly
                        />
                        <InputStyled
                            label={t("dispatch.station_name")}
                            value={dispatch?.fromStationName}
                            readOnly
                        />
                    </div>
                    <div className="hidden sm:block w-[5px] bg-default self-stretch"></div>
                    <div className="flex flex-col gap-3 w-full">
                        <h3 className="text-gray-800 font-semibold mb-1">
                            {t("dispatch.to_station")}
                        </h3>
                        <InputStyled
                            label={t("dispatch.station_id")}
                            value={dispatch?.toStationId}
                            readOnly
                        />
                        <InputStyled
                            label={t("dispatch.station_name")}
                            value={dispatch?.toStationName}
                            readOnly
                        />
                    </div>
                </div>
            </SectionStyled>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-10">
                <SectionStyled title={t("dispatch.description")} sectionClassName="w-full">
                    <div className="flex flex-col gap-3">
                        <TextareaStyled
                            label={t("dispatch.description")}
                            value={dispatch?.description}
                            readOnly
                        />
                    </div>
                </SectionStyled>
                {/* <div className="hidden sm:block w-[5px] bg-default self-stretch"></div>
                
                <SectionStyled title={t("table.action")} sectionClassName="w-full">
                    <div className="flex flex-wrap gap-3">
                        {pendingApproveDisplay && (
                            <>
                                <Link href={`/dashboard/dispatch/${dispatch.id}/approve`}>
                                    <ButtonStyled
                                        className="btn-gradient
                           text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                                    >
                                        {t("enum.approved")}
                                    </ButtonStyled>
                                </Link>

                                <ButtonStyled
                                    variant="ghost"
                                    color="danger"
                                    className="font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                                    onPress={() =>
                                        handleUpdateDispatch(DispatchRequestStatus.Cancelled)
                                    }
                                >
                                    {t("enum.rejected")}
                                </ButtonStyled>
                            </>
                        )}
                        {cancelDisplay && (
                            <ButtonStyled
                                variant="ghost"
                                className="font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                                onPress={() =>
                                    handleUpdateDispatch(DispatchRequestStatus.Cancelled)
                                }
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
                                    onPress={() =>
                                        handleUpdateDispatch(DispatchRequestStatus.Cancelled)
                                    }
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
                                        onPress={() =>
                                            handleUpdateDispatch(DispatchRequestStatus.Received)
                                        }
                                    >
                                        {t("enum.received")}
                                    </ButtonStyled>
                                </>
                            )
                        )}
                    </div>
                </SectionStyled> */}
            </div>

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
                        <Link href={`/dashboard/dispatch/${dispatch.id}/approve`}>
                            <ButtonStyled
                                className="btn-gradient
                           text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                            >
                                {t("enum.approved")}
                            </ButtonStyled>
                        </Link>

                        <ButtonStyled
                            variant="ghost"
                            color="danger"
                            className="font-semibold px-6 py-2 rounded-lg transition-all duration-300"
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
