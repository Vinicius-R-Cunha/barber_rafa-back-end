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

categoryRouter.get("/categories", categoryController.get);

categoryRouter.delete(
    "/categories/:categoryTitle",
    validateTokenMiddleware,
    categoryController.deleteEmpty
);

categoryRouter.put(
    "/categories/:categoryTitle",
    validateSchemaMiddleware(categorySchema),
    validateTokenMiddleware,
    categoryController.edit
);

export default categoryRouter;
