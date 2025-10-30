import React, { useEffect, useState } from "react";
import FilterPagination from "../../Reutilizables/Pagination/FilterPagination";
import PostCard from "./PostCard";
import PostsRest from "../../Actions/PostsRest";
import ArrayJoin from "../../Utils/ArrayJoin";

const postsRest = new PostsRest();

const Results = ({ filter }) => {
    const [results, setResults] = useState([]);
    const [pages, setPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const filter2search = [
            ["name", "contains", filter.search],
            ["summary", "contains", filter.search],
        ];
        if (filter.category) {
            filter2search.push(["category.id", "=", filter.category]);
        }

        postsRest
            .paginate({
                filter: ArrayJoin(filter2search, "and"),
                requireTotalCount: true,
                skip: 6 * (currentPage - 1),
                sort: [
                    { selector: "post_date", desc: filter.sortOrder == "desc" },
                ],
                take: 6,
            })
            .then(({ status, data, totalCount }) => {
                if (status != 200) return;
                setPages(Math.ceil(totalCount / 12));
                setResults(data);
            });
    }, [filter, currentPage]);

    return (
        <>
            <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {results.map((item, index) => {
                            return <PostCard key={index} {...item} index={index} />;
                        })}
                    </div>
                </div>
            </section>
            <div className="pb-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                    <FilterPagination
                        pages={pages}
                        current={currentPage}
                        setCurrent={setCurrentPage}
                    />
                </div>
            </div>
        </>
    );
};

export default Results;
