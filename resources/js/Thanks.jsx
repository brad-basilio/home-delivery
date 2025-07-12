import React, { useEffect, useState } from "react";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import { Local } from "sode-extend-react";
import { CarritoProvider } from "./context/CarritoContext";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { motion } from "framer-motion";
import { useTranslation } from "./hooks/useTranslation";
import { ArrowRight, CheckCircle, Heart, Star, Home as HomeIcon } from "lucide-react";

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
    const [isVisible, setIsVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        history.replaceState(null, "", "/thanks");
        localStorage.removeItem("carrito");
        
        // Trigger animations
        setIsVisible(true);
        
        // Scroll handler for parallax
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleReturnHome = () => {
        window.location.href = "/";
    };

    const { t } = useTranslation();

    return (
        <>
      
            
            {/* Hero Section de Agradecimiento */}
            <section className="relative pt-24 pb-20 min-h-screen flex items-center overflow-hidden max-h-[100dvh] lg:max-h-screen">
                {/* Background Image with Parallax */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage: `linear-gradient(rgba(54, 196, 228, 0.85), rgba(43, 163, 196, 0.85)), url('https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
                        transform: `translateY(${scrollY * 0.5}px)`
                    }}
                ></div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-20 h-20 bg-[#36C4E4]/20 rounded-full animate-pulse"></div>
                    <div className="absolute top-40 right-20 w-32 h-32 bg-[#36C4E4]/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-green-400/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
                    <div className="absolute bottom-40 right-10 w-12 h-12 bg-yellow-400/30 rounded-full animate-bounce" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-5xl mx-auto text-center text-white">
                        {/* Checkmark Hero */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 200, 
                                damping: 15,
                                delay: 0.2 
                            }}
                            className="mb-8"
                        >
                            <div className="relative mx-auto w-24 h-24 lg:w-32 lg:h-32 mb-8">
                                <motion.div
                                    animate={{ 
                                        scale: [1, 1.1, 1],
                                        boxShadow: [
                                            "0 0 0 0 rgba(34, 197, 94, 0.7)",
                                            "0 0 0 20px rgba(34, 197, 94, 0)",
                                            "0 0 0 0 rgba(34, 197, 94, 0)"
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-2xl"
                                >
                                    <CheckCircle className="h-12 w-12 lg:h-16 lg:w-16 text-white" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Título Principal */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-tight text-white drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                ¡<span className="text-green-300">Gracias</span> por{' '}
                                <span className="text-white relative drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                    Contactarnos!
                                    <motion.div 
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 1, duration: 1 }}
                                        className="absolute -bottom-2 left-0 w-full h-1 bg-green-400"
                                    ></motion.div>
                                </span>
                            </h1>
                        </motion.div>

                        {/* Subtítulo */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            <p className="text-lg md:text-2xl mb-10 text-white leading-relaxed max-w-4xl mx-auto drop-shadow-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                                Hemos recibido tu mensaje correctamente. Nuestro equipo revisará tu solicitud y nos pondremos en contacto contigo a la brevedad.
                            </p>
                        </motion.div>

                        {/* Información de respuesta */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="mb-10"
                        >
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <Star className="h-5 w-5 text-yellow-300" />
                                    <span className="text-lg font-semibold">Tiempo de Respuesta</span>
                                    <Star className="h-5 w-5 text-yellow-300" />
                                </div>
                                <p className="text-2xl font-bold text-green-300">24-48 horas hábiles</p>
                            </div>
                        </motion.div>

                        {/* Botón de retorno */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.4, duration: 0.8 }}
                            className="flex justify-center"
                        >
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleReturnHome}
                                className="group bg-white text-[#36C4E4] px-10 py-5 rounded-full text-lg font-semibold hover:bg-gray-50 transform transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3"
                            >
                                <HomeIcon className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300" />
                                <span>Volver al Inicio</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </motion.button>
                        </motion.div>

                    
                    </div>
                </div>
            </section>

       
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
