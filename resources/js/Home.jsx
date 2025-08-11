
import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import CreateReactScript from './Utils/CreateReactScript';
import { CarritoProvider } from './context/CarritoContext.jsx';

import { useState, useEffect, useRef, useContext } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Phone,
    Mail,
    MapPin,
    Truck,
    Package,
    Globe,
    Shield,
    Menu,
    X,
    Star,
    Users,
    Clock,
    Award,
    TrendingUp,
    CheckCircle,
    Heart,
} from "lucide-react"
import { translations } from '../Data/translations.js';
import GeneralRest from './actions/GeneralRest';
import { LanguageContext } from './context/LanguageContext.jsx';
import MessagesRest from './actions/MessagesRest';
import Swal from 'sweetalert2';
import { sub } from 'framer-motion/client';

// Hook para detectar cuando un elemento entra en el viewport
const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setIsIntersecting(true)
                    setHasAnimated(true)
                }
            },
            {
                threshold: 0.1,
                ...options,
            },
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [hasAnimated])

    return [ref, isIntersecting]
}

// Componente para números animados
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0)
    const [ref, isVisible] = useIntersectionObserver()

    useEffect(() => {
        if (!isVisible) return

        let startTime = null
        const startCount = 0

        const animate = (currentTime) => {
            if (startTime === null) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * (end - startCount) + startCount))

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [isVisible, end, duration])

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    )
}

