import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const invoiceApi = {
    createPayment: (invoidId: string) =>
        requestWrapper<{ paymentUrl: string }>(async () => {
            const res = await axiosInstance.post(`/invoices/${invoidId}/payment`)
            return res.data
        })
}
