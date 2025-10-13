import { BackendError } from "@/models/common/response"
import { invoiceApi } from "@/services/invoiceApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"

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
                toast.success("chuyen sang momo")
                router.push(data.link)
            } else {
                toast.error("ko tạo đc liên kết momo")
            }
        },
        onError: (error: BackendError) => {
            toast.error(translateWithFallback(t, error.detail))
        }
    })
}
