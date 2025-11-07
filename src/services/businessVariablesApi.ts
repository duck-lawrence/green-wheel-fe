import { UpdateBusinessVariableReq } from "@/models/business-variables/schema/request"
import { BusinessVariableViewRes } from "@/models/business-variables/schema/respone"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const businessVariablesApi = {
    getBusinessVariables: () =>
        requestWrapper<BusinessVariableViewRes[]>(async () => {
            const res = await axiosInstance.get("/business-variables")
            return res.data
        }),

    update: (id: string, value: number) =>
        requestWrapper<UpdateBusinessVariableReq>(async () => {
            const res = await axiosInstance.put(`/business-variables/${id}`, { value })
            return res.data
        })
}
