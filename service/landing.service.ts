import { Request,Response } from "express";
import { prisma } from "../utils/prisma";




class LandingService {
    constructor (){}

    async createCarousel(image:string){
      const carousel=await prisma.carousel.create({
        data:{image}
      });
      return carousel;
    }
}


export const landingService=new LandingService();
