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


 
  getStat = async () => {
  return await prisma.stat.findFirst();
};

  updateStat = async (data: Partial<{
  years: number;
  placements: number;
  services: number;
  countriesServed: number;
  team: number;
  database: number;
}>) => {
  const existing = await prisma.stat.findFirst();

  if (!existing) {
    return await prisma.stat.create({ data: data as any });
  }

  return await prisma.stat.update({
    where: { id: existing.id },
    data,
  });
};



 getAllServices = async () => {
  return await prisma.service.findMany();
};

 createService = async (data: {
  image: string;
  serviceType: string;
}) => {
  return await prisma.service.create({ data });
};

 deleteService = async (id: number) => {
  return await prisma.service.delete({ where: { id } });
};



getAllPartners = async () => {
  return await prisma.partner.findMany();
};

createPartner = async (data: {  image: string }) => {
  return await prisma.partner.create({ data });
};

 deletePartner = async (id: number) => {
  return await prisma.partner.delete({ where: { id } });
};





 getAllTeam = async () => {
  return await prisma.team.findMany();
};

createTeamMember = async (data: {
  name: string;
  address: string;
  role: string;
  title: string;
  linkedin: string;
  email: string;
  link: string;
  profileImg: string;
}) => {
  return await prisma.team.create({ data });
};

updateTeamMember = async (
  id: number,
  data: Partial<{
    name: string;
    address: string;
    role: string;
    title: string;
    linkedin: string;
    email: string;
    link: string;
    profileImg: string;
  }>
) => {
  return await prisma.team.update({
    where: { id },
    data,
  });
};

 deleteTeamMember = async (id: number) => {
  return await prisma.team.delete({ where: { id } });
};

}

export const landingService = new LandingService();
