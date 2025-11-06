import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { invoiceApi } from "@/services/invoiceApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useInvalidateContractQueries } from "./useRentalContract"
import { addToast } from "@heroui/toast"

export const useGetInvoiceById = ({ id, enabled = true }: { id: string; enabled?: boolean }) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.INVOICES, id],
        queryFn: async () => {
            return await invoiceApi.getById({ id })
        },
        enabled
    })
    return query
}

export const usePayInvoice = ({ contractId }: { contractId: string }) => {
    const { t } = useTranslation()
    // const QueryClient = useQueryClient()
    const router = useRouter()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        mutationFn: invoiceApi.createPayment,
        onSuccess: (data) => {
            if (data && typeof data.link === "string") {
                router.push(data.link)
            } else {
                invalidateById(contractId)
                addToast({
                    title: t("toast.success"),
                    description: t("success.payment"),
                    color: "success"
                })
            }
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

export const useCreateInvoice = ({
    contractId,
    onSuccess = undefined
}: {
    contractId: string
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        mutationFn: invoiceApi.create,
        onSuccess: async () => {
            await invalidateById(contractId)
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.create"),
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

export const useUploadInvoiceImage = ({
    id,
    contractId,
    onSuccess = undefined
}: {
    id: string
    contractId: string
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const { invalidateById } = useInvalidateContractQueries()

    return useMutation({
        mutationFn: async (formData: FormData) => {
            await invoiceApi.uploadImage({ id, formData })
        },
        onSuccess: async () => {
            await invalidateById(contractId)
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.upload"),
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
