"use client"
import {
    ButtonStyled,
    Carousel,
    Footer,
    GreenWheelExperience,
    HowItWorks,
    ScrollToTopButton,
    Stations,
    WhyChoose
} from "@/components"
import React, { useCallback, useEffect, useRef } from "react"
import { slides } from "@/../public/cars"
import { useTranslation } from "react-i18next"
import { useNavbarItemStore } from "@/hooks/singleton/store/useNavbarItemStore"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import CustomerReview from "@/components/modules/HomeItem/CustomerReview"
import { useCreateFeedback } from "@/hooks"

export default function HomePage() {
    const { t } = useTranslation()
    const setActiveMenuKey = useNavbarItemStore((s) => s.setActiveMenuKey)
    const router = useRouter()
    const params = useSearchParams()
    const hasShownToast = useRef(false)

    useEffect(() => {
        setActiveMenuKey("home")
    }, [setActiveMenuKey])

    useEffect(() => {
        if (hasShownToast.current) return

        const reason = params.get("reason")
        if (reason === "expired" || reason === "no_token") {
            toast.error(t("login.please_login"))
            hasShownToast.current = true
        }

        // tạo URL mới không có param
        const newParams = new URLSearchParams(params.toString())
        newParams.delete("reason")

        router.replace(
            `${window.location.pathname}${newParams.toString() ? "?" + newParams.toString() : ""}`,
            { scroll: false }
        )
    }, [params, t, router])

    const createFeedback = useCreateFeedback({})

    const handleCreateFeedback = useCallback(async () => {
        await createFeedback.mutateAsync({
            // content: string,
            // rating,
            // stationId
        })
    })

    const reviews = [
        {
            id: "1",
            name: "Nguyễn Minh Hòa",
            avatar: "/images/users/user1.jpg",
            rating: 1,
            title: "Trải nghiệm tuyệt vời!",
            content:
                "Xe chạy êm, nhân viên hỗ trợ nhiệt tình. Tôi rất hài lòng với dịch vụ của Green Wheel!",
            createdAt: "2025-10-01"
        },
        {
            id: "2",
            name: "Trần Bảo Ngọc",
            avatar: "/images/users/user2.jpg",
            rating: 4,
            title: "Dịch vụ ổn định",
            content: "Quy trình thuê xe nhanh chóng, giá cả hợp lý. Sẽ quay lại lần tới!",
            createdAt: "2025-09-20"
        },
        {
            id: "3",
            name: "Lê Hoàng",
            avatar: "/images/users/user3.jpg",
            rating: 5,
            title: "Green Wheel xịn xò",
            content:
                "Rất thích cách Green Wheel tối ưu app thuê xe, mọi thứ trơn tru và thân thiện.",
            createdAt: "2025-09-10"
        },
        {
            id: "4",
            name: "Lê Hoàng",
            avatar: "/images/users/user3.jpg",
            rating: 5,
            title: "Green Wheel xịn xò",
            content:
                "Rất thích cách Green Wheel tối ưu app thuê xe, mọi thứ trơn tru và thân thiện.",
            createdAt: "2025-09-10"
        },
        {
            id: "5",
            name: "Lê Hoàng",
            avatar: "/images/users/user3.jpg",
            rating: 5,
            title: "Green Wheel xịn xò",
            content:
                "Rất thích cách Green Wheel tối ưu app thuê xe, mọi thứ trơn tru và thân thiện.",
            createdAt: "2025-09-10"
        },
        {
            id: "6",
            name: "Lê Hoàng",
            avatar: "/images/users/user3.jpg",
            rating: 5,
            title: "Green Wheel xịn xò",
            content:
                "Rất thích cách Green Wheel tối ưu app thuê xe, mọi thứ trơn tru và thân thiện.",
            createdAt: "2025-09-10"
        },
        {
            id: "7",
            name: "Lê Hoàng",
            avatar: "/images/users/user3.jpg",
            rating: 5,
            title: "Green Wheel xịn xò",
            content:
                "Rất thích cách Green Wheel tối ưu app thuê xe, mọi thứ trơn tru và thân thiện.",
            createdAt: "2025-09-10"
        },
        {
            id: "8",
            name: "Lê Hoàng",
            avatar: "/images/users/user3.jpg",
            rating: 5,
            title: "Green Wheel xịn xò",
            content:
                "Rất thích cách Green Wheel tối ưu app thuê xe, mọi thứ trơn tru và thân thiện.",
            createdAt: "2025-09-10"
        }
    ]

    return (
        <>
            {/* HERO SECTION */}
            <section className="relative h-screen w-full overflow-hidden mt-[-100]">
                {/* Ảnh nền full màn hình */}
                <img
                    src="/images/bg-2.jpg"
                    alt="Green Wheel"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

                {/* Overlay tối nhẹ nếu cần (giúp chữ dễ đọc) */}
                <div className="absolute inset-0 bg-black/30" />

                {/* text*/}
                <div className="relative z-10 flex flex-col justify-center items-start h-full px-8 md:px-24 max-w-2xl space-y-4 text-white">
                    <h1 className="font-bold text-4xl md:text-5xl">
                        Green Rides. Brighter Future.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100">{t("home.description")}</p>
                    <ButtonStyled
                        href="/vehicle-rental"
                        className="text-lg font-semibold px-8 py-3 border-2 border-white rounded-xl transition-all duration-500 hover:bg-primary hover:border-primary hover:text-white"
                        variant="bordered"
                    >
                        {t("home.view_details")}
                    </ButtonStyled>
                </div>
            </section>

            {/* CAROUSEL */}
            <section className="max-w-screen-xl mx-auto py-16 px-4">
                {/* <h2 className="text-3xl text-primary font-bold text-center mb-8">
                    Danh sách sản phẩm
                </h2> */}

                {/* <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
                >
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white text-primary">
                        Vision & Core Values
                    </h2>
                </motion.div> */}
                <Carousel slides={slides} />
            </section>

            {/* CONTENT SECTIONS */}
            <div>
                <HowItWorks />
            </div>

            <div>
                <WhyChoose />
            </div>

            <div>
                <Stations />
            </div>

            <div>
                <GreenWheelExperience />
            </div>

            {/* REVIEWS */}
            <CustomerReview reviews={reviews} onAddReview={() => alert("Gửi phản hồi")} />

            <ScrollToTopButton />
            <Footer />
        </>
    )
}
