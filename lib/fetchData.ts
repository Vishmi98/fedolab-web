import { getBlogByUrl } from "@/modules/blogs/blogs.service";
import { BlogDataType } from "@/modules/blogs/blogs.types";
import { getProjectByUrl } from "@/modules/projects/projects.service";
import { ProjectDataType } from "@/modules/projects/projects.types";


export async function fetchBlog(url: string): Promise<BlogDataType | null> {
    try {
        const res = await getBlogByUrl({ url });
        if (!res.success || !res.blog) {
            return null;
        }
        return res.blog;
    } catch (error) {
        console.error("Error fetching blog data:", error);
        return null;
    }
}

export async function fetchProject(slug: string): Promise<ProjectDataType | null> {
    try {
        const res = await getProjectByUrl({ slug });
        if (!res.success || !res.project) {
            return null;
        }
        return res.project;
    } catch (error) {
        console.error("Error fetching project data:", error);
        return null;
    }
}