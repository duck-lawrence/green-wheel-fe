import { TrendCardStyled } from "@/components/styled"
import React from "react"

// type TrendCardProps = {
//     title: string
//     value: string
//     valueLastMonth: string
//     change: string
//     changeType: "positive" | "neutral" | "negative" // đổi màu changeType
//     trendType: "up" | "neutral" | "down" // đổi dấu mũi tên changeType
//     trendChipPosition?: "top" // đổi vị trí changeType
//     trendChipVariant?: "flat" // bg changeType
// }

export type TrendCardProps = {
    title: string
    value: number
    valueLastMonth: number
    change: number
    changeType?: string
    trendType?: string
    trendChipPosition?: "top"
    trendChipVariant?: "flat"
}

export function KpiStat({ data }: { data: TrendCardProps }) {
    let changType = ""
    let trendType = ""

    if (data.value - data.valueLastMonth > 0) {
        changType = "positive"
        trendType = "up"
    } else if (data.value - data.valueLastMonth == 0) {
        changType = "neutral"
        trendType = "neutral"
    } else {
        changType = "negative"
        trendType = "down"
    }

    const dataNew: TrendCardProps = {
        title: data.title,
        value: data.value,
        valueLastMonth: data.valueLastMonth,
        change: data.change,
        changeType: changType,
        trendType: trendType,
        trendChipPosition: "top",
        trendChipVariant: "flat"
    }

    return (
        <dl>
            {/* {dataNew!.map((props, index) => (
                <TrendCardStyled key={index} {...props} />
            ))} */}
            <TrendCardStyled key={dataNew.title} {...dataNew} />
        </dl>
    )
}
