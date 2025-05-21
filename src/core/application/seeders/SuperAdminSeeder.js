export class SuperAdminSeeder {
    constructor(userRepository, passwordHasher, superAdminData, role) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.superAdminData = superAdminData;
        this.role = role;
    }

    async seed() {
        const existing = await this.userRepository.findByEmail(this.superAdminData.email);
        if (existing) return;

        const hashedPassword = await this.passwordHasher.hash(this.superAdminData.password, 10);
        const user = {
            ...this.superAdminData,
            password: hashedPassword,
            roleId: this.role.id
        };

        const created = await this.userRepository.saveAdmin(user);
        console.log(`✅ Super Admin created: ${created.email}`);
        return created;
    }
}
