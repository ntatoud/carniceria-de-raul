import { Request } from 'express';
import multer, { diskStorage } from 'multer';
import dotenv from 'dotenv';

dotenv.config();
const storage = diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    callback(null, 'public/assets/images/products/');
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    callback(null, file.originalname);
  },
});
('public/assets/images/products/');
export const upload = multer({ storage: storage });
