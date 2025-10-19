"use client"
import React from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"

const experiences = [
    {
        id: "01",
        role: "Frontend Developer",
        team: "Green Wheel FE Team",
        stack: "Next.js • Tailwind • Zustand • React Query",
        time: "Mar 2024 – Present",
        desc: "Phát triển dashboard quản lý xe điện, hợp đồng và dispatch. Tối ưu hiệu năng render, caching bằng React Query và thiết kế UI với HeroUI."
    },
    {
        id: "02",
        role: "Backend Developer",
        team: "Green Wheel API",
        stack: ".NET Core • PostgreSQL • RESTful API",
        time: "Aug 2023 – Feb 2024",
        desc: "Thiết kế API quản lý thuê xe, xác thực JWT, phân quyền và tích hợp thanh toán Momo. Đảm bảo logic nghiệp vụ và bảo mật hệ thống."
    },
    {
        id: "03",
        role: "UI/UX Designer",
        team: "Green Wheel System",
        stack: "Figma • Design Tokens • i18next",
        time: "May 2023 – Jul 2023",
        desc: "Thiết kế UI đa ngôn ngữ, tone xanh hiện đại, thống nhất style guide và trải nghiệm người dùng cho web Green Wheel."
    },
    {
        id: "04",
        role: "DevOps Engineer",
        team: "Deployment Pipeline",
        stack: "Vercel • GitHub Actions • Docker",
        time: "Feb 2023 – May 2023",
        desc: "Thiết lập CI/CD pipeline tự động build & deploy lên Vercel. Tối ưu cấu hình Docker, Node.js và script production."
    }
]

export default function GreenWheelExperience() {
    return (
        <section className="bg-transparent text-[#1e2b3a] py-24">
            <div className="mx-auto max-w-5xl px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-lg font-semibold text-[#00a68e]">Experience</h2>
                    <h3 className="text-3xl font-bold mb-4">Green Wheel Journey</h3>
                    <div className="flex justify-center gap-2">
                        <span className="h-1 w-12 bg-[#00a68e] rounded-lg" />
                        <span className="h-1 w-6 bg-[#00a68e] rounded-lg" />
                        <span className="h-1 w-4 bg-[#00a68e] rounded-lg" />
                    </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Đường trục chính */}
                    <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-[#e2f2ed]" />

                    <div className="flex flex-col gap-16">
                        {experiences.map((exp, idx) => (
                            <StepItem key={exp.id} exp={exp} isLeft={idx % 2 === 0} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

function StepItem({ exp, isLeft }: { exp: any; isLeft: boolean }) {
    const controls = useAnimation()
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: false })

    React.useEffect(() => {
        if (inView) controls.start("visible")
    }, [inView, controls])

    const cardVariants = {
        hidden: { opacity: 0, y: 80 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    }

    const circleVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={cardVariants}
            className="relative md:grid md:grid-cols-2 md:gap-12"
        >
            {/* Card bên trái */}
            {isLeft && (
                <motion.div
                    variants={cardVariants}
                    animate={inView ? "visible" : "hidden"}
                    className="md:col-start-1 md:col-end-2 md:pr-12 md:text-right"
                >
                    <motion.article
                        whileHover={{ scale: 1.03 }}
                        animate={{
                            backgroundColor: inView ? "#00a68e" : "#ffffff",
                            color: inView ? "#ffffff" : "#1e2b3a"
                        }}
                        transition={{ duration: 0.4 }}
                        className="rounded-xl shadow-md p-6 transition-all duration-300 hover:bg-[#00a68e] hover:text-white"
                    >
                        <h3 className="text-2xl font-semibold">{exp.role}</h3>
                        <p className="text-[#00a68e] font-medium hover:text-white/90">{exp.team}</p>
                        <p className="text-sm mb-3">{exp.stack}</p>
                        <p className="font-medium mb-3">{exp.time}</p>
                        <p>{exp.desc}</p>
                    </motion.article>
                </motion.div>
            )}

            {/* Circle trung tâm */}
            <motion.div
                variants={circleVariants}
                animate={inView ? "visible" : "hidden"}
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
                <motion.div
                    animate={{
                        backgroundColor: inView ? "#00a68e" : "#ffffff",
                        color: inView ? "#ffffff" : "#00a68e",
                        scale: inView ? 1.15 : 1
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#00a68e] text-xl font-semibold shadow-sm"
                >
                    {exp.id}
                </motion.div>
            </motion.div>

            {/* Card bên phải */}
            {!isLeft && (
                <motion.div
                    variants={cardVariants}
                    animate={inView ? "visible" : "hidden"}
                    className="md:col-start-2 md:col-end-3 md:pl-12 md:text-left"
                >
                    <motion.article
                        whileHover={{ scale: 1.03 }}
                        animate={{
                            backgroundColor: inView ? "#00a68e" : "#ffffff",
                            color: inView ? "#ffffff" : "#1e2b3a"
                        }}
                        transition={{ duration: 0.4 }}
                        className="rounded-xl shadow-md p-6 transition-all duration-300 hover:bg-[#00a68e] hover:text-white"
                    >
                        <h3 className="text-2xl font-semibold">{exp.role}</h3>
                        <p className="text-[#00a68e] font-medium hover:text-white/90">{exp.team}</p>
                        <p className="text-sm mb-3">{exp.stack}</p>
                        <p className="font-medium mb-3">{exp.time}</p>
                        <p>{exp.desc}</p>
                    </motion.article>
                </motion.div>
            )}
        </motion.div>
    )
}
