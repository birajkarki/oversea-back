"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBannerById = exports.getServiceById = exports.deleteServiceById = exports.landingService = void 0;
const prisma_1 = require("../utils/prisma");
const email_1 = require("../utils/email");
const bcrypt_1 = require("../utils/bcrypt");
class LandingService {
    constructor() {
        this.getStat = async () => {
            return await prisma_1.prisma.stat.findFirst();
        };
        this.updateStat = async (data) => {
            const existing = await prisma_1.prisma.stat.findFirst();
            const sanitizedData = {
                years: data.years !== undefined && Number(data.years),
                placements: data.placements !== undefined ? Number(data.placements) : undefined,
                services: data.services !== undefined ? Number(data.services) : undefined,
                countriesServed: data.countriesServed !== undefined
                    ? Number(data.countriesServed)
                    : undefined,
                team: data.team !== undefined ? Number(data.team) : undefined,
                database: data.database !== undefined ? Number(data.database) : undefined,
            };
            if (!existing) {
                return await prisma_1.prisma.stat.create({ data: sanitizedData });
            }
            return await prisma_1.prisma.stat.update({
                where: { id: existing.id },
                data,
            });
        };
        this.getAllServices = async () => {
            const services = await prisma_1.prisma.service.findMany();
            return services.map(s => ({
                ...s,
                benefit: this.safeJsonParse(s.benefit),
                specialization: this.safeJsonParse(s.specialization),
            }));
        };
        this.createService = async (data) => {
            return await prisma_1.prisma.service.create({
                data,
            });
        };
        this.deleteService = async (id) => {
            return await prisma_1.prisma.service.delete({ where: { id } });
        };
        this.getAllPartners = async () => {
            return await prisma_1.prisma.partner.findMany();
        };
        this.createPartner = async (data) => {
            return await prisma_1.prisma.partner.create({ data });
        };
        this.deletePartner = async (id) => {
            return await prisma_1.prisma.partner.delete({ where: { id } });
        };
        this.getAllTeam = async () => {
            return await prisma_1.prisma.team.findMany();
        };
        this.createTeamMember = async (data) => {
            const team = await prisma_1.prisma.team.create({ data });
            console.log(team);
            return team;
        };
        this.updateTeamMember = async (id, data) => {
            return await prisma_1.prisma.team.update({
                where: { id },
                data,
            });
        };
        this.deleteTeamMember = async (id) => {
            return await prisma_1.prisma.team.delete({ where: { id } });
        };
    }
    async createCarousel(image) {
        const carousel = await prisma_1.prisma.carousel.create({
            data: { image },
        });
        return carousel;
    }
    async getCarousel() {
        const carousel = await prisma_1.prisma.carousel.findMany();
        return carousel;
    }
    safeJsonParse(value) {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch {
                return value;
            }
        }
        return value;
    }
    async getOverviewStats() {
        const [carousels, services, partners, team, testimonials, blogs] = await Promise.all([
            prisma_1.prisma.carousel.count(),
            prisma_1.prisma.service.count(),
            prisma_1.prisma.partner.count(),
            prisma_1.prisma.team.count(),
            prisma_1.prisma.testimonial.count(),
            prisma_1.prisma.blog.count(),
        ]);
        return {
            carousels,
            services,
            partners,
            team,
            testimonials,
            blogs,
        };
    }
    async getTestimonials() {
        return await prisma_1.prisma.testimonial.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async createTestimonial(data) {
        return await prisma_1.prisma.testimonial.create({ data });
    }
    async updateTestimonial(id, data) {
        return await prisma_1.prisma.testimonial.update({
            where: { id },
            data,
        });
    }
    async deleteTestimonial(id) {
        return await prisma_1.prisma.testimonial.delete({
            where: { id },
        });
    }
    async getBlogs() {
        return await prisma_1.prisma.blog.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async getBlogById(id) {
        return await prisma_1.prisma.blog.findUnique({
            where: { id },
        });
    }
    async createBlog(data) {
        return await prisma_1.prisma.blog.create({ data });
    }
    async updateBlog(id, data) {
        return await prisma_1.prisma.blog.update({
            where: { id },
            data,
        });
    }
    async deleteBlog(id) {
        return await prisma_1.prisma.blog.delete({
            where: { id },
        });
    }
    async getCareers() {
        return await prisma_1.prisma.career.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async createCareer(data) {
        return await prisma_1.prisma.career.create({ data });
    }
    async getFeedbacks() {
        return await prisma_1.prisma.feedback.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async createFeedback(data) {
        return (0, email_1.sendEmail)(data.email, "Feedback", data.message);
    }
    async login(data) {
        const user = await prisma_1.prisma.user.findFirst({ where: { email: data.email } });
        if (!user) {
            throw new Error("User not found");
        }
        const token = (0, bcrypt_1.generateToken)(user.id);
        const tokenizedUser = await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: {
                token,
            },
            omit: {
                token: false,
            },
        });
        return tokenizedUser;
    }
    async register(data) {
        return await prisma_1.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                role: "ADMIN",
                name: data.name,
            },
        });
    }
    async getEmployers() {
        return await prisma_1.prisma.employer.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
    async createEmployer(data) {
        return await prisma_1.prisma.employer.create({ data });
    }
}
exports.landingService = new LandingService();
const deleteServiceById = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    try {
        const service = await prisma_1.prisma.service.findUnique({ where: { id } });
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        await prisma_1.prisma.service.delete({ where: { id } });
        return res.status(200).json({
            success: true,
            message: `Service with id ${id} deleted successfully.`,
        });
    }
    catch (error) {
        console.error("Error deleting service:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete service.",
            error: error.message,
        });
    }
};
exports.deleteServiceById = deleteServiceById;
function safeJsonParse(value) {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }
    return value;
}
const getServiceById = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    try {
        const service = await prisma_1.prisma.service.findUnique({ where: { id } });
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }
        const transformedService = {
            ...service,
            benefit: safeJsonParse(service.benefit),
            specialization: safeJsonParse(service.specialization),
        };
        return res.status(200).json({
            success: true,
            message: `Service with id ${id} retrieved successfully.`,
            data: transformedService,
        });
    }
    catch (error) {
        console.error("Error retrieving service:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve service.",
            error: error.message,
        });
    }
};
exports.getServiceById = getServiceById;
const deleteBannerById = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: "Invalid ID" });
    }
    try {
        const service = await prisma_1.prisma.carousel.findUnique({ where: { id } });
        if (!service) {
            return res.status(404).json({ success: false, message: "Banner not found" });
        }
        await prisma_1.prisma.carousel.delete({ where: { id } });
        return res.status(200).json({
            success: true,
            message: `banner with id ${id} deleted successfully.`,
        });
    }
    catch (error) {
        console.error("Error deleting banner:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete banner.",
            error: error.message,
        });
    }
};
exports.deleteBannerById = deleteBannerById;
//# sourceMappingURL=landing.service.js.map