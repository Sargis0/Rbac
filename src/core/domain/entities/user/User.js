export class User {
    name;
    surname;
    phone_number;
    email;
    password;
    role;

    constructor(model) {
        this.name = model.name;
        this.surname = model.surname;
        this.phone_number = model.phone_number;
        this.email = model.email;
        this.password = model.password
        this.role = model.role
    }
}
