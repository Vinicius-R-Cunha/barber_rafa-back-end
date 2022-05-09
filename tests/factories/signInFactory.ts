import { faker } from "@faker-js/faker";
import { db } from "../../src/database.js";
import bcrypt from "bcrypt";

type MissingDataSignIn = "email" | "password";

export function signInBody(missing?: MissingDataSignIn) {
    const email = faker.internet.email();
    const password = faker.internet.password();

    if (missing === "email") {
        return {
            password,
        };
    } else if (missing === "password") {
        return {
            email,
        };
    } else {
        return {
            email,
            password,
        };
    }
}

export async function signIn() {
    const name = faker.name.firstName();
    const email = faker.internet.email();
    const phone = faker.phone.phoneNumber("11 9####-####");
    const password = faker.internet.password();
    const encryptedPassword = bcrypt.hashSync(password, 10);

    await db
        .collection("users")
        .insertOne({ name, email, phone, password: encryptedPassword });

    return {
        name,
        email,
        phone,
        password,
    };
}
