"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.landingController = void 0;
const landing_service_1 = require("../service/landing.service");
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
class LandingController {
    constructor() {
        this.getStat = async (req, res) => {
            try {
                const stat = await landing_service_1.landingService.getStat();
                return res.json(stat);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to fetch stat." });
            }
        };
        this.patchStat = async (req, res) => {
            try {
                const updated = await landing_service_1.landingService.updateStat(req.body);
                return res.json(updated);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to update stat." });
            }
        };
        this.getServices = async (req, res) => {
            try {
                const services = await landing_service_1.landingService.getAllServices();
                return res.json(services);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to fetch services." });
            }
        };
        this.createService = async (req, res) => {
            try {
                const { serviceType, heading, subheading, feature, benefit, specialization, } = req.body;
                console.log(feature, benefit, specialization);
                const files = req.files;
                const uploadToCloudinary = async (file) => {
                    const uploaded = await cloudinaryConfig_1.default.uploader.upload(file.path, {
                        folder: "carousel",
                    });
                    return uploaded.secure_url;
                };
                const image = files.image?.[0]
                    ? await uploadToCloudinary(files.image[0])
                    : null;
                const image2 = files.image2?.[0]
                    ? await uploadToCloudinary(files.image2[0])
                    : null;
                if (!image || !image2 || !serviceType || !heading || !subheading) {
                    return res.status(400).json({ error: "Missing required fields" });
                }
                const miniImageUrls = [];
                if (Array.isArray(files.miniImage)) {
                    for (const file of files.miniImage) {
                        try {
                            const url = await uploadToCloudinary(file);
                            miniImageUrls.push(url);
                        }
                        catch (err) {
                            console.error("Error uploading miniImage:", err);
                            return res
                                .status(500)
                                .json({ message: "Mini image upload failed" });
                        }
                    }
                }
                const safeParse = (data, fallback = []) => {
                    try {
                        if (typeof data === "string")
                            return JSON.parse(data.trim());
                        if (Array.isArray(data))
                            return JSON.parse(data[0]);
                        return fallback;
                    }
                    catch (err) {
                        return fallback;
                    }
                };
                console.log(feature);
                console.log(benefit, "e");
                const parsedFeature = JSON.parse(feature);
                console.log(parsedFeature);
                const parsedBenefit = safeParse(benefit);
                console.log(parsedBenefit);
                let parsedSpecialization = safeParse(specialization);
                if (!Array.isArray(parsedFeature) ||
                    !Array.isArray(parsedBenefit) ||
                    !Array.isArray(parsedSpecialization)) {
                    return res
                        .status(400)
                        .json({
                        error: "feature, benefit, and specialization must be arrays",
                    });
                }
                parsedSpecialization = parsedSpecialization.map((item, index) => ({
                    ...item,
                    miniImage: miniImageUrls[index] || null,
                }));
                parsedSpecialization = JSON.stringify(parsedSpecialization);
                console.log(parsedSpecialization);
                const created = await landing_service_1.landingService.createService({
                    serviceType,
                    heading,
                    subheading,
                    image,
                    image2,
                    feature: parsedFeature,
                    benefit: benefit,
                    specialization: parsedSpecialization,
                });
                return res.status(201).json({
                    success: true,
                    message: "Service created successfully",
                    data: created,
                });
            }
            catch (error) {
                console.error("Error creating service:", error);
                return res.status(500).json({
                    success: false,
                    error: "Failed to create service.",
                    message: error.message,
                });
            }
        };
        this.deleteService = async (req, res) => {
            try {
                const idParam = req.params.id;
                if (!idParam) {
                    return res.status(400).json({ error: "ID parameter is required" });
                }
                const id = parseInt(idParam, 10);
                if (isNaN(id)) {
                    return res.status(400).json({ error: "ID parameter must be a number" });
                }
                if (isNaN(id)) {
                    return res.status(400).json({ error: "Invalid ID" });
                }
                const deleted = await landing_service_1.landingService.deleteService(id);
                return res.json({ message: "Service deleted", deleted });
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to delete service." });
            }
        };
        this.getPartners = async (_req, res) => {
            try {
                const partners = await landing_service_1.landingService.getAllPartners();
                return res.json(partners);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to fetch partners." });
            }
        };
        this.patchPartner = async (req, res) => {
            try {
                const images = req.files;
                const uploadResponses = [];
                if (images && Array.isArray(images)) {
                    for (const image of images) {
                        try {
                            let imageName = await cloudinaryConfig_1.default.uploader.upload(image.path, {
                                folder: "carousel",
                            });
                            uploadResponses.push(imageName.secure_url);
                        }
                        catch (error) {
                            console.error("Error uploading image to Cloudinary:", error);
                            return res.status(500).json({ message: "Error uploading images" });
                        }
                    }
                }
                const logo = uploadResponses[0];
                if (!logo) {
                    return res.status(400).json({ error: "Missing logo" });
                }
                const partner = await landing_service_1.landingService.createPartner({ image: logo });
                return res.json(partner);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to create partner." });
            }
        };
        this.deletePartner = async (req, res) => {
            try {
                const idParam = req.params.id;
                if (!idParam) {
                    return res.status(400).json({ error: "ID parameter is required" });
                }
                const id = parseInt(idParam, 10);
                if (isNaN(id)) {
                    return res.status(400).json({ error: "ID parameter must be a number" });
                }
                if (isNaN(id))
                    return res.status(400).json({ error: "Invalid ID" });
                const deleted = await landing_service_1.landingService.deletePartner(id);
                return res.json({ message: "Partner deleted", deleted });
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to delete partner." });
            }
        };
        this.getTeam = async (_req, res) => {
            try {
                const team = await landing_service_1.landingService.getAllTeam();
                return res.json(team);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to fetch team." });
            }
        };
        this.postTeam = async (req, res) => {
            try {
                const images = req.files;
                const uploadResponses = [];
                if (images && Array.isArray(images)) {
                    for (const image of images) {
                        try {
                            let imageName = await cloudinaryConfig_1.default.uploader.upload(image.path, {
                                folder: "carousel",
                            });
                            uploadResponses.push(imageName.secure_url);
                        }
                        catch (error) {
                            console.error("Error uploading image to Cloudinary:", error);
                            return res.status(500).json({ message: "Error uploading images" });
                        }
                    }
                }
                const image = uploadResponses[0];
                const newMember = await landing_service_1.landingService.createTeamMember({
                    ...req.body,
                    profileImg: image,
                });
                return res.status(201).json(newMember);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to create team member." });
            }
        };
        this.patchTeam = async (req, res) => {
            try {
                const idParam = req.params.id;
                if (!idParam) {
                    return res.status(400).json({ error: "ID parameter is required" });
                }
                const images = req.files;
                const uploadResponses = [];
                if (images && Array.isArray(images)) {
                    for (const image of images) {
                        try {
                            let imageName = await cloudinaryConfig_1.default.uploader.upload(image.path, {
                                folder: "carousel",
                            });
                            uploadResponses.push(imageName.secure_url);
                        }
                        catch (error) {
                            console.error("Error uploading image to Cloudinary:", error);
                            return res.status(500).json({ message: "Error uploading images" });
                        }
                    }
                }
                const image = uploadResponses[0];
                const id = parseInt(idParam, 10);
                if (isNaN(id)) {
                    return res.status(400).json({ error: "ID parameter must be a number" });
                }
                const updated = await landing_service_1.landingService.updateTeamMember(id, {
                    ...req.body,
                    profileImg: image,
                });
                return res.json(updated);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to update team member." });
            }
        };
        this.deleteTeam = async (req, res) => {
            try {
                const idParam = req.params.id;
                if (!idParam) {
                    return res.status(400).json({ error: "ID parameter is required" });
                }
                const id = parseInt(idParam, 10);
                if (isNaN(id)) {
                    return res.status(400).json({ error: "ID parameter must be a number" });
                }
                if (!id)
                    return res.status(400).json({ error: "Invalid ID" });
                const deleted = await landing_service_1.landingService.deleteTeamMember(id);
                return res.json({ message: "Deleted successfully", deleted });
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to delete team member." });
            }
        };
        this.getOverview = async (req, res) => {
            try {
                const overview = await landing_service_1.landingService.getOverviewStats();
                return res.json(overview);
            }
            catch (error) {
                return res.status(500).json({ error: "Failed to fetch overview data." });
            }
        };
    }
    async createCarousel(req, res) {
        try {
            const images = req.files;
            const uploadResponses = [];
            if (images && Array.isArray(images)) {
                for (const image of images) {
                    try {
                        let imageName = await cloudinaryConfig_1.default.uploader.upload(image.path, {
                            folder: "carousel",
                        });
                        uploadResponses.push(imageName.secure_url);
                    }
                    catch (error) {
                        console.error("Error uploading image to Cloudinary:", error);
                        return res.status(500).json({ message: "Error uploading images" });
                    }
                }
            }
            const image = uploadResponses[0];
            if (!image) {
                return;
            }
            const data = await landing_service_1.landingService.createCarousel(image);
            return res.json(data).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async getCarousel(req, res) {
        try {
            const data = await landing_service_1.landingService.getCarousel();
            return res.json(data).status(200);
        }
        catch (error) {
            return res.status(500).json({ error: "Failed to fetch carousel." });
        }
    }
    async getTestimonials(req, res) {
        try {
            const data = await landing_service_1.landingService.getTestimonials();
            return res.json(data).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async createTestimonial(req, res) {
        try {
            const files = req.files;
            const uploadedUrls = [];
            if (files && Array.isArray(files)) {
                for (const file of files) {
                    try {
                        const result = await cloudinaryConfig_1.default.uploader.upload(file.path, {
                            folder: "testimonial",
                        });
                        uploadedUrls.push(result.secure_url);
                    }
                    catch (err) {
                        console.error("Error uploading image:", err);
                        return res.status(500).json({ message: "Image upload failed" });
                    }
                }
            }
            const logo = uploadedUrls[0];
            if (!logo)
                return res.status(400).json({ message: "No image uploaded" });
            const { title, subtitle, content } = req.body;
            const data = await landing_service_1.landingService.createTestimonial({
                logo,
                title,
                subtitle,
                content,
            });
            return res.json(data).status(201);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async updateTestimonial(req, res) {
        try {
            const { id } = req.params;
            const { title, subtitle, content } = req.body;
            let logo = req.body.logo;
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                try {
                    const uploaded = await cloudinaryConfig_1.default.uploader.upload(req.files[0].path, {
                        folder: "testimonial",
                    });
                    logo = uploaded.secure_url;
                }
                catch (err) {
                    console.error("Image upload error:", err);
                    return res.status(500).json({ message: "Error uploading logo" });
                }
            }
            const updated = await landing_service_1.landingService.updateTestimonial(Number(id), {
                logo,
                title,
                subtitle,
                content,
            });
            return res.json(updated).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async deleteTestimonial(req, res) {
        try {
            const { id } = req.params;
            const deleted = await landing_service_1.landingService.deleteTestimonial(Number(id));
            return res.json(deleted).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async getBlogs(req, res) {
        try {
            const data = await landing_service_1.landingService.getBlogs();
            return res.json(data).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async getBlogById(req, res) {
        try {
            const { id } = req.params;
            const blog = await landing_service_1.landingService.getBlogById(Number(id));
            return res.json(blog).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async createBlog(req, res) {
        try {
            const files = req.files;
            const uploadedUrls = [];
            if (files && Array.isArray(files)) {
                for (const file of files) {
                    try {
                        const result = await cloudinaryConfig_1.default.uploader.upload(file.path, {
                            folder: "blog",
                        });
                        uploadedUrls.push(result.secure_url);
                    }
                    catch (err) {
                        console.error("Error uploading image:", err);
                        return res.status(500).json({ message: "Image upload failed" });
                    }
                }
            }
            const thumbnailImg = uploadedUrls[0];
            if (!thumbnailImg)
                return res.status(400).json({ message: "No thumbnail uploaded" });
            const { title, content } = req.body;
            const blog = await landing_service_1.landingService.createBlog({
                thumbnailImg,
                title,
                content,
            });
            return res.json(blog).status(201);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async updateBlog(req, res) {
        try {
            const { id } = req.params;
            const { title, content } = req.body;
            let thumbnailImg = req.body.thumbnailImg;
            if (req.files && Array.isArray(req.files) && req.files.length > 0) {
                try {
                    const uploaded = await cloudinaryConfig_1.default.uploader.upload(req.files[0].path, {
                        folder: "blog",
                    });
                    thumbnailImg = uploaded.secure_url;
                }
                catch (err) {
                    console.error("Image upload error:", err);
                    return res.status(500).json({ message: "Error uploading thumbnail" });
                }
            }
            const updated = await landing_service_1.landingService.updateBlog(Number(id), {
                thumbnailImg,
                title,
                content,
            });
            return res.json(updated).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async deleteBlog(req, res) {
        try {
            const { id } = req.params;
            const deleted = await landing_service_1.landingService.deleteBlog(Number(id));
            return res.json(deleted).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async getCareers(req, res) {
        try {
            const data = await landing_service_1.landingService.getCareers();
            return res.json(data).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async createCareer(req, res) {
        try {
            const { name, email, phoneNumber } = req.body;
            const files = req.files;
            console.log("Request body:", req.body);
            console.log("Files received:", files);
            if (!files || !Array.isArray(files) || files.length === 0) {
                return res.status(400).json({ message: "Resume file is required" });
            }
            const resumeFile = files[0];
            console.log("Resume file details:", {
                fieldname: resumeFile?.fieldname,
                originalname: resumeFile?.originalname,
                mimetype: resumeFile?.mimetype,
                size: resumeFile?.size,
                path: resumeFile?.path,
                filename: resumeFile?.filename,
            });
            if (!resumeFile?.path) {
                console.error("No path found in uploaded file");
                return res.status(500).json({ message: "Resume upload failed" });
            }
            const created = await landing_service_1.landingService.createCareer({
                name,
                email,
                phoneNumber,
                resume: resumeFile.path,
            });
            console.log("Career created successfully:", created);
            return res.status(201).json(created);
        }
        catch (error) {
            console.error("Error in createCareer:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async getEmployers(req, res) {
        try {
            const data = await landing_service_1.landingService.getEmployers();
            return res.status(200).json(data);
        }
        catch (error) {
            console.error("Error in getEmployers:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async createEmployer(req, res) {
        try {
            const { companyName, contactPerson, email, phoneNumber, industry, jobTitle, location, requirements, urgency } = req.body;
            console.log("Employer request body:", req.body);
            if (!companyName || !contactPerson || !email || !phoneNumber || !jobTitle || !location) {
                return res.status(400).json({
                    message: "Company name, contact person, email, phone number, job title, and location are required"
                });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
            const validUrgencyValues = ['normal', 'urgent', 'immediate'];
            const urgencyValue = urgency || 'normal';
            if (!validUrgencyValues.includes(urgencyValue)) {
                return res.status(400).json({ message: "Invalid urgency value" });
            }
            const created = await landing_service_1.landingService.createEmployer({
                companyName,
                contactPerson,
                email,
                phoneNumber,
                industry: industry || null,
                jobTitle,
                location,
                requirements: requirements || null,
                urgency: urgencyValue,
            });
            console.log("Employer created successfully:", created);
            return res.status(201).json(created);
        }
        catch (error) {
            console.error("Error in createEmployer:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async getFeedbacks(req, res) {
        try {
            const data = await landing_service_1.landingService.getFeedbacks();
            return res.json(data).status(200);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async createFeedback(req, res) {
        try {
            const { fullName, phone, email, message } = req.body;
            const created = await landing_service_1.landingService.createFeedback({
                fullName,
                phone,
                email,
                message,
            });
            return res.json(created).status(201);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const created = await landing_service_1.landingService.register({
                name,
                email,
                password,
            });
            return res.json(created).status(201);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const created = await landing_service_1.landingService.login({
                email,
                password,
            });
            const token = created.token;
            if (token) {
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 60 * 60 * 1000,
                });
            }
            return res.json({ ...created, token }).status(201);
        }
        catch (error) {
            console.log(error);
            return;
        }
    }
}
exports.landingController = new LandingController();
//# sourceMappingURL=landing.controller.js.map