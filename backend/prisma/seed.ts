import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "agronomo@demo.com" },
    update: {},
    create: {
      name: "Ing. Carlos López",
      email: "agronomo@demo.com",
      passwordHash,
      role: "agronomist",
    },
  });

  await prisma.diagnostico.deleteMany({ where: { userId: user.id } });
  await prisma.caficultor.deleteMany({ where: { userId: user.id } });

  const farmers = await Promise.all([
    prisma.caficultor.create({
      data: {
        nombre: "Juan Pérez",
        finca: "Finca El Paraíso",
        ubicacion: "Chiapas, México",
        telefono: "+52 123 456 7890",
        email: "juan@example.com",
        userId: user.id,
      },
    }),
    prisma.caficultor.create({
      data: {
        nombre: "María García",
        finca: "Finca La Esperanza",
        ubicacion: "Veracruz, México",
        telefono: "+52 987 654 3210",
        email: "maria@example.com",
        userId: user.id,
      },
    }),
  ]);

  console.log("Seed completed:");
  console.log(`  User: ${user.email} / 123456`);
  console.log(`  Farmers: ${farmers.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
