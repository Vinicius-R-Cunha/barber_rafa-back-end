import { Router } from "express";
import * as categoryController from "../controllers/categoryController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import validateAdminMiddleware from "../middlewares/validateAdminMiddleware.js";
import categorySchema from "../schemas/categorySchema.js";

const categoryRouter = Router();

categoryRouter.post(
    "/categories",
    validateSchemaMiddleware(categorySchema),
    validateAdminMiddleware,
    categoryController.create
);

categoryRouter.get("/categories", categoryController.get);

categoryRouter.delete(
    "/categories/:categoryTitle",
    validateAdminMiddleware,
    categoryController.deleteEmpty
);

categoryRouter.put(
    "/categories/:categoryTitle",
    validateSchemaMiddleware(categorySchema),
    validateAdminMiddleware,
    categoryController.edit
);

export default categoryRouter;
