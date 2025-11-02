"use client"
import { CreateFeedback } from "./CreateFeedback"
import { ModalStyled } from "@/components/styled"
import { StationFeedbackRes } from "@/models/station-feedback/schema/response"
import { ModalBody, ModalContent } from "@heroui/react"
import React from "react"

interface FeedbackModalProps {
    isOpen: boolean
    onOpenChange: () => void
    onClose: () => void
    setAllFeedbacks: React.Dispatch<React.SetStateAction<StationFeedbackRes[]>>
}
export function CreateFeedbackModal({
    isOpen,
    onOpenChange,
    onClose,
    setAllFeedbacks
}: FeedbackModalProps) {
    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            isDismissable={true}
        >
            <ModalContent className="min-w-fit p-6">
                <ModalBody>
                    <CreateFeedback onClose={onClose} setAllFeedbacks={setAllFeedbacks} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
