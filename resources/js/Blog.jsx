import React, { useState } from "react";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";

import Filter from "./Components/Blog/Filter";
import Results from "./Components/Blog/Results";
import Header from "./components/HomeDelivery/Header";
import Footer from "./components/HomeDelivery/Footer";
import WhatsAppButton from "./components/HomeDelivery/WhatsAppButton";
import { CarritoProvider } from "./context/CarritoContext";
import MaintenancePage from "./Utils/MaintenancePage";
import BlogHeader from "./components/Blog/BlogHeader";
import '../css/homedelivery.css';
function Blog({ categories, postRecent, landing, generals = [], socials = [] }) {
    const [filter, setFilter] = useState({
        category: null,
        search: null,
        sortOrder: "asc",
    });

    console.log(postRecent);

    return (
        <div className="min-h-screen bg-white font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
            <Header />
            <main className="pt-20 md:pt-24">
                {postRecent && postRecent.length > 0 ? (
                    <>
                        <BlogHeader postRecent={postRecent} landing={landing} />
                        <Filter
                            categories={categories}
                            filter={filter}
                            setFilter={setFilter}
                            landing={landing}
                        />
                        <Results filter={filter} />
                    </>
                ) : (
                    <MaintenancePage />
                )}
            </main>
            <Footer generals={generals} socials={socials} />
            <WhatsAppButton socials={socials} generals={generals} />
        </div>
    );
}

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <Blog {...properties} />
            </Base>
        </CarritoProvider>
    );
});
