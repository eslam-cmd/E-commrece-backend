import { Request, Response } from "express";

export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email === "eslam@gmail.com" && password === "123456") {
    return res.json({ success: true, token: "123abc-token" });
  }

  res
    .status(401)
    .json({ success: false, message: "❌ بيانات الدخول غير صحيحة" });
};
