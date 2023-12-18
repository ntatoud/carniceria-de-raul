import multer, { diskStorage } from 'multer';
import { databaseConnect } from '.';
const storage = diskStorage({
    destination: (req, file, callback) => {
        callback(null, `./public/assets/images/products/`);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    },
});
export const upload = multer({ storage: storage });
export const storeImageInDb = (path, res) => {
    const connection = databaseConnect();
    connection.query(`INSERT INTO products (name, price, stock, sale, salePrice, image, description) 
      VALUES ('Product BLOB', 29.99, 100, true, 19.99, '${path}', 'Long description for Product A');`, (error) => {
        if (error) {
            console.error('Error inserting image into database:', error);
            connection.end();
            res.status(500).send('Internal Server Error');
        }
        res.status(200).send('OK');
    });
};
