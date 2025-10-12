"use client"
import React, { useCallback, useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { MapPin, Phone, EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react"
import { ButtonStyled, InputStyled, TextareaStyled } from "@/components"

export default function Contact() {
    const { t } = useTranslation()

    const initialValues = useMemo(
        () => ({ lastName: "", firstName: "", email: "", message: "" }),
        []
    )

    const validationSchema = useMemo(() => {
        return Yup.object({
            lastName: Yup.string().required(t("user.last_name")),
            firstName: Yup.string().required(t("user.first_name")),
            email: Yup.string()
                .required(t("user.email_require"))
                .matches(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/, t("user.invalid_email")),
            message: Yup.string()
        })
    }, [t])

    const handlesubmit = useCallback(
        async (values: { lastName: string; firstName: string; email: string; message: string }) => {
            await console.log(values)
        },
        []
    )

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handlesubmit
    })

    return (
        <div className="min-h-screen flex items-center justify-center py-20  px-4 mt-[-6rem]">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-5xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 border border-gray-100"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <h2 className="text-4xl font-bold text-primary">Contact Us</h2>
                    <p className="text-gray-600 text-lg">
                        We’d love to hear from you. Fill out the form or reach us via the
                        information below.
                    </p>
                </div>

                {/* Content */}
                <div className="flex flex-col lg:flex-row gap-10 mt-10">
                    {/* LEFT: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 space-y-6"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputStyled
                                isClearable
                                variant="bordered"
                                label={t("user.last_name")}
                                value={formik.values.lastName}
                                onValueChange={(value) => formik.setFieldValue("lastName", value)}
                                onBlur={() => formik.setFieldTouched("lastName")}
                                isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                                errorMessage={formik.errors.lastName}
                            />
                            <InputStyled
                                isClearable
                                variant="bordered"
                                label={t("user.first_name")}
                                value={formik.values.firstName}
                                onValueChange={(value) => formik.setFieldValue("firstName", value)}
                                onBlur={() => formik.setFieldTouched("firstName")}
                                isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                                errorMessage={formik.errors.firstName}
                            />
                        </div>
                        <InputStyled
                            isClearable
                            variant="bordered"
                            label={t("auth.email")}
                            value={formik.values.email}
                            onValueChange={(value) => formik.setFieldValue("email", value)}
                            onBlur={() => formik.setFieldTouched("email")}
                            isInvalid={!!(formik.touched.email && formik.errors.email)}
                            errorMessage={formik.errors.email}
                        />
                        <TextareaStyled
                            isClearable
                            label="Message"
                            placeholder="Type your message here..."
                            variant="bordered"
                            onValueChange={(value) => formik.setFieldValue("message", value)}
                        />

                        <ButtonStyled
                            className="w-full text-white font-semibold py-3 rounded-lg
                            bg-gradient-to-r from-primary to-teal-400 
                             hover:from-teal-500 hover:to-green-400 
                             transition-all duration-300 flex justify-center items-center gap-2"
                            type="submit"
                            isDisabled={!formik.isValid}
                            onPress={() => formik.submitForm()}
                        >
                            {t("contact.send_message")}
                            <PaperPlaneTilt size={22} weight="fill" className="animate-pulse" />
                        </ButtonStyled>
                    </motion.div>

                    {/* RIGHT: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pl-0 lg:pl-10 flex flex-col justify-between"
                    >
                        <div className="space-y-4">
                            <p className="flex items-center gap-3">
                                <MapPin size={22} weight="fill" className="text-primary" />
                                <span>
                                    <span className="font-bold text-primary">Address:</span> TP HCM,
                                    Việt Nam
                                </span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone size={22} weight="fill" className="text-primary" />
                                <span>
                                    <span className="font-bold text-primary">Phone:</span> 0900 123
                                    432
                                </span>
                            </p>
                            <p className="flex items-center gap-3">
                                <EnvelopeSimple size={22} weight="fill" className="text-primary" />
                                <span>
                                    <span className="font-bold text-primary">Email:</span>{" "}
                                    greenwheel@gmail.com
                                </span>
                            </p>
                            <p className="text-gray-400 text-sm mt-2">
                                Our team will get back to you as soon as possible. For urgent
                                matters, please call our hotline.
                            </p>
                        </div>

                        {/* MAP */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4648.246948872786!2d106.80730807570384!3d10.841132857995563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2sFPT%20University%20HCMC!5e1!3m2!1sen!2s!4v1759778136466!5m2!1sen!2s"
                            width="100%"
                            height="200"
                            className="rounded-lg shadow-sm mt-6"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
