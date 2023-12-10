import { Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { databaseConnect } from '.';
import { QueryError } from 'mysql2';

const storage = diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void
    ) => {
        callback(null, `./public/assets/images/products/`);
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, destination: string) => void
    ) => {
        callback(null, file.originalname);
    },
});

export const upload = multer({ storage: storage });

export const storeImageInDb = (path: string, res: Response) => {
    const connection = databaseConnect();

    connection.query(
        `INSERT INTO products (name, price, stock, sale, salePrice, image, description) 
      VALUES ('Product BLOB', 29.99, 100, true, 19.99, '${path}', 'Long description for Product A');`,
        (error: QueryError) => {
            if (error) {
                console.error('Error inserting image into database:', error);
                connection.end();
                res.status(500).send('Internal Server Error');
            }
            res.status(200).send('OK');
        }
    );
};
