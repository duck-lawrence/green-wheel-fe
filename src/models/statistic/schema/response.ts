export type TotalStatisticRes = {
    totalThisMonth: number
    totalLastMonth: number
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

export type InvoiceByYearRes = {
    monthName: number
    totalInvoice: number
}

export type BookingByYearRes = {
    monthName: number
    totalContract: number
}
