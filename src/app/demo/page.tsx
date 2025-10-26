// "use client"

// import { AnimatePresence, motion } from "framer-motion"
// import { ButtonStyled } from "@/components"
// import React, { useEffect, useState } from "react"
// import { useTranslation } from "react-i18next"
// import { useTypewriter } from "@/utils/helpers/useTypewriter"
// // import { useTypewriter } from "@/utils/helpers/useTyperwriter2"

// export default function HeroSection() {
//     const { t } = useTranslation()

//     const slogans = [
//         " Drive Electric. Go Green.",
//         "Rent Smarter.   Save More.",
//         "Green Wheel – The Future is Electric."
//     ]

//     const [index, setIndex] = useState(0)
//     const [text, done] = useTypewriter(slogans[index], 80, 300)

//     // chuyển đổi giữa các type
//     useEffect(() => {
//         if (done) {
//             const timeout = setTimeout(() => {
//                 setIndex((prev) => (prev + 1) % slogans.length)
//             }, 2000) // delay 2s trước khi chuyển câu
//             return () => clearTimeout(timeout)
//         }
//     }, [done, slogans.length])

//     return (
//         <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden bg-black text-white">

//             <HeroSec></HeroSec>
//             {/* 🔆 Background video / ảnh */}
//             {/* <video
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 className="absolute inset-0 w-full h-full object-cover opacity-70"
//             >
//                 <source src="/videos/greenwheel-driving.mp4" type="video/mp4" />

//             </video> */}

//             <img
//                 src="/images/test-bg.png"
//                 alt="Green Wheel"
//                 className="absolute inset-0  top-40 w-[120rem] h-[36rem] object-cover opacity-70"
//             />

//             {/* Overlay gradient */}
//             {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" /> */}

//             {/* Hiệu ứng ánh sáng động */}
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{
//                     opacity: [0.3, 0.6, 0.3],
//                     backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
//                 }}
//                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.25),transparent_70%)]"
//             />

//             {/* Content */}
//             <div className="relative z-10 flex flex-col justify-center items-start h-full px-8 md:px-24 max-w-[45.5rem] space-y-6">
//                 {/* Hiệu ứng typing slogan */}
//                 <AnimatePresence mode="wait">
//                     <motion.h1
//                         key={index}
//                         initial={{ opacity: 0, y: 40 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -40 }}
//                         transition={{ duration: 0.6, ease: "easeOut" }}
//                         className="font-bold text-4xl md:text-6xl leading-tight"
//                     >
//                         {text}
//                         <span className="animate-pulse">|</span>
//                     </motion.h1>
//                 </AnimatePresence>

//                 {/* Mô tả */}
//                 <motion.p
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 1, delay: 0.2 }}
//                     className="text-lg md:text-xl text-gray-100/90 leading-relaxed"
//                 >
//                     Thuê xe điện thông minh, tiết kiệm và thân thiện môi trường. Trải nghiệm hành
//                     trình{" "}
//                     <span className="text-teal-400 font-medium">xanh – an toàn – bền vững</span>.
//                 </motion.p>

//                 {/*Thanh năng lượng */}
//                 <motion.div
//                     initial={{ width: 0 }}
//                     animate={{ width: "140px" }}
//                     transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
//                     className="h-[4px] bg-gradient-to-r from-primary via-teal-400 to-green-400
//                                rounded-full shadow-[0_0_12px_#10b981]"
//                 />

//                 {/*Buttons */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 1, delay: 0.4 }}
//                     className="flex gap-4 mt-4"
//                 >
//                     <ButtonStyled
//                         href="/vehicle-rental"
//                         className="text-lg font-semibold px-8 py-3 rounded-xl
//                                    btn-gradient btn-gradient:hover btn-gradient:active
//                                    transition-all duration-400 shadow-lg hover:shadow-teal-500/30"
//                     >
//                         {t("home.view_details")}
//                     </ButtonStyled>

//                     <ButtonStyled
//                         href="/about"
//                         className="text-lg font-semibold px-8 py-3 rounded-xl border-2 border-white text-white
//                                    hover:bg-white hover:text-primary transition-all duration-400"
//                         variant="bordered"
//                     >
//                         {t("home.learn_more")}
//                     </ButtonStyled>
//                 </motion.div>
//             </div>

//             {/*Floating spark */}
//             <motion.div
//                 animate={{
//                     y: [0, -15, 0],
//                     opacity: [0.6, 1, 0.6],
//                     scale: [1, 1.2, 1]
//                 }}
//                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute bottom-20 right-1/4 w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_10px_4px_rgba(20,184,166,0.6)]"
//             />
//             <motion.div
//                 animate={{
//                     y: [0, -15, 0],
//                     opacity: [0.6, 1, 0.6],
//                     scale: [1, 1.2, 1]
//                 }}
//                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute left-20 top-20 right-1/4 w-3 h-3 bg-teal-400 rounded-full shadow-[0_0_10px_4px_rgba(20,184,166,0.6)]"
//             />
//         </section>
//     )
// }

import { ModelImagesUploader, TicketCard } from "@/components"
import { TicketStatus, TicketType } from "@/constants/enum"
import React from "react"

export default function page() {
    return (
        <>
            <ModelImagesUploader id="123" />
            <TicketCard
                isStaff={false}
                ticket={{
                    id: "TICKET001",
                    title: "Hỗ trợ về vấn đề thanh toán",
                    description: "Name: Ngo Huy\nEmail: duck05gaming@gmail.com\nPhone: 0987654567",
                    status: TicketStatus.Pending,
                    type: TicketType.Contact,
                    createdAt: "2024-07-21T10:30:00Z",
                    requester: {
                        firstName: "An",
                        lastName: "Nguyễn Văn",
                        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                        id: "8765678",
                        needSetPassword: false
                    },
                    assignee: {
                        firstName: "An",
                        lastName: "Nguyễn Văn",
                        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                        id: "8765678",
                        needSetPassword: false
                    }
                }}
            />
        </>
    )
}
