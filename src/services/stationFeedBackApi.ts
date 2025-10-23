import { StationFeedbackCreateReq } from "@/models/stationFeedback/schema/request"
import { StationFeedbackRes } from "@/models/stationFeedback/schema/response"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const stationFeedbackApi = {
    create: (req: StationFeedbackCreateReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/station-feedbacks", req)
        }),

    getAll: () =>
        requestWrapper<StationFeedbackRes[]>(async () => {
            const res = await axiosInstance.get("/station-feedbacks")
            return res.data
        })
}
