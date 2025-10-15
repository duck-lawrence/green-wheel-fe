"use client"
import { InputStyled, SpinnerStyled } from "@/components"
import { TableCheckList } from "@/components/modules/TableCheckList"
import { VehicleChecklistTypeLabels } from "@/constants/labels"
import { useGetByIdVehicleChecklist } from "@/hooks"
import { useParams } from "next/navigation"

import React from "react"
import { useTranslation } from "react-i18next"

export default function VehicleChecklistDetailge() {
    const { t } = useTranslation()
    const { id } = useParams()

    const { data: checklistItem, isLoading } = useGetByIdVehicleChecklist({
        id: id as string,
        enabled: true
    })

    if (isLoading) {
        return <SpinnerStyled />
    }

    // const checklistItem = mockVehicleChecklists.find((v) => v.id === "CHK001")
    return (
        <div className="rounded-2xl bg-white shadow-md px-8 py-10 border border-gray-100 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    {t("vehicle_checklist.checklist")} –{" "}
                    <span className="text-primary">
                        {VehicleChecklistTypeLabels[checklistItem!.type]}
                    </span>
                </h2>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-10">
                <div className="flex flex-col gap-4">
                    <InputStyled
                        label={t("vehicle_checklist.checklist_type")}
                        value={VehicleChecklistTypeLabels[checklistItem!.type]}
                        readOnly
                    />
                    <InputStyled
                        label={t("vehicle_checklist.contract_id")}
                        value={checklistItem?.contractId}
                        readOnly
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <InputStyled
                        label={t("vehicle_checklist.staff_name")}
                        value={`${checklistItem?.staff.firstName}  ${checklistItem?.staff.lastName}`}
                        readOnly
                    />
                    <InputStyled
                        label={t("vehicle_checklist.customer_name")}
                        value={`${checklistItem?.customer?.firstName} ${checklistItem?.customer?.lastName}`}
                        readOnly
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <InputStyled
                        label={t("vehicle_checklist.vehicle_license_plate")}
                        value={checklistItem?.vehicle.licensePlate}
                        readOnly
                    />
                    <InputStyled
                        label={t("vehicle_checklist.status")}
                        value="Pending Approval"
                        readOnly
                    />
                </div>
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* Table */}
            <TableCheckList
                vehicleCheckListItem={checklistItem?.vehicleChecklistItems}
                onStatusChange={() => console.log("Checklist updated")}
            />
        </div>
    )
}
