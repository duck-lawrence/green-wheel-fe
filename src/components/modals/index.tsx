import React from "react"
import { LoginModal } from "./LoginModal"
import { RegisterModal } from "./RegisterModal"
import { ForgotPasswordModal } from "./ForgotPasswordModal"

export * from "./ChecklistModal"
export * from "./DetailDamageModal"
export * from "./EditUserModal"
export * from "./DocumentPreview"

export * from "./ImageUploaderModal"


export const Modals = () => {
    return (
        <div>
            <ForgotPasswordModal />
            <LoginModal />
            <RegisterModal />
        </div>
    )
}
