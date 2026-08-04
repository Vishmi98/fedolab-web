'use client';

import { useState } from "react";

import NewsTable from "./NewsTable";


const News = () => {
    const [reloadTable, setReloadTable] = useState(false);

    return (
        <>
            <div className="overflow-y-auto w-full h-full scrollbar-hide">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-lg">News</h2>
                </div>
                <NewsTable reload={reloadTable} />
            </div>
        </>
    );
};

export default News;
