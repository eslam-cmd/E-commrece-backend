"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProducts = void 0;
const supabase_1 = require("../services/supabase");
const BUCKET_NAME = "image"; // غيّر لاسم الباكيت عندك
// 📌 جلب المنتجات (مع إمكانية التصفية حسب القسم)
const getProducts = async (req, res) => {
    try {
        const section = req.query.section;
        let query = supabase_1.supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });
        if (section) {
            query = query.eq("section", section);
        }
        const { data, error } = await query;
        if (error)
            return res.status(500).json({ error: error.message });
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getProducts = getProducts;
// 📌 إضافة منتج جديد
const addProduct = async (req, res) => {
    try {
        const { title, description, section, price, category } = req.body;
        let imageUrl = null;
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname
                .trim()
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .toLowerCase()}`;
            const { error: uploadError } = await supabase_1.supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
            });
            if (uploadError) {
                console.error(uploadError);
                return res.status(500).json({ error: uploadError.message });
            }
            const { data: publicData } = supabase_1.supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);
            imageUrl = publicData.publicUrl;
        }
        const { data, error } = await supabase_1.supabase
            .from("products")
            .insert([
            { title, description, section, price, category, image_url: imageUrl },
        ])
            .select("*");
        if (error)
            return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addProduct = addProduct;
// 📌 تعديل منتج
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, section, price, category, image_url: oldImage, } = req.body;
        let imageUrl = oldImage;
        if (req.file) {
            const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
            const { error: uploadError } = await supabase_1.supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
            });
            if (uploadError) {
                console.error(uploadError);
                return res.status(500).json({ error: uploadError.message });
            }
            const { data: publicData } = supabase_1.supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);
            imageUrl = publicData.publicUrl;
        }
        const { data, error } = await supabase_1.supabase
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
        if (error)
            return res.status(500).json({ error: error.message });
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateProduct = updateProduct;
// 📌 حذف منتج
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { error } = await supabase_1.supabase.from("products").delete().eq("id", id);
        if (error)
            return res.status(500).json({ error: error.message });
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteProduct = deleteProduct;
