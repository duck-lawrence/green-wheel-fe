"use client"

import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import React from "react"
import { ImageStyled } from "@/components/styled"

const stations = [
    {
        id: 1,
        name: "Trạm A - Green Central",
        address: "123 Nguyễn Văn Linh, Q7, TP.HCM",
        img: "/images/station1.jpg"
    },
    {
        id: 2,
        name: "Trạm B - Eco North",
        address: "45 Lê Duẩn, Q1, TP.HCM",
        img: "/images/station1.jpg"
    }
]

export function Stations() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="py-24 text-center overflow-hidden relative bg-transparent"
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
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-16 text-primary relative inline-block"
            >
                Trạm xe <span className="text-teal-500">Green Wheel</span>
                {/* Dòng năng lượng + spark */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-44 h-[4px]
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

            {/* Dòng năng lượng ngang nối 2 station */}
            <div
                className="hidden md:block absolute left-1/2 top-[58%] -translate-x-1/2 
                           w-[60%] h-[4px] rounded-full 
                           bg-gradient-to-r from-primary via-teal-400 to-green-400 
                           bg-[length:200%] animate-[flow_3s_linear_infinite] opacity-40"
            />
            <div className="hidden md:block absolute left-[20%] top-[58%] w-[60%] h-[4px] overflow-visible">
                <span
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full 
                               bg-white shadow-[0_0_12px_4px_rgba(20,184,166,0.8)]"
                    style={{
                        animation: "sparkMove 3s linear infinite"
                    }}
                ></span>
            </div>

            {/* Grid stations */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6">
                {stations.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 80 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ scale: 1.04, y: -8 }}
                        className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
                                   transition-all duration-30 border border-gray-100 group z-10"
                    >
                        {/* Ảnh */}
                        <div className="relative w-full h-56 md:h-64 overflow-hidden">
                            <ImageStyled
                                src={s.img}
                                alt={s.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 
                                           transition-transform duration-700 ease-out"
                            />
                            <div
                                className="absolute inset-0 bg-black/10 group-hover:bg-black/20 
                                           transition-colors duration-500"
                            />
                        </div>

                        {/* Nội dung */}
                        <div className="p-6 flex flex-col items-center text-center">
                            <MapPin
                                className="w-8 h-8 text-primary mb-3 transition-transform duration-500 
                                           group-hover:rotate-12 group-hover:scale-110"
                            />
                            <h3 className="font-semibold text-lg md:text-xl text-gray-800 mb-1">
                                {s.name}
                            </h3>
                            <p className="text-gray-600 text-sm md:text-base">{s.address}</p>
                        </div>

                        {/* Viền sáng khi hover */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100
                                       bg-gradient-to-r from-gray-200/30 to-gray-700/20
                                       transition-opacity duration-700 rounded-2xl pointer-events-none"
                        ></div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}
