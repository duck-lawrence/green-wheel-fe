import { PaymentMethod } from "@/constants/enum"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const invoiceApi = {
    createPayment: ({
        invoiceId,
        paymentMethod
    }: {
        invoiceId: string
        paymentMethod: PaymentMethod
    }) =>
        requestWrapper<{ link: string }>(async () => {
            const res = await axiosInstance.put(`/invoices/${invoiceId}/payment`, { paymentMethod })
            return res.data
        })
}
