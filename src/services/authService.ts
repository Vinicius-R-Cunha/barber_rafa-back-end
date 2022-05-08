import * as userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface SignUpData {
    name: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirmation: string;
}

export type SignInData = Omit<
    SignUpData,
    "name" | "phone" | "passwordConfirmation"
>;

export type User = Omit<SignUpData, "passwordConfirmation">;

export type TokenData = Omit<SignUpData, "password" | "passwordConfirmation">;

export async function signUp(body: SignUpData) {
    const { name, email, phone, password, passwordConfirmation } = body;

    checkIfPasswordsMatch(password, passwordConfirmation);
    await checkIfEmailExists(email);
    const encryptedPassword = encryptPassword(password);

    await userRepository.createNewUser(name, email, phone, encryptedPassword);

    return;
}

export async function signIn(body: SignInData) {
    const { email, password } = body;

    const user = await validateLogin(email, password);
    return generateToken({
        name: user.name,
        email: user.email,
        phone: user.phone,
    });
}

function checkIfPasswordsMatch(password: string, passwordConfirmation: string) {
    if (password !== passwordConfirmation) {
        throw { type: "conflict", message: "passwords do not match" };
    }
    return;
}

async function checkIfEmailExists(email: string) {
    const user = await userRepository.findByEmail(email);

    if (user) {
        throw { type: "conflict", message: "email already exists" };
    }
}

function encryptPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}

async function validateLogin(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw { type: "conflict", message: "incorrect email/password" };

    validatePassword(user, password);

    return user;
}

function validatePassword(user: any, password: string) {
    if (!bcrypt.compareSync(password, user.password)) {
        throw { type: "conflict", message: "incorrect email/password" };
    }
}

function generateToken(data: TokenData) {
    const secretKey = process.env.JWT_SECRET;

    return jwt.sign(
        {
            data,
        },
        secretKey,
        {
            expiresIn: 60 * 24 * 60 * 60,
        }
    );
}
