'use client';

import { useState } from "react";
import { BiPlus } from "react-icons/bi";

import AddBlogModal from "./AddBlogModal";
import BlogsTable from "./BlogsTable";


const Blogs = () => {
    const [open, setOpen] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleReload = () => setReloadTable((prev) => !prev);

    return (
        <>
            <div className="overflow-y-auto w-full h-full scrollbar-hide">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-semibold text-lg">Blogs</h2>
                    <div className="flex justify-end">
                        <button
                            onClick={handleClickOpen}
                            className="flex items-center gap-2 bg-black hover:bg-black/80 cursor-pointer text-white text-sm px-3 py-1 rounded-md shadow"
                        >
                            <BiPlus className="w-5 h-5" />
                            Add Blog
                        </button>
                        <AddBlogModal
                            isOpen={open}
                            onClose={handleClose}
                            handleReload={handleReload}
                        />
                    </div>
                </div>
                <BlogsTable reload={reloadTable} />
            </div>
        </>
    );
};

export default Blogs;
