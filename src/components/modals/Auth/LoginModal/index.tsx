"use client"
import React from "react"
import { ModalBody, ModalContent } from "@heroui/react"
import { useLoginDiscloresureSingleton } from "@/hooks"
import { ModalStyled } from "@/components/"
import { LoginForm } from "./LoginForm"

export function LoginModal() {
    const { isOpen, onOpenChange, onClose } = useLoginDiscloresureSingleton()

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent className="max-w-150 w-full p-14">
                <ModalBody>
                    <LoginForm onSuccess={onClose} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
