import { notFound } from "next/navigation";

import { fetchProject } from "@/lib/fetchData";
import ProjectOverview from "@/modules/projects/ui/ProjectOverview";


export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (!slug) {
        console.log("Project is missing from slug params");
        return notFound();
    }

    const projectData = await fetchProject(slug);

    if (!projectData) {
        return notFound();
    }

    return (
        <main>
            <ProjectOverview project={projectData} />
        </main>
    );
};

