"use client"
import { MapPin } from "lucide-react"
import { motion } from "framer-motion"
import React from "react"
export default function Stations() {
    const stations = [
        { id: 1, name: "Trạm A - Green Central", address: "123 Nguyễn Văn Linh, Q7, TP.HCM" },
        { id: 2, name: "Trạm B - Eco North", address: "45 Lê Duẩn, Q1, TP.HCM" }
    ]

    return (
        <section className="py-20 bg-transparent text-center">
            <h2 className="text-3xl font-bold mb-10 text-green-700">Trạm xe Green Wheel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {stations.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg"
                    >
                        <MapPin className="w-10 h-10 text-green-500 mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">{s.name}</h3>
                        <p className="text-gray-600">{s.address}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
