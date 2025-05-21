export class IPasswordRepository {
    async hash(password, s) {
        throw new Error("Method not implemented.");
    }

    async compare(password, hashedPassword) {
        throw new Error("Method not implemented.");
    }
}
