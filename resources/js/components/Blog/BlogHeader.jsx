import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import bgHeader from "./images/header.png";
import Swal from "sweetalert2";
import SubscriptionsRest from "../../Actions/SubscriptionsRest";
import Global from "../../Utils/Global";
import HtmlContent from "../../Utils/HtmlContent";
import TextWithHighlight from "../../Utils/TextWithHighlight";


const subscriptionsRest = new SubscriptionsRest();

const BlogHeader = ({ categories, postRecent, landing }) => {
    const emailRef = useRef();
    const [saving, setSaving] = useState(false);

    const onEmailSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const request = {
            email: emailRef.current.value,
        };
        const result = await subscriptionsRest.save(request);
        setSaving(false);

        if (!result) return;

        Swal.fire({
            title: "¡Éxito!",
            text: `Te has suscrito correctamente al blog de ${Global.APP_NAME}.`,
            icon: "success",
            confirmButtonText: "Ok",
        });

        emailRef.current.value = null;
    };

    const landingHero = landing?.find(
        (item) => item.correlative === "page_blog_hero"
    );

    // Check if postRecent exists and has items
    if (!postRecent || postRecent.length === 0) {
        return <div>No posts available</div>;
    }

    // Animations
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
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const imageHoverVariants = {
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    const cardHoverVariants = {
        hover: {
            y: -5,
            transition: {
                type: "spring",
                stiffness: 400,
            },
        },
    };

    // Render main post
    const renderMainPost = () => (
        <motion.div
            className="md:col-span-6"
            variants={itemVariants}
            whileHover="hover"
        >
            <motion.a
                href={`/blog/${postRecent[0].slug}`}
                className="overflow-hidden rounded-3xl"
                variants={cardHoverVariants}
            >
                <motion.div
                    className="relative h-64 md:h-80 rounded-3xl overflow-hidden"
                    whileHover="hover"
                >
                    <motion.img
                        src={postRecent[0].image ? `/api/posts/media/${postRecent[0].image}` : "/api/cover/thumbnail/null"}
                        alt={postRecent[0].name}
                        className="w-full h-full object-cover"
                        variants={imageHoverVariants}
                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                    />
                </motion.div>
                <motion.div
                    className="p-4 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.div
                        className="text-sm text-hd-cerulean font-bold mb-1 uppercase tracking-wide"
                        whileHover={{ x: 3 }}
                    >
                        {postRecent[0].category?.name}
                    </motion.div>
                    <motion.h2
                        className="text-xl font-bold mb-2 text-gray-900 hover:text-hd-android transition-colors duration-300"
                    >
                        <TextWithHighlight text={postRecent[0].name} />
                    </motion.h2>
                    <motion.p
                        className="text-gray-600 mb-3 line-clamp-2"
                    >
                        <HtmlContent html={postRecent[0].description} />
                    </motion.p>
                    <div className="flex items-center text-sm text-hd-cerise font-medium">
                        <span>{moment(postRecent[0].post_date).format("ll")}</span>
                    </div>
                </motion.div>
            </motion.a>
        </motion.div>
    );

    // Render secondary posts
    const renderSecondaryPost = (post, index) => {
        if (!post) return null;
        
        return (
            <motion.div
                key={post.id}
                className="rounded-lg overflow-hidden"
                variants={itemVariants}
                whileHover="hover"
            >
                <motion.a
                    href={`/blog/${post.slug}`}
                    className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden"
                    variants={cardHoverVariants}
                >
                    <motion.div
                        className="md:w-2/5 h-48 md:h-64 rounded-3xl overflow-hidden"
                        whileHover="hover"
                    >
                        <motion.img
                            src={post.image ? `/api/posts/media/${post.image}` : "/api/cover/thumbnail/null"}
                            alt={post.name}
                            className="w-full h-full object-cover"
                            variants={imageHoverVariants}
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        />
                    </motion.div>
                    <motion.div
                        className="md:w-3/5 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                    >
                        <motion.div
                            className="text-sm text-hd-cerulean font-bold mb-1 uppercase tracking-wide"
                            whileHover={{ x: 3 }}
                        >
                            {post.category?.name}
                        </motion.div>
                        <motion.h2
                            className="text-lg font-bold mb-2 text-gray-900 hover:text-hd-android transition-colors duration-300"
                        >
                            <TextWithHighlight text={post.name} />
                        </motion.h2>
                        <motion.p
                            className="text-gray-600 mb-3 text-sm line-clamp-2"
                        >
                            <HtmlContent html={post.description} />
                        </motion.p>
                        <div className="flex items-center text-sm text-hd-cerise font-medium">
                            <span> {moment(post.post_date).format("ll")}</span>
                        </div>
                    </motion.div>
                </motion.a>
            </motion.div>
        );
    };

    return (
        <div className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Decoración de fondo */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-hd-cerulean rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-hd-android rounded-full blur-3xl" />
            </div>

            <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div 
                        className="inline-block px-6 py-2 rounded-full mb-6"
                        style={{
                            background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
                        }}
                    >
                        <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">Blog</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                       
                            <>
                                Descubre lo mejor
Publicaciones sobre el {" "}
                                <span 
                                    className="bg-clip-text text-transparent"
                                    style={{
                                        backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                                    }}
                                >
                                    mundo de la logistica
                                </span>
                            </>
                        
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {landingHero?.description || 'Mantente informado sobre las últimas tendencias en logística'}
                    </p>
                </div>

                {/* Featured Posts Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Main Post */}
                    <div className="md:col-span-6">
                        <a
                            href={`/blog/${postRecent[0].slug}`}
                            className="block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full"
                        >
                            {/* Imagen principal */}
                            <div className="relative h-80 md:h-64 overflow-hidden">
                                <img
                                    src={postRecent[0].image ? `/api/posts/media/${postRecent[0].image}` : "/api/cover/thumbnail/null"}
                                    alt={postRecent[0].name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3 text-sm">
                                   
                                    <span className="text-hd-cerise font-medium">
                                        {moment(postRecent[0].post_date).format("ll")}
                                    </span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-hd-android transition-colors duration-300">
                                    <TextWithHighlight text={postRecent[0].name} />
                                </h2>

                                <div className="text-gray-600 line-clamp-3 leading-relaxed">
                                    <HtmlContent html={postRecent[0].description} />
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Secondary Posts */}
                    <div className="md:col-span-6 space-y-6">
                        {postRecent.slice(1, 3).map((post, index) => {
                            if (!post) return null;
                            
                            return (
                                <a
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="flex bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                                >
                                    {/* Imagen secundaria */}
                                    <div className="w-2/5 relative overflow-hidden">
                                        <img
                                            src={post.image ? `/api/posts/media/${post.image}` : "/api/cover/thumbnail/null"}
                                            alt={post.name}
                                            className="w-full h-full object-cover aspect-square transform group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Contenido secundario */}
                                    <div className="w-3/5 p-4">
                                        <div className="text-xs text-hd-cerulean font-bold mb-2 uppercase tracking-wide">
                                            {post.category?.name}
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-hd-android transition-colors duration-300">
                                            <TextWithHighlight text={post.name} />
                                        </h3>

                                        <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            <HtmlContent html={post.description} />
                                        </div>

                                        <span className="text-xs text-hd-cerise font-medium">
                                            {moment(post.post_date).format("ll")}
                                        </span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogHeader;
