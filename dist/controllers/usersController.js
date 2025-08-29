"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAuthUsers = fetchAuthUsers;
exports.removeAuthUser = removeAuthUser;
exports.updateAuthUser = updateAuthUser;
const supabase_js_1 = require("@supabase/supabase-js");
// الاتصال بـ Supabase باستخدام مفتاح الخدمة
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// عرض المستخدمين
async function fetchAuthUsers(req, res) {
    try {
        const { data, error } = await supabase.auth.admin.listUsers({
            perPage: 100,
        });
        if (error)
            throw error;
        const users = data.users.map((user) => ({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "غير محدد",
        }));
        res.json(users);
    }
    catch (err) {
        console.error("خطأ في جلب المستخدمين:", err);
        res.status(500).json({ error: "فشل في عرض المستخدمين" });
    }
}
// حذف مستخدم
async function removeAuthUser(req, res) {
    try {
        const { id } = req.params;
        const { error } = await supabase.auth.admin.deleteUser(id);
        if (error)
            throw error;
        res.json({ message: "✅ تم حذف المستخدم بنجاح" });
    }
    catch (err) {
        console.error("خطأ في حذف المستخدم:", err);
        res.status(500).json({ error: "فشل في حذف المستخدم" });
    }
}
// تعديل مستخدم
async function updateAuthUser(req, res) {
    try {
        const { id } = req.params;
        const { full_name, email } = req.body;
        const { data, error } = await supabase.auth.admin.updateUserById(id, {
            email,
            user_metadata: { full_name },
        });
        if (error)
            throw error;
        res.json({
            message: "✅ تم تعديل المستخدم بنجاح",
            user: {
                id: data?.user?.id,
                email: data?.user?.email,
                full_name: data?.user?.user_metadata?.full_name || "غير محدد",
            },
        });
    }
    catch (err) {
        console.error("خطأ في تعديل المستخدم:", err);
        res.status(500).json({ error: "فشل في تعديل المستخدم" });
    }
}
