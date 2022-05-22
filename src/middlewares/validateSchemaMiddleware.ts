import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import pkg from "joi-translation-pt-br";
const { messages } = pkg;

export function validateSchemaMiddleware(schema: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const validation = schema.validate(req.body, { messages });
        if (validation.error) {
            throw res.status(422).send({ error: validation.error.message });
        }

        next();
    };
}
