"use client"

import React from "react"
import { useParams } from "next/navigation"
import { SpinnerStyled } from "@/components"
import { AdminFleetDetail } from "@/components"

export default function AdminFleetDetailPage() {
    const { id } = useParams()
    const modelId = id?.toString()

    if (!modelId) return <SpinnerStyled />

    return <AdminFleetDetail modelId={modelId} />
}
