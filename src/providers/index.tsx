"use client"
import React from "react"
import { HeroUIProvider } from "@heroui/react"
import { ToastProvider } from "@heroui/toast"
import { getQueryClient } from "@/utils/helpers/getQueryClient"
import { QueryClientProvider } from "@tanstack/react-query"
import { DisclosureProvider } from "./DisclosureProvider"
import { ClientI18nProvider } from "./ClientI18nProvider"
import { NextStep, NextStepProvider } from "nextstepjs"
import { onboardingSteps } from "@/lib/nextstep/steps"
import { DisableAutoScrollFix, useCustomNavigationAdapter } from "@/hooks"
import { CustomCard } from "@/components"

export function AppProviders({ children, locale }: { children: React.ReactNode; locale: string }) {
    const queryClient = getQueryClient()
    const navigationAdapter = useCustomNavigationAdapter()
    return (
        <QueryClientProvider client={queryClient}>
            <HeroUIProvider>
                <ClientI18nProvider locale={locale}>
                    <NextStepProvider>
                        <NextStep
                            steps={onboardingSteps}
                            cardComponent={CustomCard}
                            navigationAdapter={() => navigationAdapter}
                        >
                            <DisableAutoScrollFix />
                            <DisclosureProvider>{children}</DisclosureProvider>
                            <ToastProvider />
                        </NextStep>
                    </NextStepProvider>
                </ClientI18nProvider>
            </HeroUIProvider>
        </QueryClientProvider>
    )
}
