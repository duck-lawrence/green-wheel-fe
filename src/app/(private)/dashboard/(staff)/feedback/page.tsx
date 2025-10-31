"use client"
import { useDeleteFeedback, useGetAllFeedback } from "@/hooks"
import React, { useCallback } from "react"
import { ButtonStyled, TableStyled } from "@/components"
import { useTranslation } from "react-i18next"
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
export default function FeedbackPage() {
    const { t } = useTranslation()
    const { data: feedbacks = [] } = useGetAllFeedback()

    const deleteFeedback = useDeleteFeedback()
    const handleDelete = useCallback(
        async (id: string) => {
            await deleteFeedback.mutateAsync(id)
        },
        [deleteFeedback]
    )

    return (
        <div className="rounded-2xl bg-white shadow-sm px-6 py-6">
            <div className="text-3xl mb-3 px-4 font-bold">
                <p>{t("review.feedback")}</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                {/*table */}
                <TableStyled className="min-w-full text-sm md:text-base" removeWrapper>
                    <TableHeader>
                        <TableColumn className="text-center text-gray-700 font-semibold">
                            No.
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold">
                            {t("table.name")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold">
                            {t("table.rating")}
                        </TableColumn>
                        <TableColumn className="text-center text-gray-700 font-semibold">
                            {t("table.description")}
                        </TableColumn>

                        <TableColumn className="text-center text-gray-700 font-semibold">
                            {t("table.action")}
                        </TableColumn>
                    </TableHeader>

                    <TableBody>
                        {feedbacks.map((item, index) => (
                            <TableRow
                                key={item.id}
                                className="hover:bg-gray-50 transition-colors border-b border-gray-100 cursor-pointer"
                            >
                                <TableCell className="text-center text-gray-700">
                                    {index + 1}
                                </TableCell>

                                <TableCell className="text-center text-gray-700">
                                    {item.customerName}
                                </TableCell>

                                <TableCell className="text-center text-gray-700">
                                    {item.rating}
                                </TableCell>

                                <TableCell
                                    className="
          text-gray-700 text-center
          max-w-[250px] truncate
          overflow-hidden 
          text-ellipsis  break-words whitespace-pre-wrap
        "
                                    title={item.content} // Hover hiển thị full text
                                >
                                    {item.content}
                                </TableCell>

                                {/* Action Buttons */}
                                <TableCell className="text-center">
                                    <div>
                                        <ButtonStyled
                                            color="danger"
                                            variant="bordered"
                                            className="
              h-8 w-18 border border-red-500 text-red-600
              hover:bg-red-500 hover:text-white transition-colors font-medium rounded-full
            "
                                            onPress={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </ButtonStyled>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableStyled>
            </div>
        </div>
    )
}
