import { Router } from "express";
import authRouter from "./authRouter.js";
import categoryRouter from "./categoryRouter.js";

const router = Router();
router.use(authRouter);
router.use(categoryRouter);

export default router;
