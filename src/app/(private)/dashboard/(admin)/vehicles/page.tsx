"use client"

import React from "react"
import { AdminVehicleManagementView, SpinnerStyled } from "@/components"
import { useGetMe } from "@/hooks"

export default function AdminVehicleManagementPage() {
    const { data: user } = useGetMe()

    if (!user) return <SpinnerStyled />

    return <AdminVehicleManagementView myStation={user.station!} />
}
