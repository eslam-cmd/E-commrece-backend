"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const supabase_1 = require("../services/supabase");
const fs_1 = __importDefault(require("fs"));
const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "الرجاء رفع صورة" });
        }
        const fileName = `${Date.now()}-${file.originalname}`;
        // رفع الصورة
        const { error } = await supabase_1.supabase.storage
            .from("products") // اسم الباكيت
            .upload(fileName, fs_1.default.createReadStream(file.path), {
            contentType: file.mimetype
        });
        if (error)
            throw error;
        // الحصول على رابط عام
        const { data: publicUrlData } = supabase_1.supabase
            .storage
            .from("products")
            .getPublicUrl(fileName);
        res.json({
            message: "✅ تم رفع الصورة بنجاح",
            imageUrl: publicUrlData.publicUrl
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.uploadImage = uploadImage;
