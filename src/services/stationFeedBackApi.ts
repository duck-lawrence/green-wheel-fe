import { StationFeedbackCreateReq } from "@/models/stationFeedback/schema/request"
import axiosInstance from "@/utils/axios"
import { requestWrapper } from "@/utils/helpers/axiosHelper"

export const stationFeedbackApi = {
    create: (req: StationFeedbackCreateReq) =>
        requestWrapper<void>(async () => {
            await axiosInstance.post("/station-feedbacks", req)
        })

    // getAll: ()
}
