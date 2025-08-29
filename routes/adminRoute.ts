import express from "express";
import { signup, login } from "../controllers/authController";
import { adminLogin } from "../controllers/adminController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/admin_login", adminLogin);

export default router;
