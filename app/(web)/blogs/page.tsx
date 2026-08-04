import Blogs from "@/modules/blogs/ui/Blogs"
import Header from "@/modules/blogs/ui/Header"

const BlogsPage = () => {
    return (
        <div className="overflow-hidden bg-gray-100">
            <Header />
            <Blogs />
        </div>
    )
}

export default BlogsPage