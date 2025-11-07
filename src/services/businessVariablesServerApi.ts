import { BusinessVariableViewRes } from "@/models/business-variables/schema/respone"
import axiosServer from "@/utils/axiosServer"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const businessVariablesServerApi = {
    getBusinessVariables: () =>
        requestWrapper<BusinessVariableViewRes[]>(async () => {
            const res = await axiosServer.get("/business-variables")
            return res.data
        })
}
