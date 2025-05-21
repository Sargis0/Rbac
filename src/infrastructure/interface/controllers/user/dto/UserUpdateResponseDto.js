export class UserUpdateResponseDto {
    name;
    surname;
    phone_number;
    email;
    role;

    constructor(model) {
        this.name = model.name;
        this.surname = model.surname;
        this.phone_number = model.phone_number;
        this.email = model.email;
        this.role = model.role.name;
    }
}
