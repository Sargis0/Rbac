export class UserResponseDto {
    constructor(model) {
        if (Array.isArray(model)) {
            return model.map(user => ({
                name: user.name,
                surname: user.surname,
                phone_number: user.phone_number,
                email: user.email,
                role: user.role.name,
                permissions: user.role.permissions.map(p => p.description),
            }));
        }
        return [];
    }
}
