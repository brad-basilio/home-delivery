import React, { useEffect } from "react";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import { Local } from "sode-extend-react";
import { CarritoProvider } from "./context/CarritoContext";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { motion } from "framer-motion";
import { useTranslation } from "./hooks/useTranslation";

// Animaciones configuradas
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            when: "beforeChildren",
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
        },
    },
};

const checkmarkVariants = {
    hidden: { scale: 0 },
    visible: {
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 15,
        },
    },
};

const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const Thanks = ({ session }) => {
    useEffect(() => {
        history.replaceState(null, "", "/thanks");
        localStorage.removeItem("carrito");
    }, []);

    const handleReturnHome = () => {
        window.location.href = "/";
    };

    const { t } = useTranslation();

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen px-5 py-10 bg-white">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="w-full max-w-lg p-10 bg-white rounded-xl  flex flex-col items-center"
                >
                    {/* Checkmark icon with animation */}
                    <motion.div
                        variants={checkmarkVariants}
                        className="relative mb-8"
                    >
                        <motion.div
                            variants={pulseVariants}
                            initial="initial"
                            animate="pulse"
                            className="absolute flex items-center justify-center inset-0 rounded-full bg-blue-100 opacity-70"
                            style={{ width: "80px", height: "80px" }}
                        />
                        <div className="flex items-center justify-center w-20 h-20 rounded-full  z-10 relative">
                            <motion.span
                                className="text-4xl text-blue-500"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.3,
                                    type: "spring",
                                    stiffness: 300,
                                }}
                            >
                                ✓
                            </motion.span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-3xl font-bold text-gray-800 mb-4 text-center"
                    >
                        ¡Gracias por contactarnos!
                    </motion.h1>

                    {/* Divider */}
                    <motion.div
                        variants={itemVariants}
                        className="w-20 h-1 bg-gradient-to-r from-blue-600 to-[#224483] rounded-full mb-6"
                    />

                    {/* Message */}
                    <motion.p
                        variants={itemVariants}
                        className="text-base text-gray-600 text-center mb-6 max-w-md leading-relaxed"
                    >
                        Hemos recibido su mensaje correctamente. Nuestro equipo
                        revisará su solicitud y nos pondremos en contacto con
                        usted a la brevedad.
                    </motion.p>

                    {/* Response time */}
                    <motion.p
                        variants={itemVariants}
                        className="text-sm text-gray-500 mb-8 px-4 py-2 bg-gray-50 rounded-lg"
                    >
                        Tiempo estimado de respuesta:{" "}
                        <strong className="text-[#224483]">
                            24-48 horas hábiles
                        </strong>
                    </motion.p>

                    {/* Return button */}
                    <motion.button
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleReturnHome}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-[#224483] text-white font-medium rounded-lg hover:shadow-md transition-all duration-200"
                    >
                        {t("public.header.home", "Inicio")}
                    </motion.button>
                </motion.div>
            </div>
            <Footer />
        </>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Thanks {...properties} />
            </Base>
        </CarritoProvider>
    );
});
