import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

class LandingService {
  constructor() {}

  async createCarousel(image: string) {
    const doesExist = await prisma.carousel.findFirst();
    if (doesExist) {
      const carousel = await prisma.carousel.update({where:{id:doesExist.id},data:{image}})
      return carousel;
    }
    const carousel = await prisma.carousel.create({
      data: { image },
    });
    return carousel;
  }

  async getCarousel() {
    const carousel = await prisma.carousel.findFirst();
    return carousel;
  }
}

export const landingService = new LandingService();
