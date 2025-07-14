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
      if (!image) {
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
      const image = uploadResponses[0];
      if (!image || !serviceType) {
        return res.status(400).json({ error: "Missing image or serviceType" });
      }

      const created = await landingService.createService({
        image,
        serviceType,
      });
      return res.json(created);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create service." });
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
      return res.json({ message: "Service deleted", deleted });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete service." });
    }
  };

  getPartners = async (_req: Request, res: Response) => {
    try {
      const partners = await landingService.getAllPartners();
      return res.json(partners);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch partners." });
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
      const logo = uploadResponses[0];

      if (!logo) {
        return res.status(400).json({ error: "Missing logo" });
      }

      const partner = await landingService.createPartner({ image: logo });
      return res.json(partner);
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
      return res.json({ message: "Partner deleted", deleted });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete partner." });
    }
  };

  getTeam = async (_req: Request, res: Response) => {
    try {
      const team = await landingService.getAllTeam();
      return res.json(team);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch team." });
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
      const image = uploadResponses[0];
      const newMember = await landingService.createTeamMember({
        ...req.body,
        profileImg: image,
      });
      return res.status(201).json(newMember);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create team member." });
    }
  };

  patchTeam = async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;

      if (!idParam) {
        return res.status(400).json({ error: "ID parameter is required" });
      }
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
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID parameter must be a number" });
      }
      const updated = await landingService.updateTeamMember(id, {
        ...req.body,
        profileImg: image,
      });
      return res.json(updated);
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
      if (!id) return res.status(400).json({ error: "Invalid ID" });

      const deleted = await landingService.deleteTeamMember(id);
      return res.json({ message: "Deleted successfully", deleted });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete team member." });
    }
  };

  getOverview = async (req: Request, res: Response) => {
    try {
      const overview = await landingService.getOverviewStats();
      return res.json(overview);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch overview data." });
    }
  };

  //testimonial

  async getTestimonials(req: Request, res: Response) {
    try {
      const data = await landingService.getTestimonials();
      return res.json(data).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async createTestimonial(req: Request & any, res: Response) {
    try {
      const files = req.files;
      const uploadedUrls: string[] = [];

      if (files && Array.isArray(files)) {
        for (const file of files) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "testimonial",
            });
            uploadedUrls.push(result.secure_url);
          } catch (err) {
            console.error("Error uploading image:", err);
            return res.status(500).json({ message: "Image upload failed" });
          }
        }
      }

      const logo = uploadedUrls[0];
      if (!logo) return res.status(400).json({ message: "No image uploaded" });

      const { title, subtitle, content } = req.body;
      const data = await landingService.createTestimonial({
        logo,
        title,
        subtitle,
        content,
      });

      return res.json(data).status(201);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async updateTestimonial(req: Request & any, res: Response) {
    try {
      const { id } = req.params;
      const { title, subtitle, content } = req.body;

      let logo = req.body.logo; // fallback to existing if no new image

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        try {
          const uploaded = await cloudinary.uploader.upload(req.files[0].path, {
            folder: "testimonial",
          });
          logo = uploaded.secure_url;
        } catch (err) {
          console.error("Image upload error:", err);
          return res.status(500).json({ message: "Error uploading logo" });
        }
      }

      const updated = await landingService.updateTestimonial(Number(id), {
        logo,
        title,
        subtitle,
        content,
      });

      return res.json(updated).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async deleteTestimonial(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await landingService.deleteTestimonial(Number(id));
      return res.json(deleted).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  //blog

  async getBlogs(req: Request, res: Response) {
    try {
      const data = await landingService.getBlogs();
      return res.json(data).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async getBlogById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const blog = await landingService.getBlogById(Number(id));
      return res.json(blog).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async createBlog(req: Request & any, res: Response) {
    try {
      const files = req.files;
      const uploadedUrls: string[] = [];

      if (files && Array.isArray(files)) {
        for (const file of files) {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "blog",
            });
            uploadedUrls.push(result.secure_url);
          } catch (err) {
            console.error("Error uploading image:", err);
            return res.status(500).json({ message: "Image upload failed" });
          }
        }
      }

      const thumbnailImg = uploadedUrls[0];
      if (!thumbnailImg)
        return res.status(400).json({ message: "No thumbnail uploaded" });

      const { title, content } = req.body;
      const blog = await landingService.createBlog({
        thumbnailImg,
        title,
        content,
      });

      return res.json(blog).status(201);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async updateBlog(req: Request & any, res: Response) {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      let thumbnailImg = req.body.thumbnailImg; // fallback to existing

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        try {
          const uploaded = await cloudinary.uploader.upload(req.files[0].path, {
            folder: "blog",
          });
          thumbnailImg = uploaded.secure_url;
        } catch (err) {
          console.error("Image upload error:", err);
          return res.status(500).json({ message: "Error uploading thumbnail" });
        }
      }

      const updated = await landingService.updateBlog(Number(id), {
        thumbnailImg,
        title,
        content,
      });

      return res.json(updated).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async deleteBlog(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await landingService.deleteBlog(Number(id));
      return res.json(deleted).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  //career
  async getCareers(req: Request, res: Response) {
    try {
      const data = await landingService.getCareers();
      return res.json(data).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

async createCareer(req: Request, res: Response) {
    try {
      const { name, email, phoneNumber } = req.body;
      const files = req.files;

      console.log("Request body:", req.body);
      console.log("Files received:", files);

      // Check if files exist
      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ message: "Resume file is required" });
      }

      const resumeFile = files[0];
      console.log("Resume file details:", {
        fieldname: resumeFile?.fieldname,
        originalname: resumeFile?.originalname,
        mimetype: resumeFile?.mimetype,
        size: resumeFile?.size,
        path: resumeFile?.path,
        filename: resumeFile?.filename
      });

      // Check if the file was successfully uploaded to Cloudinary
      if (!resumeFile?.path) {
        console.error("No path found in uploaded file");
        return res.status(500).json({ message: "Resume upload failed" });
      }

      const created = await landingService.createCareer({
        name,
        email,
        phoneNumber,
        resume: resumeFile.path,
      });

      console.log("Career created successfully:", created);
      return res.status(201).json(created);
    } catch (error) {
      console.error("Error in createCareer:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
}
  //feedback
  async getFeedbacks(req: Request, res: Response) {
    try {
      const data = await landingService.getFeedbacks();
      return res.json(data).status(200);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async createFeedback(req: Request, res: Response) {
    try {
      const { fullName, phone, email, message } = req.body;
      const created = await landingService.createFeedback({
        fullName,
        phone,
        email,
        message,
      });
      return res.json(created).status(201);
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

export const landingController = new LandingController();
