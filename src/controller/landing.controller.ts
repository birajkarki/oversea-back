import { Request, Response } from "express";

import { landingService, updateService } from "../service/landing.service";
import cloudinary from "../config/cloudinaryConfig";
import { prisma } from "../utils/prisma";

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

  createService = async (req: Request, res: Response) => {
    try {
      const {
        serviceType,
        heading,
        subheading,
        feature,
        benefit,
        specialization,
      } = req.body;

      console.log(feature, benefit, specialization);

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const uploadToCloudinary = async (file: Express.Multer.File) => {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "carousel",
        });
        return uploaded.secure_url;
      };

      // Upload image and image2
      const image = files.image?.[0]
        ? await uploadToCloudinary(files.image[0])
        : null;
      const image2 = files.image2?.[0]
        ? await uploadToCloudinary(files.image2[0])
        : null;
      const image3 = files.image3?.[0]
        ? await uploadToCloudinary(files.image3[0])
        : null;

      if (
        !image ||
        !image2 ||
        !serviceType ||
        !heading ||
        !subheading ||
        !image3
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Upload all miniImages
      const miniImageUrls: string[] = [];
      if (Array.isArray(files.miniImage)) {
        for (const file of files.miniImage) {
          try {
            const url = await uploadToCloudinary(file);
            miniImageUrls.push(url);
          } catch (err) {
            console.error("Error uploading miniImage:", err);
            return res
              .status(500)
              .json({ message: "Mini image upload failed" });
          }
        }
      }

      // Safe JSON parser
      const safeParse = (data: any, fallback: any[] = []) => {
        try {
          if (typeof data === "string") return JSON.parse(data.trim());
          if (Array.isArray(data)) return JSON.parse(data[0]);
          return fallback;
        } catch (err) {
          return fallback;
        }
      };
      console.log(feature);
      console.log(benefit, "e");
      const parsedFeature = JSON.parse(feature);
      console.log(parsedFeature);
      const parsedBenefit = safeParse(benefit);
      console.log(parsedBenefit);
      let parsedSpecialization = safeParse(specialization);

      if (
        !Array.isArray(parsedFeature) ||
        !Array.isArray(parsedBenefit) ||
        !Array.isArray(parsedSpecialization)
      ) {
        return res.status(400).json({
          error: "feature, benefit, and specialization must be arrays",
        });
      }

      // Attach miniImage URLs to specialization
      parsedSpecialization = parsedSpecialization.map(
        (item: any, index: number) => ({
          ...item,
          image: miniImageUrls[index] || null,
        })
      );
      parsedSpecialization = parsedSpecialization;

      // Save to DB
      const created = await landingService.createService({
        serviceType,
        heading,
        subheading,
        image,
        image2,
        image3,
        feature: parsedFeature,
        benefit: benefit,
        specialization: parsedSpecialization,
      });

      return res.status(201).json({
        success: true,
        message: "Service created successfully",
        data: created,
      });
    } catch (error: any) {
      console.error("Error creating service:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to create service.",
        message: error.message,
      });
    }
  };

  updateSpecialization = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Please provide an id" });
      }

      const { title, description } = req.body;
      console.log(title);
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      // Cloudinary uploader
      const uploadToCloudinary = async (file: Express.Multer.File) => {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "carousel",
        });
        return uploaded.secure_url;
      };

      // Handle optional image
      let image: string | undefined;
      if (files?.image?.[0]) {
        image = await uploadToCloudinary(files.image[0]);
      } else if (req.body.image) {
        image = req.body.image; // fallback to existing image passed in body
      }
      console.log(image);
      // Update record
      const updated = await prisma.specialization.update({
        where: { id: +id },
        data: {
          title,
          description,
          ...(image && { image }), // only set image if exists
        },
      });
      console.log(updated);

      return res.json(updated);
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  };

  uploadSpecialization = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Please provide an id" });
      }

      const { title, description } = req.body;
      console.log(title);
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      // Cloudinary uploader
      const uploadToCloudinary = async (file: Express.Multer.File) => {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "carousel",
        });
        return uploaded.secure_url;
      };

      // Handle optional image
      let image: any;
      if (files?.image?.[0]) {
        image = await uploadToCloudinary(files.image[0]);
      }

      const updated = await prisma.service.update({
        where: { id: +id },
        data: {
          specialization: {
            create: {
              title,
              description,
              image,
            },
          },
        },
      });

      console.log(updated);

      return res.json(updated);
    } catch (error: any) {
      console.error(error);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  };

  getServiceById = async (id: number) => {
    return await prisma.service.findUnique({
      where: { id },
    });
  };

  updateService = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        serviceType,
        heading,
        subheading,
        feature,
        benefit,
        specialization,
      } = req.body;

      // Check if service exists
      const existingService = await this.getServiceById(parseInt(id as any));
      if (!existingService) {
        return res.status(404).json({ error: "Service not found" });
      }

      console.log(feature, benefit, specialization);

      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      const uploadToCloudinary = async (file: Express.Multer.File) => {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "carousel",
        });
        return uploaded.secure_url;
      };

      // Prepare update data object
      const updateData: any = {};

      // Handle basic fields (only update if provided)
      if (serviceType !== undefined) updateData.serviceType = serviceType;
      if (heading !== undefined) updateData.heading = heading;
      if (subheading !== undefined) updateData.subheading = subheading;

      // Handle image uploads (only if new files are provided)
      if (files.image?.[0]) {
        updateData.image = await uploadToCloudinary(files.image[0]);
      }
      if (files.image2?.[0]) {
        updateData.image2 = await uploadToCloudinary(files.image2[0]);
      }
      if (files.image3?.[0]) {
        updateData.image3 = await uploadToCloudinary(files.image3[0]);
      }

      // Handle miniImages for specialization
      const miniImageUrls: string[] = [];
      if (Array.isArray(files.miniImage) && files.miniImage.length > 0) {
        for (const file of files.miniImage) {
          try {
            const url = await uploadToCloudinary(file);
            miniImageUrls.push(url);
          } catch (err) {
            console.error("Error uploading miniImage:", err);
            return res
              .status(500)
              .json({ message: "Mini image upload failed" });
          }
        }
      }

      // Safe JSON parser
      const safeParse = (data: any, fallback: any[] = []) => {
        try {
          if (typeof data === "string") return JSON.parse(data.trim());
          if (Array.isArray(data)) return JSON.parse(data[0]);
          return fallback;
        } catch (err) {
          return fallback;
        }
      };

      // Handle feature updates
      if (feature !== undefined) {
        try {
          const parsedFeature = JSON.parse(feature);
          if (Array.isArray(parsedFeature)) {
            updateData.feature = parsedFeature;
          } else {
            return res.status(400).json({ error: "feature must be an array" });
          }
        } catch (err) {
          return res.status(400).json({ error: "Invalid feature format" });
        }
      }

      // Handle benefit updates
      if (benefit !== undefined) {
        const parsedBenefit = safeParse(benefit);
        if (Array.isArray(parsedBenefit)) {
          updateData.benefit = JSON.stringify(parsedBenefit);
        } else {
          return res.status(400).json({ error: "benefit must be an array" });
        }
      }

      // Handle specialization updates
      if (specialization !== undefined) {
        let parsedSpecialization = safeParse(specialization);

        if (Array.isArray(parsedSpecialization)) {
          // If new miniImages are uploaded, attach them to specialization
          if (miniImageUrls.length > 0) {
            parsedSpecialization = parsedSpecialization.map(
              (item: any, index: number) => ({
                ...item,
                miniImage: miniImageUrls[index] || item.miniImage || null,
              })
            );
          }
          updateData.specialization = JSON.stringify(parsedSpecialization);
        } else {
          return res
            .status(400)
            .json({ error: "specialization must be an array" });
        }
      }

      console.log("Update data:", updateData);

      // Update service in database
      const updatedService = await updateService(
        parseInt(id as any),
        updateData
      );

      return res.status(200).json({
        success: true,
        message: "Service updated successfully",
        data: updatedService,
      });
    } catch (error: any) {
      console.error("Error updating service:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to update service.",
        message: error.message,
      });
    }
  };

  deleteSpecialization = async (req: Request, res: Response) => {
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

      const deleted = await prisma.specialization.delete({
        where: { id: +id },
      });
      return res.json({ message: "Specialization deleted", deleted });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete specialization." });
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
        filename: resumeFile?.filename,
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

  async reorderBanner(req: Request, res: Response) {
    try {
      const orderData = req.body; // Array of {id: number, order: number}
      // Validate the request body
      if (!Array.isArray(orderData)) {
        return res.status(400).json({
          success: false,
          message: "Invalid request format. Expected an array of order data.",
        });
      }

      // Validate each item in the array
      for (const item of orderData) {
        if (!item.id || typeof item.order !== "number") {
          return res.status(400).json({
            success: false,
            message: "Each item must have an 'id' and 'order' field.",
          });
        }
      }

      // Use a transaction to ensure all updates succeed or fail together
      const updatedBanners = await prisma.$transaction(
        orderData.map((item: { id: number; order: number }) =>
          prisma.carousel.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );

      return res.status(200).json({
        success: true,
        message: "Banner order updated successfully",
        data: updatedBanners,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while updating Banner order",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  async reorder(req: Request, res: Response) {
    try {
      const orderData = req.body; // Array of {id: number, order: number}
      // Validate the request body
      if (!Array.isArray(orderData)) {
        return res.status(400).json({
          success: false,
          message: "Invalid request format. Expected an array of order data.",
        });
      }

      // Validate each item in the array
      for (const item of orderData) {
        if (!item.id || typeof item.order !== "number") {
          return res.status(400).json({
            success: false,
            message: "Each item must have an 'id' and 'order' field.",
          });
        }
      }

      // Use a transaction to ensure all updates succeed or fail together
      const updatedTeamMembers = await prisma.$transaction(
        orderData.map((item: { id: number; order: number }) =>
          prisma.team.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );

      return res.status(200).json({
        success: true,
        message: "Team order updated successfully",
        data: updatedTeamMembers,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while updating team order",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }


  // Advertisement
  async getAllAdvertisement(req: Request, res: Response) {
    try {
      const advertisements =await prisma.advertisement.findMany({
        include:{
          Service:true
        }
      });
      return res.status(200).json({
        success: true,
        message: "Advertisement retrieved successfully",
        data: advertisements,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while retrieving advertisements",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  async postAdvertisement(req: Request, res: Response) {
    try {
      const {title,serviceId}=req.body;
      const file = req.file;
      console.log(file)
      if (!file) {
        return res.status(400).json({ message: "Advertisement file is required" });
      }
      const image = file;
      if (!image?.path) {
        console.error("No path found in uploaded file");
        return res.status(500).json({ message: "Advertisement upload failed" });
      }
      const advertisement = await prisma.advertisement.create({
        data: {
          title,
          serviceId: +serviceId,
          image: image.path
        }
      })
      return res.status(201).json({
        success: true,
        message: "Advertisement posted successfully",
        data: advertisement,
      }); 
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while posting advertisement",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  async deleteAdvertisement(req: Request, res: Response) {
    try {
      const id = req.body.id;
      if (!id) {
        return res.status(400).json({ message: "Advertisement ID is required" });
      }

      const deletedAdvertisement = await prisma.advertisement.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "Advertisement deleted successfully",
        data: deletedAdvertisement,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while deleting advertisement",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }
  async getAdvertisementById(req: Request, res: Response) {
    try {
      
      const id = +req.body.id;
      if (!id) {
        return res.status(400).json({ message: "Advertisement ID is required" });
      }

      const advertisement = await prisma.advertisement.findFirst({
        where: { id },
      });

      if (!advertisement) {
        return res.status(404).json({ message: "Advertisement not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Advertisement retrieved successfully",
        data: advertisement,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error while retrieving advertisement",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const created = await landingService.register({
        name,

        email,
        password,
      });
      return res.json(created).status(201);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const created = await landingService.login({
        email,
        password,
      });

      const token = created.token;
      if (token) {
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // only send over HTTPS
          sameSite: "strict",
          maxAge: 60 * 60 * 1000,
        });
      }

      return res.json({ ...created, token }).status(201);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async postEmployer(req: Request, res: Response) {
    try {
      const { companyName, contactPerson, email, phoneNumber, jobTitle, location, requirements, industry, urgency } = req.body;

      const employer = await prisma.employer.create({
        data: {
          companyName,
          contactPerson,
          email,
          phoneNumber,
          jobTitle,
          location,
          requirements,
          industry,
          urgency
        }
      });

      return res.status(201).json({
        success: true,
        message: "Employer posted successfully",
        data: employer
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async getEmployer(req: Request, res: Response) {
    try {
      const employers = await prisma.employer.findMany({
        orderBy:{
          createdAt:"desc"
        }
      });
      return res.status(200).json({
        success: true,
        message: "Employers retrieved successfully",
        data: employers
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }}


export const landingController = new LandingController();
