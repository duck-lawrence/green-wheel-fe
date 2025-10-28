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

export function GreenWheelExperience() {
    return (
        <section className="bg-transparent text-[#1e2b3a] py-24 overflow-hidden relative">
            <style>{`
        @keyframes flow {
          0% { background-position: 0 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spark {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes sparkMove {
          0% { left: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>

            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="text-center mb-20 relative flex flex-col justify-center">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-lg font-semibold text-teal-500 uppercase tracking-wide"
                    >
                        Experience
                    </motion.h2>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-primary mb-6"
                    >
                        Green Wheel Journey
                    </motion.h3>

                    {/* Dòng năng lượng + spark ngang */}
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-52 h-[4px]
                       bg-gradient-to-r from-primary via-teal-400 to-green-400
                       bg-[length:200%] animate-[flow_3s_linear_infinite]
                       rounded-full opacity-70 overflow-hidden"
                    >
                        {/* Spark nhỏ chạy ngang */}
                        <span
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                         bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.8)]"
                            style={{ animation: "sparkMove 2.5s linear infinite" }}
                        ></span>
                    </motion.div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Dòng điện trung tâm */}
                    <div
                        className="hidden md:block absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 
                       bg-[length:200%] animate-[flow_3s_linear_infinite]
                       bg-gradient-to-b from-primary via-teal-400 to-green-400 opacity-70 rounded-full"
                    />

                    {/* Hiệu ứng spark dọc */}
                    <div className="hidden md:block absolute left-[49.5%] -translate-x-1/5 top-0 h-full w-[6px] overflow-visible">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <span
                                key={i}
                                className="absolute left-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-green-400 shadow-[0_0_8px_3px_rgba(20,184,166,0.6)]"
                                style={{
                                    animation: `spark 4s linear ${i * 0.6}s infinite`
                                }}
                            />
                        ))}
                    </div>

                    {/* Các item */}
                    <div className="flex flex-col gap-20">
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
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

    React.useEffect(() => {
        if (inView) controls.start("visible")
    }, [inView, controls])

    // const cardVariants = {
    //     hidden: { opacity: 0, x: isLeft ? -120 : 120 },
    //     visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    // }

    const circleVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: { opacity: 0, x: isLeft ? -120 : 120 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="relative md:grid md:grid-cols-2 md:gap-12"
        >
            {/* LEFT */}
            {isLeft && (
                <motion.div className="md:col-start-1 md:col-end-2 md:pr-12 md:text-right">
                    <Card exp={exp} inView={inView} />
                </motion.div>
            )}

            {/* Center circle */}
            <motion.div
                variants={circleVariants}
                animate={inView ? "visible" : "hidden"}
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   items-center justify-center z-10"
            >
                <motion.div
                    animate={{
                        backgroundColor: inView ? "#0ea47a" : "#ffffff",
                        boxShadow: inView
                            ? "0 0 25px rgba(14,164,122,0.7), 0 0 45px rgba(20,184,166,0.4)"
                            : "none",
                        color: inView ? "#ffffff" : "#0ea47a",
                        scale: inView ? 1.15 : 1
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border-4
                     border-teal-400 text-lg font-semibold"
                >
                    {exp.id}
                </motion.div>
            </motion.div>

            {/* RIGHT */}
            {!isLeft && (
                <motion.div className="md:col-start-2 md:col-end-3 md:pl-12 md:text-left">
                    <Card exp={exp} inView={inView} />
                </motion.div>
            )}
        </motion.div>
    )
}

function Card({ exp, inView }: { exp: any; inView: boolean }) {
    return (
        <motion.article
            whileHover={{ scale: 1.05, y: -5 }}
            animate={{
                background: inView ? "linear-gradient(135deg, #0ea47a, #14b8a6)" : "white",
                color: inView ? "white" : "#1e2b3a",
                boxShadow: inView
                    ? "0 10px 25px rgba(20,184,166,0.25)"
                    : "0 5px 15px rgba(0,0,0,0.05)"
            }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl shadow-md p-8 border border-gray-100 hover:border-teal-300 
                 transition-all duration-100"
        >
            <h3 className="text-2xl font-semibold mb-1">{exp.role}</h3>
            <p className="text-teal-800 font-medium mb-2">{exp.team}</p>
            <p className="text-sm opacity-90 mb-3">{exp.stack}</p>
            <p className="font-medium mb-3">{exp.time}</p>
            <p>{exp.desc}</p>
        </motion.article>
    )
}
