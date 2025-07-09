import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'user_images', 
      allowed_formats: ['jpg', 'jpeg', 'png'],
    } as any, 
  });
  

const upload = multer({ storage });

export default upload;
