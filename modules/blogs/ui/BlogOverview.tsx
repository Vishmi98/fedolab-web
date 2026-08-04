import Image from "next/image";

import { BlogDataType } from "../blogs.types";


interface Props {
    blog: BlogDataType;
}

const BlogOverview = ({ blog }: Props) => {
    return (
        <div className="overflow-hidden bg-gray-100">
            <section className="w-[90%] md:w-[70%] mx-auto py-20 md:py-30">

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-bold">
                    {blog.title}
                </h1>

                {/* Meta */}
                <p className="mt-3 text-gray-500 border-b border-gray-300 pb-3">
                    {blog.date} • {blog.author}
                </p>

                {/* Image */}
                <div className="relative w-full h-[300px] md:h-[700px] my-10 overflow-hidden">
                    <Image
                        src={blog.coverImagePath}
                        alt={blog.title}
                        fill
                        className="object-cover object-top"
                    />
                </div>

                <div className="space-y-5">
                    <p>{blog?.paragraph1}</p>
                    <p>{blog?.paragraph2}</p>
                    <p>{blog?.paragraph3}</p>
                </div>
            </section>
        </div>
    );
};

export default BlogOverview;