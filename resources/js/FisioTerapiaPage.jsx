import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import TextWithHighlight from "./Utils/TextWithHighlight";
import {
    ChevronDown,
    ChevronLeft,
    ChevronLeftCircle,
    ChevronLeftIcon,
    ChevronRight,
    ChevronUp,
    CircleChevronLeft,
} from "lucide-react";
import MaintenancePage from "./Utils/MaintenancePage";
import { useTranslation } from "./hooks/useTranslation";

// Animaciones compartidas
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10,
            mass: 0.5,
        },
    },
};

const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const FisioTerapiaPage = ({ landing, staffData, specialities }) => {
    const landingHero = landing.find(
        (item) => item.correlative === "page_aboutus_hero"
    );
  
    const landingStaff = landing.find(
        (item) => item.correlative === "page_aboutus_staff"
    );

    /*PARA STAFF */
    const [activeFilter, setActiveFilter] = useState(staffData[0]?.job);
    const [expandedCard, setExpandedCard] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [activeSlide, setActiveSlide] = useState(0);

    const filteredStaff = staffData?.filter(
        (person) => person.job === activeFilter
    );
    const categories = [...new Set(staffData.map((person) => person.job))];

    // Agrupar staff para mobile
    const staffSlides = [];
    for (let i = 0; i < filteredStaff.length; i += 3) {
        staffSlides.push(filteredStaff.slice(i, i + 3));
    }

    const extractSocialPlatform = (url) => {
        if (!url) return "default";
        const socialPlatforms = {
            "facebook.com": "facebook",
            "twitter.com": "twitter",
            "x.com": "twitter",
            "instagram.com": "instagram",
            "linkedin.com": "linkedin",
            "youtube.com": "youtube",
            "tiktok.com": "tiktok",
        };
        try {
            const domain = new URL(url).hostname.replace("www.", "");
            return socialPlatforms[domain] || "instagram";
        } catch {
            return "default";
        }
    };

    const { t } = useTranslation();

    return (
        <div className="font-poppins">
            <Header />
            {landingHero ? (
                <div className="px-[5%] lg:px-0 min-h-screen bg-white font-sans text-negro">
                    {/* Hero Section */}
                    <motion.header
                        className="w-full max-w-[82rem] mx-auto pt-10 pb-6 md:pt-10 md:pb-12"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.div
                            className="md:text-center max-w-4xl md:mx-auto lg:max-w-6xl mb-6 md:mb-14"
                            variants={containerVariants}
                        >
                            <motion.h1
                                className="text-[40px] md:text-4xl lg:text-6xl font-semibold leading-[42px] lg:text-center lg:leading-tight mb-2 md:mb-3 text-center"
                                variants={slideUp}
                            >
                                <TextWithHighlight
                                    text={landingHero?.title}
                                    split_coma={true}
                                />
                            </motion.h1>
                            <motion.p
                                className="text-base lg:text-lg max-w-3xl lg:max-w-4xl md:mx-auto leading-relaxed text-center"
                                variants={slideUp}
                                transition={{ delay: 0.1 }}
                            >
                                {landingHero?.description}
                            </motion.p>
                        </motion.div>

                        <motion.div
                            className="w-full mt-0 rounded-2xl overflow-hidden shadow-lg h-[500px] lg:h-[500px] lg:max-w-6xl lg:mx-auto"
                            variants={fadeIn}
                            transition={{ delay: 0.2 }}
                        >
                            <img
                                src={`/api/landing_home/media/${landingHero?.image}`}
                                alt={landingHero?.title}
                                className="w-full h-full object-cover"
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                        </motion.div>
                    </motion.header>

                    {/* Specialties Section */}

                    {/* Staff Section */}
                    <motion.section
                        className="w-full pt-4 pb-12 lg:pt-16 lg:pb-0 lg:max-w-[82rem] lg:mx-auto lg:px-[5%]"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                        variants={containerVariants}
                    >
                        <div className="mx-auto">
                            <motion.div
                                className="text-center mb-10 lg:mb-8"
                                variants={containerVariants}
                            >
                                <motion.h2
                                    className="text-[40px] leading-[42px] lg:text-7xl font-semibold lg:max-w-4xl lg:mx-auto mb-4"
                                    variants={slideUp}
                                >
                                    <TextWithHighlight
                                        text={landingStaff?.title}
                                    />
                                </motion.h2>
                                <motion.p
                                    className="text-base mt-8 lg:text-lg max-w-3xl mx-auto"
                                    variants={slideUp}
                                    transition={{ delay: 0.1 }}
                                >
                                    {landingStaff?.description}
                                </motion.p>
                            </motion.div>

                            {/* Staff Categories */}
                            <motion.div
                                className="flex items-center justify-center"
                                variants={itemVariants}
                            >
                                <div className="flex justify-center gap-8 text-[#242424] mb-8 lg:mb-16 bg-[#F2F3F4] py-1 px-1 w-max rounded-full">
                                    {categories.map((category) => (
                                        <motion.button
                                            key={category}
                                            className={`flex items-center cursor-pointer h-12 px-4 capitalize ${
                                                activeFilter === category
                                                    ? "text-azul bg-[#E2E4E7] rounded-full px-4"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setActiveFilter(category);
                                                setExpandedCard(null);
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full mr-2 ${
                                                    activeFilter === category
                                                        ? "bg-azul"
                                                        : "hidden"
                                                }`}
                                            ></span>
                                            <span className="text-lg md:text-base font-medium">
                                                {category}
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Staff Cards - Desktop */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFilter}
                                    className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={containerVariants}
                                    transition={{ duration: 0.3 }}
                                >
                                    {filteredStaff.map((person, index) => (
                                        <motion.div
                                            key={person.id}
                                            className={`bg-white rounded-xl lg:rounded-2xl shadow-md relative ${
                                                expandedCard === index
                                                    ? "z-10"
                                                    : ""
                                            }`}
                                            variants={itemVariants}
                                            whileHover={{ y: -5 }}
                                            layout
                                        >
                                            {/* Imagen */}
                                            <div className="h-[350px] lg:h-80 rounded-t-3xl overflow-hidden">
                                                <motion.img
                                                    src={`/api/staff/media/${person.image}`}
                                                    alt={person.name}
                                                    className="w-full h-full object-cover"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                />
                                            </div>

                                            {/* Contenido básico */}
                                            <div className="p-4 lg:mt-4 relative">
                                                <h3 className="font-semibold text-2xl">
                                                    <TextWithHighlight
                                                        text={person.name}
                                                    />
                                                </h3>
                                                <p
                                                    className={`text-lg line-clamp-1 ${
                                                        expandedCard === index
                                                            ? "hidden"
                                                            : ""
                                                    }`}
                                                >
                                                    {person.description}
                                                </p>

                                                {/* Botón para expandir */}
                                                <motion.button
                                                    className={`absolute right-4 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 ${
                                                        expandedCard === index
                                                            ? "bottom-4"
                                                            : "bottom-10"
                                                    }`}
                                                    onClick={() =>
                                                        setExpandedCard(
                                                            expandedCard ===
                                                                index
                                                                ? null
                                                                : index
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    {expandedCard === index ? (
                                                        <ChevronUp className="h-5 w-5 text-azul" />
                                                    ) : (
                                                        <ChevronDown className="h-5 w-5 text-azul" />
                                                    )}
                                                </motion.button>
                                            </div>

                                            {/* Contenido expandido */}
                                            <AnimatePresence>
                                                {expandedCard === index && (
                                                    <motion.div
                                                        className="absolute left-0 right-0 top-full -mt-10 bg-white p-6 rounded-b-xl lg:rounded-b-2xl shadow-lg z-20"
                                                        initial={{
                                                            opacity: 0,
                                                            y: -20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: -20,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                    >
                                                        <div className="space-y-4">
                                                            {/* Descripción completa */}
                                                            <p className="text-base">
                                                                {
                                                                    person.description
                                                                }
                                                            </p>

                                                            {/* Credenciales */}
                                                            <div className="space-y-4">
                                                                {person.characteristics.map(
                                                                    (
                                                                        characteristic,
                                                                        i
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="flex items-start gap-4"
                                                                        >
                                                                            <img
                                                                                src="/assets/img/icons/pin.png"
                                                                                className="w-6 h-6 mt-1 flex-shrink-0"
                                                                            />
                                                                            <p className="text-base lg:text-[17px]">
                                                                                {
                                                                                    characteristic
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>

                                                            {/* Redes sociales */}
                                                            {person.socials
                                                                ?.length >
                                                                0 && (
                                                                <div className="flex gap-4 mt-6 justify-end">
                                                                    {person.socials.map(
                                                                        (
                                                                            social,
                                                                            i
                                                                        ) => {
                                                                            const platform =
                                                                                extractSocialPlatform(
                                                                                    social
                                                                                );
                                                                            return (
                                                                                <a
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    href={
                                                                                        social
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                >
                                                                                    <img
                                                                                        src={`/assets/img/icons/socials/${platform}.png`}
                                                                                        className="h-10 w-10 hover:opacity-80 transition-opacity"
                                                                                        alt={
                                                                                            platform
                                                                                        }
                                                                                    />
                                                                                </a>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {/* Staff Cards - Mobile */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFilter}
                                    className="lg:hidden"
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    variants={containerVariants}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        overflow: "visible",
                                        padding: "0 20px",
                                    }}
                                >
                                    <Swiper
                                        spaceBetween={0}
                                        slidesPerView={1}
                                        breakpoints={{
                                            640: { slidesPerView: 3 },
                                        }}
                                        loop={true}
                                        pagination={{ clickable: true }}
                                        onSlideChange={(swiper) =>
                                            setActiveSlide(swiper.realIndex)
                                        }
                                        style={{
                                            overflowY: "visible",
                                        }}
                                    >
                                        {staffSlides.map(
                                            (group, slideIndex) => (
                                                <SwiperSlide key={slideIndex}>
                                                    <div className="grid grid-cols-1 gap-6">
                                                        {group.map(
                                                            (person, index) => (
                                                                <motion.div
                                                                    key={
                                                                        person.id
                                                                    }
                                                                    className="bg-white rounded-xl lg:rounded-2xl shadow-md relative"
                                                                    variants={
                                                                        itemVariants
                                                                    }
                                                                >
                                                                    {/* Imagen */}
                                                                    <div className="h-[350px] lg:h-80 rounded-t-3xl overflow-hidden">
                                                                        <img
                                                                            src={`/api/staff/media/${person.image}`}
                                                                            alt={
                                                                                person.name
                                                                            }
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>

                                                                    {/* Contenido básico */}
                                                                    <div className="p-4 lg:mt-4 relative">
                                                                        <h3 className="font-semibold text-2xl">
                                                                            <TextWithHighlight
                                                                                text={
                                                                                    person.name
                                                                                }
                                                                            />
                                                                        </h3>
                                                                        <p
                                                                            className={`text-lg line-clamp-1 ${
                                                                                expandedCard ===
                                                                                index
                                                                                    ? "hidden"
                                                                                    : ""
                                                                            }`}
                                                                        >
                                                                            {
                                                                                person.description
                                                                            }
                                                                        </p>

                                                                        {/* Botón para expandir */}
                                                                        <motion.button
                                                                            className={`absolute right-4 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 ${
                                                                                expandedCard ===
                                                                                index
                                                                                    ? "bottom-4"
                                                                                    : "bottom-10"
                                                                            }`}
                                                                            onClick={() =>
                                                                                setExpandedCard(
                                                                                    expandedCard ===
                                                                                        index
                                                                                        ? null
                                                                                        : index
                                                                                )
                                                                            }
                                                                            whileHover={{
                                                                                scale: 1.1,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.9,
                                                                            }}
                                                                        >
                                                                            {expandedCard ===
                                                                            index ? (
                                                                                <ChevronUp className="h-5 w-5 text-azul" />
                                                                            ) : (
                                                                                <ChevronDown className="h-5 w-5 text-azul" />
                                                                            )}
                                                                        </motion.button>
                                                                    </div>

                                                                    {/* Contenido expandido */}
                                                                    {expandedCard ===
                                                                        index && (
                                                                        <motion.div
                                                                            className="absolute left-0 right-0 top-full -mt-4 bg-white p-6 rounded-b-xl lg:rounded-b-2xl shadow-lg z-20"
                                                                            initial={{
                                                                                opacity: 0,
                                                                                y: -20,
                                                                            }}
                                                                            animate={{
                                                                                opacity: 1,
                                                                                y: 0,
                                                                            }}
                                                                            exit={{
                                                                                opacity: 0,
                                                                                y: -20,
                                                                            }}
                                                                            transition={{
                                                                                duration: 0.3,
                                                                            }}
                                                                        >
                                                                            <div className="space-y-4">
                                                                                {/* Descripción completa */}
                                                                                <p className="text-base">
                                                                                    {
                                                                                        person.description
                                                                                    }
                                                                                </p>

                                                                                {/* Credenciales */}
                                                                                <div className="space-y-4">
                                                                                    {person.characteristics.map(
                                                                                        (
                                                                                            characteristic,
                                                                                            i
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    i
                                                                                                }
                                                                                                className="flex items-start gap-4"
                                                                                            >
                                                                                                <img
                                                                                                    src="/assets/img/icons/pin.png"
                                                                                                    className="w-6 h-6 mt-1 flex-shrink-0"
                                                                                                />
                                                                                                <p className="text-base lg:text-[17px]">
                                                                                                    {
                                                                                                        characteristic
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        )
                                                                                    )}
                                                                                </div>

                                                                                {/* Redes sociales */}
                                                                                {person
                                                                                    .socials
                                                                                    ?.length >
                                                                                    0 && (
                                                                                    <div className="flex gap-4 mt-6 justify-end">
                                                                                        {person.socials.map(
                                                                                            (
                                                                                                social,
                                                                                                i
                                                                                            ) => {
                                                                                                const platform =
                                                                                                    extractSocialPlatform(
                                                                                                        social
                                                                                                    );
                                                                                                return (
                                                                                                    <a
                                                                                                        key={
                                                                                                            i
                                                                                                        }
                                                                                                        href={
                                                                                                            social
                                                                                                        }
                                                                                                        target="_blank"
                                                                                                        rel="noopener noreferrer"
                                                                                                    >
                                                                                                        <img
                                                                                                            src={`/assets/img/icons/socials/${platform}.png`}
                                                                                                            className="h-10 w-10 hover:opacity-80 transition-opacity"
                                                                                                            alt={
                                                                                                                platform
                                                                                                            }
                                                                                                        />
                                                                                                    </a>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </motion.div>
                                                            )
                                                        )}
                                                    </div>
                                                </SwiperSlide>
                                            )
                                        )}
                                    </Swiper>
                                    <motion.div
                                        className="flex justify-center mt-4 space-x-2"
                                        variants={itemVariants}
                                    >
                                        {staffSlides.map((_, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() =>
                                                    setActiveSlide(index)
                                                }
                                                className={`rounded-full transition-all duration-300 ${
                                                    index === activeSlide
                                                        ? "bg-[#224483] w-[20px] h-[12px]"
                                                        : "bg-[#22448366] w-[12px] h-[12px]"
                                                }`}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                            />
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.section>
                </div>
            ) : (
                <MaintenancePage />
            )}
            <Footer />
        </div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <FisioTerapiaPage {...properties} />
            </Base>
        </CarritoProvider>
    );
});
