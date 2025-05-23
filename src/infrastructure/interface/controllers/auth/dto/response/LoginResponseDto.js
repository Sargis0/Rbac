export class LoginResponseDto {
    name;
    surname;
    phoneNumber;
    email;
    role;
    permissions;
    accessToken;

    constructor(model, accessToken) {
        this.name = model.name;
        this.surname = model.surname;
        this.phoneNumber = model.phone_number || "";
        this.email = model.email;
        this.role = model.role.name;
        this.permissions = model.role.permissions.map(permission => permission.description);
        this.accessToken = accessToken;
    }
}
