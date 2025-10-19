"use client"
import { motion } from "framer-motion"
import { Leaf, Zap, FileCheck, Shield } from "lucide-react"
import React from "react"
export default function WhyChoose() {
    const reasons = [
        {
            icon: <Zap />,
            title: "100% Xe điện",
            desc: "Tiết kiệm năng lượng và giảm phát thải CO₂."
        },
        {
            icon: <FileCheck />,
            title: "Quản lý thông minh",
            desc: "Tất cả hợp đồng và hóa đơn được số hoá."
        },
        {
            icon: <Shield />,
            title: "An toàn & tiện lợi",
            desc: "Xe bảo trì định kỳ, luôn sẵn sàng hoạt động."
        },
        {
            icon: <Leaf />,
            title: "Xanh hơn mỗi ngày",
            desc: "Cùng bạn tạo nên hành tinh xanh bền vững."
        }
    ]

    return (
        <section className="py-20 bg-transparent text-center">
            <h2 className="text-3xl font-bold mb-10 text-green-700">Vì sao chọn Green Wheel?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {reasons.map((r, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
                    >
                        <div className="flex justify-center text-green-500 mb-3">{r.icon}</div>
                        <h3 className="font-semibold mb-2">{r.title}</h3>
                        <p className="text-gray-600">{r.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
