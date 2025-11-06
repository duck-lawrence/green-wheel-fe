import { QUERY_KEYS } from "@/constants/queryKey"
import { stationApi } from "@/services/stationApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { StationViewRes } from "@/models/station/schema/response"
import { StationUpdateReq, StationViewReq } from "@/models/station/schema/request"
import { useTranslation } from "react-i18next"
import { addToast } from "@heroui/toast"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

export const useGetAllStations = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return useQuery<StationViewRes[]>({
        queryKey: QUERY_KEYS.STATIONS,
        queryFn: stationApi.getAll,
        enabled,
        refetchOnWindowFocus: false
    })
}

export const useGetStationById = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
    return useQuery<StationViewRes>({
        queryKey: [...QUERY_KEYS.STATIONS, id],
        queryFn: () => stationApi.getById(id),
        enabled,
        refetchOnWindowFocus: false
    })
}

export const useCreateStation = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (req: StationViewReq) => stationApi.create(req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATIONS })
            addToast({
                title: "success",
                description: t("toast.create_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useUpdateStation = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, req }: { id: string; req: StationUpdateReq }) =>
            stationApi.update(id, req),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATIONS })
            addToast({
                title: t("toast.success"),
                description: t("toast.update_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useDeleteStation = (id: string) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => stationApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STATIONS })
            addToast({
                title: t("toast.success"),
                description: t("toast.delete_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
