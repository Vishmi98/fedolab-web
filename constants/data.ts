import { BiMobile } from "react-icons/bi";
import { FaBullhorn, FaCloud, FaCode, FaMicrochip } from "react-icons/fa";
import { TbSeo } from "react-icons/tb";

import { ServiceType } from "@/modules/home/home.types";
import { NewsDataType } from "@/modules/news/news.types";


export const MAX_SIZE_MB = 1.1 * 1024 * 1024;

export const JWT_SECRET = "eregr5trertw56rrgfhtyrt5tfasrgt235346346ffgsdfgdfsg4dfefsdrwef"

export const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blogs", href: "/blogs" },
    { label: "News", href: "/news" },
    { label: "Companies", href: "/companies" },
    { label: "Stocks", href: "/stocks" },
]

export const SERVICE_DATA: ServiceType[] = [
    {
        id: 1,
        icon: FaMicrochip,
        title: "AI Solutions",
        paragraph:
            "Unleash the power of artificial intelligence to transform your business operations and gain a competitive edge.",
    },
    {
        id: 2,
        icon: FaCloud,
        title: "Software Development",
        paragraph:
            "Get custom software solutions tailored to your unique business needs, ensuring efficiency and innovation.",
    },
    {
        id: 3,
        icon: FaCode,
        title: "AWS Cloud Solutions",
        paragraph:
            "Optimize your operations with tailored AWS solutions that boost scalability, security, and efficiency.",
    },
    {
        id: 4,
        icon: FaBullhorn,
        title: "Digital Marketing",
        paragraph:
            "Amplify your online presence with our comprehensive digital marketing strategies that drive growth and engagement.",
    },
    {
        id: 5,
        icon: BiMobile,
        title: "Mobile App Development",
        paragraph:
            "Experience the future of mobile with our user-centric app development for iOS and Android platforms.",
    },
    {
        id: 6,
        icon: TbSeo,
        title: "SEO Services",
        paragraph:
            "Boost your website's visibility and attract more organic traffic with our expert search engine optimization techniques.",
    },

];

export const CLIENTS = [
    { id: 1, src: "/1.svg", alt: "Client 1" },
    { id: 2, src: "/2.svg", alt: "Client 2" },
    { id: 3, src: "/3.svg", alt: "Client 3" },
    { id: 4, src: "/4.svg", alt: "Client 4" },
    { id: 5, src: "/5.svg", alt: "Client 5" },
    { id: 6, src: "/6.svg", alt: "Client 6" },
    { id: 7, src: "/7.svg", alt: "Client 7" },
    { id: 8, src: "/8.svg", alt: "Client 8" },
];

// data/team.ts
export const TEAM_MEMBERS = [
    {
        id: 1,
        name: "ALEX RIVERA",
        role: "Creative Director",
        description: "Pushing the boundaries of digital interaction through code and art.",
        texture: "/t4.jpg",
    },
    {
        id: 2,
        name: "SARAH CHENG",
        role: "Technical Architect",
        description: "Specializing in high-performance WebGL and real-time rendering.",
        texture: "/t5.jpg",
    }
];

export const EMAIL_CONFIG = {
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
        user: "vishmi@fedolab.com",
        pass: "Vishmi!@#"
    }
}

export const NEWS_DATA: NewsDataType[] = [
    {
        id: 1,
        image: "https://i.pinimg.com/1200x/21/2b/ab/212bab409bb729f573a985d48dedc3cc.jpg",
        title: "Fedolab Launches AI-Powered Business Automation Solutions",
        description:
            "Fedolab has introduced a new suite of AI-powered automation services designed to help businesses streamline operations, improve productivity, and reduce manual workloads through intelligent workflows.",
        date: "Jan 15, 2026",
        category: "Company News",
        slug: "fedolab-ai-business-automation",
    },
    {
        id: 2,
        image: "https://i.pinimg.com/736x/26/0f/7f/260f7fa9de8c17206d438afd16735c52.jpg",
        title: "New Mobile App Development Services Now Available",
        description:
            "Our development team now offers end-to-end mobile application development for iOS and Android using modern technologies, delivering scalable, secure, and high-performance solutions.",
        date: "Jan 10, 2026",
        category: "Services",
        slug: "mobile-app-development-services",
    },
    {
        id: 3,
        image: "https://i.pinimg.com/736x/94/6b/d1/946bd13534564146d577fe4bc923509f.jpg",
        title: "Fedolab Expands Cloud & AWS Consulting Team",
        description:
            "To meet growing client demand, Fedolab has expanded its AWS cloud engineering team, enabling faster cloud migrations, infrastructure optimization, and secure DevOps implementations.",
        date: "Jan 6, 2026",
        category: "AWS Cloud",
        slug: "aws-cloud-consulting-expansion",
    },
    {
        id: 4,
        image: "https://i.pinimg.com/736x/86/51/0d/86510d75a429c986ede4a46961e63933.jpg",
        title: "AI Chatbot Platform Successfully Delivered for Enterprise Client",
        description:
            "Fedolab recently completed an enterprise AI chatbot project capable of automating customer support, reducing response times, and providing multilingual assistance around the clock.",
        date: "Dec 30, 2025",
        category: "Projects",
        slug: "enterprise-ai-chatbot-platform",
    },
    {
        id: 5,
        image: "https://i.pinimg.com/736x/d5/44/3d/d5443d71e44c3ffbb73bd492d1b667bd.jpg",
        title: "New SEO & Digital Marketing Solutions Released",
        description:
            "Our digital marketing team has launched comprehensive SEO and performance marketing services focused on improving search rankings, generating qualified leads, and increasing online visibility.",
        date: "Dec 22, 2025",
        category: "Digital Marketing",
        slug: "seo-digital-marketing-solutions",
    },
    {
        id: 6,
        image: "https://i.pinimg.com/736x/52/5a/c5/525ac57fc91dbe431dd36a2c2a5cc930.jpg",
        title: "Fedolab Announces Next-Generation Web Development Framework",
        description:
            "Leveraging Next.js, React, and modern cloud infrastructure, our latest web development approach delivers faster loading speeds, better SEO, enhanced security, and exceptional user experiences.",
        date: "Dec 15, 2025",
        category: "Technology",
        slug: "next-generation-web-development",
    },
];