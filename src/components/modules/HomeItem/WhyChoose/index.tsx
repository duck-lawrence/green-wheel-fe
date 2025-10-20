"use client"
import { motion } from "framer-motion"
import { Leaf, Zap, FileCheck, Shield } from "lucide-react"
import React from "react"

export default function WhyChoose() {
    const reasons = [
        {
            icon: <Zap className="w-8 h-8" />,
            title: "100% Xe điện",
            desc: "Tiết kiệm năng lượng và giảm phát thải CO₂."
        },
        {
            icon: <FileCheck className="w-8 h-8" />,
            title: "Quản lý thông minh",
            desc: "Tất cả hợp đồng và hóa đơn được số hoá."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "An toàn & tiện lợi",
            desc: "Xe bảo trì định kỳ, luôn sẵn sàng hoạt động."
        },
        {
            icon: <Leaf className="w-8 h-8" />,
            title: "Xanh hơn mỗi ngày",
            desc: "Cùng bạn tạo nên hành tinh xanh bền vững."
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
                Vì sao chọn <span className="text-teal-500">Green Wheel?</span>
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6">
                {reasons.map((r, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.1,
                            delay: i * 0.1,
                            ease: "easeOut"
                        }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ scale: 1.05, y: -8 }}
                        className="relative p-8 bg-white rounded-2xl border border-gray-100 
                       shadow-md hover:shadow-xl transition-all duration-500 group"
                    >
                        {/* icon */}
                        <div
                            className="flex justify-center items-center w-14 h-14 mx-auto mb-4 
                         rounded-full bg-gradient-to-r from-primary to-teal-400 
                         text-white shadow-md group-hover:shadow-lg 
                         transition-transform duration-500 group-hover:rotate-12"
                        >
                            {/* {r.icon} */}
                            {React.cloneElement(r.icon, { size: 32 })}
                        </div>

                        {/* nội dung */}
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">{r.title}</h3>
                        <p className="text-gray-600">{r.desc}</p>

                        {/* viền sáng khi hover */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 
                            bg-gradient-to-r from-gray-200/30 to-gray-700/20
                            rounded-2xl transition-opacity duration-700 pointer-events-none"
                        ></div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
