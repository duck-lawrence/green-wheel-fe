import { CreateInvoiceReq, PaymentReq } from "@/models/invoice/schema/request"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const invoiceApi = {
    createPayment: ({ invoiceId, req }: { invoiceId: string; req: PaymentReq }) =>
        requestWrapper<{ link: string }>(async () => {
            const res = await axiosInstance.put(`/invoices/${invoiceId}/payment`, req)
            return res.data
        }),

    getById: ({ id }: { id: string }) =>
        requestWrapper<InvoiceViewRes>(async () => {
            const res = await axiosInstance.get(`/invoices/${id}`)
            return res.data
        }),

    create: (req: CreateInvoiceReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/invoices", req)
        })
}
