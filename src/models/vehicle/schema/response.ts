import { BrandViewRes } from "@/models/brand/schema/response"
import { VehicleStatus } from "@/constants/enum"

export type VehicleModelViewRes = {
    id: string
    name: string
    description: string
    costPerDay: number
    depositFee: number
    seatingCapacity: number
    numberOfAirbags: number
    motorPower: number
    batteryCapacity: number
    ecoRangeKm: number
    sportRangeKm: number
    imageUrl?: string
    imageUrls: string[]
    brand: BrandViewRes
    segment: VehicleSegmentViewRes
    availableVehicleCount: number
}

export type CreateVehicleModelRes = {
    id: string
}

export type VehicleModelImagesRes = {
    id: string
    imageUrl?: string
    imageUrls: string[]
}

export type VehicleComponentViewRes = {
    id: string
    name: string
    description: string
    damageFee: number
}

export type VehicleSegmentViewRes = {
    id: string
    name: string
    description: string
}

export type VehicleViewRes = {
    id: string
    licensePlate: string
    stationId: string
    model: VehicleModelViewRes
    status: VehicleStatus
    updatedAt?: string
}
