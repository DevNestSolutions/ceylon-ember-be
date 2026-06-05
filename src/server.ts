import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import dishesRoutes from "./routes/dishes";
import reservationsRoutes from "./routes/reservations";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*", // In production, replace with specific origins for safety (e.g. frontend URL & admin URL)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dishes", dishesRoutes);
app.use("/api/reservations", reservationsRoutes);

// Root path test
app.get("/", (req, res) => {
  res.json({ message: "Welcome to The Ceylon Ember Restaurant API" });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
