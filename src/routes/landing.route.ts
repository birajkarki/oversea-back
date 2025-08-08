import express, { Request, Response, NextFunction } from "express";
import { landingController } from "../controller/landing.controller";
import upload from "../config/multer";
import { isValidUser } from "../middleware/auth";
import { deleteBannerById, getServiceById } from "../service/landing.service";
import { resolve } from "path";
const app = express.Router();

// To get the homepage banner image
app.get("/carousel", landingController.getCarousel);
// To create or update the homepage banner image
app.patch("/carousel",isValidUser, upload.array("image"), landingController.createCarousel);
app.delete("/carousel/:id",isValidUser,deleteBannerById);

// To get the stat in landing page
app.get("/stat", landingController.getStat);
// To create/update the stat in landing page
app.patch("/stat",isValidUser,  landingController.patchStat);

app.get("/isValid",isValidUser,(req,res)=>{
  res.status(200).send({success:true})
});
// TO get service image
app.get("/service", landingController.getServices);
app.patch("/service", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "miniImage",maxCount:10 } 
  ]), landingController.createService);

app.delete("/service/:id",isValidUser,  landingController.deleteService);
app.get("/service/:id",  getServiceById);

// To get partner logos
app.get("/partner", landingController.getPartners);
app.patch("/partner",isValidUser,  upload.array("image"), landingController.patchPartner);
app.delete("/partner/:id",isValidUser,  landingController.deletePartner);

// To get team members
app.get("/team", landingController.getTeam);
app.post("/team",isValidUser,  upload.array("image"), landingController.postTeam);
app.patch("/team/:id",isValidUser,  upload.array("image"), landingController.patchTeam);
app.delete("/team/:id",isValidUser,  landingController.deleteTeam);
app.post("/team/reorder",landingController.reorder)
//login

app.post('/login',landingController.login)
app.post('/register',landingController.register)



// To get blogs
app.get("/testimonials", landingController.getTestimonials);
app.post(
  "/testimonial",
  upload.array("image"),
  landingController.createTestimonial
);
app.patch(
  "/testimonial/:id",
  isValidUser, 
  upload.array("image"),
  landingController.updateTestimonial
);
app.delete("/testimonial/:id",isValidUser,  landingController.deleteTestimonial);



app.get("/blogs", landingController.getBlogs);
app.get("/blogs/:id", landingController.getBlogById);
app.post("/blog", isValidUser, upload.array("image"), landingController.createBlog);
app.patch("/blog/:id",isValidUser,  upload.array("image"), landingController.updateBlog);
app.delete("/blog/:id",isValidUser,  landingController.deleteBlog);


app.get("/careers", landingController.getCareers);
app.post("/career",  upload.array("resume"), landingController.createCareer);


app.get("/feedbacks", landingController.getFeedbacks);
app.post("/feedback", landingController.createFeedback);


app.get("/overview", landingController.getOverview);


export default app;
