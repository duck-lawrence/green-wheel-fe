"use client"
import { useDeleteFeedback, useGetAllFeedbacks, useGetAllStations, useGetMe } from "@/hooks"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { AutocompleteItem, Spinner } from "@heroui/react"
import CardReviewUser from "@/components/styled/GrateStyled"
import { StationFeedbackParams } from "@/models/station-feedback/schema/request"
import { PaginationParams } from "@/models/common/request"
import { AutocompleteStyled, PaginationStyled } from "@/components"
import { MapPinAreaIcon } from "@phosphor-icons/react"
export default function FeedbackPage() {
    const { t } = useTranslation()
    const { data: me, isLoading: isMeLoading } = useGetMe()
    const { data: stations, isLoading: isStationLoading } = useGetAllStations()

    const [filter, setFilter] = useState<StationFeedbackParams>({})
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 9 })
    const { data, isLoading, refetch } = useGetAllFeedbacks({
        filter: filter,
        pagination: pagination
    })

    useEffect(() => {
        const handleRefetch = async () => {
            await refetch()
        }

        handleRefetch()
    }, [refetch, filter, pagination])

    const deleteFeedback = useDeleteFeedback()
    const handleDelete = useCallback(
        async (id: string) => {
            await deleteFeedback.mutateAsync(id)
        },
        [deleteFeedback]
    )

    return (
        <div className="rounded-2xl bg-white shadow-sm px-6 py-6 space-y-3">
            <div className="text-3xl mb-3 px-4 font-bold">
                <p>{t("review.feedback")}</p>
            </div>
            <AutocompleteStyled
                className="md:w-50"
                label={t("vehicle_model.station")}
                items={stations}
                startContent={<MapPinAreaIcon className="text-xl" />}
                selectedKey={filter.stationId}
                onSelectionChange={(id) => {
                    setFilter((prev) => {
                        return {
                            ...prev,
                            stationId: id as string | undefined
                        }
                    })

                    setPagination((prev) => {
                        return {
                            ...prev,
                            pageNumber: 1
                        }
                    })
                }}
            >
                {(stations ?? []).map((item) => (
                    <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                ))}
            </AutocompleteStyled>
            <div className="text-center">
                {isLoading || isStationLoading || isMeLoading ? (
                    <Spinner />
                ) : (
                    <>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-5">
                            {(data?.items || []).map((item) => (
                                <CardReviewUser
                                    key={item.id}
                                    name={item.customerName}
                                    avatar={item.avatarUrl}
                                    rating={item.rating}
                                    station={
                                        (item.stationId == stations?.[0].id
                                            ? stations?.[0].name
                                            : stations?.[1].name) ?? ""
                                    }
                                    content={item.content}
                                    createdAt={item.createdAt}
                                    isDeleteable={me?.station?.id === item.stationId}
                                    onDelete={() => handleDelete(item.id)}
                                />
                            ))}
                        </div>
                        <div className="mt-6 flex justify-center">
                            <PaginationStyled
                                page={data?.pageNumber ?? 1}
                                total={data?.totalPages ?? 10}
                                onChange={(page: number) =>
                                    setPagination((prev) => {
                                        return {
                                            ...prev,
                                            pageNumber: page
                                        }
                                    })
                                }
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
