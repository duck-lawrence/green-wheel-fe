"use client"

import { ButtonStyled, InputStyled, SectionStyled, SpinnerStyled } from "@/components"
import TableSelectionStaff from "@/components/modules/TableSelectionStaff"
import TableSelectionVehicle from "@/components/modules/TableSelectionVehicle/indesx"
import { DispatchRequestStatus } from "@/constants/enum"
import { DispatchRequestStatusLabels } from "@/constants/labels"
import { useGetDispatchById, useGetMe, useUpdateDispatch } from "@/hooks"
import { UserSwitch, Car } from "@phosphor-icons/react"
import { useParams } from "next/navigation"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchDetailPage() {
    const { t } = useTranslation()
    const { id } = useParams()
    const dispatchId = id?.toString()
    const { data: user } = useGetMe()
    const stationNow = user?.station?.id
    const { data: dispatchDetail } = useGetDispatchById({ id: dispatchId!, enabled: true })
    const updateDispatch = useUpdateDispatch({})

    // Update
    const handleUpdateDispatch = useCallback(
        async (status: DispatchRequestStatus) => {
            if (!dispatchDetail?.id) return
            await updateDispatch.mutateAsync({ id: dispatchDetail.id, req: { status } })
        },
        [dispatchDetail?.id, updateDispatch]
    )

    // Display conditions
    const display1 =
        dispatchDetail?.status === DispatchRequestStatus.Pending &&
        stationNow === dispatchDetail?.fromStationId
    const display2 =
        dispatchDetail?.status === DispatchRequestStatus.Pending &&
        stationNow === dispatchDetail?.toStationId
    const display3 =
        dispatchDetail?.status === DispatchRequestStatus.Approved &&
        stationNow === dispatchDetail?.toStationId

    if (!dispatchId || !dispatchDetail) return <SpinnerStyled />

    return (
        <div className="max-w-6xl mx-auto w-full bg-white p-10 rounded-2xl shadow-md border border-gray-100">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-primary tracking-wide">
                    {t("dispatch.dispatch_detail")}
                </h1>
            </div>

            {/* Station Info */}
            <SectionStyled title={t("dispatch.station_information")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-gray-800 font-semibold mb-1">
                            {t("dispatch.station_form")}
                        </h3>
                        <InputStyled
                            label={t("dispatch.station_id")}
                            value={dispatchDetail?.fromStationId}
                            readOnly
                        />
                        <InputStyled
                            label={t("dispatch.station_name")}
                            value={dispatchDetail?.fromStationName}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-gray-800 font-semibold mb-1">
                            {t("dispatch.to_station")}
                        </h3>
                        <InputStyled
                            label={t("dispatch.station_id")}
                            value={dispatchDetail?.toStationId}
                            readOnly
                        />
                        <InputStyled
                            label={t("dispatch.station_name")}
                            value={dispatchDetail?.toStationName}
                            readOnly
                        />
                    </div>
                </div>
            </SectionStyled>

            {/* Status */}
            <SectionStyled title={t("dispatch.cur_status")}>
                <div className="flex flex-wrap items-center gap-3">
                    <InputStyled
                        className="max-w-xs"
                        label={t("dispatch.dispatch_status")}
                        value={DispatchRequestStatusLabels[dispatchDetail.status]}
                        readOnly
                    />
                </div>
            </SectionStyled>

            {/* Action Buttons */}
            <SectionStyled title={t("table.action")}>
                <div className="flex flex-wrap gap-3">
                    {display1 && (
                        <>
                            <ButtonStyled
                                className="btn-gradient btn-gradient:hover btn-gradient:active
                           text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                                onPress={() => handleUpdateDispatch(DispatchRequestStatus.Approved)}
                            >
                                {t("enum.approved")}
                            </ButtonStyled>

                            <ButtonStyled
                                className=" bg-danger
                           text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                                onPress={() => handleUpdateDispatch(DispatchRequestStatus.Rejected)}
                            >
                                {t("enum.rejected")}
                            </ButtonStyled>
                        </>
                    )}
                    {display2 && (
                        <ButtonStyled
                            className="bg-white border-2 border-gray-400
                         text-gray-800 font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                            onPress={() => handleUpdateDispatch(DispatchRequestStatus.Cancelled)}
                        >
                            {t("enum.cancelled")}
                        </ButtonStyled>
                    )}
                    {display3 && (
                        <ButtonStyled
                            className="btn-gradient btn-gradient:hover btn-gradient:active
                         text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
                            onPress={() => handleUpdateDispatch(DispatchRequestStatus.Received)}
                        >
                            {t("enum.received")}
                        </ButtonStyled>
                    )}
                </div>
            </SectionStyled>

            {/* Staff & Vehicle Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-8">
                <SectionStyled title={t("dispatch.assigned_staff")} icon={UserSwitch}>
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                        <TableSelectionStaff staffs={dispatchDetail?.staffs ?? []} />
                    </div>
                </SectionStyled>

                <SectionStyled title={t("dispatch.assigned_vehicle")} icon={Car}>
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                        <TableSelectionVehicle vehicles={dispatchDetail?.vehicles ?? []} />
                    </div>
                </SectionStyled>
            </div>
        </div>
    )
}
