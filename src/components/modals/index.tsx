import React from "react"
import { LoginModal } from "./LoginModal"
import { RegisterModal } from "./RegisterModal"
import { ForgotPasswordModal } from "./ForgotPasswordModal"

export * from "./ChecklistModal"
export * from "./CreateInvoiceModal"
export * from "./CreateRentalContractModal"
export * from "./CreateUserModal"
export * from "./DetailDamageModal"
export * from "./EditUserModal"
export * from "./DocumentPreview"
export * from "./ImageUploaderModal"
export * from "./SelectUserModal"
export * from "./VehicleModals"

export const Modals = () => {
    return (
        <div>
            <ForgotPasswordModal />
            <LoginModal />
            <RegisterModal />
        </div>
    )
}
