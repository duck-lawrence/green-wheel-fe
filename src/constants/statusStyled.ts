import { RentalContractStatus } from "./enum"

export const STATUS_STYLES: Record<RentalContractStatus, string> = {
    [RentalContractStatus.RequestPending]: "bg-yellow-100 text-yellow-700",
    [RentalContractStatus.PaymentPending]: "bg-amber-100 text-amber-700",
    [RentalContractStatus.Active]: "bg-blue-100 text-blue-700",
    [RentalContractStatus.Returned]: "bg-emerald-100 text-emerald-700",
    [RentalContractStatus.Completed]: "bg-primary text-white",
    [RentalContractStatus.Cancelled]: "bg-red-100 text-red-600"
}
