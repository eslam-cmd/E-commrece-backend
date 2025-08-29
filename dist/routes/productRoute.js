"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// جلب المنتجات
router.get("/", productController_1.getProducts);
// إضافة منتج مع رفع صورة
router.post("/", upload_1.upload.single("image"), productController_1.addProduct);
// تعديل منتج مع رفع صورة جديدة (اختياري)
router.put("/:id", upload_1.upload.single("image"), productController_1.updateProduct);
// حذف منتج
router.delete("/:id", productController_1.deleteProduct);
exports.default = router;
