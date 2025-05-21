export class RoleSeeder {
    constructor(roleRepository, permissionMap) {
        this.roleRepository = roleRepository;
        this.permissionMap = permissionMap;
    }

    async seed() {
        try {
            await this.roleRepository.deleteAll();

            const roles = [
                {
                    name: "super_admin",
                    permissions: Object.values(this.permissionMap)
                },
                {
                    name: "admin",
                    permissions: [
                        this.permissionMap['create_user'],
                        this.permissionMap['read_user'],
                        this.permissionMap['update_user'],
                    ]
                },
                {
                    name: "user",
                    permissions: [
                        this.permissionMap["read_user"],
                        this.permissionMap["update_user"],
                    ]
                }
            ];

            const inserted = await this.roleRepository.insertMany(roles);
            const roleMap = {};
            inserted.forEach(role => roleMap[role.name] = role);
            return roleMap;
        } catch (error) {
            console.error("Failed to seed roles:", error);
            throw error;
        }
    }
}
