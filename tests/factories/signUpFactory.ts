import { faker } from "@faker-js/faker";

export function signUpBody(missing?: string) {
    if (missing === "name") {
        const password = faker.internet.password();
        return {
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber("11 9####-####"),
            password,
            passwordConfirmation: password,
        };
    }
}
