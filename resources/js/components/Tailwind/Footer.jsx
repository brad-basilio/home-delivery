import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { motion } from "framer-motion";

import Tippy from "@tippyjs/react";
import HtmlContent from "../../Utils/HtmlContent";
import GeneralRest from "../../actions/GeneralRest";
import { X } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

ReactModal.setAppElement("#app");

const Footer = ({ terms, footerLinks = [] }) => {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = (index) => setModalOpen(index);
    const closeModal = () => setModalOpen(false);
    const generalRest = new GeneralRest();
    const links = {};
    /* footerLinks.forEach((fl) => {
        links[fl.correlative] = fl.description;
    });*/
    const [socials, setSocials] = useState([]);

    useEffect(() => {
        const fetchSocials = async () => {
            try {
                const data = await generalRest.getSocials();
                setSocials(data);
            } catch (error) {
                console.error("Error fetching socials:", error);
            }
        };

        fetchSocials();
    }, []); // Asegúrate de que este array de dependencias está vacío si solo se ejecuta una vez

    const Facebook = socials.find(
        (social) => social.description.toLowerCase() === "facebook"
    );
    const Twitter = socials.find((social) => social.description.toLowerCase() === "twitter");
    const Instagram = socials.find(
        (social) => social.description.toLowerCase() === "instagram"
    );
    const Youtube = socials.find((social) => social.description.toLowerCase() === "youtube");

    const Whatsapp = socials.find((social) => social.description.toLowerCase() === "whatsapp");
    
    
    const [aboutuses, setAboutuses] = useState(null); // o useState({});

    useEffect(() => {
        const fetchAboutuses = async () => {
            try {
                const data = await generalRest.getAboutuses();
                setAboutuses(data);
            } catch (error) {
                console.error("Error fetching about:", error);
            }
        };

        fetchAboutuses();
    }, []);

    const aboutusData = aboutuses?.aboutus || [];
    const generalsData = aboutuses?.generals || [];
    const sedesData = aboutuses?.sedes || [];
    // console.log(sedesData);
    const policyItems = {
        privacy_policy: t("public.footer.privacity", "Políticas de privacidad"),
        terms_conditions: t("public.form.terms", "Términos y condiciones"),
        // 'delivery_policy': 'Políticas de envío',
        exchange_policy: t("public.footer.change", "Políticas de cambio"),
    };

    const cleanText = (text) => {
        if (text === null || text === undefined) return "";

        // Convertir a string y eliminar varios patrones de asteriscos
        return String(text)
            .replace(/\*\*(.*?)\*\*/g, "$1") // **texto**
            .replace(/\*(.*?)\*/g, "$1") // *texto*
            .replace(/[*]+/g, ""); // Cualquier asterisco suelto
    };

    return (
        <>
          {Whatsapp && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-end w-full mx-auto z-[100] relative"
                        >
                            <div className="fixed bottom-3 right-2 md:bottom-[1rem] lg:bottom-[2rem] lg:right-3 z-20 cursor-pointer">
                                <a
                                    target="_blank"
                                    id="whatsapp-toggle"
                                    href={Whatsapp.link}
                                >
                                    <motion.img
                                        animate={{
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatType: "loop",
                                        }}
                                        src="/assets/img/icons/WhatsApp.svg"
                                        alt="whatsapp"
                                        className="mr-3 w-16 h-16 md:w-[80px] md:h-[80px]"
                                    />
                                </a>
                            </div>
                        </motion.div>
                    )}
            <footer className="bg-[#224483] text-white mt-8 font-poppins ">
                {" "}

                {/*lg:mt-[120px] */}
                <div className="px-[5%] max-w-xl lg:max-w-[82rem]  mx-auto py-10 lg:pt-16 lg:pb-8">
                    <div className=" flex flex-col gap-6 lg:flex-row ">
                        <div className="lg:w-4/12 lg:px-[2%] ">
                            <div className=" w-full">
                                <img
                                    src="/assets/img/logo-white.png"
                                    alt="No Pain"
                                    className="md:w-[170.52px]  lg:w-[300.52px] object-cover grayscale invert brightness-0"
                                />
                            </div>
                            <div className=" w-full mt-6 flex gap-1 ">
                                <img
                                    src="/assets/img/icons/visa.svg"
                                    alt="visa"
                                    className="h-9 rounded-lg overflow-hidden w-auto   object-cover"
                                />
                                <img
                                    src="/assets/img/icons/mastercard.svg"
                                    alt="mastercard"
                                    className="h-9 rounded-lg overflow-hidden w-auto   object-cover"
                                />
                                <img
                                    src="/assets/img/icons/amex.svg"
                                    alt="amex"
                                    className="h-9 rounded-lg overflow-hidden w-auto   object-cover"
                                />
                                <img
                                    src="/assets/img/icons/diners.svg"
                                    alt="diners"
                                    className="h-9 rounded-lg overflow-hidden w-auto   object-cover"
                                />
                                <img
                                    src="/assets/img/icons/yape.svg"
                                    alt="yape"
                                    className="h-9 rounded-lg overflow-hidden w-auto   object-cover"
                                />
                                <img
                                    src="/assets/img/icons/plin.svg"
                                    alt="plin"
                                    className="h-9 rounded-lg overflow-hidden w-auto   object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 lg:w-8/12 lg:grid lg:grid-cols-3">
                            {sedesData.map((sede, index) => (
                                <div
                                    key={index}
                                    className="w-full text-white flex flex-col gap-2 mt-0"
                                >
                                    <p className="mb-2">
                                        {cleanText(sede.title) ||
                                            "Información no disponible"}
                                    </p>
                                    {sede.ubications.map((ubication, index) => (
                                        <p key={index} className="text-[14px]">
                                            {ubication}
                                        </p>
                                    ))}

                                    <p className="flex gap-2 text-[14px]">
                                        {t("public.form.phone", "Teléfono")}:{" "}
                                        {sede.phones.map((phone, index) => (
                                            <p key={index} className="">
                                                {phone}
                                            </p>
                                        ))}
                                    </p>
                                    {sede.emails.map((email, index) => (
                                        <p key={index} className="text-[14px]">
                                            {email}
                                        </p>
                                    ))}
                                </div>
                            ))}
                            {sedesData && sedesData.length > 0 && (
                                <div className="w-full text-white flex flex-col gap-2">
                                    <p className="mb-2">
                                        {t(
                                            "public.contact.office_hours",
                                            "Horario de Atención"
                                        )}
                                    </p>
                                    {sedesData[0]?.business_hours.map(
                                        (horario, index) => {
                                            // Dividir solo en el primer ":" encontrado
                                            const firstColonIndex =
                                                horario.indexOf(":");

                                            return (
                                                <div
                                                    key={`hour-${index}`}
                                                    className="text-[14px] mb-2"
                                                >
                                                    {/* Mostrar la parte antes del primer ":" */}
                                                    <p className="font-medium">
                                                        {horario.substring(
                                                            0,
                                                            firstColonIndex + 1
                                                        )}
                                                    </p>
                                                    {/* Mostrar la parte después del primer ":" */}
                                                    <p className="ml-0">
                                                        {horario
                                                            .substring(
                                                                firstColonIndex +
                                                                    1
                                                            )
                                                            .trim()}
                                                    </p>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                            <div className="w-full text-white flex flex-col gap-2">
                                <p className="mb-2 font-bold">
                                    {t("public.footer.politycs", "Politicas")}
                                </p>
                                <a
                                    className="text-[14px] cursor-pointer"
                                    onClick={() => openModal(0)}
                                >
                                    {t(
                                        "public.footer.privacity",
                                        "Políticas de privacidad"
                                    )}
                                </a>
                                <a
                                    onClick={() => openModal(1)}
                                    className="text-[14px] cursor-pointer"
                                >
                                    {t(
                                        "public.form.terms",
                                        "Términos y Condiciones"
                                    )}
                                </a>
                                <p
                                    onClick={() => openModal(2)}
                                    className="text-[14px] cursor-pointer"
                                >
                                    {t(
                                        "public.footer.change",
                                        "Políticas de cambio"
                                    )}
                                </p>
                                <a
                                    href="/libro-de-reclamaciones"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[14px]"
                                >
                                    {t(
                                        "public.footer.complaints",
                                        "Libro de reclamaciones"
                                    )}
                                </a>
                            </div>

                            <div className="w-full text-white flex flex-col gap-2">
                                <p className="mb-2 font-bold">
                                    {t(
                                        "public.footer.socials",
                                        "Nuestras redes"
                                    )}
                                </p>
                                <div className="flex gap-4">
                                    {Facebook && (
                                        <a
                                            className="cursor-pointer"
                                            href={Facebook.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src="/assets/img/icons/facebook.png"
                                                className="h-8 w-8"
                                            />
                                        </a>
                                    )}
                                    {Twitter && (
                                        <a
                                            className="cursor-pointer"
                                            href={Twitter.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src="/assets/img/icons/twitter.png"
                                                className="h-8 w-8"
                                            />
                                        </a>
                                    )}

                                    {Instagram && (
                                        <a
                                            className="cursor-pointer"
                                            href={Instagram.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src="/assets/img/icons/instagram.png"
                                                className="h-8 w-8"
                                            />
                                        </a>
                                    )}
                                    {Youtube && (
                                        <a
                                            className="cursor-pointer"
                                            href={Youtube.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src="/assets/img/icons/youtube.png"
                                                className="h-8 w-8"
                                            />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" bg-[#EFF0F1]">
                    <div className="px-[5%]  py-3">
                        <p className=" text-center text-xs text-[#242424] font-medium">
                            {t(
                                "public.footer.copyright",
                                "Copyright © 2024 NOPAIN Fisioterapia & Rehabilitación. Reservados todos los derechos."
                            )}
                            {/*  Copyright © 2025 NOPAIN Fisioterapia & 
                           <br className="lg:hidden" />
                            Rehabilitación. Reservados todos los derechos.*/}
                        </p>
                    </div>
                </div>
                {/* Modal para Términos y Condiciones */}
                {Object.keys(policyItems).map((key, index) => {
                    const title = policyItems[key];
                    const content =
                        generalsData.find((x) => x.correlative == key)
                            ?.description ?? "";
                    return (
                        <ReactModal
                            key={index}
                            isOpen={modalOpen === index}
                            onRequestClose={closeModal}
                            contentLabel={title}
                            className="fixed top-[5%] left-1/2 -translate-x-1/2 bg-white p-6 rounded-3xl shadow-lg w-[95%] max-w-4xl max-h-[90vh] mb-10 overflow-y-auto scrollbar-hide"
                            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto  scrollbar-hide "
                        >
                            <button
                                onClick={closeModal}
                                className="float-right  text-red-500 hover:text-red-700 transition-all duration-300 "
                            >
                                <X width="2rem" strokeWidth="4px" />
                            </button>
                            <h2 className="text-2xl font-bold mb-4">{title}</h2>
                            <HtmlContent className="prose" html={content} />
                        </ReactModal>
                    );
                })}
            </footer>
        </>
    );
};

export default Footer;
