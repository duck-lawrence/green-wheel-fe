import React from "react"

import { ForgotPasswordModal, LoginModal, RegisterModal } from "./Auth"

export * from "./AlertModal"
export * from "./ChecklistModal"
export * from "./CreateFeedbackModal"
export * from "./CreateInvoiceModal"
export * from "./CreateRentalContractModal"
export * from "./SystemSettingModal"
export * from "./DetailDamageModal"
export * from "./DocumentPreview"

export * from "./Image"
export * from "./Staff"
export * from "./Ticket"
export * from "./User"
export * from "./Vehicle"
export * from "./VehicleModel"
export * from "./VehicleComponent"

export const Modals = () => {
    return (
        <div>
            <ForgotPasswordModal />
            <LoginModal />
            <RegisterModal />
        </div>
    )
}
