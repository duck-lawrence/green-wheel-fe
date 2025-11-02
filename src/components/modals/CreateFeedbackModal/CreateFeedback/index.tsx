"use client"

import { AutocompleteStyled, ButtonStyled, TextareaStyled } from "@/components/styled"
import { useCreateFeedback, useGetAllStations } from "@/hooks"
import { AutocompleteItem } from "@heroui/react"
import { MapPinAreaIcon, Star } from "@phosphor-icons/react"
import { useFormik } from "formik"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { StationFeedbackRes } from "@/models/station-feedback/schema/response"

export function CreateFeedback({
    setAllFeedbacks,
    onClose
}: {
    setAllFeedbacks: React.Dispatch<React.SetStateAction<StationFeedbackRes[]>>
    onClose: () => void
}) {
    const { t } = useTranslation()
    const { data: stations } = useGetAllStations()
    const createFeedback = useCreateFeedback({})
    const [hovered, setHovered] = useState<number>(0)

    const handleCreateFeedback = async (values: {
        stationId: string
        content: string
        rating: number
    }) => {
        const res = await createFeedback.mutateAsync(values)
        setAllFeedbacks((prev) => [res, ...prev])
        onClose()
    }

    const formik = useFormik({
        initialValues: {
            stationId: stations?.[0].id || "",
            content: "",
            rating: 0
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            stationId: Yup.string().required(t("review.station_required")),
            content: Yup.string().required(t("review.content_required")),
            rating: Yup.number()
                .min(1, t("review.rating_required"))
                .max(5, t("review.rating_required"))
                .required(t("review.rating_required"))
        }),
        onSubmit: handleCreateFeedback
    })

    return (
        <motion.form
            onSubmit={formik.handleSubmit}
            className="space-y-8 max-w-fit mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <h1 className="text-3xl font-bold text-center text-primary mb-6">
                {t("review.create_title")}
            </h1>

            <div className="grid gap-6">
                {/* Station picker */}
                <AutocompleteStyled
                    label={t("vehicle_model.station")}
                    items={stations ?? []}
                    startContent={<MapPinAreaIcon className="text-xl" />}
                    selectedKey={formik.values.stationId}
                    onSelectionChange={(key) => formik.setFieldValue("stationId", key)}
                    className="w-full"
                    isClearable={false}
                    isInvalid={!!(formik.touched.stationId && formik.errors.stationId)}
                    errorMessage={formik.errors.stationId}
                >
                    {(stations ?? []).map((item) => (
                        <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                    ))}
                </AutocompleteStyled>

                {/* Feedback content */}
                <TextareaStyled
                    label={t("review.review")}
                    placeholder={t("review.review_placeholder")}
                    value={formik.values.content}
                    onChange={formik.handleChange("content")}
                    onBlur={formik.handleBlur("content")}
                    isInvalid={!!(formik.touched.content && formik.errors.content)}
                    errorMessage={formik.errors.content}
                    className="min-h-24"
                />

                {/* Rating */}
                <div className="flex flex-col gap-2">
                    {/* <label className="font-medium text-gray-700">{t("review.rating")}</label> */}
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((val) => (
                            <Star
                                key={val}
                                size={36}
                                weight={
                                    (hovered || formik.values.rating) >= val ? "fill" : "regular"
                                }
                                className={`cursor-pointer transition-colors duration-300 ${
                                    (hovered || formik.values.rating) >= val
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                }`}
                                onMouseEnter={() => setHovered(val)}
                                onMouseLeave={() => setHovered(0)}
                                onClick={() => formik.setFieldValue("rating", val)}
                            />
                        ))}
                    </div>
                    {formik.touched.rating && formik.errors.rating && (
                        <p className="text-red-500 text-sm">{formik.errors.rating}</p>
                    )}
                </div>
            </div>

            {/* Submit */}
            <ButtonStyled
                type="submit"
                fullWidth
                isLoading={createFeedback.isPending}
                className="py-3 text-base font-semibold tracking-wide btn-gradient rounded-xl interactive-scale"
            >
                {t("review.submit")}
            </ButtonStyled>
        </motion.form>
    )
}
