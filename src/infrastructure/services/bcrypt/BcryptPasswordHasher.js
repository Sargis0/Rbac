import bcrypt from "bcryptjs";
import {IPasswordRepository} from "../../../core/domain/repositories/bcrypt/IPasswordRepository.js";

export class BcryptPasswordHash extends IPasswordRepository {
    async hash(password, s) {
        const salt = await bcrypt.genSalt(s);
        return await bcrypt.hash(password, salt);
    }

    async compare(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}
