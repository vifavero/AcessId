import { PrismaClient } from "@prisma/client";
import { hashSecurity } from "./utils/hash.js";

const prisma = new PrismaClient();

async function createAdmin() {
  const email = "vn85315@gmail.com";
  const password = "SenhaSuperSecreta123";

  const hashedPassword = await hashSecurity(password);

  if (!hashedPassword) {
    console.error("Não foi possível gerar o hash da senha.");
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log("Admin criado com sucesso:", user.email);
  } catch (err) {
    console.error("Erro ao criar admin:", err);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
