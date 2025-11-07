"use client"
import { ButtonStyled, InputStyled, NumberInputStyled, TextareaStyled } from "@/components/styled"
import { useCreateBrand } from "@/hooks/queries/useBrand"
import { BrandReq } from "@/models/brand/schema/request"
import { Spinner } from "@heroui/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Building2, Save } from "lucide-react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function CreateBrand({ onClose }: { onClose: () => void }) {
    const { t } = useTranslation()
    const createBrand = useCreateBrand()

    const handleCreate = useCallback(
        async (req: BrandReq) => {
            const payload: BrandReq = {
                name: req.name,
                description: req.description,
                country: req.country,
                foundedYear: req.foundedYear
            }
            await createBrand.mutateAsync(payload)
        },
        [createBrand]
    )

    const formik = useFormik({
        initialValues: { name: "", description: "", country: "", foundedYear: 0 },
        validationSchema: Yup.object().shape({
            name: Yup.string().required(t("common.required")),
            description: Yup.string().required(t("common.required")),
            country: Yup.string().required(t("common.required")),
            foundedYear: Yup.number().required(t("common.required"))
            // .min(1, t("system.brand_founded_year_min"))
            // .max(new Date().getFullYear(), t("system.brand_founded_year_max"))
        }),
        onSubmit: async (values) => {
            await handleCreate(values)
            onClose()
        }
    })
    return (
        <div className="max-w-3xl mx-auto bg-white/80 0 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-8">
            <header className="mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t("system.create_brand")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("system.create_brand_description")}
                    </p>
                </div>
            </header>

            <form onSubmit={formik.handleSubmit} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                    <InputStyled
                        name="name"
                        label={t("system.brand_name")}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        isInvalid={!!(formik.touched.name && formik.errors.name)}
                        errorMessage={formik.errors.name}
                        onBlur={() => formik.setFieldTouched("name")}
                        required
                    />
                    <InputStyled
                        name="country"
                        label={t("system.brand_country")}
                        onChange={formik.handleChange}
                        value={formik.values.country}
                        isInvalid={!!(formik.touched.country && formik.errors.country)}
                        errorMessage={formik.errors.country}
                        onBlur={() => formik.setFieldTouched("country")}
                        required
                    />
                    <NumberInputStyled
                        name="foundedYear"
                        label={t("system.brand_founded_year")}
                        value={formik.values.foundedYear}
                        onValueChange={(val) => formik.setFieldValue("foundedYear", val)}
                        minValue={1}
                        maxValue={new Date().getFullYear()}
                        isInvalid={!!(formik.touched.foundedYear && formik.errors.foundedYear)}
                        errorMessage={formik.errors.foundedYear}
                        onBlur={() => formik.setFieldTouched("foundedYear")}
                        required
                    />
                </div>

                <TextareaStyled
                    name="description"
                    label={t("system.brand_description")}
                    placeholder={t("system.brand_description_placeholder")}
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    isInvalid={!!(formik.touched.description && formik.errors.description)}
                    errorMessage={formik.errors.description}
                    onBlur={() => formik.setFieldTouched("description")}
                    required
                />

                <div className="flex justify-end gap-3 pt-4">
                    <ButtonStyled
                        type="button"
                        variant="bordered"
                        onPress={onClose}
                        disabled={createBrand.isPending}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        color="primary"
                        disabled={createBrand.isPending}
                        className="flex items-center gap-2"
                    >
                        {createBrand.isPending ? (
                            <Spinner color="white" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> {t("common.create")}
                            </>
                        )}
                    </ButtonStyled>
                </div>
            </form>
        </div>
    )
}
