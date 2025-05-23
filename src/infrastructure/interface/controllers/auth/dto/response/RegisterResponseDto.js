export class RegisterResponseDto {
    name;
    surname;
    email;

    constructor(model) {
        this.name = model.name;
        this.surname = model.surname;
        this.email = model.email;
    }
}
