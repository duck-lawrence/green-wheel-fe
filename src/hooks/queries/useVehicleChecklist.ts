import { QUERY_KEYS } from "@/constants/queryKey"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"
import { VehicleChecklistsApi } from "@/services/vehicleChecklistsApi"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetByIdVehicleChecklist = ({
    id,
    enabled = true
}: {
    id: string
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: [...QUERY_KEYS.VEHICLE_CHECKLISTS, id],
        queryFn: () => VehicleChecklistsApi.getById(id),
        initialData: () => {
            return queryClient.getQueryData<VehicleChecklistViewRes>([
                ...QUERY_KEYS.VEHICLE_CHECKLISTS,
                id
            ])
        },
        enabled
    })
    return query
}
