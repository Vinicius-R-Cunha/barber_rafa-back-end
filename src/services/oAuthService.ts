import * as userRepository from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import { stripHtml } from "string-strip-html";

export interface oAuthData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type TokenData = Omit<oAuthData, "id">;

export async function handleOAuth(body: oAuthData, oAuthType: string) {
  const { id, name, email, phone } = {
    id: strip(body.id),
    name: strip(body.name),
    email: strip(body.email),
    phone: strip(body.phone),
  };

  let token: string;
  const user = await userRepository.findByEmail(email);

  if (!user) {
    if (oAuthType === "facebook") {
      await userRepository.createNewFacebookUser(id, name, email, phone);
    } else if (oAuthType === "google") {
      await userRepository.createNewGoogleUser(id, name, email, phone);
    } else {
      throw { type: "bad_request", message: "Tipo de login inválido" };
    }

    token = generateToken({ name, email, phone });

    return { token, newUser: true };
  }

  if (!user.facebookId && !user.googleId) {
    throw {
      type: "conflict",
      message:
        "Já existe uma conta associada à esse email, tente fazer login normalmente!",
    };
  }

  token = generateToken({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  if (user.phone.length < 15) return { token, newUser: true };

  return { token, newUser: false };
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
