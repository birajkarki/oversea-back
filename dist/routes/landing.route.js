"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const landing_controller_1 = require("../controller/landing.controller");
const multer_1 = __importDefault(require("../config/multer"));
const auth_1 = require("../middleware/auth");
const landing_service_1 = require("../service/landing.service");
const app = express_1.default.Router();
app.get("/carousel", landing_controller_1.landingController.getCarousel);
app.patch("/carousel", auth_1.isValidUser, multer_1.default.array("image"), landing_controller_1.landingController.createCarousel);
app.delete("/carousel/:id", auth_1.isValidUser, landing_service_1.deleteBannerById);
app.post("/carousel/reorder", landing_controller_1.landingController.reorderBanner);
app.get("/stat", landing_controller_1.landingController.getStat);
app.patch("/stat", auth_1.isValidUser, landing_controller_1.landingController.patchStat);
app.get("/isValid", auth_1.isValidUser, (req, res) => {
    res.status(200).send({ success: true });
});
app.get("/service", landing_controller_1.landingController.getServices);
app.patch("/service/:id", multer_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "miniImage", maxCount: 10 }
]), landing_controller_1.landingController.updateService);
app.patch("/service", multer_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "miniImage", maxCount: 10 }
]), landing_controller_1.landingController.createService);
app.patch("/specialization/:id", multer_1.default.fields([{ name: 'image', maxCount: 1 }]), landing_controller_1.landingController.updateSpecialization);
app.post("/specialization/:id", multer_1.default.fields([{ name: 'image', maxCount: 1 }]), landing_controller_1.landingController.uploadSpecialization);
app.delete("/specialization/:id", auth_1.isValidUser, landing_controller_1.landingController.deleteSpecialization);
app.delete("/service/:id", auth_1.isValidUser, landing_controller_1.landingController.deleteService);
app.get("/service/:id", landing_service_1.getServiceById);
app.get("/partner", landing_controller_1.landingController.getPartners);
app.patch("/partner", auth_1.isValidUser, multer_1.default.array("image"), landing_controller_1.landingController.patchPartner);
app.delete("/partner/:id", auth_1.isValidUser, landing_controller_1.landingController.deletePartner);
app.get("/team", landing_controller_1.landingController.getTeam);
app.post("/team", auth_1.isValidUser, multer_1.default.array("image"), landing_controller_1.landingController.postTeam);
app.patch("/team/:id", auth_1.isValidUser, multer_1.default.array("image"), landing_controller_1.landingController.patchTeam);
app.delete("/team/:id", auth_1.isValidUser, landing_controller_1.landingController.deleteTeam);
app.post("/team/reorder", landing_controller_1.landingController.reorder);
app.post('/login', landing_controller_1.landingController.login);
app.post('/register', landing_controller_1.landingController.register);
app.get("/testimonials", landing_controller_1.landingController.getTestimonials);
app.post("/testimonial", multer_1.default.array("image"), landing_controller_1.landingController.createTestimonial);
app.patch("/testimonial/:id", auth_1.isValidUser, multer_1.default.array("image"), landing_controller_1.landingController.updateTestimonial);
app.delete("/testimonial/:id", auth_1.isValidUser, landing_controller_1.landingController.deleteTestimonial);
app.get("/blogs", landing_controller_1.landingController.getBlogs);
app.get("/blogs/:id", landing_controller_1.landingController.getBlogById);
app.post("/blog", auth_1.isValidUser, multer_1.default.array("image"), landing_controller_1.landingController.createBlog);
app.patch("/blog/:id", auth_1.isValidUser, multer_1.default.array("image"), landing_controller_1.landingController.updateBlog);
app.delete("/blog/:id", auth_1.isValidUser, landing_controller_1.landingController.deleteBlog);
app.get("/careers", landing_controller_1.landingController.getCareers);
app.post("/career", multer_1.default.array("resume"), landing_controller_1.landingController.createCareer);
app.get("/feedbacks", landing_controller_1.landingController.getFeedbacks);
app.post("/feedback", landing_controller_1.landingController.createFeedback);
app.get("/overview", landing_controller_1.landingController.getOverview);
app.get("/advertisement", landing_controller_1.landingController.getAllAdvertisement);
app.post("/advertisement", multer_1.default.single("image"), landing_controller_1.landingController.postAdvertisement);
app.delete("/advertisement", landing_controller_1.landingController.deleteAdvertisement);
app.get("/advertisement", landing_controller_1.landingController.getAdvertisementById);
app.post("/employer", landing_controller_1.landingController.postEmployer);
app.get("/employers", landing_controller_1.landingController.getEmployer);
exports.default = app;
//# sourceMappingURL=landing.route.js.map