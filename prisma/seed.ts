/// <reference types="node" />
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.user.deleteMany({});
  await prisma.dish.deleteMany({});
  await prisma.reservation.deleteMany({});

  // Hash default admin password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("admin123", salt);

  // Create default admin user
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      passwordHash,
    },
  });
  console.log("Created admin user:", admin.username);

  // Initial dishes list
  const initialDishes = [
    {
      name: "Wagyu Reserve",
      price: "$148",
      tag: "Signature",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
      desc: "A5 wagyu, smoked bone marrow, charred shallot jus.",
    },
    {
      name: "Hokkaido Scallops",
      price: "$84",
      tag: "Ocean",
      img: "https://images.unsplash.com/photo-1534080391025-a87b9959442f?auto=format&fit=crop&q=80&w=800",
      desc: "Torched scallops, brown butter, gold leaf.",
    },
    {
      name: "The Ceylon Ember Noir",
      price: "$42",
      tag: "Dessert",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
      desc: "Single-origin chocolate, raspberry coulis, gilded leaf.",
    },
    {
      name: "Spiced Ramen",
      price: "$96",
      tag: "Chef's Special",
      img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800",
      desc: "Slow-roasted lamb, saffron reduction, herb crust.",
    },
  ];

  for (const dish of initialDishes) {
    const created = await prisma.dish.create({
      data: dish,
    });
    console.log("Created dish:", created.name);
  }

  // Create one or two mock reservations to make dashboard look populated initially
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  await prisma.reservation.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        date: formatDate(tomorrow),
        guests: 2,
        status: "CONFIRMED",
      },
      {
        name: "Sarah Smith",
        email: "sarah@example.com",
        date: formatDate(tomorrow),
        guests: 4,
        status: "PENDING",
      },
    ],
  });
  console.log("Created mock reservations");

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
