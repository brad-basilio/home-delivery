import React from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../Utils/TextWithHighlight";
import { useTranslation } from "../../hooks/useTranslation";

const Filter = ({ categories, filter, setFilter, landing }) => {
    const landingFooter = landing.find(
        (item) => item.correlative === "page_blog_footer"
    );

    const { t } = useTranslation();
    
    return (
        <section className="py-12 md:py-16 bg-white relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-hd-cerise rounded-full blur-3xl" />
            </div>

            <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
                {/* Header con título y búsqueda */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-12">
                    {/* Título */}
                    <div className="lg:col-span-2 text-center lg:text-left">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            {landingFooter?.title ? (
                                <TextWithHighlight text={landingFooter.title} />
                            ) : (
                                <>
                                    Todos los{' '}
                                    <span 
                                        className="bg-clip-text text-transparent"
                                        style={{
                                            backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                                        }}
                                    >
                                        Artículos
                                    </span>
                                </>
                            )}
                        </h2>
                        {landingFooter?.description && (
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {landingFooter.description}
                            </p>
                        )}
                    </div>

                    {/* Campo de búsqueda */}
                    <div className="lg:col-span-1">
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <svg className="w-5 h-5 text-hd-cerulean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                id="txt-search"
                                type="text"
                                placeholder={t("public.post.search", "Buscar publicación")}
                                className="w-full pl-12 pr-4 py-4 rounded-full bg-white border-2 border-gray-200 focus:border-hd-android focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                                onChange={(e) =>
                                    setFilter((old) => ({
                                        ...old,
                                        search: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Botones de categorías */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    {categories.map((item, index) => (
                        <button
                            key={index}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                                item.id == filter.category
                                    ? "bg-gradient-to-r from-hd-android to-hd-android/90 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                            }`}
                            onClick={() =>
                                setFilter((old) => ({
                                    ...old,
                                    category:
                                        item.id == filter.category
                                            ? null
                                            : item.id,
                                }))
                            }
                            style={{
                                animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`
                            }}
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Animación CSS */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </section>
    );
};

export default Filter;
