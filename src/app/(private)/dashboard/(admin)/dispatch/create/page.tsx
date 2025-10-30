"use client"
import {
    AutocompleteStyled,
    ButtonStyled,
    SectionStyled,
    SpinnerStyled,
    TableSelectionStaff,
    TableSelectionVehicle
} from "@/components"
import { useGetAllStations, useGetMe } from "@/hooks"
import { useCreateDispatch } from "@/hooks/queries/useDispatch"
import { AutocompleteItem, Textarea } from "@heroui/react"
import { Car, MapPinAreaIcon, UserSwitchIcon } from "@phosphor-icons/react"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchCreatePage() {
    const { t } = useTranslation()
    // const router = useRouter()
    const { data: user, isLoading: isLoading_1 } = useGetMe()
    const stationIdNow = user?.station?.id

    //Station
    const { data: stations, isLoading: isLoading_2 } = useGetAllStations()
    const stationDispatch = stationIdNow
        ? (stations || []).filter(({ id }) => id !== stationIdNow) || null
        : null
    const [selecedSationId, setSelecedSationId] = useState(stationDispatch?.[0]?.id || "")

    //Create
    const createDispatch = useCreateDispatch({})
    const [textArea, setTextArea] = useState("")
    const [selectStaffs, setSelectStaffs] = useState<string[]>([])
    const [selectVehicles, setSelectVehicles] = useState<string[]>([])

    const handleCreateDispatch = useCallback(async () => {
        await createDispatch.mutateAsync({
            fromStationId: selecedSationId,
            description: textArea,
            staffIds: selectStaffs,
            vehicleIds: selectVehicles
        })
    }, [createDispatch, selecedSationId, selectStaffs, selectVehicles, textArea])

    if (isLoading_1 || isLoading_2) return <SpinnerStyled />

    return (
        <div className="max-w-7xl mx-auto w-full bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-primary tracking-wide">
                    {t("dispatch.dispatch")}
                </h1>
                <p className="text-gray-500 text-sm mt-1">{t("dispatch.title")}</p>
            </div>

            {/* Station - Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-3">
                <SectionStyled title={t("dispatch.station")} sectionClassName="mb-0">
                    <AutocompleteStyled
                        label={t("vehicle_model.station")}
                        items={stationDispatch ?? []}
                        startContent={<MapPinAreaIcon className="text-xl" />}
                        selectedKey={selecedSationId}
                        onSelectionChange={(key) => {
                            setSelecedSationId(key as string)
                        }}
                        className="max-w-60 h-20 mr-0"
                    >
                        {(stationDispatch ?? []).map((item) => (
                            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                        ))}
                    </AutocompleteStyled>
                </SectionStyled>
                <SectionStyled title={t("dispatch.description")} sectionClassName="mb-0">
                    <Textarea
                        label={t("table.description")}
                        minRows={4}
                        className="w-full"
                        value={textArea}
                        onChange={(value) => setTextArea(value.target.value)}
                    />
                </SectionStyled>
            </div>

            {/* Tables */}
            <SectionStyled
                title={t("dispatch.list_staff")}
                icon={UserSwitchIcon}
                sectionClassName="mb-4"
            >
                <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                    <TableSelectionStaff
                        stationId={selecedSationId}
                        onChangeSelected={setSelectStaffs}
                    />
                </div>
            </SectionStyled>

            <SectionStyled title={t("dispatch.list_vehicle")} icon={Car} sectionClassName="mb-4">
                <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                    <TableSelectionVehicle
                        stationId={selecedSationId}
                        onChangeSelected={setSelectVehicles}
                    />
                </div>
            </SectionStyled>

            <div className="flex justify-center items-center">
                <ButtonStyled
                    color="primary"
                    className="p-6 btn-gradient btn-gradient:hover btn-gradient:active"
                    onPress={handleCreateDispatch}
                >
                    {t("dispatch.create")}
                </ButtonStyled>
            </div>
        </div>
    )
}
