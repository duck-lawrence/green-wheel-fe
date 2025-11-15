"use client"
import React from "react"
import { Step, useNextStep } from "nextstepjs"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ButtonStyled } from "@/components/styled"
import { useGetMe, useUpdateMe } from "@/hooks"
import { usePathname } from "next/navigation"

interface CartNextStepProps {
    step: Step
    currentStep: number
    totalSteps: number
    nextStep: () => void
    prevStep: () => void
    skipTour?: () => void
    arrow?: React.ReactNode
}

export const CartNextStep: React.FC<CartNextStepProps> = ({
    step,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    skipTour,
    arrow
}) => {
    const { t } = useTranslation()
    const { closeNextStep } = useNextStep()
    const pathName = usePathname()

    const { data: me } = useGetMe()
    const updateUser = useUpdateMe({ onSuccess: undefined, showToast: false })

    const handleFinishTour = () => {
        if (me?.hasSeenTutorial === false) {
            updateUser.mutate({ hasSeenTutorial: true })
            localStorage.setItem("hasSeenOnboarding", "true")
        }
        closeNextStep()
    }

    const handleSkipTour = () => {
        handleFinishTour(), skipTour?.()
    }

    const handlePrevStep = () => {
        if (pathName === "/" || pathName === "/profile") {
            if (currentStep === 0) return
        }
        prevStep()
    }

    const handleNextStep = () => {
        if (currentStep === totalSteps - 1) {
            handleFinishTour()
        } else {
            nextStep()
        }
    }

    // Tiến trình
    const progress = ((currentStep + 1) / totalSteps) * 100

    return (
        <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="relative bg-white/90 dark:bg-zinc-900/80 backdrop-blur-lg border border-gray-200/40 
                 dark:border-zinc-700/40 shadow-2xl rounded-2xl px-6 py-5 w-[340px] sm:w-[380px] 
                 select-none ring-1 ring-primary/10"
        >
            {/* Progress Bar */}
            <div className="absolute top-28 left-0 h-1 w-full bg-gray-200 dark:bg-zinc-700 rounded-2xl overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-primary to-teal-400"
                />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 mt-2">
                {step.icon && (
                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="text-primary text-2xl flex items-center justify-center bg-primary/10 p-2 rounded-xl"
                    >
                        {step.icon}
                    </motion.div>
                )}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-snug">
                    {step.title}
                </h3>
            </div>

            {/* Content */}
            <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
                {step.content}
            </p>

            {arrow && <div className="mb-3">{arrow}</div>}

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                    {t("nextstep.step")} {currentStep + 1} / {totalSteps}
                </span>

                <div className="flex gap-2 items-center">
                    {currentStep > 0 && (
                        <ButtonStyled
                            onPress={handlePrevStep}
                            className="flex items-center gap-1 px-0 py-1.5 rounded-lg border border-gray-300/60 
                          text-sm font-medium text-gray-700
                         hover:bg-gray-200 hover:scale-[1.02] transition-all"
                        >
                            <ChevronLeft size={16} />
                            {t("nextstep.previous")}
                        </ButtonStyled>
                    )}

                    <ButtonStyled
                        onPress={handleNextStep}
                        className="flex items-center gap-1 px-4 py-1.5 rounded-lg 
                       bg-gradient-to-r from-primary to-teal-500 text-white font-medium text-sm 
                       shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                        {currentStep === totalSteps - 1 ? (
                            t("nextstep.finish")
                        ) : (
                            <>
                                {t("nextstep.next")} <ChevronRight size={16} />
                            </>
                        )}
                    </ButtonStyled>

                    {step.showSkip && (
                        <ButtonStyled
                            onPress={handleSkipTour}
                            className="flex items-center gap-1 text-sm text-gray-400 
                         hover:text-red-500 hover:scale-105 transition-all"
                        >
                            <XCircle size={15} />
                            {t("nextstep.skip")}
                        </ButtonStyled>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
