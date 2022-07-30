import * as userRepository from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import { stripHtml } from "string-strip-html";
import { SignUpData, TokenData } from "./authService.js";

export type UpdateUserData = Partial<Omit<SignUpData, "password">>;
type Types = "name" | "email" | "phone";

export async function updateUserData(
  email: string,
  body: UpdateUserData,
  type: Types
) {
  if (type === "name") {
    const name = strip(body.name);
    await userRepository.changeName(email, name);

    const user = await userRepository.findByEmail(email);
    return generateToken({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  }

  if (type === "phone") {
    const phone = strip(body.phone);
    await userRepository.changePhone(email, phone);

    const user = await userRepository.findByEmail(email);
    return generateToken({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  }

  if (type === "email") {
    const newEmail = strip(body.email);

    const emailIsTaken = await userRepository.findByEmail(newEmail);
    if (emailIsTaken) {
      throw { type: "conflict", message: "Esse email já está em uso" };
    }

    await userRepository.changeEmail(email, newEmail);

    const user = await userRepository.findByEmail(newEmail);
    return generateToken({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  }

  throw { type: "conflict", message: "Tipo de dado inválido" };
}

export async function removeUser(email: string) {
  if (email !== process.env.ADMIN_EMAIL) {
    await userRepository.removeUser(email);
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
