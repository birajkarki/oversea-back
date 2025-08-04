import { Request, Response } from "express";
declare class LandingController {
    constructor();
    createCarousel(req: Request & any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCarousel(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getStat: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    patchStat: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getServices: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createService: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteService: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getPartners: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    patchPartner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deletePartner: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTeam: (_req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    postTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    patchTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteTeam: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getOverview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTestimonials(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createTestimonial(req: Request & any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateTestimonial(req: Request & any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteTestimonial(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBlogs(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBlogById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createBlog(req: Request & any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateBlog(req: Request & any, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteBlog(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCareers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createCareer(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getFeedbacks(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createFeedback(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    reorder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const landingController: LandingController;
export {};
//# sourceMappingURL=landing.controller.d.ts.map