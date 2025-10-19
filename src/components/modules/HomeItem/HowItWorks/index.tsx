"use client"
import { motion } from "framer-motion"
import { CheckCircle, CalendarCheck, Car } from "lucide-react"
import React from "react"
export default function HowItWorks() {
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
        <section className="py-20 bg-transparent text-center">
            <h2 className="text-3xl font-bold mb-10 text-green-700">Cách thuê xe Green Wheel</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {steps.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 rounded-2xl shadow-md hover:shadow-lg transition bg-green-50"
                    >
                        <div className="flex justify-center mb-4">{s.icon}</div>
                        <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                        <p className="text-gray-600">{s.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
