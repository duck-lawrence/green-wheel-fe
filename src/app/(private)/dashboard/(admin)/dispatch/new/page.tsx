"use client"
import {
    AutocompleteStyled,
    ButtonStyled,
    NumberInputStyled,
    SectionStyled,
    SpinnerStyled,
    TableSelectionVehicle,
    TableStyled
} from "@/components"
import { useGetAllStations, useGetMe } from "@/hooks"
import { useCreateDispatch } from "@/hooks/queries/useDispatch"
import { CreateDispatchReq, VehicleDispatchReq } from "@/models/dispatch/schema/request"
import {
    AutocompleteItem,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react"
import { Car, MapPinAreaIcon } from "@phosphor-icons/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { UserSwitchIcon } from "@phosphor-icons/react/dist/ssr"

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
    // const [selectStaffs, setSelectStaffs] = useState<string[]>([])
    // const [selectVehicles, setSelectVehicles] = useState<VehicleDispatchReq[]>([])

    const handleCreateDispatch = useCallback(
        async (value: CreateDispatchReq) => {
            await createDispatch.mutateAsync(value)
        },
        [createDispatch]
    )

    const formik = useFormik<CreateDispatchReq>({
        initialValues: {
            fromStationId: selecedSationId,
            numberOfStaff: 0,
            vehicles: []
        },
        validationSchema: Yup.object().shape({
            fromStationId: Yup.string().required(t("dispatch.from_station_require")),
            numberOfStaff: Yup.number()
                .typeError(t("validation.number_type_require"))
                .integer(t("validation.integer_require"))
                .required(t("dispatch.number_staff_require"))
                .min(0, t("dispatch.number_staff_min")),
            vehicles: Yup.array()
                .of(
                    Yup.object({
                        modelId: Yup.string().required(t("dispatch.vehicle_model_require")),
                        numberOfVehicle: Yup.number()
                            .typeError(t("validation.number_type_require"))
                            .integer(t("validation.integer_require"))
                            .required(t("dispatch.number_vehicle_require"))
                            .min(1, t("dispatch.number_vehicle_min"))
                    })
                )
                .optional()
        }),
        onSubmit: handleCreateDispatch
    })

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

            {/* Station - number of staffs */}
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
                <SectionStyled title={t("dispatch.number_staff")} sectionClassName="mb-0">
                    <NumberInputStyled
                        label={t("dispatch.number_staff")}
                        min={0}
                        className="w-full"
                        value={formik.values.numberOfStaff}
                        onValueChange={(val) => {
                            formik.setFieldValue(
                                "numberOfStaff",
                                Number.isNaN(val) ? undefined : val
                            )
                        }}
                        onBlur={() => formik.setFieldTouched("numberOfStaff", true)}
                        isInvalid={!!(formik.touched.numberOfStaff && formik.errors.numberOfStaff)}
                        errorMessage={formik.errors.numberOfStaff}
                        hideStepper
                    />
                </SectionStyled>
            </div>

            {/* Tables */}
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
                    className="p-6 btn-gradient"
                    onPress={() => formik.handleSubmit()}
                >
                    {t("dispatch.create")}
                </ButtonStyled>
            </div>
        </div>
    )
}
