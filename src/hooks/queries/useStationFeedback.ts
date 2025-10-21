import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { stationFeedbackApi } from "@/services/stationFeedBackApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

export const useCreateFeedback = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: stationFeedbackApi.create,
        onSuccess: () => {
            toast.success(t("review.create_successfull"))
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useGetAllFeedback = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const query = useQuery({
        queryKey: QUERY_KEYS.STATION_FEEDBACKS,
        queryFn: stationFeedbackApi.getAll,
        enabled,
        refetchOnWindowFocus: false
    })
    return query
}
