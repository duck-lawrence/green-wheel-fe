"use client"
import { motion } from "framer-motion"
import { CheckCircle, CalendarCheck, Car } from "lucide-react"
import React from "react"

export function HowItWorks() {
    const steps = [
        {
            icon: <CheckCircle className="w-10 h-10 text-green-500" />,
            title: "Chọn xe & trạm",
            desc: "Tìm xe điện VinFast gần nhất và chọn trạm bạn muốn nhận."
        },
        {
            icon: <CalendarCheck className="w-10 h-10 text-green-500" />,
            title: "Đặt lịch & thanh toán",
            desc: "Thanh toán nhanh chóng bằng Momo hoặc tài khoản ngân hàng."
        },
        {
            icon: <Car className="w-10 h-10 text-green-500" />,
            title: "Nhận xe & khởi hành",
            desc: "Tới trạm, nhận xe và bắt đầu chuyến đi xanh của bạn!"
        }
    ]

    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="py-24 text-center relative overflow-hidden"
        >
            <style>{`
                @keyframes flow {
                    0% { background-position: 0 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes sparkMove {
                    0% { left: 0%; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { left: 100%; opacity: 0; }
                }
            `}</style>

            {/* Header */}
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-12 text-primary relative inline-block"
            >
                Cách thuê xe <span className="text-teal-500">Green Wheel</span>
                {/* Dòng năng lượng + spark */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-36 h-[4px]
                               bg-gradient-to-r from-primary via-teal-400 to-green-400
                               bg-[length:200%] animate-[flow_3s_linear_infinite]
                               rounded-full opacity-70 overflow-hidden"
                >
                    <span
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                                   bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.8)]"
                        style={{
                            animation: "sparkMove 2.5s linear infinite"
                        }}
                    ></span>
                </div>
            </motion.h2>

            {/* Dòng năng lượng chính nối 3 step */}
            <div
                className="hidden md:block absolute left-1/2 top-[58%] -translate-x-1/2 w-[70%] h-[4px] 
                           rounded-full bg-gradient-to-r from-green-400 via-teal-400 to-emerald-500 
                           bg-[length:200%] animate-[flow_3s_linear_infinite] opacity-50"
            />

            {/* Spark chạy ngang qua line */}
            <div className="hidden md:block absolute left-[15%] top-[58%] w-[70%] h-[4px] overflow-visible">
                <span
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                               bg-white shadow-[0_0_10px_3px_rgba(20,184,166,0.8)]"
                    style={{
                        animation: "sparkMove 3s linear infinite"
                    }}
                ></span>
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                {steps.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="relative p-8 rounded-2xl bg-white shadow-md 
                                   hover:shadow-lg border border-gray-100 transition-all duration-500 group z-10"
                    >
                        <div className="flex justify-center mb-4">{s.icon}</div>
                        {/* <div
                            className="flex justify-center items-center w-16 h-16 mx-auto mb-5 
                                                                   rounded-full bg-gradient-to-r from-primary to-teal-400 
                                                                   text-white shadow-md transition-transform duration-500 
                                                                   group-hover:rotate-12 group-hover:scale-110"
                        >
                            {React.cloneElement(s.icon, { size: 32, strokeWidth: 2 })}
                        </div> */}
                        <h3 className="font-semibold text-lg md:text-xl mb-2 text-gray-800">
                            {s.title}
                        </h3>
                        <p className="text-gray-600 ">{s.desc}</p>

                        {/* Glow hiệu ứng hover */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100
                                       bg-gradient-to-r from-gray-200/30 to-gray-700/20
                                       transition-opacity duration-700 rounded-2xl pointer-events-none"
                        />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}
