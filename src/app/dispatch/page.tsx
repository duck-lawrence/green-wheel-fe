"use client"
import { ButtonStyled, InputStyled, SectionStyled } from "@/components"
import TableSelectionStaff from "@/components/modules/TableSelectionStaff"
import TableSelectionVehicle from "@/components/modules/TableSelectionVehicle/indesx"
import { useGetAllStaffs, useGetAllStations, useGetMe } from "@/hooks"
import { useCreateDispatch } from "@/hooks/queries/useDispatch"
import { useGetAllVehicle } from "@/hooks/queries/useVehicle"
import { Textarea } from "@heroui/react"
import { Car, UserSwitchIcon } from "@phosphor-icons/react"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchPage() {
    const { t } = useTranslation()
    const { data: user } = useGetMe()
    const stationIdStaff = user?.station?.id
    const { data: stations } = useGetAllStations()
    const { data: vehicles } = useGetAllVehicle({
        params: { stationId: stationIdStaff },
        enabled: true
    })
    const { data: staffs } = useGetAllStaffs({
        params: { stationId: stationIdStaff },
        enabled: true
    })

    const createDispatch = useCreateDispatch({})

    let stationDispatch = null
    if (stations && stationIdStaff) {
        stationDispatch = stationIdStaff === stations[0].id ? stations[1] : stations[0]
    }

    const [textArea, setTextArea] = useState("")
    const [selectStaffs, setSelectStaffs] = useState<string[]>([])
    const [selectVehicles, setSelectVehicles] = useState<string[]>([])

    const handleCreateDispatch = useCallback(async () => {
        await createDispatch.mutateAsync({
            toStationId: stationDispatch!,
            description: textArea,
            staffIds: selectStaffs,
            vehicleIds: selectVehicles
        })
    }, [createDispatch, selectStaffs, selectVehicles, stationDispatch, textArea])

    return (
        <div className="max-w-7xl mx-auto w-full bg-white p-8 rounded-2xl shadow-md border border-gray-100">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-primary tracking-wide">Dispatch</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Dispatch staff and vehicles between stations
                </p>
            </div>

            {/* Station - Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <SectionStyled title="Station">
                    <InputStyled
                        label={t("table.station")}
                        value={stationDispatch?.name}
                        readOnly
                    />
                </SectionStyled>

                <SectionStyled title="Description">
                    <Textarea
                        label={t("table.description")}
                        minRows={4}
                        className="w-full"
                        placeholder="Type dispatch details..."
                        value={textArea}
                        onChange={(value) => setTextArea(value.target.value)}
                    />
                </SectionStyled>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                <SectionStyled title="Danh sách nhân viên" icon={UserSwitchIcon}>
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                        <TableSelectionStaff
                            staffs={staffs ?? []}
                            onChangeSelected={setSelectStaffs}
                        />
                    </div>
                </SectionStyled>

                <SectionStyled title="Danh sách xe" icon={Car}>
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/60">
                        <TableSelectionVehicle
                            vehicles={vehicles ?? []}
                            onChangeSelected={setSelectVehicles}
                        />
                    </div>
                </SectionStyled>
            </div>

            <div className="flex justify-center items-center">
                <ButtonStyled color="primary" className="p-6 " onPress={handleCreateDispatch}>
                    Create
                </ButtonStyled>
            </div>
        </div>
    )
}
