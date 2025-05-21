export class PermissionSeeder {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
        this.permissions = [
            {action: "create_user", description: 'Create a user'},
            {action: "read_user", description: 'Read user information'},
            {action: "update_user", description: 'Update user information'},
            {action: "delete_user", description: 'Delete a user'},
            {action: "set_role", description: 'Set user role'},
        ];
    }

    async seed() {
        await this.permissionRepository.deleteAll();
        return await this.permissionRepository.insertMany(this.permissions);
    }
}
