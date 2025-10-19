import { InvoiceItemType, InvoiceType } from "@/constants/enum"
import { useCreateInvoice } from "@/hooks"
import { CreateInvoiceReq } from "@/models/invoice/schema/request"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { InvoiceItemTypeLabels, InvoiceTypeLabels } from "@/constants/labels"
import { ButtonStyled, NumberInputStyled, TableStyled, TextareaStyled } from "@/components/styled"
import { TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { EnumPicker } from "@/components/modules"

type CreateInvoiceItemUI = CreateInvoiceReq["items"][number] & { _id: string }
type CreateInvoiceFormValues = Omit<CreateInvoiceReq, "items"> & {
    items: CreateInvoiceItemUI[]
}

export function CreateInvoiceForm({
    contractId,
    type,
    onClose
}: {
    contractId: string
    type: InvoiceType
    onClose: () => void
}) {
    const { t } = useTranslation()
    const createMutation = useCreateInvoice({ onSuccess: onClose })

    const initialValues = useMemo<CreateInvoiceFormValues>(
        () => ({
            contractId,
            type,
            items: []
        }),
        [contractId, type]
    )

    const handleCreate = useCallback(
        async (req: CreateInvoiceFormValues) => {
            const payload: CreateInvoiceReq = {
                contractId: req.contractId,
                type: req.type,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                items: req.items.map(({ _id, ...rest }) => rest)
            }
            await createMutation.mutateAsync(payload)
        },
        [createMutation]
    )

    const formik = useFormik<CreateInvoiceFormValues>({
        initialValues,
        validationSchema: Yup.object().shape({
            items: Yup.array().of(
                Yup.object().shape({
                    unitPrice: Yup.number()
                        .typeError(t("invoice.unit_price_require"))
                        .required(t("invoice.unit_price_require"))
                        .min(1, t("invoice.unit_price_min")),
                    quantity: Yup.number()
                        .typeError(t("invoice.quantity_require"))
                        .required(t("invoice.quantity_require"))
                        .min(1, t("invoice.quantity_min")),
                    description: Yup.string(),
                    type: Yup.number().required(t("invoice.item_type_require"))
                })
            )
        }),
        onSubmit: handleCreate
    })

    return (
        <form onSubmit={formik.handleSubmit} className="px-6">
            <div className="flex flex-col mb-3">
                <span>{`${t("rental_contract.id")}: ${formik.values.contractId}`}</span>
                <span>{`${t("table.type")}: ${InvoiceTypeLabels[formik.values.type]}`}</span>
            </div>

            <TableStyled className="min-w-full mb-3">
                <TableHeader>
                    <TableColumn className="text-center text-gray-700 font-semibold w-12">
                        {t("table.no")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-40">
                        {t("table.type")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-40">
                        {t("invoice.unit_price")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-30">
                        {t("invoice.quantity")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold w-100">
                        {t("table.description")}
                    </TableColumn>
                    <TableColumn className="text-center text-gray-700 font-semibold">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    {formik.values.items.map((item, index) => {
                        return (
                            <TableRow key={item._id}>
                                <TableCell className="text-center align-top text-gray-700 font-medium">
                                    {index + 1}
                                </TableCell>

                                {/* Type */}
                                <TableCell className="text-center align-top text-gray-700 font-medium">
                                    <EnumPicker
                                        // label={t("table.type")}
                                        labels={InvoiceItemTypeLabels}
                                        value={item.type}
                                        onChange={(val) => {
                                            formik.setFieldValue(`items[${index}].type`, val)
                                        }}
                                        isClearable={false}
                                    />
                                </TableCell>

                                {/* Unit price */}
                                <TableCell className="text-center align-top text-gray-700 font-medium">
                                    <NumberInputStyled
                                        value={item.unitPrice}
                                        onValueChange={(val) => {
                                            // if (!val) return
                                            formik.setFieldValue(
                                                `items[${index}].unitPrice`,
                                                Number.isNaN(val) ? undefined : val
                                            )
                                        }}
                                        onBlur={() =>
                                            formik.setFieldTouched(
                                                `items[${index}].unitPrice`,
                                                true
                                            )
                                        }
                                        isInvalid={
                                            !!(
                                                formik.touched.items?.[index]?.unitPrice &&
                                                (formik.errors.items?.[index] as any)?.unitPrice
                                            )
                                        }
                                        errorMessage={
                                            formik.touched.items?.[index]?.unitPrice &&
                                            (formik.errors.items?.[index] as any)?.unitPrice
                                        }
                                        hideStepper
                                    />
                                </TableCell>

                                {/* Quantity */}
                                <TableCell className="text-center align-top text-gray-700 font-medium">
                                    <NumberInputStyled
                                        value={item.quantity}
                                        onValueChange={(val) => {
                                            // if (!val) return
                                            formik.setFieldValue(
                                                `items[${index}].quantity`,
                                                Number.isNaN(val) ? undefined : val
                                            )
                                        }}
                                        onBlur={() =>
                                            formik.setFieldTouched(`items[${index}].quantity`, true)
                                        }
                                        isInvalid={
                                            !!(
                                                formik.touched.items?.[index]?.quantity &&
                                                (formik.errors.items?.[index] as any)?.quantity
                                            )
                                        }
                                        errorMessage={
                                            formik.touched.items?.[index]?.quantity &&
                                            (formik.errors.items?.[index] as any)?.quantity
                                        }
                                        hideStepper
                                    />
                                </TableCell>

                                {/* description */}
                                <TableCell className="text-center align-top text-gray-700 font-medium">
                                    <TextareaStyled
                                        name={`items[${index}].description`}
                                        value={item.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        errorMessage={
                                            (formik.errors.items?.[index] as any)?.description
                                        }
                                    />
                                </TableCell>

                                {/* delete btn */}
                                <TableCell className="text-center align-top text-gray-700 font-medium">
                                    <ButtonStyled
                                        type="button"
                                        variant="bordered"
                                        color="danger"
                                        className="hover:text-white hover:bg-red-600"
                                        onPress={() =>
                                            formik.setFieldValue(
                                                "items",
                                                formik.values.items.filter((_, i) => i !== index)
                                            )
                                        }
                                    >
                                        {t("common.delete")}
                                    </ButtonStyled>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </TableStyled>
            <ButtonStyled
                onPress={() => {
                    formik.setFieldValue(
                        "items",
                        formik.values.items.concat({
                            _id: crypto.randomUUID(),
                            unitPrice: 1000,
                            quantity: 1,
                            description: "",
                            type: InvoiceItemType.Penalty
                        })
                    )
                }}
            >
                {t("invoice.add_item")}
            </ButtonStyled>
        </form>
    )
}
