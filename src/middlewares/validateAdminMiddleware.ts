import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/userRepository.js";

export default async function validateAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw { type: "unauthorized", message: "Token inválido" };
  }

  const tokenData = getTokenData(token);
  await getUser(tokenData);

  next();
}

function getTokenData(token: string) {
  let tokenData: jwt.JwtPayload;
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.log(error);
      throw { type: "unauthorized", message: "Token inválido" };
    }
    tokenData = decoded as jwt.JwtPayload;
  });
  return tokenData;
}

async function getUser(tokenData: jwt.JwtPayload) {
  const user = await userRepository.findByEmail(tokenData?.data?.email);

  if (!user) {
    throw { type: "bad_request", message: "usuário não encontrado" };
  }

  if (user.email !== process.env.ADMIN_EMAIL) {
    throw { type: "unauthorized", message: "Token inválido" };
  }

  return user;
}
