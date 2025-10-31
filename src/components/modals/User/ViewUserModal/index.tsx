"use client"
import { AccountPreview, ModalStyled } from "@/components"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { ModalBody, ModalContent } from "@heroui/react"
import React from "react"

interface ViewUserModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    user: UserProfileViewRes
}

export function ViewUserModal({ isOpen, onOpenChange, user }: ViewUserModalProps) {
    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true}>
            <ModalContent className="min-w-[80vw] md:min-w-xl py-3 px-5">
                <ModalBody>
                    <AccountPreview user={user} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
