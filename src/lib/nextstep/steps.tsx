// import React from "react"
// export const onboardingSteps: Tour[] = [
// {
//     tour: "docs-demo",
//     steps: [
//         {
//             icon: <>👋</>,
//             title: "First Step",
//             content: <>This is the first step of our demo tour</>,
//             selector: "#docs-demo-step1", // 👈 cần trùng id bên dưới
//             side: "right",
//             showControls: true,
//             blockKeyboardControl: false,
//             showSkip: true,
//             pointerPadding: 5,
//             pointerRadius: 5
//         },
//         {
//             icon: <>🎉</>,
//             title: "Second Step",
//             content: <>This is the second step of our demo tour</>,
//             selector: "#docs-demo-step2", // 👈 cần trùng id bên dưới
//             side: "bottom",
//             showControls: true,
//             showSkip: true,
//             pointerPadding: 10,
//             pointerRadius: 10
//         }
//     ]
// }
"use client"
import type { Tour } from "nextstepjs"
import React from "react"
export const onboardingSteps: Tour[] = [
    {
        tour: "greenwheel-onboarding",
        steps: [
            {
                icon: <>👋</>,
                title: "Welcome to GreenWheel",
                content: (
                    <>Nhấn vào biểu tượng người dùng ở góc trên bên phải để mở menu tài khoản.</>
                ),
                selector: "#navbar-user",
                side: "bottom",
                showControls: true,
                showSkip: true
            },
            {
                icon: <>👤</>,
                title: "Cập nhật hồ sơ cá nhân",
                content: (
                    <>
                        Chọn <b>Profile</b> để xem và cập nhật thông tin của bạn.
                    </>
                ),
                selector: "#navbar-profile",
                side: "right",
                showControls: true,
                showSkip: true,

                nextRoute: "/profile" // ✅ tự chuyển sang trang profile
            },
            {
                icon: <>📱</>,
                title: "Nhập số điện thoại",
                content: (
                    <>
                        Điền số điện thoại của bạn tại đây để GreenWheel có thể liên hệ khi cần
                        thiết.
                    </>
                ),
                selector: "#input-phone",
                side: "right",
                showControls: true,
                showSkip: true
            },
            {
                icon: <>🪪</>,
                title: "Tải lên CCCD",
                content: (
                    <>
                        Tải ảnh <b>CCCD</b> để xác minh danh tính của bạn.
                    </>
                ),
                selector: "#upload-cccd",
                side: "top",
                showControls: true,
                showSkip: true
            },
            {
                icon: <>🚗</>,
                title: "Tải lên bằng lái xe",
                content: (
                    <>
                        Tải ảnh <b>bằng lái xe</b> để xác minh quyền điều khiển phương tiện.
                    </>
                ),
                selector: "#upload-license",
                side: "top",
                showControls: true,
                showSkip: true
            },
            {
                icon: <>🚙</>,
                title: "Bắt đầu thuê xe",
                content: (
                    <>
                        Nhấn vào <b>Vehicle Rental</b> để chọn xe mà bạn muốn thuê.
                    </>
                ),
                selector: "#navbar-vehicle",
                side: "bottom",
                showControls: true,
                showSkip: true,

                nextRoute: "/vehicle-rental"
            }
        ]
    }
]
