import { QUERY_KEYS } from "@/constants/queryKey"
import { BusinessVariableViewRes } from "@/models/business-variables/schema/respone"
import { BackendError } from "@/models/common/response"
import { businessVariablesApi } from "@/services/businessVariablesApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"

import { addToast, closeAll } from "@heroui/toast"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useQueryClient } from "node_modules/@tanstack/react-query/build/modern/QueryClientProvider"
import { useTranslation } from "react-i18next"

export const useGetBusinessVariables = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const queryClient = useQueryClient()
    return useQuery<BusinessVariableViewRes[]>({
        queryKey: [...QUERY_KEYS.BUSINESS_VARIABLES],
        queryFn: businessVariablesApi.getBusinessVariables,
        initialData: () => {
            return queryClient.getQueryData<BusinessVariableViewRes[]>([
                ...QUERY_KEYS.BUSINESS_VARIABLES
            ])
        },
        enabled
    })
}

export const useUpdateBusinessVariables = () => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, value }: { id: string; value: string }) =>
            businessVariablesApi.update(id, value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.BUSINESS_VARIABLES] })
            closeAll()
            addToast({
                title: t("toast.success"),
                description: t("toast.update_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
