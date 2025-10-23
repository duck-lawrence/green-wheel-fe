import { QUERY_KEYS } from "@/constants/queryKey"
import { stationApi } from "@/services/stationApi"
import { useQuery } from "@tanstack/react-query"
import type { StationViewRes } from "@/models/station/schema/response"

export const useGetAllStations = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return useQuery<StationViewRes[]>({
        queryKey: QUERY_KEYS.STATIONS,
        queryFn: stationApi.getAll,
        enabled,
        refetchOnWindowFocus: false
    })
}
