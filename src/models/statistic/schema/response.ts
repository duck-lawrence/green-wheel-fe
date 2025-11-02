export type CustomerRes = {
    totalCustomerInThisMonth: number
    totalCustomerInLastMonth: number
    changeRate: number
}

export type CustomerAnonymousRes = {
    customerAnonymusInThisMonth: number
    customerAnonymusInLastMonth: number
    changeRate: number
}

export type TotalRevenueRes = {
    totalRevenueInThisMonth: number
    totalRevenueInLastMonth: number
    changeRate: number
}

export type TotalStatisticRes = {
    // invoice
    totalStatisticThisMonth: number
    totalStatisticLastMonth: number
    changeRate: number
}

export type VehicleTotalRes = {
    total: number
    items: VehicleStatusCountItem[]
}

export type VehicleStatusCountItem = {
    status: string
    numberOfVehicle: number
}

export type VehicleModelStatisticRes = {
    modelId: string
    modelName: string
    numberOfAvailable: number
    numberOfRented: number
    numberOfMaintenance: number
}

export type RevenueByYearRes = {
    month: number
    revenue: number
}
