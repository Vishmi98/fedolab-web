'use client';

import { useState } from "react";

import InquiriesTable from "./InquiriesTable";


const Inquiries = () => {
    const [reloadTable, setReloadTable] = useState(false);

    return (
        <>
            <div className="overflow-y-auto w-full h-full scrollbar-hide">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-lg">Inquiries</h2>
                </div>
                <InquiriesTable reload={reloadTable} />
            </div>
        </>
    );
};

export default Inquiries;
