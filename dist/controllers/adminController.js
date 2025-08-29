"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const adminLogin = (req, res) => {
    const { email, password } = req.body;
    if (email === "eslam@gmail.com" && password === "123456") {
        return res.json({ success: true, token: "123abc-token" });
    }
    res
        .status(401)
        .json({ success: false, message: "❌ بيانات الدخول غير صحيحة" });
};
exports.adminLogin = adminLogin;
