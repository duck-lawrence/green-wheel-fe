"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { FunnelSimple } from "@phosphor-icons/react"
import {EditStaffModal, NewStaffModal} from "@/components/modals/StaffModals"
import {
    ButtonStyled,
    CitizenIdentityPreviewModal,
    DriverLicensePreviewModal,
    FilterTypeOption,
    FilterTypeStyle,
    InputStyled,
    PaginationStyled,
    StaffUserManagement
} from "@/components"
import type { Selection } from "@heroui/react"
import { useGetAllStations, useGetAllUsers } from "@/hooks"
import { ROLE_STAFF } from "@/constants/constants"
import { StationViewRes } from "@/models/station/schema/response"
import { UserProfileViewRes } from "@/models/user/schema/response"

const PAGE_SIZE = 10

type DocumentPreviewState = {
    user: UserProfileViewRes
    type: "citizen" | "driver"
}

export default function StaffManagementPage() {
    const { t } = useTranslation()
    const [searchInput, setSearchInput] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [stationFilter, setStationFilter] = useState<string | undefined>()
    const [page, setPage] = useState(1)
    const [previewDocument, setPreviewDocument] = useState<DocumentPreviewState | null>(null)
    const [selectedStaff, setSelectedStaff] = useState<UserProfileViewRes | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const { data: stations = [] } = useGetAllStations({ enabled: true })

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch((prev) => {
                const nextValue = searchInput.trim()
                if (prev !== nextValue) {
                    setPage(1)
                }
                return nextValue
            })
        }, 500)

        return () => window.clearTimeout(timeoutId)
    }, [searchInput])

    const staffQueryParams = useMemo(
        () => ({
            role: ROLE_STAFF.toLowerCase()
        }),
        []
    )

    const staffQuery = useGetAllUsers({
        params: staffQueryParams,
        enabled: true
    })

    const normalizedSearch = useMemo(
        () => debouncedSearch.trim().toLowerCase(),
        [debouncedSearch]
    )

    const staffList = useMemo(() => {
        const items = staffQuery.data ?? []
        return items.filter((staff) => {
            const roleName = staff.role?.name?.toLowerCase()
            if (roleName !== ROLE_STAFF.toLowerCase()) {
                return false
            }

            const matchesStation =
                !stationFilter ||
                stationFilter === (staff.station?.id ?? "")

            if (!matchesStation) {
                return false
            }

            if (!normalizedSearch) {
                return true
            }

            const fullName = (
                [staff.firstName, staff.lastName].filter(Boolean).join(" ").trim()
            ).toLowerCase()
            const email = (staff.email ?? "").toLowerCase()
            const phone = (staff.phone ?? "").toLowerCase()

            return [fullName, email, phone].some((value) =>
                value.includes(normalizedSearch)
            )
        })
    }, [normalizedSearch, staffQuery.data, stationFilter])

    const totalItems = staffList.length

    const paginatedStaff = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE
        return staffList.slice(start, start + PAGE_SIZE)
    }, [page, staffList])

    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
        if (page > maxPage) {
            setPage(maxPage)
        }
    }, [page, totalItems])

    const handleSearch = useCallback(() => {
        setDebouncedSearch((prev) => {
            const nextValue = searchInput.trim()
            if (prev !== nextValue) {
                setPage(1)
            }
            return nextValue
        })
    }, [searchInput])

    const handleStationChange = useCallback(
        (keys: Selection) => {
            if (keys === "all") {
                setStationFilter(undefined)
                setPage(1)
                return
            }

            const values = Array.from(keys)
            if (values.length === 0) {
                setStationFilter(undefined)
                setPage(1)
                return
            }

            const selection = values[0]?.toString()
            const nextStation = selection === "all" ? undefined : selection
            setStationFilter(nextStation)
            setPage(1)
        },
        []
    )

    const handlePreviewDocument = useCallback((payload: DocumentPreviewState) => {
        setPreviewDocument(payload)
    }, [])

    const handleClosePreview = useCallback(() => {
        setPreviewDocument(null)
    }, [])

    const handleDocumentStateUpdate = useCallback(
        (userId: string, type: "citizen" | "driver", nextUrl: string | null) => {
            setPreviewDocument((prev) => {
                if (!prev || prev.user.id !== userId || prev.type !== type) return prev
                if (type === "citizen") {
                    return {
                        ...prev,
                        user: {
                            ...prev.user,
                            citizenUrl: nextUrl ?? undefined
                        }
                    }
                }
                return {
                    ...prev,
                    user: {
                        ...prev.user,
                        licenseUrl: nextUrl ?? undefined
                    }
                }
            })
        },
        []
    )

    const handleOpenEditStaff = useCallback((staff: UserProfileViewRes) => {
        setSelectedStaff(staff)
    }, [])

    const handleCloseEditStaff = useCallback(() => {
        setSelectedStaff(null)
    }, [])

    const isInitialLoading = staffQuery.isLoading || staffQuery.isPending
    const isRefetching = staffQuery.isFetching && !isInitialLoading

    const renderStaffName = useCallback(
        (staff: UserProfileViewRes) => {
            const displayName =
                [staff.firstName, staff.lastName].filter(Boolean).join(" ").trim() ??
                ""
            return displayName || t("staff_management.unknown_name")
        },
        [t]
    )

    const stationMap = useMemo(() => {
        return stations.reduce<Record<string, StationViewRes>>((acc, station) => {
            acc[station.id] = station
            return acc
        }, {})
    }, [stations])

    const getStationName = useCallback(
        (staff: UserProfileViewRes) => {
            return (
                stationMap[staff.station?.id ??  ""]?.name ??
                staff.station?.name ??
                t("staff_management.unknown_station")
            )
        },
        [stationMap, t]
    )

    return (
        <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">
                    {t("staff_management.page_title")}
                </h1>
                <p className="text-sm text-slate-500">
                    {t("staff_management.page_subtitle")}
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2 text-slate-700">
                    <FunnelSimple size={22}  className="text-primary" />
                    <h2 className="text-lg font-semibold">
                        {t("staff_management.filter_title")}
                    </h2>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                        <InputStyled
                            label={t("staff_management.filter_keyword")}
                            placeholder={t("staff_management.filter_keyword_placeholder")}
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault()
                                    handleSearch()
                                }
                            }}
                            isDisabled={isInitialLoading && staffList.length === 0}
                        />

                        <FilterTypeStyle<string>
                            label={t("staff_management.filter_station")}
                            placeholder={t("staff_management.filter_station_placeholder")}
                            selectedKeys={
                                stationFilter
                                    ? new Set([stationFilter])
                                    : new Set<string>(["all"])
                            }
                            disallowEmptySelection={false}
                            showIcon={false}
                            onSelectionChange={handleStationChange}
                            isDisabled={stations.length === 0}
                        >
                            <FilterTypeOption key="all" value="all">
                                {t("staff_management.all_stations")}
                            </FilterTypeOption>
                            {stations.map((station) => (
                                <FilterTypeOption key={station.id} value={station.id}>
                                    {station.name}
                                </FilterTypeOption>
                            ))}
                        </FilterTypeStyle>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <ButtonStyled
                            className="bg-gradient-to-r from-primary to-emerald-400 px-6 text-white"
                            onPress={handleSearch}
                            isDisabled={isInitialLoading && staffList.length === 0}
                        >
                            {t("common.search")}
                        </ButtonStyled>
                        <ButtonStyled
                            className="bg-emerald-500 px-6 text-white hover:bg-emerald-600"
                            onPress={() => setIsCreateModalOpen(true)}
                        >
                            {t("staff_management.add_staff_button")}
                        </ButtonStyled>
                    </div>
                </div>
            </div>

            <StaffUserManagement
                staff={paginatedStaff}
                isLoading={isInitialLoading}
                isRefetching={isRefetching}
                renderStaffName={renderStaffName}
                getStationName={getStationName}
                onPreviewDocument={handlePreviewDocument}
                onEditStaff={handleOpenEditStaff}
            />

            {totalItems > PAGE_SIZE ? (
                <div className="flex justify-center">
                    <PaginationStyled
                        pageNumber={page}
                        totalItems={totalItems}
                        pageSize={PAGE_SIZE}
                        onPageChange={setPage}
                    />
                </div>
            ) : null}

            <NewStaffModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                stations={stations}
                onCreated={() => {
                    setPage(1)
                }}
            />

            <EditStaffModal
                staff={selectedStaff}
                isOpen={Boolean(selectedStaff)}
                onClose={handleCloseEditStaff}
            />

            {previewDocument && previewDocument.type === "citizen" ? (
                <CitizenIdentityPreviewModal
                    userId={previewDocument.user.id}
                    isOpen
                    imageUrl={previewDocument.user.citizenUrl}
                    onClose={handleClosePreview}
                    onUpdated={(nextUrl) =>
                        handleDocumentStateUpdate(previewDocument.user.id, "citizen", nextUrl)
                    }
                />
            ) : null}

            {previewDocument && previewDocument.type === "driver" ? (
                <DriverLicensePreviewModal
                    userId={previewDocument.user.id}
                    isOpen
                    imageUrl={previewDocument.user.licenseUrl}
                    onClose={handleClosePreview}
                    onUpdated={(nextUrl) =>
                        handleDocumentStateUpdate(previewDocument.user.id, "driver", nextUrl)
                    }
                />
            ) : null}
        </div>
    )
}
