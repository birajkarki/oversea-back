
import express, { Request, Response, NextFunction } from 'express';
import { landingController } from '../controller/landing.controller';
import upload from '../config/multer';

const app=express();



// To get the homepage banner image
app.get("/carousel",upload.array("image")  ,landingController.getCarousel)
// To create or update the homepage banner image
app.patch("/carousel",landingController.createCarousel)


// To get the stat in landing page
app.get("/stat")
// To create/update the stat in landing page
app.patch("/stat")


// TO get service image
app.get("/service")
app.patch("/service")

// To get partner logos
app.get("/partner")
app.patch("/partner")
app.delete("/partner/:id")


// To get team members
app.get("/team")
app.post("/team")
app.patch("/team?:id")
app.delete("/team/:id")


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

