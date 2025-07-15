import express, { Request, Response, NextFunction } from "express";
import { landingController } from "../controller/landing.controller";
import upload from "../config/multer";

const app = express.Router();

// To get the homepage banner image
app.get("/carousel", landingController.getCarousel);
// To create or update the homepage banner image
app.patch("/carousel", upload.array("image"), landingController.createCarousel);

// To get the stat in landing page
app.get("/stat", landingController.getStat);
// To create/update the stat in landing page
app.patch("/stat", landingController.patchStat);

// TO get service image
app.get("/service", landingController.getServices);
app.patch("/service", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "miniImage",maxCount:10 } 
  ]), landingController.createService);

app.delete("/service/:id", landingController.deleteService);

// To get partner logos
app.get("/partner", landingController.getPartners);
app.patch("/partner", upload.array("image"), landingController.patchPartner);
app.delete("/partner/:id", landingController.deletePartner);

// To get team members
app.get("/team", landingController.getTeam);
app.post("/team", upload.array("image"), landingController.postTeam);
app.patch("/team/:id", upload.array("image"), landingController.patchTeam);
app.delete("/team/:id", landingController.deleteTeam);

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
  upload.array("image"),
  landingController.updateTestimonial
);
app.delete("/testimonial/:id", landingController.deleteTestimonial);



app.get("/blogs", landingController.getBlogs);
app.get("/blogs/:id", landingController.getBlogById);
app.post("/blog", upload.array("image"), landingController.createBlog);
app.patch("/blog/:id", upload.array("image"), landingController.updateBlog);
app.delete("/blog/:id", landingController.deleteBlog);


app.get("/careers", landingController.getCareers);
app.post("/career", upload.array("resume"), landingController.createCareer);


app.get("/feedbacks", landingController.getFeedbacks);
app.post("/feedback", landingController.createFeedback);


app.get("/overview", landingController.getOverview);


export default app;
