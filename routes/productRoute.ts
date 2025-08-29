import express from "express";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController";
import { upload } from "../middleware/upload";

const router = express.Router();

// جلب المنتجات
router.get("/", getProducts);

// إضافة منتج مع رفع صورة
router.post("/", upload.single("image"), addProduct);

// تعديل منتج مع رفع صورة جديدة (اختياري)
router.put("/:id", upload.single("image"), updateProduct);

// حذف منتج
router.delete("/:id", deleteProduct);

export default router;
