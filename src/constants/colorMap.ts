import { TicketStatus } from "./enum"

export const TicketStatusColorMap: Record<TicketStatus, "warning" | "success" | "danger"> = {
    [TicketStatus.Pending]: "warning",
    [TicketStatus.Resolve]: "success",
    [TicketStatus.EscalatedToAdmin]: "danger"
}
