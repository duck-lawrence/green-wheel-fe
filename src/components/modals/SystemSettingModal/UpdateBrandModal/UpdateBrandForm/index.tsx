import { ButtonStyled, InputStyled, TextareaStyled } from "@/components/styled"
import { useGetBrandById, useUpdateBrand } from "@/hooks/queries/useBrand"
import { BrandReq } from "@/models/brand/schema/request"
import { Spinner } from "@heroui/react"
import { useFormik } from "formik"
import { Building2, Save } from "lucide-react"
import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"

export default function UpdateBrandForm({ id, onClose }: { id: string; onClose: () => void }) {
    const { t } = useTranslation()
    const updateBrand = useUpdateBrand()
    const { data: brandId } = useGetBrandById(id)

    const handleUpdate = useCallback(
        async (id: string, updatedData: BrandReq) => {
            await updateBrand.mutateAsync({
                id,
                req: updatedData
            })
            onClose()
        },
        [updateBrand, onClose]
    )
    const formik = useFormik({
        initialValues: {
            name: brandId?.name || "",
            description: brandId?.description || "",
            country: brandId?.country || "",
            foundedYear: brandId?.foundedYear || 0
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            await handleUpdate(id, values)
            onClose()
        }
    })
    return (
        <div className="max-w-3xl mx-auto bg-white/80  backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md p-8">
            <header className="mb-8 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t("system.update_brand")}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {t("system.update_brand_description")}
                    </p>
                </div>
            </header>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <InputStyled
                        name="name"
                        label="Brand Name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        required
                    />
                    <InputStyled
                        name="country"
                        label="Country"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.country}
                        required
                    />
                    <InputStyled
                        name="foundedYear"
                        label="Founded Year"
                        value={String(formik.values.foundedYear ?? 0)}
                        onChange={(e) =>
                            formik.setFieldValue("foundedYear", Number(e.target.value))
                        }
                        min={1800}
                        max={new Date().getFullYear()}
                    />
                </div>

                <TextareaStyled
                    name="description"
                    label="Description"
                    placeholder="Describe the brand..."
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <ButtonStyled
                        type="button"
                        variant="bordered"
                        onPress={onClose}
                        disabled={updateBrand.isPending}
                        className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        color="primary"
                        disabled={updateBrand.isPending}
                        className="flex items-center gap-2"
                    >
                        {updateBrand.isPending ? (
                            <Spinner color="white" />
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> {t("common.update")}
                            </>
                        )}
                    </ButtonStyled>
                </div>
            </form>
        </div>
    )
}
