import { CreateInvoiceReq, PaymentReq } from "@/models/invoice/schema/request"
import { InvoiceViewRes } from "@/models/invoice/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const invoiceApi = {
    createPayment: ({ id, req }: { id: string; req: PaymentReq }) =>
        requestWrapper<{ link: string } | undefined>(async () => {
            const res = await axiosInstance.put(`/invoices/${id}/payment`, req)
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
        }),

    uploadImage: ({ id, formData }: { id: string; formData: FormData }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.put(`/invoices/${id}/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })
        })
}
