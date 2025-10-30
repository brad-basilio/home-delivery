import React from "react";
import TextWithHighlight from "../../Utils/TextWithHighlight";

const PostCard = ({
    id,
    slug,
    name,
    summary,
    category,
    image,
    post_date,
    firstImage = false,
    index = 0
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return (
        <article
            className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
            }}
        >
            {/* Imagen */}
            <div className="relative h-56 overflow-hidden">
                {image ? (
                    <img
                        src={`/api/posts/media/${image}`}
                        alt={name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="20"%3EHome Delivery%3C/text%3E%3C/svg%3E';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-hd-android/20 to-hd-cerise/20 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
                
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Contenido */}
            <div className="p-6">
                {/* Categoría y Fecha */}
                <div className="flex items-center gap-3 mb-4 text-sm">
                    
                    <span className="text-gray-500">
                        {formatDate(post_date)}
                    </span>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-hd-cerise transition-colors">
                    <TextWithHighlight text={name} />
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {summary || "Sin descripción"}
                </p>

                {/* Link */}
                <a
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-2 text-hd-cerise font-semibold hover:gap-4 transition-all duration-300"
                >
                    Leer más
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>

            {/* Animación CSS */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </article>
    );
};

export default PostCard;