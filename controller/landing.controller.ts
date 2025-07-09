import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { landingService } from "../service/landing.service";

class LandingController {
  constructor() {}

  async createCarousel(req: Request, res: Response) {
    try {
      const { image } = req.body;
      const data = await landingService.createCarousel(image);
      return res.json(data).status(200);
    } catch (error: any) {
      console.log(error);
    }
  }

  async getCarousel(req: Request, res: Response) {
    try {
      const { image } = req.body;
      const data = await landingService.createCarousel(image);
      return res.json(data).status(200);
    } catch (error: any) {
      console.log(error);
    }
  }
}

export const landingController = new LandingController();
