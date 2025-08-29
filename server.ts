import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRouter from "./routes/adminRoute";
import usersRouter from "./routes/usersRoute";
import productRoutes from "./routes/productRoute";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://e-commrece-client.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productRoutes);

app.use("/products", express.static(path.join(__dirname, "public/products")));

app.get("/", (req, res) => {
  res.send("✅ السيرفر يعمل بنجاح");
});

export default app;
