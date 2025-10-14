"use client"
import { InputStyled } from "@/components"
import { TableCheckList } from "@/components/modules/TableCheckList"
import { VehicleChecklistTypeLabels } from "@/constants/labels"
import { mockVehicleChecklists } from "@/data/mockCheckList"

import React from "react"
import { useTranslation } from "react-i18next"

export default function VehicleChecklistPage() {
    const { t } = useTranslation()
    const data = mockVehicleChecklists.find((v) => v.id === "CHK001")
    return (
        <div className="rounded-2xl bg-white shadow-md px-8 py-10 border border-gray-100 max-w-6xl mx-auto mt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    Check List –{" "}
                    <span className="text-primary">{VehicleChecklistTypeLabels[data!.type]}</span>
                </h2>
                {/* <p className="text-gray-500 text-sm mt-2 md:mt-0 italic">
                    #{data?.id} • Vehicle ID: {data?.vehicleId}
                </p> */}
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-10">
                <div className="flex flex-col gap-4">
                    <InputStyled
                        label="Checklist Type"
                        value={VehicleChecklistTypeLabels[data!.type]}
                        readOnly
                    />
                    <InputStyled label="Contract ID" value={data?.contractId ?? "---"} readOnly />
                </div>

                <div className="flex flex-col gap-4">
                    <InputStyled
                        label="Staff Name"
                        value={data?.staffId ?? "Unassigned"}
                        readOnly
                    />
                    <InputStyled label="Customer Name" value={data?.customerId ?? "N/A"} readOnly />
                </div>

                <div className="flex flex-col gap-4">
                    <InputStyled
                        label="Vehicle License Plate"
                        value={data?.vehicleId ?? "Unknown"}
                        readOnly
                    />
                    <InputStyled label="Status" value="Pending Approval" readOnly />
                </div>
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* Table */}
            <TableCheckList
                vehicleCheckListItem={data?.vehicleChecklistItems}
                onStatusChange={() => console.log("Checklist updated")}
            />
        </div>
    )
}
