import { stripHtml } from "string-strip-html";
import * as hashRepository from "../repositories/hashRepository.js";
import * as userRepository from "../repositories/userRepository.js";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import nodemailer from "nodemailer";

export interface ResetPasswordData {
  password: string;
  passwordConfirmation: string;
}

export async function reset(body: ResetPasswordData, hash: string) {
  const { password, passwordConfirmation } = {
    password: strip(body.password),
    passwordConfirmation: strip(body.passwordConfirmation),
  };

  if (password !== passwordConfirmation) {
    throw { type: "conflict", message: "As senhas não coincidem" };
  }

  const { email } = await validateHash(hash);
  const encryptedPassword = encryptPassword(password);

  await userRepository.changePassword(email, encryptedPassword);

  setTimeout(async () => await hashRepository.remove(hash), 10000);

  return;
}

export async function generateUrl(email: string) {
  const stripEmail = strip(email);

  const hash = uuid();
  const expireDate = dayjs().add(1, "day").toDate();
  const user = await userRepository.findByEmail(stripEmail);

  if (user) {
    await hashRepository.create(hash, email, expireDate);
    await sendEmail(`http://localhost:3000/${hash}`, stripEmail);
  }

  return;
}

export async function validateHash(hash: string) {
  const stripHash = strip(hash);

  const hashData = await hashRepository.getByUuid(stripHash);
  if (!hashData) throw { type: "bad_request", message: "Url inválida" };

  if (dateExpired(hashData.expireDate)) {
    await hashRepository.remove(hashData.uuid);
    throw { type: "bad_request", message: "Url inválida" };
  }

  return hashData;
}

async function sendEmail(url: string, email: string) {
  const EMAIL_SENDER = process.env.SEND_MESSAGES_EMAIL;
  const APP_PASSWORD = process.env.SEND_MESSAGES_APP_PASSWORD;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_SENDER,
      pass: APP_PASSWORD,
    },
  });

  const options = {
    from: EMAIL_SENDER,
    to: email,
    subject: "Redefinição de senha",
    text: url,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) return console.log(err);
    return;
  });
}

function encryptPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

function dateExpired(date: Date) {
  return dayjs().isAfter(dayjs(date));
}

function strip(string: string) {
  return stripHtml(string).result.trim();
}
