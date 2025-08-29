import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role?: string };
}

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ error: "غير مسموح لك بالدخول" });
};
