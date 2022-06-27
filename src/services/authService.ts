import * as userRepository from "../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { stripHtml } from "string-strip-html";

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export type SignInData = Omit<SignUpData, "name" | "phone">;

export type TokenData = Omit<SignUpData, "password">;

export async function signUp(body: SignUpData) {
  const bodyStrip = {
    name: strip(body.name),
    email: strip(body.email),
    phone: strip(body.phone),
    password: strip(body.password),
  };
  const { name, email, phone, password } = bodyStrip;

  await checkIfEmailExists(email);
  const encryptedPassword = encryptPassword(password);

  await userRepository.createNewUser(name, email, phone, encryptedPassword);

  return;
}

export async function signIn(body: SignInData) {
  const bodyStrip = {
    email: strip(body.email),
    password: strip(body.password),
  };
  const { email, password } = bodyStrip;

  const user = await validateLogin(email, password);
  return generateToken({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
}

async function checkIfEmailExists(email: string) {
  const user = await userRepository.findByEmail(email);

  if (user) {
    throw { type: "conflict", message: "Esse email já está em uso" };
  }
}

function encryptPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

async function validateLogin(email: string, password: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw { type: "conflict", message: "email e/ou senha incorretos" };

  validatePassword(user, password);

  return user;
}

function validatePassword(user: any, password: string) {
  if (!bcrypt.compareSync(password, user.password)) {
    throw { type: "conflict", message: "email e/ou senha incorretos" };
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

function strip(string: string) {
  return stripHtml(string).result.trim();
}
