"use client"
import { SpinnerStyled, VehicleChecklistDetail } from "@/components"
import { useParams } from "next/navigation"
import React from "react"

export default function VehicleChecklistDetailPage() {
    const { id } = useParams()
    const checklistId = id?.toString()

    if (!checklistId) return <SpinnerStyled />

    return <VehicleChecklistDetail id={checklistId} isStaff={true} />
}
