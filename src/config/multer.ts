import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinaryConfig';
import path from 'path';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname); // e.g., '.pdf'
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, ''); // sanitize filename

    // Detect file type for Cloudinary resource_type
    const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype);
    const isDoc = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(file.mimetype);

    // Set proper extension (without dot)
    const cleanExt = ext.replace('.', '');

   return {
  folder: 'user_images',
  public_id: `${baseName}.${cleanExt}`,
  resource_type: isImage ? 'image' : isDoc ? 'raw' : 'auto',
  use_filename: true,
  unique_filename: false,
  access_mode: 'public',
  allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
  transformation: !isImage ? [{ flags: 'attachment' }] : undefined, // force download for docs
};

  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only JPG, PNG, PDF, DOC, and DOCX files are allowed.'
        )
      );
    }
  },
});

export default upload;
