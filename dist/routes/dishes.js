"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET all active dishes (Public)
router.get("/", async (req, res) => {
    try {
        const dishes = await prisma_1.default.dish.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "asc" },
        });
        return res.json(dishes);
    }
    catch (error) {
        console.error("Fetch dishes error:", error);
        return res.status(500).json({ error: "Failed to fetch dishes" });
    }
});
// GET all dishes including inactive (Admin only)
router.get("/all", auth_1.authenticateToken, async (req, res) => {
    try {
        const dishes = await prisma_1.default.dish.findMany({
            orderBy: { createdAt: "desc" },
        });
        return res.json(dishes);
    }
    catch (error) {
        console.error("Fetch all dishes error:", error);
        return res.status(500).json({ error: "Failed to fetch all dishes" });
    }
});
// POST a new dish (Admin only)
router.post("/", auth_1.authenticateToken, async (req, res) => {
    const { name, price, tag, img, desc } = req.body;
    if (!name || !price || !tag || !img || !desc) {
        return res.status(400).json({ error: "All fields are required (name, price, tag, img, desc)" });
    }
    try {
        const dish = await prisma_1.default.dish.create({
            data: {
                name,
                price,
                tag,
                img,
                desc,
                isActive: true,
            },
        });
        return res.status(201).json(dish);
    }
    catch (error) {
        console.error("Create dish error:", error);
        return res.status(500).json({ error: "Failed to create dish" });
    }
});
// PUT update a dish (Admin only)
router.put("/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, price, tag, img, desc, isActive } = req.body;
    try {
        const dish = await prisma_1.default.dish.update({
            where: { id },
            data: {
                name,
                price,
                tag,
                img,
                desc,
                isActive,
            },
        });
        return res.json(dish);
    }
    catch (error) {
        console.error("Update dish error:", error);
        return res.status(500).json({ error: "Failed to update dish. Make sure ID is valid." });
    }
});
// DELETE a dish (Admin only)
router.delete("/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.dish.delete({
            where: { id },
        });
        return res.json({ message: "Dish deleted successfully" });
    }
    catch (error) {
        console.error("Delete dish error:", error);
        return res.status(500).json({ error: "Failed to delete dish. Make sure ID is valid." });
    }
});
exports.default = router;
