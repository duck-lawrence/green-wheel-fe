"use client"
import { SpinnerStyled, StatisticPage } from "@/components"
import { useGetMe } from "@/hooks"
import React from "react"

export default function StationStatisticPage() {
    const { data: me } = useGetMe()

    if (!me?.station?.id) return <SpinnerStyled />

    return <StatisticPage adminStationId={me.station.id} />
}
