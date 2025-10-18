import { QUERY_KEYS } from "@/constants/queryKey"
import { VehicleViewReq } from "@/models/vehicle/schema/request"
import { vehicleApi } from "@/services/vehicleApi"
import { useQuery } from "@tanstack/react-query"

export const useGetAllVehicle = ({
    params,
    enabled = true
}: {
    params: VehicleViewReq
    enabled?: boolean
}) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.VEHICLES, params],
        queryFn: () => vehicleApi.getAll(params),
        enabled
    })
    return query
}
