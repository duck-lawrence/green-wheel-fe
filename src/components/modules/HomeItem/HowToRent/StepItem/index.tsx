import { motion, useAnimation, Variants } from "framer-motion"
import { useInView } from "react-intersection-observer"
import React from "react"

export function StepItem({ step, isLeft }: { step: any; isLeft: boolean }) {
    const controls = useAnimation()
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true })

    React.useEffect(() => {
        if (inView) controls.start("visible")
    }, [inView, controls])

    const createCardVariants = (isLeft: boolean): Variants => ({
        hidden: { opacity: 0, x: isLeft ? -120 : 120 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    })

    const circleVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
    }

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={createCardVariants(isLeft)}
            className="relative md:grid md:grid-cols-2 md:gap-12"
        >
            {/* LEFT */}
            {isLeft && (
                <motion.div className="md:col-start-1 md:col-end-2 md:pr-12 md:text-right">
                    <StepCard step={step} inView={inView} />
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
                    {step.id}
                </motion.div>
            </motion.div>

            {/* RIGHT */}
            {!isLeft && (
                <motion.div className="md:col-start-2 md:col-end-3 md:pl-12 md:text-left">
                    <StepCard step={step} inView={inView} />
                </motion.div>
            )}
        </motion.div>
    )
}

function StepCard({ step, inView }: { step: any; inView: boolean }) {
    const hasIcon = !!step.icon

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: inView ? 1 : 0.8,
                y: inView ? 0 : 30,
                background: inView ? "linear-gradient(135deg, #0ea47a, #14b8a6)" : "#ffffff",
                color: inView ? "#ffffff" : "#1e2b3a",
                boxShadow: inView
                    ? "0 10px 25px rgba(20,184,166,0.25)"
                    : "0 5px 15px rgba(0,0,0,0.05)"
            }}
            whileHover={{
                scale: 1.05,
                y: -6,
                boxShadow: "0 12px 30px rgba(20,184,166,0.35)"
            }}
            transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1.0] // cubic-bezier smooth easing
            }}
            className="rounded-2xl shadow-md p-8 border border-gray-100 text-center flex flex-col items-center"
        >
            {hasIcon ? (
                <motion.div
                    whileHover={{ rotate: 5 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`text-4xl mb-4 ${inView ? "text-white" : "text-teal-500"}`}
                >
                    {step.icon}
                </motion.div>
            ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-teal-50 text-teal-600 font-bold text-lg mb-4">
                    {step.id}
                </div>
            )}

            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="opacity-90">{step.desc}</p>
        </motion.article>
    )
}
