export type CustomerRes = {
    customerInThisMonth: number
    customerInLastMonth: number
    changeRate: number
}

export type CustomerAnonymousRes = {
    customerAnonymusInThisMonth: number
    customerAnonymusInLastMonth: number
    changeRate: number
}

export type TotalRevenueRes = {
    totalRevenueThisMonth: number
    totalRevenueLastMonth: number
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
    monthName: number
    totalRevenue: number
}
