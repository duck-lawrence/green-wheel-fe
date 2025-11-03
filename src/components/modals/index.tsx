import React from "react"

import { ForgotPasswordModal, LoginModal, RegisterModal } from "./Auth"

/* ========================= A ========================= */
export * from "./AlertModal"

/* ========================= C ========================= */
export * from "./ChecklistModal"
export * from "./CreateFeedbackModal"
export * from "./CreateInvoiceModal"
export * from "./CreateRentalContractModal"

/* ========================= D ========================= */
export * from "./DetailDamageModal"
export * from "./DocumentPreview"

/* ========================= I ========================= */
export * from "./Image"

/* ========================= S ========================= */
export * from "./Staff"
export * from "./SystemSettingModal"

/* ========================= T ========================= */
export * from "./Ticket"

/* ========================= U ========================= */
export * from "./User"

/* ========================= V ========================= */
export * from "./Vehicle"
export * from "./VehicleComponent"
export * from "./VehicleModel"

export const Modals = () => {
    return (
        <div>
            <ForgotPasswordModal />
            <LoginModal />
            <RegisterModal />
        </div>
    )
}
