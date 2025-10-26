import React from "react"

import { ForgotPasswordModal, LoginModal, RegisterModal } from "./Auth"

export * from "./ChecklistModal"
export * from "./CreateInvoiceModal"
export * from "./CreateRentalContractModal"
export * from "./DetailDamageModal"
export * from "./DocumentPreview"
export * from "./FeedbackModal"

export * from "./Image"
export * from "./Staff"
export * from "./Ticket"
export * from "./User"
export * from "./Vehicle"

export const Modals = () => {
    return (
        <div>
            <ForgotPasswordModal />
            <LoginModal />
            <RegisterModal />
        </div>
    )
}
