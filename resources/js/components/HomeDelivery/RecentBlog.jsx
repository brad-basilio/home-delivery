import React from 'react';

/**
 * RecentBlog - Sección de Posts Recientes del Blog
 * Muestra los 3 posts más recientes con imágenes
 * Responsive: 2xl:max-w-7xl 2xl:px-0, menor a 2xl usa px-[5%]
 */
const RecentBlog = ({ posts = [] }) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-hd-cerulean rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-hd-android rounded-full blur-3xl" />
      </div>

      <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-block px-6 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
            }}
          >
            <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">Blog</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Últimas{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
              }}
            >
              Noticias
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mantente informado sobre las últimas tendencias en logística
          </p>
        </div>

        {/* Grid de Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`
              }}
            >
              {/* Imagen */}
              <div className="relative h-56 overflow-hidden">
                {post.image ? (
                  <img
                    src={`/api/posts/media/${post.image}`}
                    alt={post.name}
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
                  {post.category && (
                    <span className="px-3 py-1 bg-hd-cerise/10 text-hd-cerise rounded-full font-semibold">
                      {post.category.name}
                    </span>
                  )}
                  <span className="text-gray-500">
                    {formatDate(post.created_at)}
                  </span>
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-hd-cerise transition-colors">
                  {post.name}
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.summary || post.description}
                </p>

                {/* Link */}
                <a
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-hd-cerise font-semibold hover:gap-4 transition-all duration-300"
                >
                  Leer más
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Botón Ver Todo el Blog */}
        <div className="text-center">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-hd-cerulean to-hd-cerise hover:from-hd-cerise hover:to-hd-android text-white rounded-full font-semibold transition-all duration-500 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ver todos los artículos
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
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
    </section>
  );
};

export default RecentBlog;
