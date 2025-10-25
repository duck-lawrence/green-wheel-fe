"use client"

import { CardBody, CardFooter, CardHeader, Chip, useDisclosure, User } from "@heroui/react"
import { useDay, useName } from "@/hooks"
import { TicketViewRes } from "@/models/ticket/schema/response"
import React from "react"
import { useTranslation } from "react-i18next"
import { TicketStatusLabels, TicketTypeLabels } from "@/constants/labels"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { TicketStatusColorMap } from "@/constants/colorMap"
import { EditTicketModal, CardStyled } from "@/components/"

export function TicketCard({
    isStaff = false,
    ticket
}: {
    isStaff: boolean
    ticket: TicketViewRes
}) {
    const { t } = useTranslation()
    const { toFullName } = useName()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    return (
        <>
            <EditTicketModal
                isStaff={isStaff}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                ticket={ticket}
            />
            <CardStyled
                className="w-[22rem] max-w-[22rem] max-h-fit interactive-scale px-2 py-0"
                onPress={onOpen}
                isPressable
            >
                <CardHeader className="flex justify-between items-start">
                    <h4 className="max-w-30 text-small font-semibold text-left break-words">
                        {ticket.title}
                    </h4>
                    <div className="flex flex-col items-end">
                        <Chip size="sm" variant="solid">
                            {TicketTypeLabels[ticket.type]}
                        </Chip>
                        <Chip color={TicketStatusColorMap[ticket.status]} size="sm" variant="solid">
                            {TicketStatusLabels[ticket.status]}
                        </Chip>
                    </div>
                </CardHeader>
                <CardBody className="py-0 text-small text-default-400">
                    <p className="whitespace-pre-line break-words">{ticket.description}</p>
                </CardBody>
                <CardFooter className="gap-3 justify-between">
                    {ticket.requester && (
                        <User
                            name={toFullName(ticket.requester)}
                            description={t("ticket.requester")}
                            avatarProps={{
                                src: ticket.requester.avatarUrl
                            }}
                            className="transition-transform"
                        />
                    )}
                    <div className="text-default-400 text-small">
                        {formatDateTime({ date: ticket.createdAt })}
                    </div>
                </CardFooter>
            </CardStyled>
        </>
    )
}
