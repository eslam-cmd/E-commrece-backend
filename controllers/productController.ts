import { supabase } from "../services/supabase";
import { Request, Response } from "express";

const BUCKET_NAME = "image"; // غيّر لاسم الباكيت عندك

// 📌 جلب المنتجات (مع إمكانية التصفية حسب القسم)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const section = req.query.section as string | undefined;

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (section) {
      query = query.eq("section", section);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 إضافة منتج جديد
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, section, price, category } = req.body;
    let imageUrl: string | null = null;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase()}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error(uploadError);
        return res.status(500).json({ error: uploadError.message });
      }

      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      imageUrl = publicData.publicUrl;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        { title, description, section, price, category, image_url: imageUrl },
      ])
      .select("*");

    if (error) return res.status(500).json({ error: error.message });

    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 تعديل منتج
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const {
      title,
      description,
      section,
      price,
      category,
      image_url: oldImage,
    } = req.body;

    let imageUrl = oldImage;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname.replace(
        /\s+/g,
        "-"
      )}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error(uploadError);
        return res.status(500).json({ error: uploadError.message });
      }

      const { data: publicData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

      imageUrl = publicData.publicUrl;
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        title,
        description,
        section,
        price,
        category,
        image_url: imageUrl,
      })
      .eq("id", id)
      .select("*");

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 حذف منتج
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
