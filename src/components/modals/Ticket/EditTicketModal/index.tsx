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
import { TicketStatus } from "@/constants/enum"
import { useDay, useEscalateTicketToAdmin, useName, useUpdateTicket } from "@/hooks"
import { UpdateTicketReq } from "@/models/ticket/schema/request"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Chip, Spinner, User } from "@heroui/react"
import { PaperPlaneTilt } from "@phosphor-icons/react"
import { TicketViewRes } from "@/models/ticket/schema/response"
import { TicketStatusLabels, TicketTypeLabels } from "@/constants/labels"
import { TicketStatusColorMap } from "@/constants/colorMap"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"

interface EditTicketModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    isStaff: boolean
    ticket: TicketViewRes
}

export function EditTicketModal({
    isOpen,
    onOpenChange,
    onClose,
    isStaff = false,
    ticket
}: EditTicketModalProps) {
    const { t } = useTranslation()
    const { toFullName } = useName()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const updateMutation = useUpdateTicket({ onSuccess: onClose })
    const escalateMutation = useEscalateTicketToAdmin({ onSuccess: onClose })

    const isEditable = useMemo(
        () => isStaff && ticket.status === TicketStatus.Pending,
        [isStaff, ticket.status]
    )

    const hanldeUpdate = useCallback(
        async (req: UpdateTicketReq) => {
            await updateMutation.mutateAsync({ id: ticket.id, req })
        },
        [ticket.id, updateMutation]
    )

    const handleEscalate = useCallback(async () => {
        await escalateMutation.mutateAsync(ticket.id)
    }, [ticket.id, escalateMutation])

    const formik = useFormik<UpdateTicketReq>({
        initialValues: {
            reply: ticket.reply || "",
            status: TicketStatus.Resolve
        },
        validationSchema: Yup.object({
            reply: Yup.string().required(t("ticket.reply_require"))
        }),
        onSubmit: hanldeUpdate
    })

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
            <ModalContentStyled className="max-w-150 w-full px-6 py-4">
                <ModalHeaderStyled>{TicketTypeLabels[ticket.type]}</ModalHeaderStyled>
                <ModalBodyStyled>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-dashed pb-4">
                        <div className="flex items-center gap-2">
                            <Chip
                                color={TicketStatusColorMap[ticket.status]}
                                size="sm"
                                variant="solid"
                            >
                                {TicketStatusLabels[ticket.status]}
                            </Chip>
                            <p className="text-default-400 text-small">
                                {formatDateTime({ date: ticket.createdAt })}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {ticket.requester && (
                                <User
                                    name={toFullName(ticket.requester)}
                                    description={t("ticket.requester")}
                                    avatarProps={{
                                        src: ticket.requester.avatarUrl,
                                        size: "sm"
                                    }}
                                />
                            )}
                            {ticket.assignee && (
                                <User
                                    name={toFullName(ticket.assignee)}
                                    description={t("ticket.assignee")}
                                    avatarProps={{
                                        src: ticket.assignee.avatarUrl,
                                        size: "sm"
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                        <InputStyled
                            label={t("ticket.title")}
                            variant="bordered"
                            value={ticket.title}
                            isReadOnly
                        />
                        <TextareaStyled
                            label={t("ticket.description")}
                            placeholder={t("ticket.description_placeholder")}
                            variant="bordered"
                            value={ticket.description}
                            isReadOnly
                        />
                        <TextareaStyled
                            label={t("ticket.reply")}
                            placeholder={
                                isEditable
                                    ? t("ticket.reply_placeholder")
                                    : t("ticket.wait_for_reply")
                            }
                            variant="bordered"
                            value={formik.values.reply}
                            onValueChange={(value) => formik.setFieldValue("reply", value)}
                            onBlur={() => formik.setFieldTouched("reply")}
                            isInvalid={
                                !!(formik.touched.reply && formik.errors.reply) && isEditable
                            }
                            errorMessage={formik.errors.reply}
                            readOnly={!isEditable}
                            required
                        />
                        {isEditable && (
                            <div className="flex gap-2">
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
                                            {t("ticket.reply")}
                                        </>
                                    )}
                                </ButtonStyled>
                                <ButtonStyled
                                    className="w-full rounded-lg"
                                    onPress={handleEscalate}
                                    isDisabled={
                                        escalateMutation.isPending ||
                                        ticket.status === TicketStatus.EscalatedToAdmin
                                    }
                                >
                                    {t("enum.escalated_to_admin")}
                                </ButtonStyled>
                            </div>
                        )}
                    </form>
                </ModalBodyStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
