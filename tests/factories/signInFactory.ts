import { faker } from "@faker-js/faker";
import { db } from "../../src/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export async function generateValidToken() {
    const { name, email, phone } = await signIn();

    const secretKey = process.env.JWT_SECRET;

    return jwt.sign(
        {
            data: { name, email, phone },
        },
        secretKey,
        {
            expiresIn: 60 * 24 * 60 * 60,
        }
    );
}

export async function signInAdmin() {
    const name = faker.name.firstName();
    const email = process.env.ADMIN_EMAIL;
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

export async function generateAdminToken() {
    const { name, email, phone } = await signInAdmin();

    const secretKey = process.env.JWT_SECRET;

    return jwt.sign(
        {
            data: { name, email, phone },
        },
        secretKey,
        {
            expiresIn: 60 * 24 * 60 * 60,
        }
    );
}
