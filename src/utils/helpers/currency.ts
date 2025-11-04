import { DamageStatus } from "@/constants/enum"

export const formatCurrency = (n: number) => {
    if (n < 0) n *= -1
    return new Intl.NumberFormat("vi-VN").format(n).replace(/\./g, ",")
}

export const formatCurrencyWithSymbol = (n: number) => {
    if (n < 0) n *= -1
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
    })
        .format(n)
        .replace(/\./g, ",")
}

export const calculateCompensation = (baseAmount: number, damageStatus: DamageStatus) => {
    const multiplier = (() => {
        switch (Number(damageStatus)) {
            case DamageStatus.Good:
                return 0.0
            case DamageStatus.Minor:
                return 0.05
            case DamageStatus.Moderate:
                return 0.15
            case DamageStatus.Severe:
                return 0.4
            case DamageStatus.Totaled:
                return 1.0
            default:
                return 0.0
        }
    })()

    return baseAmount * multiplier
}

// export const formatCurrency = (n: number) =>
//     new Intl.NumberFormat("en-US", {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     }).format(n) + " VND / Ngày"
