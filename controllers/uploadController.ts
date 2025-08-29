import { Request, Response } from "express";
import { supabase } from "../services/supabase";
import fs from "fs";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "الرجاء رفع صورة" });
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    // رفع الصورة
    const { error } = await supabase.storage
      .from("products") // اسم الباكيت
      .upload(fileName, fs.createReadStream(file.path), {
        contentType: file.mimetype
      });

    if (error) throw error;

    // الحصول على رابط عام
    const { data: publicUrlData } = supabase
      .storage
      .from("products")
      .getPublicUrl(fileName);

    res.json({
      message: "✅ تم رفع الصورة بنجاح",
      imageUrl: publicUrlData.publicUrl
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};