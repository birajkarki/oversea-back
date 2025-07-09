
import express, { Request, Response, NextFunction } from 'express';
import { landingController } from '../controller/landing.controller';
import upload from '../config/multer';

const app = express.Router();

// To get the homepage banner image
app.get("/carousel" ,landingController.getCarousel)
// To create or update the homepage banner image
app.patch("/carousel",upload.array("image") ,landingController.createCarousel)


// To get the stat in landing page
app.get("/stat",landingController.getStat)
// To create/update the stat in landing page
app.patch("/stat",landingController.patchStat)


// TO get service image
app.get("/service", landingController.getServices);
app.patch("/service",upload.array("image"), landingController.patchService);
app.delete("/service/:id", landingController.deleteService);

// To get partner logos
app.get("/partner", landingController.getPartners);
app.patch("/partner",upload.array("image"), landingController.patchPartner);
app.delete("/partner/:id", landingController.deletePartner);


// To get team members
app.get("/team", landingController.getTeam);
app.post("/team",upload.array("image"), landingController.postTeam);
app.patch("/team/:id",upload.array("image"), landingController.patchTeam);
app.delete("/team/:id", landingController.deleteTeam);


// To get blogs

app.get("/blogs")
app.get("/blogs/:id")
app.post("/blogs")
app.patch("/blogs/:id")
app.delete("/blogs/:id")

// to get testimonial
app.get("/testimonial")
app.get("/testimonial/:id")
app.post("/testimonial")
app.patch("/testimonial/:id")
app.delete("/testimonial/:id")


// Feedback
app.post("/feedback")
app.get("/feedback")



//Apply now

app.post("/apply")


export default app ;