import { PaymentReq } from "@/models/invoice/schema/request"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const invoiceApi = {
    createPayment: ({ invoiceId, req }: { invoiceId: string; req: PaymentReq }) =>
        requestWrapper<{ link: string }>(async () => {
            const res = await axiosInstance.put(`/invoices/${invoiceId}/payment`, req)
            return res.data
        })
}
