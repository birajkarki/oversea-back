import { Request, Response } from "express";
declare class LandingService {
    constructor();
    createCarousel(image: string): Promise<{
        id: number;
        image: string;
    }>;
    getCarousel(): Promise<{
        id: number;
        image: string;
    }[]>;
    getStat: () => Promise<{
        id: number;
        years: number;
        services: number;
        team: number;
        createdAt: Date;
        placements: number;
        countriesServed: number;
        database: number;
        updatedAt: Date;
    } | null>;
    updateStat: (data: Partial<{
        years: number;
        placements: number;
        services: number;
        countriesServed: number;
        team: number;
        database: number;
    }>) => Promise<{
        id: number;
        years: number;
        services: number;
        team: number;
        createdAt: Date;
        placements: number;
        countriesServed: number;
        database: number;
        updatedAt: Date;
    }>;
    safeJsonParse(value: any): any;
    getAllServices: () => Promise<{
        benefit: any;
        specialization: any;
        id: number;
        image: string | null;
        serviceType: string;
        heading: string | null;
        subheading: string | null;
        image2: string | null;
        feature: string[];
    }[]>;
    createService: (data: {
        image: string;
        image2: string;
        serviceType: string;
        heading: string;
        subheading: string;
        feature: string[];
        benefit: Array<{
            title: string;
            subtitle: string;
        }>;
        specialization: any;
    }) => Promise<{
        id: number;
        image: string | null;
        serviceType: string;
        heading: string | null;
        subheading: string | null;
        image2: string | null;
        feature: string[];
        benefit: import("@prisma/client/runtime/library").JsonValue | null;
        specialization: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    deleteService: (id: number) => Promise<{
        id: number;
        image: string | null;
        serviceType: string;
        heading: string | null;
        subheading: string | null;
        image2: string | null;
        feature: string[];
        benefit: import("@prisma/client/runtime/library").JsonValue | null;
        specialization: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    getAllPartners: () => Promise<{
        id: number;
        image: string;
    }[]>;
    createPartner: (data: {
        image: string;
    }) => Promise<{
        id: number;
        image: string;
    }>;
    deletePartner: (id: number) => Promise<{
        id: number;
        image: string;
    }>;
    getAllTeam: () => Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        title: string;
        createdAt: Date;
        link: string;
        address: string;
        order: number;
        linkedin: string;
        profileImg: string;
    }[]>;
    createTeamMember: (data: {
        name: string;
        address: string;
        role: string;
        title: string;
        linkedin: string;
        email: string;
        link: string;
        profileImg: string;
    }) => Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        title: string;
        createdAt: Date;
        link: string;
        address: string;
        order: number;
        linkedin: string;
        profileImg: string;
    }>;
    updateTeamMember: (id: number, data: Partial<{
        name: string;
        address: string;
        role: string;
        title: string;
        linkedin: string;
        email: string;
        link: string;
        profileImg: string;
    }>) => Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        title: string;
        createdAt: Date;
        link: string;
        address: string;
        order: number;
        linkedin: string;
        profileImg: string;
    }>;
    deleteTeamMember: (id: number) => Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        title: string;
        createdAt: Date;
        link: string;
        address: string;
        order: number;
        linkedin: string;
        profileImg: string;
    }>;
    getOverviewStats(): Promise<{
        carousels: number;
        services: number;
        partners: number;
        team: number;
        testimonials: number;
        blogs: number;
    }>;
    getTestimonials(): Promise<{
        id: number;
        logo: string;
        title: string;
        subtitle: string;
        content: string;
        createdAt: Date;
    }[]>;
    createTestimonial(data: {
        logo: string;
        title: string;
        subtitle: string;
        content: string;
    }): Promise<{
        id: number;
        logo: string;
        title: string;
        subtitle: string;
        content: string;
        createdAt: Date;
    }>;
    updateTestimonial(id: number, data: Partial<{
        logo: string;
        title: string;
        subtitle: string;
        content: string;
    }>): Promise<{
        id: number;
        logo: string;
        title: string;
        subtitle: string;
        content: string;
        createdAt: Date;
    }>;
    deleteTestimonial(id: number): Promise<{
        id: number;
        logo: string;
        title: string;
        subtitle: string;
        content: string;
        createdAt: Date;
    }>;
    getBlogs(): Promise<{
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        thumbnailImg: string;
    }[]>;
    getBlogById(id: number): Promise<{
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        thumbnailImg: string;
    } | null>;
    createBlog(data: {
        thumbnailImg: string;
        title: string;
        content: string;
    }): Promise<{
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        thumbnailImg: string;
    }>;
    updateBlog(id: number, data: Partial<{
        thumbnailImg: string;
        title: string;
        content: string;
    }>): Promise<{
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        thumbnailImg: string;
    }>;
    deleteBlog(id: number): Promise<{
        id: number;
        title: string;
        content: string;
        createdAt: Date;
        thumbnailImg: string;
    }>;
    getCareers(): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        phoneNumber: string;
        resume: string;
    }[]>;
    createCareer(data: {
        name: string;
        email: string;
        phoneNumber: string;
        resume: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        createdAt: Date;
        phoneNumber: string;
        resume: string;
    }>;
    getFeedbacks(): Promise<{
        id: number;
        email: string;
        createdAt: Date;
        fullName: string;
        phone: string;
        message: string;
    }[]>;
    createFeedback(data: {
        fullName: string;
        phone: string;
        email: string;
        message: string;
    }): Promise<void>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
        token: string;
    }>;
    register(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        role: string;
    }>;
}
export declare const landingService: LandingService;
export declare const deleteServiceById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getServiceById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteBannerById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=landing.service.d.ts.map