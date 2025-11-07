// import { User, CarFront, CheckCircle2, InfoIcon } from "lucide-react"
import { type Tour } from "nextstepjs"
import React from "react"
export const onboardingSteps: Tour[] = [
    {
        tour: "docs-demo",
        steps: [
            {
                icon: <>👋</>,
                title: "First Step",
                content: <>This is the first step of our demo tour</>,
                selector: "#docs-demo-step1", // 👈 cần trùng id bên dưới
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10
            },
            {
                icon: <>🎉</>,
                title: "Second Step",
                content: <>This is the second step of our demo tour</>,
                selector: "#docs-demo-step2", // 👈 cần trùng id bên dưới
                side: "bottom",
                showControls: true,
                showSkip: true,
                pointerPadding: 10,
                pointerRadius: 10
            }
        ]
    }
]
