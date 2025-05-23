export class CreateUserDto {
    constructor(dto) {
        this.name = dto.name;
        this.surname = dto.surname;
        this.phone_number = dto.phone_number;
        this.email = dto.email;
        this.password = dto.password;
        this.role = dto.role;
    }
}
