import fs from "node:fs";
import path from "node:path";
import {v4 as uuidv4} from "uuid";

export class ImageService {
    async upload(file) {
        const uploadDir = path.join(process.cwd(), "uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        const newFilePath = path.join(uploadDir, filename);

        fs.renameSync(file.path, newFilePath);
        return `/uploads/${filename}`;
    }
}
