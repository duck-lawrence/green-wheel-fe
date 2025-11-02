import { QUERY_KEYS } from "@/constants/queryKey"
import { brandApi } from "@/services/brandApi"
import { useQuery } from "@tanstack/react-query"

export const useGetAllBrands = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.BRANDS,
        queryFn: brandApi.getAll,
        enabled
    })
}
