"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:3000",
    "https://e-commrece-client.vercel.app",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.options("*", (0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", adminRoute_1.default);
app.use("/api/users", usersRoute_1.default);
app.use("/api/products", productRoute_1.default);
app.use("/products", express_1.default.static(path_1.default.join(__dirname, "public/products")));
app.get("/", (req, res) => {
    res.send("✅ السيرفر يعمل بنجاح");
});
exports.default = app;
