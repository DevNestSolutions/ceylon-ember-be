"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const dishes_1 = __importDefault(require("./routes/dishes"));
const reservations_1 = __importDefault(require("./routes/reservations"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: "*", // In production, replace with specific origins for safety (e.g. frontend URL & admin URL)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_1.default);
app.use("/api/dishes", dishes_1.default);
app.use("/api/reservations", reservations_1.default);
// Root path test
app.get("/", (req, res) => {
    res.json({ message: "Welcome to The Ceylon Ember Restaurant API" });
});
// 404 Route handler
app.use((req, res) => {
    res.status(404).json({ error: "API route not found" });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Something went wrong on the server" });
});
// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