const Home = ({ services = [], testimonies = [], faqs = [], generals = [], socials = [], staff_boss = null, benefits = [], indicators = [], landing = [], sliders = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isFormSubmitting, setIsFormSubmitting] = useState(false)
    const [activeTestimonial, setActiveTestimonial] = useState(0)
    const [openFAQ, setOpenFAQ] = useState(null)
    const [scrollY, setScrollY] = useState(0)
    const mobileMenuRef = useRef(null)

    // Estados para idiomas (desde HomeDokux)
    const [socialsState, setSocialsState] = useState(socials || []);
    const [languagesSystem, setLanguagesSystem] = useState([]);
    const { currentLanguage, changeLanguage } = useContext(LanguageContext);
    const [selectLanguage, setSelectLanguage] = useState(currentLanguage || languagesSystem[0]);

    // Form states
    const [formData, setFormData] = useState({
        phone: "",
        selectedService: null
    });
    const [sending, setSending] = useState(false);
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);
    const nameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const descriptionRef = useRef();
    const serviceDropdownRef = useRef();
    const messagesRest = new MessagesRest();

    // Translation system compatibility
    console.log("Current Language:", currentLanguage);
    const [languageContext, setLanguageContext] = useState(currentLanguage?.description || 'es');

    const language = languageContext || 'es';
    const t = translations[language];

    // Crear array de sliders dinámico (filtrar solo los visibles y activos)
    const activeSliders = sliders?.filter(slider => slider.visible && slider.status) || [];
    // Fallback a imágenes estáticas si no hay sliders dinámicos
    const slidersToShow = activeSliders.length > 0 ? activeSliders : [
        {
            image: "https://www.esan.edu.pe/images/blog/2019/02/26/1500x844-transporte-logistica.jpg",
            name: "Conectamos el Mundo con tu Negocio",
            description: "Soluciones logísticas integrales que llevan tus productos a cualquier destino. Confianza, seguridad y eficiencia en cada envío.",
            button_text: "Cotizar Ahora",
            button_link: "#contacto"
        },
        {
            image: "/assets/img/anmalik/red-logistica.jpg",
            name: "Red Logística Global",
            description: "Conectamos tu negocio con más de 5a0 países en 5 continentes",
            button_text: "Ver Servicios",
            button_link: "#servicios"
        },
        {
            image: "https://thelogisticsworld.com/wp-content/uploads/2020/10/flota_transporte_de_carga.jpg",
            name: "Líderes en Logística",
            description: "Más de una década conectando empresas con el mundo a través de soluciones logísticas innovadoras",
            button_text: "Conoce Más",
            button_link: "#nosotros"
        }
    ];

    // Cargar idiomas del sistema (desde HomeDokux)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const generalRest = new GeneralRest();
                const data = await generalRest.getSocials();
                const languages = await generalRest.getLanguages();
                setSocialsState(data);
                setLanguagesSystem(languages);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Sincronizar con el contexto de idioma (desde HomeDokux)
    useEffect(() => {
        if (currentLanguage) {
            setSelectLanguage(currentLanguage);
        } else if (languagesSystem.length > 0) {
            setSelectLanguage(languagesSystem[0]);
        }
    }, [currentLanguage, languagesSystem]);

    // Auto-cambio de testimonios
    useEffect(() => {
        if (testimonies.length > 0) {
            const timer = setInterval(() => {
                setActiveTestimonial((prev) => (prev + 1) % testimonies.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [testimonies]);

    // Parallax effect
    /*useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY)
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])*/

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slidersToShow.length)
            setIsZoomed(true)
            setTimeout(() => setIsZoomed(false), 500)
        }, 4000)

        return () => clearInterval(timer)
    }, [slidersToShow.length])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false)
            }
        }

        if (isMobileMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isMobileMenuOpen])

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setIsMobileMenuOpen(false)
            }
        }

        if (isMobileMenuOpen) {
            document.addEventListener("keydown", handleEscapeKey)
        }

        return () => {
            document.removeEventListener("keydown", handleEscapeKey)
        }
    }, [isMobileMenuOpen])

    // Cerrar dropdown de servicios al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
                setShowServiceDropdown(false);
            }
        };

        if (showServiceDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showServiceDropdown]);

    // Manejar scroll para el header con throttle para suavizar
    useEffect(() => {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slidersToShow.length)
        setIsZoomed(true)
        setTimeout(() => setIsZoomed(false), 500)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slidersToShow.length) % slidersToShow.length)
        setIsZoomed(true)
        setTimeout(() => setIsZoomed(false), 500)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setIsFormSubmitting(true)

        try {
            const formDataToSend = {
                name: nameRef.current?.value || '',
                last_name: lastNameRef.current?.value || '',
                email: emailRef.current?.value || '',
                subject: `Solicitud de Cotización - Servicios de Transporte y Logística`,
                phone: phoneRef.current?.value || '',
                description: descriptionRef.current?.value || '',
                service_id: formData.selectedService?.id || null
            };

            const result = await messagesRest.save(formDataToSend);

            if (result) {
                // Redirigir a página de agradecimiento
                window.location.href = "/thanks";
            }
           

            // Limpiar formulario
            if (nameRef.current) nameRef.current.value = '';
            if (lastNameRef.current) lastNameRef.current.value = '';
            if (emailRef.current) emailRef.current.value = '';
            if (phoneRef.current) phoneRef.current.value = '';
            if (descriptionRef.current) descriptionRef.current.value = '';
            setFormData({ ...formData, selectedService: null });

        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar el mensaje. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }

        setIsFormSubmitting(false)
    }

    // Función para cambiar idioma (desde HomeDokux)
    const onUseLanguage = async (langData) => {
        try {
            // Función para extraer el token de la cookie
            const getCsrfTokenFromCookie = () => {
                const cookie = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
                return cookie ? decodeURIComponent(cookie[1]) : null;
            };

            // Obtén el token CSRF de las cookies automáticamente
            const response = await fetch("/set-current-lang", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCsrfTokenFromCookie(), // Función para obtenerlo
                },
                body: JSON.stringify({ lang_id: langData.id }),
                credentials: "include", // Permite enviar cookies
            });

            if (response.ok) {
                await changeLanguage(langData); // ✅ Agrega await aquí
                setSelectLanguage(langData);
                window.location.reload(); // ⚠️ Opcional temporal para forzar actualización
            } else {
                console.log("Error de extracion:", await response.text());
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    // Función para obtener el icono según el nombre de la red social
    const getSocialIcon = (name) => {
        const socialName = name.toLowerCase();
        // Devuelve directamente el JSX del SVG para cada red social
        switch (socialName) {
            case 'instagram':
                return () => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                );
            case 'facebook':
                return () => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                );
            case 'whatsapp':
            case 'watsapp':
                return () => (
                    <svg fill='currentColor' width="16px" height="16px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp icon</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                );
            case 'twitter':
            case 'x':
                return () => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                );
            case 'linkedin':
                return () => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                );
            case 'youtube':
                return () => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                );
            case 'tiktok':
                return () => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                    </svg>
                );
            default:
                return () => (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                );
        }
    };

    const [headerRef, headerVisible] = useIntersectionObserver()
    const [heroRef, heroVisible] = useIntersectionObserver()
    const [servicesRef, servicesVisible] = useIntersectionObserver()
    const [statsRef, statsVisible] = useIntersectionObserver()
    const [aboutRef, aboutVisible] = useIntersectionObserver()
    const [parallaxRef, parallaxVisible] = useIntersectionObserver()

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header
                ref={headerRef}
                className={` top-0 left-0 right-0 z-50 text-white transition-all duration-700 ease-in-out ${
                    scrollY > 30 
                        ? 'fixed bg-[#2e3e50]/95 backdrop-blur-md shadow-lg' 
                        : 'relative bg-[#2e3e50]/90'
                }`}
            >
                {/* Top Bar - Hidden on small screens and when scrolled */}
                <div className={`hidden lg:block bg-[#1a252f] transition-all duration-700 ease-in-out ${
                    scrollY > 30 ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-auto py-2 opacity-100'
                }`}>
                    <div className="container mx-auto px-4 xl:px-6">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-[#e5b437]" />
                                    <span>{generals?.find(g => g.correlative === 'phone_contact')?.description || '+1 (555) 123-4567'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-[#e5b437]" />
                                    <span>{generals?.find(g => g.correlative === 'email_contact')?.description || 'info@anmalikcargo.com'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-[#e5b437]" />
                                    <span>{generals?.find(g => g.correlative === 'address')?.description || 'info@anmalikcargo.com'}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-[#e5b437]">Síguenos:</span>
                                <div className="flex space-x-2">
                                    {socials?.filter(social => 
                                        social.visible && 
                                        social.status && 
                                        !social.description?.toLowerCase().includes('whatsapp') && 
                                        !social.name?.toLowerCase().includes('whatsapp')
                                    ).map((social, index) => {
                                        const IconComponent = getSocialIcon(social.description || social.name);
                                        return (
                                            <a
                                                key={index}
                                                href={social.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-[#e5b437] transition-colors text-sm font-medium w-6 h-6 flex items-center justify-center"
                                                title={social.description || social.name}
                                            >
                                                <IconComponent />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Header */}
                <div className={`transition-all duration-700 ease-in-out ${
                    scrollY > 30 
                        ? 'bg-[#2e3e50]/98 backdrop-blur-sm shadow-md' 
                        : 'bg-black/20 backdrop-blur-sm'
                }`}>
                   <div className="py-3 lg:py-4 px-4 xl:px-6">
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center space-x-3 lg:space-x-4">
                                <img src="./logo.png" alt="" className="h-12" />
                                {/*
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#e5b437] rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                  <span className="text-[#2e3e50] font-bold text-lg lg:text-xl">M</span>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg lg:text-2xl font-bold truncate">AN MALIK CARGO</h1>
                  <p className="text-xs lg:text-sm text-gray-300 hidden sm:block">Logistics & Transportation</p>
                </div>
                */}
                            </div>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center space-x-8">
                                <a href="#inicio" className="hover:text-[#e5b437] transition-colors font-medium">
                                    Inicio
                                </a>
                                <a href="#servicios" className="hover:text-[#e5b437] transition-colors font-medium">
                                    Servicios
                                </a>
                                <a href="#nosotros" className="hover:text-[#e5b437] transition-colors font-medium">
                                    Nosotros
                                </a>
                                <a href="#contacto" className="hover:text-[#e5b437] transition-colors font-medium">
                                    Contacto
                                </a>
                            </nav>

                            {/* Desktop Contact Info */}
                            <div className="hidden xl:flex items-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-[#e5b437]" />
                                    <span className="font-medium">{generals?.find(g => g.correlative === 'phone_contact')?.description || '+1 (555) 123-4567'}</span>
                                </div>
                                {(() => {
                                    const whatsappSocial = socials?.find(social => 
                                        social.visible && 
                                        social.status && 
                                        (social.description?.toLowerCase().includes('whatsapp') || social.name?.toLowerCase().includes('whatsapp'))
                                    );
                                    
                                    if (whatsappSocial) {
                                        const IconComponent = getSocialIcon(whatsappSocial.description || whatsappSocial.name);
                                        return (
                                            <a
                                                href={whatsappSocial.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#e5b437] hover:bg-[#d4a332] text-white px-6 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
                                                title={whatsappSocial.description || whatsappSocial.name}
                                            >
                                                <IconComponent />
                                                <span>Cotizar Ahora</span>
                                            </a>
                                        );
                                    } else {
                                        return (
                                            <button className="bg-[#e5b437] hover:bg-[#d4a332] text-white px-6 py-2 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                                Cotizar Ahora
                                            </button>
                                        );
                                    }
                                })()}
                            </div>

                            {/* Mobile Contact & Menu */}
                            <div className="flex items-center space-x-3 lg:hidden">
                                <a href={`tel:${generals?.find(g => g.correlative === 'phone_contact')?.description?.replace(/\D/g, '') || '15551234567'}`} className="flex items-center space-x-1 text-[#e5b437] text-sm">
                                    <Phone className="w-4 h-4" />
                                    <span className="hidden sm:inline">Llamar</span>
                                </a>
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="p-2 hover:bg-[#3a4a5c] rounded-lg transition-colors"
                                    aria-label="Toggle menu"
                                >
                                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>

                {/* Mobile Menu */}
                <div
                    ref={mobileMenuRef}
                    className={`lg:hidden absolute top-full left-0 right-0 bg-[#2e3e50]/95 backdrop-blur-md border-t border-[#3a4a5c]/50 transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "opacity-100 visible transform translate-y-0" : "opacity-0 invisible transform -translate-y-2"
                        }`}
                >
                    <div className="container mx-auto px-4 py-4">
                        <nav className="space-y-4">
                            <a
                                href="#inicio"
                                className="block py-2 hover:text-[#e5b437] transition-colors font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Inicio
                            </a>
                            <a
                                href="#servicios"
                                className="block py-2 hover:text-[#e5b437] transition-colors font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Servicios
                            </a>
                            <a
                                href="#nosotros"
                                className="block py-2 hover:text-[#e5b437] transition-colors font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Nosotros
                            </a>
                            <a
                                href="#contacto"
                                className="block py-2 hover:text-[#e5b437] transition-colors font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contacto
                            </a>
                        </nav>

                        <div className="mt-6 pt-4 border-t border-[#3a4a5c] space-y-3">
                            <div className="flex items-center space-x-2 text-sm">
                                <Mail className="w-4 h-4 text-[#e5b437]" />
                                <span>{generals?.find(g => g.correlative === 'email_contact')?.description || 'info@anmalikcargo.com'}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="w-4 h-4 text-[#e5b437]" />
                                <span>Servicio 24/7 - Cobertura Global</span>
                            </div>
                            <button className="w-full bg-[#e5b437] hover:bg-[#d4a332] text-white mt-4 py-3 rounded-md font-medium transition-colors">
                                Solicitar Cotización
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section with Slider and Form */}
            <section
                ref={heroRef}
                id="inicio"
                className={`relative min-h-screen overflow-hidden transition-all duration-1000 pt-[120px] lg:pt-[100px] ${heroVisible ? "animate-fadeInUp" : "opacity-0 translate-y-10"
                    }`}
            >
                {/* Image Slider */}
                <div className="absolute inset-0">
                    {slidersToShow.map((slider, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-3000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <img
                                src={
                                    // Si es un slider de la BD y tiene imagen, usar la API
                                    slider.image && typeof slider.image === 'string' && !slider.image.startsWith('http') 
                                        ? `/api/sliders/media/${slider.image}`
                                        // Si es una URL completa (fallback estático), usarla directamente
                                        : slider.image || "/placeholder.svg"
                                }
                                alt={slider.name || `Slide ${index + 1}`}
                                className={`w-full h-full object-cover transition-transform duration-[2000ms] ${isZoomed ? "scale-110" : "scale-100"
                                    }`}
                            />
                            <div className="absolute inset-0 bg-black/50 lg:bg-black/40"></div>
                        </div>
                    ))}
                </div>



              

                {/* Slide Indicators */}
                <div className="absolute bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {slidersToShow.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-200 ${index === currentSlide ? "bg-[#e5b437] scale-125" : "bg-white/50 hover:bg-white/75"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center z-10">
                    <div className="container mx-auto px-4 xl:px-6">
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Content */}
                            <div className="text-white space-y-4 lg:space-y-6 text-center lg:text-left animate-slideInLeft">
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                                    {slidersToShow[currentSlide]?.name ? (
                                        slidersToShow[currentSlide].name.split(' ').map((word, index) => (
                                            index === Math.floor(slidersToShow[currentSlide].name.split(' ').length / 2) ? (
                                                <span key={index} className="text-[#e5b437] animate-pulse"> {word}</span>
                                            ) : (
                                                <span key={index}> {word}</span>
                                            )
                                        ))
                                    ) : (
                                        <>
                                            Conectamos el
                                            <span className="text-[#e5b437] animate-pulse"> Mundo</span>
                                            <br />
                                            con tu Negocio
                                        </>
                                    )}
                                </h2>
                                <p className="text-lg lg:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {slidersToShow[currentSlide]?.description || "Soluciones logísticas integrales que llevan tus productos a cualquier destino. Confianza, seguridad y eficiencia en cada envío."}
                                </p>
                                <div className="flex flex-wrap justify-center lg:justify-start gap-3 lg:gap-4">
                                    <div className="flex items-center space-x-2 bg-[#2b604b]/20 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-lg animate-fadeInUp animation-delay-300">
                                        <Globe className="w-4 h-4 lg:w-5 lg:h-5 text-[#2b604b]" />
                                        <span className="text-sm lg:text-base">Cobertura Global</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-[#e5b437]/20 backdrop-blur-sm px-3 lg:px-4 py-2 rounded-lg animate-fadeInUp animation-delay-500">
                                        <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-[#e5b437]" />
                                        <span className="text-sm lg:text-base">Envíos Seguros</span>
                                    </div>
                                </div>

                                  {/* Slider Controls */}
              <div className='hidden lg:flex gap-4 pt-8'>
                  <button
                    onClick={prevSlide}
                    className=" transform -translate-y-1/2 bg-[#e5b437] hover:bg-[#d4a332] text-white p-2 lg:p-3 rounded-full z-10 transition-all duration-200 hover:scale-110"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className=" transform -translate-y-1/2 bg-[#e5b437] hover:bg-[#d4a332] text-white p-2 lg:p-3 rounded-full z-10 transition-all duration-200 hover:scale-110"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6" />
                </button>
              </div>

                                {/* Mobile CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 lg:hidden pt-4">
                                    <a 
                                        href={slidersToShow[currentSlide]?.button_link || "#contacto"}
                                        className="bg-[#e5b437] hover:bg-[#d4a332] text-white px-6 py-3 text-lg font-semibold rounded-md transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounceIn animation-delay-700 text-center"
                                    >
                                        {slidersToShow[currentSlide]?.button_text || "Cotizar Ahora"}
                                    </a>
                                    <a 
                                        href="#servicios"
                                        className="border border-white text-white hover:bg-white hover:text-[#2e3e50] px-6 py-3 bg-transparent rounded-md transition-all duration-300 hover:scale-105 animate-bounceIn animation-delay-900 text-center"
                                    >
                                        Ver Servicios
                                    </a>
                                </div>
                            </div>

                            {/* Contact Form - Hidden on mobile, shown on tablet+ */}
                            <div  className="hidden lg:block animate-slideInRight">
                                <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-300">
                                    <div className="p-6 xl:p-8">
                                        <div className="text-center mb-6">
                                            <h3 className="text-xl xl:text-2xl font-bold text-[#2e3e50] mb-2">Solicita tu Cotización</h3>
                                            <p className="text-gray-600 text-sm xl:text-base">
                                                Obtén una cotización personalizada para tus envíos
                                            </p>
                                        </div>

                                        <form onSubmit={handleFormSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                                <input
                                                    ref={nameRef}
                                                    type="text"
                                                    placeholder="Nombre completo"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                                    required
                                                />
                                                <input
                                                    ref={lastNameRef}
                                                    type="text"
                                                    placeholder="Apellidos"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                                <input
                                                    ref={emailRef}
                                                    type="email"
                                                    placeholder="Correo electrónico"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                                    required
                                                />
                                                <input
                                                    ref={phoneRef}
                                                    type="tel"
                                                    placeholder="Teléfono"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                                    required
                                                />
                                            </div>

                                            {/* Selector de Servicios */}
                                            {services && services.length > 0 && (
                                                <div className="relative" ref={serviceDropdownRef}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300 bg-white text-left flex items-center justify-between"
                                                    >
                                                        <span className={formData.selectedService ? "text-gray-900" : "text-gray-500"}>
                                                            {formData.selectedService?.title || formData.selectedService?.name || "Selecciona un servicio"}
                                                        </span>
                                                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showServiceDropdown ? 'rotate-90' : ''}`} />
                                                    </button>

                                                    {showServiceDropdown && (
                                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                                            {services.map((service) => (
                                                                <button
                                                                    key={service.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData({ ...formData, selectedService: service });
                                                                        setShowServiceDropdown(false);
                                                                    }}
                                                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-200"
                                                                >
                                                                    {service.title || service.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <textarea
                                                ref={descriptionRef}
                                                placeholder="Describe tu consulta (tipo de carga, destino, etc.)"
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] resize-none transition-all duration-300"
                                            />

                                            <button
                                                type="submit"
                                                disabled={isFormSubmitting}
                                                className="w-full bg-[#e5b437] hover:bg-[#d4a332] text-white py-3 text-lg font-semibold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg"
                                            >
                                                {isFormSubmitting ? "Enviando..." : "Solicitar Cotización"}
                                            </button>
                                        </form>

                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex items-center justify-center space-x-4 xl:space-x-6 text-xs xl:text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4 text-[#2e3e50]" />
                                                    <span>Respuesta en 24h</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Shield className="w-4 h-4 text-[#2b604b]" />
                                                    <span>Cotización gratuita</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Form Section */}
            <section id='contacto' className="lg:hidden bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="bg-white shadow-xl rounded-lg animate-fadeInUp">
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-[#2e3e50] mb-2">Solicita tu Cotización</h3>
                                <p className="text-gray-600 text-sm">Obtén una cotización personalizada</p>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nombre completo"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Apellidos"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                />
                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                    required
                                />

                                {/* Selector de Servicios para móvil */}
                                {services && services.length > 0 && (
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] transition-all duration-300"
                                        onChange={(e) => {
                                            const selectedService = services.find(s => s.id == e.target.value);
                                            setFormData({ ...formData, selectedService });
                                        }}
                                    >
                                        <option value="">Selecciona un servicio</option>
                                        {services.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.title || service.name}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <textarea
                                    placeholder="Describe tu consulta"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e5b437] focus:border-[#e5b437] resize-none transition-all duration-300"
                                />
                                <button
                                    type="submit"
                                    disabled={isFormSubmitting}
                                    className="w-full bg-[#e5b437] hover:bg-[#d4a332] text-white py-3 font-semibold rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg"
                                >
                                    {isFormSubmitting ? "Enviando..." : "Solicitar Cotización"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section
                ref={servicesRef}
                id="servicios"
                className={`py-12 lg:py-20 bg-white transition-all duration-1000 ${servicesVisible ? "animate-fadeInUp" : "opacity-0 translate-y-10"
                    }`}
            >
                <div className="container mx-auto px-4 xl:px-6">
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#2e3e50] mb-4">
                            {t?.services?.title || "Nuestros Servicios"}
                        </h2>
                        <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                            {t?.services?.subtitle || "Ofrecemos soluciones logísticas completas adaptadas a las necesidades de tu negocio"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {services?.map((service, index) => (
                            <div
                                key={index}
                                className={`group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 p-6 lg:p-8 text-center transform hover:scale-105 animate-fadeInUp`}
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className="w-16 p-2 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: service.color }}>
                                    <img
                                        src={`/api/service/media/${service?.icon}`}
                                        alt={service?.name}
                                        className="w-full h-full p-2 group-hover:rotate-12 transition-transform duration-500 ease-in-out"
                                    />
                                </div>
                                <h3 className="text-lg lg:text-xl font-bold text-[#2e3e50] mb-3 lg:mb-4 group-hover:text-[#e5b437] transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Banner después de Servicios (sin parallax) */}
            <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
                {/* Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/assets/img/anmalik/red-logistica.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-[#e5b437]/70"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 animate-fadeInUp">
                        Red Logística <span className="text-[#2e3e50]">Global</span>
                    </h2>
                    <p className="text-xl text-white max-w-3xl mx-auto mb-8 animate-fadeInUp animation-delay-300">
                        Conectamos tu negocio con más de 50 países en 5 continentes
                    </p>
                    <a href='#inicio'  className="bg-[#2e3e50] hover:bg-[#1a252f] text-white px-8 py-3 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounceIn animation-delay-500">
                      Consultanos
                    </a>
                </div>
            </section>

            {/* Banner Section (sin parallax) */}
            <section
                ref={parallaxRef}
                className={`relative py-20 lg:py-32 overflow-hidden transition-all duration-1000 ${parallaxVisible ? "animate-fadeIn" : "opacity-0"
                    }`}
            >
                {/* Background - sin efecto parallax */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi6l6edApZXXTPmeNpbLgzjWKr0dqu1eP3XqnaiQo4Vtj-NZqOpoZ4VINl642EofQS6QzF_YV1HUsTBVnbWgxxqlSo85sCJETq3eFECFX_sve1-5vxDzgN_v_03kck4_8_wjinHGInjag/s2980/AdobeStock_195584994.jpeg')",
                    }}
                >
                    <div className="absolute inset-0 bg-[#2e3e50]/90"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 xl:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 animate-slideInUp">
                            Líderes en <span className="text-[#e5b437]">Logística Global</span>
                        </h2>
                        <p className="text-xl text-gray-200 max-w-3xl mx-auto animate-slideInUp animation-delay-300">
                            Más de una década conectando empresas con el mundo a través de soluciones logísticas innovadoras
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
                        {[
                            {
                                number: 500,
                                suffix: "+",
                                label: "Clientes Satisfechos",
                                icon: Users,
                                description: "Empresas confían en nosotros",
                            },
                            {
                                number: 50,
                                suffix: "+",
                                label: "Países de Cobertura",
                                icon: Globe,
                                description: "Presencia internacional",
                            },
                            {
                                number: 99,
                                suffix: "%",
                                label: "Entregas a Tiempo",
                                icon: CheckCircle,
                                description: "Puntualidad garantizada",
                            },
                            {
                                number: 15,
                                suffix: "+",
                                label: "Años de Experiencia",
                                icon: Award,
                                description: "Trayectoria comprobada",
                            },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`text-center text-white animate-fadeInUp`}
                                style={{ animationDelay: `${index * 200 + 500}ms` }}
                            >
                                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#e5b437]/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-[#e5b437]/30">
                                    <stat.icon className="w-8 h-8 lg:w-10 lg:h-10 text-[#e5b437]" />
                                </div>
                                <div className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 text-[#e5b437]">
                                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                                </div>
                                <div className="text-lg lg:text-xl font-semibold mb-1">{stat.label}</div>
                                <div className="text-sm text-gray-300">{stat.description}</div>
                            </div>
                        ))}
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: TrendingUp,
                                title: "Crecimiento Sostenido",
                                description: "Expandimos nuestras operaciones año tras año, manteniendo la calidad en cada servicio.",
                            },
                            {
                                icon: Shield,
                                title: "Seguridad Garantizada",
                                description: "Protocolos de seguridad internacionales y seguros completos para cada envío.",
                            },
                            {
                                icon: Clock,
                                title: "Disponibilidad 24/7",
                                description: "Soporte técnico y seguimiento de envíos disponible las 24 horas del día.",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 lg:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-slideInUp`}
                                style={{ animationDelay: `${index * 200 + 800}ms` }}
                            >
                                <div className="w-12 h-12 bg-[#e5b437] rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-200 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section
                ref={statsRef}
                className={`py-12 lg:py-16 bg-[#e5b437] transition-all duration-1000 ${statsVisible ? "animate-fadeInUp" : "opacity-0 translate-y-10"
                    }`}
            >
                <div className="container mx-auto px-4 xl:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {[
                            { number: 500, suffix: "+", label: "Clientes Satisfechos", icon: Users },
                            { number: 50, suffix: "+", label: "Países de Cobertura", icon: Globe },
                            { number: 24, suffix: "/7", label: "Soporte Técnico", icon: Clock },
                            { number: 99, suffix: "%", label: "Entregas a Tiempo", icon: Star },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className={`text-center text-white animate-bounceIn`}
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                                    <stat.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                                </div>
                                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 lg:mb-2">
                                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                                </div>
                                <div className="text-sm lg:text-base font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section
                ref={aboutRef}
                id="nosotros"
                className={`py-12 lg:py-20 bg-[#2e3e50] text-white transition-all duration-1000 ${aboutVisible ? "animate-fadeInUp" : "opacity-0 translate-y-10"
                    }`}
            >
                <div className="container mx-auto px-4 xl:px-6">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1 animate-slideInLeft">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
                                Sobre <span className="text-[#e5b437]">AN MALIK CARGO</span>
                            </h2>
                            <p className="text-lg lg:text-xl text-gray-300 mb-6 lg:mb-8 leading-relaxed">
                                Con años de experiencia en el sector logístico, nos hemos consolidado como líderes en soluciones de
                                transporte y distribución. Nuestro compromiso es conectar tu negocio con el mundo de manera eficiente y
                                segura.
                            </p>

                            <div className="grid grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                                <div className="text-center animate-fadeInUp animation-delay-300">
                                    <div className="text-2xl lg:text-3xl font-bold text-[#e5b437] mb-1 lg:mb-2">
                                        <AnimatedCounter end={500} suffix="+" />
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-300">Clientes Satisfechos</div>
                                </div>
                                <div className="text-center animate-fadeInUp animation-delay-500">
                                    <div className="text-2xl lg:text-3xl font-bold text-[#e5b437] mb-1 lg:mb-2">
                                        <AnimatedCounter end={50} suffix="+" />
                                    </div>
                                    <div className="text-xs lg:text-sm text-gray-300">Países de Cobertura</div>
                                </div>
                                <div className="text-center animate-fadeInUp animation-delay-700">
                                    <div className="text-2xl lg:text-3xl font-bold text-[#e5b437] mb-1 lg:mb-2">24/7</div>
                                    <div className="text-xs lg:text-sm text-gray-300">Soporte Técnico</div>
                                </div>
                            </div>

                            <a href='#inicio' className="bg-[#e5b437] hover:bg-[#d4a332] text-white px-6 lg:px-8 py-2 lg:py-3 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg animate-bounceIn animation-delay-900">
                               Contactenos
                            </a>
                        </div>

                        <div className="relative order-1 lg:order-2 animate-slideInRight">
                            <img
                                src="/assets/img/anmalik/about-malik.jpg"
                                alt="About AN MALIK CARGO"
                                className="rounded-lg shadow-2xl w-full transform hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 w-16 h-16 lg:w-24 lg:h-24 bg-[#2b604b] rounded-lg flex items-center justify-center animate-pulse">
                                <Package className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           

            {/* Footer */}
            <footer id="contacto" className="bg-[#1a252f] text-white py-8 lg:pt-12 lg:pb-4 animate-fadeIn">
                <div className="container mx-auto px-4 xl:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="sm:col-span-2 lg:col-span-1 animate-slideInLeft">
                            <div className="flex items-center space-x-3 mb-4 lg:mb-6">
                              
                                   <img src='/logo.png' className='h-16 w-auto object-cover' />
                             
                            </div>
                            <p className="text-gray-400 leading-relaxed text-sm lg:text-base">
                                Conectamos tu negocio con el mundo a través de soluciones logísticas innovadoras y confiables.
                            </p>
                        </div>

                        <div className="animate-slideInUp animation-delay-200">
                            <h4 className="text-lg font-semibold mb-3 lg:mb-4 text-[#e5b437]">Servicios</h4>
                            <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
                               
                               {services?.map((service, index) => (
                                    <li key={service.id || index}>
                                        <a href="#servicios" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                                            {service.title || service.name}
                                        </a>
                                    </li>
                                ))}
                             
                            </ul>
                        </div>

                        <div className="animate-slideInUp animation-delay-400">
                            <h4 className="text-lg font-semibold mb-3 lg:mb-4 text-[#e5b437]">Empresa</h4>
                            <ul className="space-y-2 text-gray-400 text-sm lg:text-base">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                                        Sobre Nosotros
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                                        Nuestro Equipo
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                                        Certificaciones
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                                        Carreras
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="animate-slideInRight animation-delay-600">
                            <h4 className="text-lg font-semibold mb-3 lg:mb-4 text-[#e5b437]">Contacto</h4>
                            <div className="space-y-3 text-gray-400 text-sm lg:text-base">
                                <div className="flex items-center space-x-2 hover:text-white transition-colors">
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    <a href={`tel:${generals?.find(g => g.correlative === 'phone_contact')?.description?.replace(/\D/g, '') || '15551234567'}`} className="hover:text-white transition-colors">
                                        {generals?.find(g => g.correlative === 'phone_contact')?.description || '+1 (555) 123-4567'}
                                    </a>
                                </div>
                                <div className="flex items-center space-x-2 hover:text-white transition-colors">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    <a href={`mailto:${generals?.find(g => g.correlative === 'email_contact')?.description || 'info@anmalikcargo.com'}`} className="hover:text-white transition-colors">
                                        {generals?.find(g => g.correlative === 'email_contact')?.description || 'info@anmalikcargo.com'}
                                    </a>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{generals?.find(g => g.correlative === 'address')?.description || '123 Logistics Ave, City, Country'}</span>
                                </div>

                                {/* Redes Sociales */}
                                {socials?.filter(social => 
                                    social.visible && 
                                    social.status && 
                                    !social.description?.toLowerCase().includes('whatsapp') && 
                                    !social.name?.toLowerCase().includes('whatsapp')
                                ).length > 0 && (
                                    <div className="mt-4">
                                        <h5 className="text-[#e5b437] font-semibold mb-3">Síguenos</h5>
                                        <div className="flex space-x-3">
                                            {socials?.filter(social => 
                                                social.visible && 
                                                social.status && 
                                                !social.description?.toLowerCase().includes('whatsapp') && 
                                                !social.name?.toLowerCase().includes('whatsapp')
                                            ).map((social, index) => {
                                                const IconComponent = getSocialIcon(social.description || social.name);
                                                return (
                                                    <a
                                                        key={social.id || index}
                                                        href={social.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 !text-[#1a252f] bg-[#e5b437] hover:bg-[#d4a332] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                                                    >
                                                        <IconComponent />
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                       {/* WhatsApp Floating Button */}
            {(() => {
                const whatsappSocial = socials?.find(social =>
                    social.description.toLowerCase().includes('whatsapp') && social.visible && social.status
                );

                if (!whatsappSocial) return null;

                return (
                    <>
                        <a
                            href={whatsappSocial.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fixed bottom-8 right-8  fill-white  bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/25 hover:scale-110 transition-all duration-300 z-50 animate-bounce"
                            style={{ animationDuration: '2s' }}
                            title={whatsappSocial.description || whatsappSocial.name}
                        >
                            <svg width="36px" height="36px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp icon</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                        </a>
                    </>
                );
            })()}

                    <div className="border-t border-gray-700 mt-6 lg:mt-8 pt-6 lg:pt-4 text-center text-gray-400 text-sm lg:text-base animate-fadeIn animation-delay-800">
                        <p>&copy; {new Date().getFullYear()} AN MALIK CARGO. Todos los derechos reservados. Power By <a className='' href='https://www.mundoweb.pe/' target='_blank' >MundoWeb</a></p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Home {...properties} />
            </Base>
        </CarritoProvider>
    );
});
