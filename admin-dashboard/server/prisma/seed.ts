import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: "admin@example.com",
    },
  });

  if (existingAdmin) {
    console.log("⚠️ Admin user already exists, skipping seed...");
    return;
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("Admin@123", saltRounds);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      userName: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin user created successfully:");
  console.log({
    id: admin.id,
    userName: admin.userName,
    email: admin.email,
    role: admin.role,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });