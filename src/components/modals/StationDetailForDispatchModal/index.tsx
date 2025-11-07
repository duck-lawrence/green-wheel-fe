"use client"
import {
    ButtonStyled,
    InputStyled,
    ModalStyled,
    NumberInputStyled,
    SectionStyled,
    TableStyled
} from "@/components"
import { useConfirmDispatch } from "@/hooks"
import { ConfirmDispatchReq } from "@/models/dispatch/schema/request"
import { DispatchDescriptionVehicleDto, DispatchViewRes } from "@/models/dispatch/schema/response"
import { StationForDispatchRes } from "@/models/station/schema/response"
import {
    ModalBody,
    ModalContent,
    ModalHeader,
    Spinner,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@heroui/react"
import { useRouter } from "next/navigation"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { FormikErrors, useFormik } from "formik"
import * as Yup from "yup"
import { DispatchRequestStatus } from "@/constants/enum"

interface FinalDescriptionForm {
    numberOfStaffs: number
    vehicles: DispatchDescriptionVehicleDto[]
}

export function StationDetailForDispatchModal({
    isOpen,
    onOpenChange,
    station,
    dispatch
}: {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    station: StationForDispatchRes
    dispatch: DispatchViewRes
}) {
    const { t } = useTranslation()
    const router = useRouter()

    const confirmMutation = useConfirmDispatch({
        onSuccess: () => router.push(`/dashboard/dispatchs/${dispatch.id}`)
    })

    const handleApprove = useCallback(
        async (value: NonNullable<ConfirmDispatchReq["finalDescription"]>) => {
            await confirmMutation.mutateAsync({
                id: dispatch.id,
                req: {
                    status: DispatchRequestStatus.Approved,
                    fromStationId: station.id,
                    finalDescription: value
                }
            })
        },
        [confirmMutation, dispatch.id, station.id]
    )

    const validationSchema = useMemo(() => {
        return Yup.object().shape({
            numberOfStaffs: Yup.number()
                .typeError(t("validation.number_type_require"))
                .integer(t("validation.integer_require"))
                .required(t("dispatch.number_staff_require"))
                .min(0, t("dispatch.number_staff_min")),
            vehicles: Yup.array().of(
                Yup.object().shape({
                    modelId: Yup.string().required(t("dispatch.vehicle_model_require")),
                    quantity: Yup.number()
                        .typeError(t("validation.number_type_require"))
                        .integer(t("validation.integer_require"))
                        .required(t("dispatch.number_vehicle_require"))
                        .min(0, t("dispatch.number_vehicle_min"))
                })
            )
        })
    }, [t])

    const formik = useFormik<FinalDescriptionForm>({
        initialValues: {
            numberOfStaffs: dispatch.description?.numberOfStaffs || 0,
            vehicles: dispatch.description?.vehicles || []
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: handleApprove
    })

    const rows = (dispatch.description?.vehicles || []).map((item, index) => ({
        modelId: item.modelId,
        index: index,
        modelName: item.modelName,
        quantity: item.quantity
    }))

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={true}
            className="w-fit max-w-screen"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{t("station.detail")}</ModalHeader>
                <ModalBody className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <InputStyled label={t("station.name")} value={station.name} readOnly />
                        <InputStyled
                            label={t("station.address")}
                            value={station.address}
                            isReadOnly
                        />
                    </div>

                    <hr className="text-gray-400 border-2 rounded-2xl" />

                    <div className="flex gap-2 w-xl">
                        <NumberInputStyled
                            labelPlacement="outside"
                            label={t("dispatch.number_staff_need")}
                            className="w-full"
                            value={dispatch.description?.numberOfStaffs || 0}
                            isReadOnly
                        />
                        <NumberInputStyled
                            labelPlacement="outside"
                            label={t("dispatch.number_staff_assign")}
                            className="w-full"
                            value={station.availableDescription?.numberOfStaffs || 0}
                            isReadOnly
                        />
                    </div>
                    <TableStyled
                        classNames={{
                            base: "max-h-[250px] overflow-scroll"
                        }}
                    >
                        <TableHeader>
                            <TableColumn>{t("vehicle_model.name")}</TableColumn>
                            <TableColumn className="text-center">
                                {t("dispatch.number_vehicle_need")}
                            </TableColumn>
                            <TableColumn className="text-center">
                                {t("dispatch.number_vehicle_assign")}
                            </TableColumn>
                        </TableHeader>
                        <TableBody
                            items={dispatch.description?.vehicles || []}
                            emptyContent={t("dispatch.no_vehicles_requested")}
                        >
                            {(item) => {
                                const quantityCanAssign =
                                    station.availableDescription.vehicles?.find(
                                        (v) => v.modelId === item.modelId
                                    )?.quantity || 0

                                return (
                                    <TableRow key={item.modelId}>
                                        <TableCell>{item.modelName}</TableCell>
                                        <TableCell className="text-center">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {quantityCanAssign}
                                        </TableCell>
                                    </TableRow>
                                )
                            }}
                        </TableBody>
                    </TableStyled>

                    <SectionStyled
                        title={t("dispatch.super_admin_approve")}
                        sectionClassName="mb-2"
                        childrenClassName="space-y-2"
                    >
                        <NumberInputStyled
                            label={t("dispatch.number_staff")}
                            className="w-full"
                            minValue={0}
                            maxValue={dispatch.description?.numberOfStaffs}
                            value={formik.values.numberOfStaffs}
                            onValueChange={(val) => {
                                formik.setFieldValue("numberOfStaffs", val)
                            }}
                            onBlur={() => formik.setFieldTouched("numberOfStaffs")}
                            isInvalid={
                                !!(formik.touched.numberOfStaffs && formik.errors.numberOfStaffs)
                            }
                            errorMessage={formik.errors.numberOfStaffs}
                        />
                        {formik.values.vehicles !== undefined &&
                            formik.values.vehicles.length > 0 && (
                                <TableStyled>
                                    <TableHeader>
                                        <TableColumn>{t("vehicle_model.name")}</TableColumn>
                                        <TableColumn className="text-left">
                                            {t("dispatch.number_vehicle")}
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody
                                        items={rows}
                                        emptyContent={t("dispatch.no_vehicles_requested")}
                                    >
                                        {(item) => {
                                            const vehicleErrors = formik.errors.vehicles as
                                                | FormikErrors<DispatchDescriptionVehicleDto>[]
                                                | undefined

                                            return (
                                                <TableRow key={item.modelId}>
                                                    <TableCell>{item.modelName}</TableCell>
                                                    <TableCell className="text-left">
                                                        <NumberInputStyled
                                                            className="w-full"
                                                            classNames={{
                                                                inputWrapper: "h-10"
                                                            }}
                                                            minValue={0}
                                                            maxValue={item.quantity}
                                                            value={
                                                                formik.values.vehicles?.[item.index]
                                                                    ?.quantity
                                                            }
                                                            onValueChange={(val) => {
                                                                formik.setFieldValue(
                                                                    `vehicles[${item.index}].quantity`,
                                                                    val
                                                                )
                                                            }}
                                                            onBlur={() =>
                                                                formik.setFieldTouched(
                                                                    `vehicles[${item.index}].quantity`
                                                                )
                                                            }
                                                            isInvalid={
                                                                !!(
                                                                    formik.touched.vehicles?.[
                                                                        item.index
                                                                    ]?.quantity &&
                                                                    vehicleErrors?.[item.index]
                                                                        ?.quantity
                                                                )
                                                            }
                                                            errorMessage={
                                                                vehicleErrors?.[item.index]
                                                                    ?.quantity
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }}
                                    </TableBody>
                                </TableStyled>
                            )}
                    </SectionStyled>

                    <div className="flex justify-center items-center gap-2">
                        {confirmMutation.isPending ? (
                            <Spinner />
                        ) : (
                            <>
                                <ButtonStyled
                                    className="btn-gradient px-6 py-2"
                                    onPress={() => {
                                        formik.handleSubmit()
                                    }}
                                >
                                    {t("dispatch.approve")}
                                </ButtonStyled>
                            </>
                        )}
                    </div>
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
