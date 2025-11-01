export type GetVehicleComponentsParams = {
    modelId?: string
    name?: string
}

export type CreateVehicleComponentReq = {
    name: string
    description: string
    damageFee: number
}

export type UpdateVehicleComponentReq = {
    name?: string
    description?: string
    damageFee?: number
}
