import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { landingService } from "../service/landing.service";


class LandingController{
    constructor (){}
    async createCarousel(req:Request,res:Response){
  try {
            const {image}=req.body;
            const res=await landingService.createCarousel(image)
        } catch (error:any) {
            console.log(error)
        }
    }
}

export const landingController=new LandingController();