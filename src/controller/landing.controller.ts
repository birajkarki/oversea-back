import { Request, Response } from "express";

import { landingService } from "../service/landing.service";
import cloudinary from "../config/cloudinaryConfig";

class LandingController {
  constructor() {}

  async createCarousel(req: Request & any, res: Response) {
    try {
      const images = req.files;
      const uploadResponses: string[] = [];

      if (images && Array.isArray(images)) {
        for (const image of images) {
          try {
            let imageName = await cloudinary.uploader.upload(image.path, {
              folder: "carousel",
            });
            uploadResponses.push(imageName.secure_url);
          } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).json({ message: "Error uploading images" });
          }
        }
      }
      const image = uploadResponses[0];
     if(!image){
      return;
     }
      const data = await landingService.createCarousel(image);
      return res.json(data).status(200);
    } catch (error: any) {
      console.log(error);
      return;
    }
  }

  async getCarousel(req: Request, res: Response) {
    try {
      const data = await landingService.getCarousel();
      return res.json(data).status(200);
    } catch (error: any) {
     return res.status(500).json({ error: "Failed to fetch carousel." });
      
    }
  }

  getStat = async (req: Request, res: Response) => {
    try {
      const stat = await landingService.getStat();
     return res.json(stat);
    } catch (error) {
     return res.status(500).json({ error: "Failed to fetch stat." });
    }
  };

  patchStat = async (req: Request, res: Response) => {
    try {
      const updated = await landingService.updateStat(req.body);
     return res.json(updated);
    } catch (error) {
     return res.status(500).json({ error: "Failed to update stat." });
    }
  };

  getServices = async (req: Request, res: Response) => {
    try {
      const services = await landingService.getAllServices();
     return res.json(services);
    } catch (error) {
     return res.status(500).json({ error: "Failed to fetch services." });
    }
  };

  patchService = async (req: Request, res: Response) => {
    try {
      const { serviceType } = req.body;
    const images = req.files;
      const uploadResponses: string[] = [];

      if (images && Array.isArray(images)) {
        for (const image of images) {
          try {
            let imageName = await cloudinary.uploader.upload(image.path, {
              folder: "carousel",
            });
            uploadResponses.push(imageName.secure_url);
          } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).json({ message: "Error uploading images" });
          }
        }
      }
      const image=uploadResponses[0];
      if (!image || !serviceType) {
        return res.status(400).json({ error: "Missing image or serviceType" });
      }

      const created = await landingService.createService({
        image,
        serviceType,
      });
    return  res.json(created);
    } catch (error) {
    return  res.status(500).json({ error: "Failed to create service." });
    }
  };

  deleteService = async (req: Request, res: Response) => {
    try {
     const idParam = req.params.id;

if (!idParam) {
  return res.status(400).json({ error: "ID parameter is required" });
}

const id = parseInt(idParam, 10);
if (isNaN(id)) {
  return res.status(400).json({ error: "ID parameter must be a number" });
}

      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }

      const deleted = await landingService.deleteService(id);
   return   res.json({ message: "Service deleted", deleted });
    } catch (error) {
   return   res.status(500).json({ error: "Failed to delete service." });
    }
  };

  getPartners = async (_req: Request, res: Response) => {
    try {
      const partners = await landingService.getAllPartners();
    return  res.json(partners);
    } catch (error) {
    return  res.status(500).json({ error: "Failed to fetch partners." });
    }
  };

  patchPartner = async (req: Request, res: Response) => {
    try {
      const images = req.files;
      const uploadResponses: string[] = [];

      if (images && Array.isArray(images)) {
        for (const image of images) {
          try {
            let imageName = await cloudinary.uploader.upload(image.path, {
              folder: "carousel",
            });
            uploadResponses.push(imageName.secure_url);
          } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).json({ message: "Error uploading images" });
          }
        }
      }
      const logo=uploadResponses[0];

      if (!logo) {
        return res.status(400).json({ error: "Missing logo" });
      }

      const partner = await landingService.createPartner({ image: logo });
    return  res.json(partner);
    } catch (error) {
     return res.status(500).json({ error: "Failed to create partner." });
    }
  };

  deletePartner = async (req: Request, res: Response) => {
    try {
     const idParam = req.params.id;

if (!idParam) {
  return res.status(400).json({ error: "ID parameter is required" });
}

const id = parseInt(idParam, 10);
if (isNaN(id)) {
  return res.status(400).json({ error: "ID parameter must be a number" });
}
      if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

      const deleted = await landingService.deletePartner(id);
    return  res.json({ message: "Partner deleted", deleted });
    } catch (error) {
    return  res.status(500).json({ error: "Failed to delete partner." });
    }
  };

  getTeam = async (_req: Request, res: Response) => {
    try {
      const team = await landingService.getAllTeam();
    return  res.json(team);
    } catch (error) {
    return  res.status(500).json({ error: "Failed to fetch team." });
    }
  };

  postTeam = async (req: Request, res: Response) => {
    try {
       const images = req.files;
      const uploadResponses: string[] = [];

      if (images && Array.isArray(images)) {
        for (const image of images) {
          try {
            let imageName = await cloudinary.uploader.upload(image.path, {
              folder: "carousel",
            });
            uploadResponses.push(imageName.secure_url);
          } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).json({ message: "Error uploading images" });
          }
        }
      }
      const image=uploadResponses[0];
      const newMember = await landingService.createTeamMember({...req.body,profileImg:image});
     return res.status(201).json(newMember);
    } catch (error) {
    return  res.status(500).json({ error: "Failed to create team member." });
    }
  };

  patchTeam = async (req: Request, res: Response) => {
    try {
    const idParam = req.params.id;

if (!idParam) {
  return res.status(400).json({ error: "ID parameter is required" });
}

const id = parseInt(idParam, 10);
if (isNaN(id)) {
  return res.status(400).json({ error: "ID parameter must be a number" });
}
      const updated = await landingService.updateTeamMember(id, req.body);
    return  res.json(updated);
    } catch (error) {
     return res.status(500).json({ error: "Failed to update team member." });
    }
  };

  deleteTeam = async (req: Request, res: Response) => {
    try {
   const idParam = req.params.id;

if (!idParam) {
  return res.status(400).json({ error: "ID parameter is required" });
}

const id = parseInt(idParam, 10);
if (isNaN(id)) {
  return res.status(400).json({ error: "ID parameter must be a number" });
}
      if (!(id)) return res.status(400).json({ error: "Invalid ID" });

      const deleted = await landingService.deleteTeamMember(id);
     return res.json({ message: "Deleted successfully", deleted });
    } catch (error) {
     return res.status(500).json({ error: "Failed to delete team member." });
    }
  };
}

export const landingController = new LandingController();
