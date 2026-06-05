"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST create a reservation (Public)
router.post("/", async (req, res) => {
    const { name, email, date, guests } = req.body;
    if (!name || !email || !date || !guests) {
        return res.status(400).json({ error: "Name, email, date, and guests count are required" });
    }
    const parsedGuests = parseInt(guests, 10);
    if (isNaN(parsedGuests) || parsedGuests <= 0) {
        return res.status(400).json({ error: "Guests count must be a valid positive number" });
    }
    try {
        const reservation = await prisma_1.default.reservation.create({
            data: {
                name,
                email,
                date,
                guests: parsedGuests,
                status: "PENDING",
            },
        });
        return res.status(201).json(reservation);
    }
    catch (error) {
        console.error("Create reservation error:", error);
        return res.status(500).json({ error: "Failed to create reservation" });
    }
});
// GET all reservations (Admin only)
router.get("/", auth_1.authenticateToken, async (req, res) => {
    try {
        const reservations = await prisma_1.default.reservation.findMany({
            orderBy: { date: "asc" },
        });
        return res.json(reservations);
    }
    catch (error) {
        console.error("Fetch reservations error:", error);
        return res.status(500).json({ error: "Failed to fetch reservations" });
    }
});
// PUT update reservation status (Admin only)
router.put("/:id/status", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !["PENDING", "CONFIRMED", "CANCELLED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value. Must be PENDING, CONFIRMED, or CANCELLED." });
    }
    try {
        const updated = await prisma_1.default.reservation.update({
            where: { id },
            data: { status },
        });
        return res.json(updated);
    }
    catch (error) {
        console.error("Update reservation status error:", error);
        return res.status(500).json({ error: "Failed to update reservation status. Make sure ID is valid." });
    }
});
// DELETE a reservation (Admin only)
router.delete("/:id", auth_1.authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.reservation.delete({
            where: { id },
        });
        return res.json({ message: "Reservation deleted successfully" });
    }
    catch (error) {
        console.error("Delete reservation error:", error);
        return res.status(500).json({ error: "Failed to delete reservation. Make sure ID is valid." });
    }
});
exports.default = router;
