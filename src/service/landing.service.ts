import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { sendEmail } from "../utils/email";
import { generateToken } from "../utils/bcrypt";

class LandingService {
  constructor() {}

  async createCarousel(image: string) {
    // const doesExist = await prisma.carousel.findFirst();
    // if (doesExist) {
    //   const carousel = await prisma.carousel.update({where:{id:doesExist.id},data:{image}})
    //   return carousel;
    // }
    const carousel = await prisma.carousel.create({
      data: { image },
    });
    return carousel;
  }

  async getCarousel() {
    const carousel = await prisma.carousel.findMany();
    return carousel;
  }

  getStat = async () => {
    return await prisma.stat.findFirst();
  };

  updateStat = async (
    data: Partial<{
      years: number;
      placements: number;
      services: number;
      countriesServed: number;
      team: number;
      database: number;
    }>
  ) => {
    const existing = await prisma.stat.findFirst();
    const sanitizedData = {
      years: data.years !== undefined && Number(data.years),
      placements:
        data.placements !== undefined ? Number(data.placements) : undefined,
      services: data.services !== undefined ? Number(data.services) : undefined,
      countriesServed:
        data.countriesServed !== undefined
          ? Number(data.countriesServed)
          : undefined,
      team: data.team !== undefined ? Number(data.team) : undefined,
      database: data.database !== undefined ? Number(data.database) : undefined,
    };
    if (!existing) {
      return await prisma.stat.create({ data: sanitizedData as any });
    }

    return await prisma.stat.update({
      where: { id: existing.id },
      data,
    });
  };

  safeJsonParse(value: any) {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value; // or null if invalid JSON string
      }
    }
    return value; // already parsed object/array
  }

  getAllServices = async () => {
    const services = await prisma.service.findMany();

    return services.map((s) => ({
      ...s,
      benefit: this.safeJsonParse(s.benefit),
      specialization: this.safeJsonParse(s.specialization),
    }));
  };

  createService = async (data: {
    image: string;
    image2: string;
    image3:string;
    serviceType: string;
    heading: string;
    subheading: string;
    feature: string[];
    benefit: Array<{ title: string; subtitle: string }>;
    specialization: any;
  }) => {
    return await prisma.service.create({
      data,
    });
  };

  deleteService = async (id: number) => {
    return await prisma.service.delete({ where: { id } });
  };

  getAllPartners = async () => {
    return await prisma.partner.findMany();
  };

  createPartner = async (data: { image: string }) => {
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
    const maxOrderResult = await prisma.team.aggregate({
      _max: {
        order: true,
      },
    });

    const nextOrder = (maxOrderResult._max.order || 0) + 1;
    const team = await prisma.team.create({
      data: {
        ...data,
        order: nextOrder,
      },
    });
    console.log(team);

    return team;
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

  // OVerview api

  async getOverviewStats() {
    const [carousels, services, partners, team, testimonials, blogs] =
      await Promise.all([
        prisma.carousel.count(),
        prisma.service.count(),
        prisma.partner.count(),
        prisma.team.count(),
        prisma.testimonial.count(),
        prisma.blog.count(),
      ]);

    return {
      carousels,
      services,
      partners,
      team,
      testimonials,
      blogs,
    };
  }

  async getTestimonials() {
    return await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createTestimonial(data: {
    logo: string;
    title: string;
    subtitle: string;
    content: string;
  }) {
    return await prisma.testimonial.create({ data });
  }

  async updateTestimonial(
    id: number,
    data: Partial<{
      logo: string;
      title: string;
      subtitle: string;
      content: string;
    }>
  ) {
    return await prisma.testimonial.update({
      where: { id },
      data,
    });
  }

  async deleteTestimonial(id: number) {
    return await prisma.testimonial.delete({
      where: { id },
    });
  }

  async getBlogs() {
    return await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async getBlogById(id: number) {
    return await prisma.blog.findUnique({
      where: { id },
    });
  }

  async createBlog(data: {
    thumbnailImg: string;
    title: string;
    content: string;
  }) {
    return await prisma.blog.create({ data });
  }

  async updateBlog(
    id: number,
    data: Partial<{
      thumbnailImg: string;
      title: string;
      content: string;
    }>
  ) {
    return await prisma.blog.update({
      where: { id },
      data,
    });
  }

  async deleteBlog(id: number) {
    return await prisma.blog.delete({
      where: { id },
    });
  }

  async getCareers() {
    return await prisma.career.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createCareer(data: {
    name: string;
    email: string;
    phoneNumber: string;
    resume: string;
  }) {
    return await prisma.career.create({ data });
  }

  async getFeedbacks() {
    return await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async createFeedback(data: {
    fullName: string;
    phone: string;
    email: string;
    message: string;
  }) {
    return sendEmail(data.email, "Feedback", data.message);
  }

  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findFirst({ where: { email: data.email } });
    if (!user) {
      throw new Error("User not found");
    }
    const token = generateToken(user.id);
    const tokenizedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        token,
      },
      omit: {
        token: false,
      },
    });

    return tokenizedUser;
  }

  async register(data: {
    name: string;

    email: string;
    password: string;
  }) {
    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: "ADMIN",
        name: data.name,
      },
    });
  }
}

export const landingService = new LandingService();

export const deleteServiceById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    await prisma.service.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: `Service with id ${id} deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete service.",
      error: error.message,
    });
  }
};
function safeJsonParse(value: any) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value; // or null if invalid JSON string
    }
  }
  return value; // already parsed object/array
}

export const getServiceById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Transform the service data with safeJsonParse
    const transformedService = {
      ...service,
      benefit: safeJsonParse(service.benefit),
      specialization: safeJsonParse(service.specialization),
    };

    return res.status(200).json({
      success: true,
      message: `Service with id ${id} retrieved successfully.`,
      data: transformedService,
    });
  } catch (error: any) {
    console.error("Error retrieving service:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve service.",
      error: error.message,
    });
  }
};

export const deleteBannerById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  try {
    const service = await prisma.carousel.findUnique({ where: { id } });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    await prisma.carousel.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: `banner with id ${id} deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Error deleting banner:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete banner.",
      error: error.message,
    });
  }
};

export const updateService = async (id: number, data: {
    serviceType?: string;
    heading?: string;
    subheading?: string;
    image?: string;
    image2?: string;
    image3?: string;
    feature?: string[];
    benefit?: string; // JSON string
    specialization?: string; // JSON string
}) => {
    return await prisma.service.update({
        where: { id },
        data,
    });
};
