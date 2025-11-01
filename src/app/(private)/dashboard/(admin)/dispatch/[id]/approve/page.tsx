"use client"
import {
    AlertModal,
    ButtonStyled,
    InputStyled,
    SectionStyled,
    SpinnerStyled,
    TableSelectionStaff,
    TableSelectionVehicle,
    TextareaStyled
} from "@/components"
import { DispatchRequestStatus } from "@/constants/enum"
import { useGetMe } from "@/hooks"
import { useGetDispatchById, useUpdateDispatch } from "@/hooks/queries/useDispatch"
import { useDisclosure } from "@heroui/react"
import { addToast } from "@heroui/toast"
import { Car, UserSwitchIcon } from "@phosphor-icons/react"
import { useParams, useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchCreatePage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { id } = useParams()
    const dispatchId = id?.toString()
    const { data: dispatch } = useGetDispatchById({ id: dispatchId!, enabled: true })
    const { data: user, isLoading: isGetMeLoading } = useGetMe()
    const stationIdNow = user?.station?.id

    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()

    const updateMutation = useUpdateDispatch({})
    const [selectStaffs, setSelectStaffs] = useState<string[]>([])
    const [selectVehicles, setSelectVehicles] = useState<string[]>([])

    const handleUpdate = useCallback(async () => {
        if (!dispatch) return

        await updateMutation.mutateAsync({
            id: dispatch.id,
            req: {
                status: DispatchRequestStatus.Approved,
                staffIds: selectStaffs,
                vehicleIds: selectVehicles
            }
        })
    }, [dispatch, updateMutation, selectStaffs, selectVehicles])

    useEffect(() => {
        if (!stationIdNow || !dispatch) return
        if (stationIdNow !== dispatch.fromStationId) {
            router.replace("/")
            addToast({
                title: t("toast.error"),
                description: t("user.do_not_have_permission"),
                color: "danger"
            })
        }
    }, [dispatch, router, stationIdNow, t])

    if (isGetMeLoading || !stationIdNow) return <SpinnerStyled />

    return (
        <div className="max-w-7xl mx-auto w-full bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-primary tracking-wide">
                    {t("dispatch.dispatch")}
                </h1>
                <p className="text-gray-500 text-sm mt-1">{t("dispatch.title")}</p>
            </div>

            {/* Station Info */}
            <SectionStyled title={t("dispatch.station_information")}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                    <div className="flex flex-col gap-3 w-full">
                        <h3 className="text-gray-800 font-semibold mb-1">
                            {t("dispatch.form_station")}
                        </h3>
                        <InputStyled
                            label={t("dispatch.station_id")}
                            value={dispatch?.fromStationId}
                            readOnly
                        />
                        <InputStyled
                            label={t("dispatch.station_name")}
                            value={dispatch?.fromStationName}
                            readOnly
                        />
                    </div>
                    <div className="hidden sm:block w-[5px] bg-default self-stretch"></div>
                    <div className="flex flex-col gap-3 w-full">
                        <h3 className="text-gray-800 font-semibold mb-1">
                            {t("dispatch.to_station")}
                        </h3>
                        <InputStyled
                            label={t("dispatch.station_id")}
                            value={dispatch?.toStationId}
                            readOnly
                        />
                        <InputStyled
                            label={t("dispatch.station_name")}
                            value={dispatch?.toStationName}
                            readOnly
                        />
                    </div>
                </div>
            </SectionStyled>

            <SectionStyled title={t("dispatch.description")} sectionClassName="w-full">
                <div className="flex flex-col gap-3">
                    <TextareaStyled
                        label={t("dispatch.description")}
                        value={dispatch?.description}
                        readOnly
                    />
                </div>
            </SectionStyled>

            {/* Tables */}
            <SectionStyled
                title={t("dispatch.list_staff")}
                icon={UserSwitchIcon}
                sectionClassName="mb-4"
            >
                <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                    <TableSelectionStaff
                        stationId={stationIdNow}
                        onChangeSelected={setSelectStaffs}
                    />
                </div>
            </SectionStyled>

            <SectionStyled title={t("dispatch.list_vehicle")} icon={Car} sectionClassName="mb-4">
                <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                    <TableSelectionVehicle
                        stationId={stationIdNow}
                        onChangeSelected={setSelectVehicles}
                    />
                </div>
            </SectionStyled>

            <div className="flex justify-center items-center">
                <ButtonStyled className="p-6 btn-gradient" onPress={onOpen}>
                    {t("dispatch.approve")}
                </ButtonStyled>
                <AlertModal
                    header={t("common.confirm_to_submit")}
                    body={t("common.confirm_to_submit_body")}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                    onConfirm={() => {
                        handleUpdate()
                    }}
                />
            </div>
        </div>
    )
}
