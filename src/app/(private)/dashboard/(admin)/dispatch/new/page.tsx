"use client"
import {
    AlertModal,
    AutocompleteStyled,
    ButtonStyled,
    NumberInputStyled,
    SectionStyled,
    SpinnerStyled,
    TableSelectionVehicleModel
} from "@/components"
import { useGetAllStations, useGetAllVehicleModels, useGetMe } from "@/hooks"
import { useCreateDispatch } from "@/hooks/queries/useDispatch"
import { CreateDispatchReq } from "@/models/dispatch/schema/request"
import { AutocompleteItem, useDisclosure } from "@heroui/react"
import { Car, MapPinAreaIcon } from "@phosphor-icons/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchCreatePage() {
    const { t } = useTranslation()
    // const router = useRouter()
    const { data: user, isLoading: isGetMeLoading } = useGetMe()
    const stationIdNow = user?.station?.id

    //Station
    const { data: stations, isLoading: isStationLoading } = useGetAllStations()
    const { data: models, isLoading: isModelsLoading } = useGetAllVehicleModels({ query: {} })

    const stationDispatch = stationIdNow
        ? (stations || []).filter(({ id }) => id !== stationIdNow) || null
        : null

    //Create
    const createDispatch = useCreateDispatch({})
    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()
    // const [selectStaffs, setSelectStaffs] = useState<string[]>([])
    const [selectVehicles, setSelectVehicles] = useState<string[]>([])

    const handleCreateDispatch = useCallback(
        async (value: CreateDispatchReq) => {
            await createDispatch.mutateAsync({
                ...value,
                vehicles: value.vehicles.filter(
                    (v) => v.numberOfVehicle > 0 && selectVehicles.includes(v.modelId)
                )
            })
        },
        [createDispatch, selectVehicles]
    )

    const formik = useFormik<CreateDispatchReq>({
        initialValues: {
            fromStationId: stationDispatch?.[0]?.id || "",
            numberOfStaff: 0,
            vehicles: (models || []).map((m) => ({
                modelId: m.id,
                numberOfVehicle: 1
            }))
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            fromStationId: Yup.string().required(t("dispatch.from_station_require")),
            numberOfStaff: Yup.number()
                .typeError(t("validation.number_type_require"))
                .integer(t("validation.integer_require"))
                .required(t("dispatch.number_staff_require"))
                .min(0, t("dispatch.number_staff_min")),
            vehicles: Yup.array().of(
                Yup.object().shape({
                    modelId: Yup.string().required(t("dispatch.vehicle_model_require")),
                    numberOfVehicle: Yup.number()
                        .typeError(t("validation.number_type_require"))
                        .integer(t("validation.integer_require"))
                        .required(t("dispatch.number_vehicle_require"))
                        .min(1, t("dispatch.number_vehicle_min"))
                })
            )
        }),
        onSubmit: handleCreateDispatch
    })

    const isSubmitable = useMemo(() => {
        return formik.isValid && (formik.values.numberOfStaff !== 0 || selectVehicles.length > 0)
    }, [formik.isValid, formik.values.numberOfStaff, selectVehicles.length])

    if (isGetMeLoading || isStationLoading || isModelsLoading) return <SpinnerStyled />

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
            <div className="flex flex-wrap gap-8">
                <SectionStyled title={t("dispatch.station")} sectionClassName="mb-0">
                    <AutocompleteStyled
                        label={t("vehicle_model.station")}
                        className="max-w-60 h-20 mr-0"
                        items={stationDispatch ?? []}
                        startContent={<MapPinAreaIcon className="text-xl" />}
                        selectedKey={formik.values.fromStationId}
                        onSelectionChange={(key) => {
                            formik.setFieldValue("fromStationId", key as string)
                        }}
                        isClearable={false}
                        isInvalid={!!formik.errors.fromStationId}
                        errorMessage={formik.errors.fromStationId}
                    >
                        {(stationDispatch ?? []).map((item) => (
                            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                        ))}
                    </AutocompleteStyled>
                </SectionStyled>
                <SectionStyled title={t("dispatch.number_staff")} sectionClassName="mb-0">
                    <NumberInputStyled
                        label={t("dispatch.number_staff")}
                        className="max-w-60 h-20 mr-0"
                        min={0}
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
                    <TableSelectionVehicleModel
                        vehicleModels={models || []}
                        formik={formik}
                        onChangeSelected={setSelectVehicles}
                    />
                </div>
            </SectionStyled>

            <div className="flex justify-center items-center">
                <ButtonStyled
                    className="p-6 btn-gradient"
                    isDisabled={!formik.isValid || !isSubmitable}
                    onPress={onOpen}
                >
                    {t("dispatch.create")}
                </ButtonStyled>
                <AlertModal
                    header={t("common.confirm_to_submit")}
                    body={t("common.confirm_to_submit_body")}
                    isOpen={isOpen && formik.isValid}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                    onConfirm={() => {
                        formik.handleSubmit()
                    }}
                />
            </div>
        </div>
    )
}
