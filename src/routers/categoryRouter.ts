import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import validateTokenMiddleware from "../middlewares/validateTokenMiddleware.js";
import categorySchema from "../schemas/categorySchema.js";

const categoryRouter = Router();

categoryRouter.post(
    "/categories",
    validateSchemaMiddleware(categorySchema),
    validateTokenMiddleware,
    categoryController.create
);

categoryRouter.get(
    "/categories",
    validateTokenMiddleware,
    categoryController.get
);

categoryRouter.delete(
    "/categories/:categoryTitle",
    validateTokenMiddleware,
    categoryController.deleteEmpty
);

export default categoryRouter;
