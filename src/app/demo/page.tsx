"use client"
import { ButtonStyled } from "@/components"
import { useNextStep } from "nextstepjs"
import React from "react"

export default function page() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { startNextStep, closeNextStep } = useNextStep()

    return (
        <div className="flex flex-col gap-3 p-8">
            <h1 className="text-xl font-bold mb-4">NextStepJS Demo</h1>

            <div id="docs-demo-step1" className="p-3 bg-gray-200 rounded-md">
                Onboard Step 1
            </div>

            <div id="docs-demo-step2" className="p-3 bg-gray-200 rounded-md">
                Onboard Step 2
            </div>

            <div className="flex gap-2 mt-4">
                <ButtonStyled onPress={() => startNextStep("docs-demo")}>
                    Start Demo Tour
                </ButtonStyled>

                <ButtonStyled onPress={closeNextStep}>Close Tour</ButtonStyled>
            </div>
        </div>
    )
}
