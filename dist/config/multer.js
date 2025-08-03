"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinaryConfig_1 = __importDefault(require("./cloudinaryConfig"));
const path_1 = __importDefault(require("path"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinaryConfig_1.default,
    params: async (req, file) => {
        const ext = path_1.default.extname(file.originalname);
        const baseName = path_1.default
            .basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, '');
        const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype);
        const isDoc = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.mimetype);
        const cleanExt = ext.replace('.', '');
        return {
            folder: 'user_images',
            public_id: `${baseName}.${cleanExt}`,
            resource_type: isImage ? 'image' : isDoc ? 'raw' : 'auto',
            use_filename: true,
            unique_filename: false,
            access_mode: 'public',
            allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
            transformation: !isImage ? [{ flags: 'attachment' }] : undefined,
        };
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
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
        }
        else {
            cb(new Error('Invalid file type. Only JPG, PNG, PDF, DOC, and DOCX files are allowed.'));
        }
    },
});
exports.default = upload;
//# sourceMappingURL=multer.js.map