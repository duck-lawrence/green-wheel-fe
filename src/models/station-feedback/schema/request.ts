export type StationFeedbackCreateReq = {
    stationId: string
    content: string
    rating: number
}

export type StationFeedbackParams = {
    stationId?: string
}
