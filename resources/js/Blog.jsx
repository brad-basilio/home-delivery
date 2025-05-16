import React, { useState } from "react";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";

import Filter from "./Components/Blog/Filter";
import Results from "./Components/Blog/Results";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoProvider } from "./context/CarritoContext";
import MaintenancePage from "./Utils/MaintenancePage";
import BlogHeader from "./components/Blog/BlogHeader";
function Blog({ categories, postRecent, landing }) {
    const [filter, setFilter] = useState({
        category: null,
        search: null,
        sortOrder: "asc",
    });

    console.log(postRecent);

    return (
        <div>
            <Header />
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
            <Footer />
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
