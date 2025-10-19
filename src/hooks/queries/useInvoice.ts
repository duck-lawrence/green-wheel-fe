import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { invoiceApi } from "@/services/invoiceApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

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

export const usePayInvoice = () => {
    const { t } = useTranslation()
    // const QueryClient = useQueryClient()
    const router = useRouter()
    return useMutation({
        // mutationFn: async (invoiceId: string, paymentMethod: PaymentMethod) => {
        //     const res = await invoiceApi.createPayment(invoiceId, paymentMethod)
        //     return res
        // },
        mutationFn: invoiceApi.createPayment,

        onSuccess: (data) => {
            if (data?.link) {
                router.push(data.link)
            }
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}

export const useCreateInvoice = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
    const { t } = useTranslation()
    const router = useRouter()

    return useMutation({
        mutationFn: invoiceApi.create,
        onSuccess: () => {
            router.refresh()
            onSuccess?.()
            toast.success(t("success.create"))
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
