"use client"

import {
    ButtonStyled,
    InputStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalHeaderStyled,
    ModalStyled,
    TextareaStyled
} from "@/components"
import { TicketStatus, TicketType } from "@/constants/enum"
import { useCreateTicket } from "@/hooks"
import { CreateTicketReq } from "@/models/ticket/schema/request"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Spinner } from "@heroui/react"
import { PaperPlaneTilt } from "@phosphor-icons/react"
import { TicketTypeLabels } from "@/constants/labels"
import { PaginationParams } from "@/models/common/request"

interface CreateTicketModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    type: TicketType
    status?: TicketStatus
    pagination: PaginationParams
}

export function CreateTicketModal({
    isOpen,
    onOpenChange,
    onClose,
    type,
    status,
    pagination = {}
}: CreateTicketModalProps) {
    const { t } = useTranslation()
    const createMutation = useCreateTicket({ status, pagination, onSuccess: onClose })

    const handleCreate = useCallback(
        async (req: CreateTicketReq) => {
            await createMutation.mutateAsync(req)
        },
        [createMutation]
    )

    const formik = useFormik<CreateTicketReq>({
        initialValues: {
            title: "",
            description: "",
            type
        },
        validationSchema: Yup.object({
            title: Yup.string().required(t("ticket.title_require")),
            description: Yup.string().required(t("ticket.description_require"))
        }),
        onSubmit: handleCreate
    })

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContentStyled className="max-w-150 w-full px-6 py-4">
                <ModalHeaderStyled>{TicketTypeLabels[type]}</ModalHeaderStyled>
                <ModalBodyStyled>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                        <InputStyled
                            label={t("ticket.title")}
                            variant="bordered"
                            value={formik.values.title}
                            onValueChange={(value) => formik.setFieldValue("title", value)}
                            onBlur={() => formik.setFieldTouched("title")}
                            isInvalid={!!(formik.touched.title && formik.errors.title)}
                            errorMessage={formik.errors.title}
                            required
                        />
                        <TextareaStyled
                            label={t("ticket.description")}
                            placeholder={t("ticket.description_placeholder")}
                            variant="bordered"
                            value={formik.values.description}
                            onValueChange={(value) => formik.setFieldValue("description", value)}
                            onBlur={() => formik.setFieldTouched("description")}
                            isInvalid={!!(formik.touched.description && formik.errors.description)}
                            errorMessage={formik.errors.description}
                            required
                        />
                        <ButtonStyled
                            className="btn-gradient w-full rounded-lg
                                flex justify-center items-center gap-2"
                            type="submit"
                            isDisabled={!formik.isValid || formik.isSubmitting}
                            onPress={() => formik.submitForm()}
                        >
                            {formik.isSubmitting ? (
                                <Spinner color="white" />
                            ) : (
                                <>
                                    <PaperPlaneTilt
                                        size={22}
                                        weight="fill"
                                        className="animate-pulse"
                                    />
                                    {t("common.send")}
                                </>
                            )}
                        </ButtonStyled>
                    </form>
                </ModalBodyStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
