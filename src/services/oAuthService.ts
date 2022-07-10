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
  const bodyStrip = {
    id: strip(body.id),
    name: strip(body.name),
    email: strip(body.email),
    phone: strip(body.phone),
  };
  if (oAuthType === "facebook") {
    let token: string;

    const user = await userRepository.findByFacebookId(bodyStrip.id);
    if (!user) {
      await userRepository.createNewFacebookUser(
        bodyStrip.id,
        bodyStrip.name,
        bodyStrip.email,
        bodyStrip.phone
      );

      token = generateToken({
        name: bodyStrip.name,
        email: bodyStrip.email,
        phone: bodyStrip.phone,
      });

      return { token, newUser: true };
    }

    token = generateToken({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });

    if (user.phone.length < 15) return { token, newUser: true };

    return { token, newUser: false };
  }

  return;
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
