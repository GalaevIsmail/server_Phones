import { Router } from "express";

import ProductController from "../controllers/ProductController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", ProductController.GetAll)
router.post("/create", auth.authUser,  ProductController.Create);
router.put("/updates/:id", auth.authUser , ProductController.update)
router.delete("/delete/:id", auth.authUser, ProductController.delet)

export default router;
