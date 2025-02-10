import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function seed() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  await db.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
      },
      {
        name: "User",
        email: "user@example.com",
        password: userPassword,
        role: "USER",
      },
    ],
  });

  console.log("Usuarios creados");
}

seed()
  .catch((e) => console.error(e))
  .finally(() => db.$disconnect());
