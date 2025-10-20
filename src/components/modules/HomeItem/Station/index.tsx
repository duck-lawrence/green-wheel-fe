"use client"

import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import React from "react"

export default function Stations() {
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

    return (
        <section className="py-20  text-center overflow-hidden">
            <motion.h2
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-12 text-primary"
            >
                Trạm xe <span className="text-teal-500">Green Wheel</span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto px-6">
                {stations.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{
                            opacity: 0,
                            x: i % 2 === 0 ? -100 : 100
                        }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.05,
                            delay: i * 0.2,
                            ease: "easeOut"
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ scale: 1.04, y: -8 }}
                        className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl 
                       transition-all duration-500 border border-gray-100 group"
                    >
                        {/* Ảnh */}
                        <div className="relative w-full h-56 md:h-64 overflow-hidden">
                            <motion.img
                                src={s.img}
                                alt={s.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 
                           transition-transform duration-700 ease-out"
                            />
                            <motion.div
                                className="absolute inset-0 bg-black/10 group-hover:bg-black/20 
                           transition-colors duration-500"
                            />
                        </div>

                        {/* Nội dung */}
                        <motion.div
                            className="p-6 flex flex-col items-center text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.3 }}
                            viewport={{ once: true }}
                        >
                            <MapPin
                                className="w-8 h-8 text-primary mb-3 transition-transform duration-500 
                           group-hover:rotate-12 group-hover:scale-110"
                            />
                            <h3 className="font-semibold text-lg md:text-xl text-gray-800 mb-1">
                                {s.name}
                            </h3>
                            <p className="text-gray-600">{s.address}</p>
                        </motion.div>

                        {/* Viền sáng gradient khi hover */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100
                            bg-gradient-to-r from-gray-200/30 to-gray-700/20
                            transition-opacity duration-700 rounded-2xl pointer-events-none"
                        ></div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
