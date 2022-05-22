import { Request, Response } from "express";
import * as authService from "../services/authService.js";

export async function signUp(req: Request, res: Response) {
    await authService.signUp(req.body);

    return res.sendStatus(201);
}

export async function signIn(req: Request, res: Response) {
    const token = await authService.signIn(req.body);

    return res.status(200).send(token);
}

export async function checkToken(req: Request, res: Response) {
    const { user } = res.locals;

    return res.status(200).send({
        isAdmin: user.email === process.env.ADMIN_EMAIL,
        name: user.name,
        email: user.email,
        phone: user.phone,
    });
}
