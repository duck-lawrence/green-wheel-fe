import { TicketStatus, TicketType } from "@/constants/enum"
import { UserProfileViewRes } from "@/models/user/schema/response"

export type TicketViewRes = {
    id: string
    title: string
    description: string
    reply?: string
    status: TicketStatus
    type: TicketType
    createdAt: string

    requester?: UserProfileViewRes
    assignee?: UserProfileViewRes
}
