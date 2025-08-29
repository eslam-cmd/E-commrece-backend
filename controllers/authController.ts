// 📦 authController.ts
import { Request, Response } from "express";
import { supabase } from "../services/supabase";

// 📥 signup - save
export const signup = async (req: Request, res: Response) => {
  const { email, password, fullName, avatarUrl } = req.body;

  try {
    // ✅ 1. إنشاء المستخدم
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (userError || !userData?.user?.id) {
      return res.status(400).json({
        error: "فشل إنشاء المستخدم",
        details: userError?.message,
      });
    }

    const userId = userData.user.id;

    // ✅ 2. إضافة الاسم والصورة إلى user_metadata
    const { error: metaError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        full_name: fullName,
        avatar_url: avatarUrl || null,
      },
    });

    if (metaError) {
      return res.status(500).json({
        error: "تم إنشاء المستخدم لكن فشل حفظ البيانات الإضافية",
        details: metaError.message,
      });
    }

    return res.status(201).json({
      message: "✅ تم إنشاء المستخدم بنجاح",
      userId,
    });
  } catch (err) {
    return res.status(500).json({
      error: "حدث خطأ غير متوقع أثناء التسجيل",
      details: (err as Error).message,
    });
  }
};

// 🔑 login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // ✅ تجربة تسجيل الدخول
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      if (signInError.message.includes("Invalid login credentials")) {
        return res.status(401).json({
          error: "📛 البريد أو كلمة المرور غير صحيحة",
        });
      }
      return res.status(404).json({
        error: "🕵️‍♂️ الحساب غير موجود أو غير مفعل",
      });
    }

    const user = signInData.user;
    const fullName = user.user_metadata?.full_name || "بدون اسم";
    const avatarUrl = user.user_metadata?.avatar_url || null;

    return res.status(200).json({
      message: "✅ تم تسجيل الدخول بنجاح",
      user: {
        id: user.id,
        email: user.email,
        fullName,
        avatarUrl,
      },
    });
  } catch (err) {
    return res.status(500).json({
      error: "❌ خطأ غير متوقع أثناء تسجيل الدخول",
      details: (err as Error).message,
    });
  }
};