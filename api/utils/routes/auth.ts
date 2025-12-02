import { type FastifyInstance } from "fastify";
import { hashSecurity, verifySecurity } from "../hash.js";

import { token } from "../jwt.js";
import { z } from "zod";
import { prisma } from "../prisma.js";

export async function authRoutes(app: FastifyInstance) {
  // schemas
  const registerSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  });

  const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha obrigatória"),
  });

  // register
  app.post("/register", async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: parsed.error.flatten().fieldErrors });
    }

    const { name, email, password } = parsed.data;

    try {
      const hashedPassword = await hashSecurity(password);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword! },
      });

      return reply
        .code(201)
        .send({ message: "Usuário registrado com sucesso", userId: user.id });
    } catch (err: any) {
      if (err.code === "P2002") {
        return reply.code(409).send({ error: "Email já cadastrado" });
      }
      return reply.code(500).send({ error: "Erro interno do servidor" });
    }
  });

  // login
  app.post("/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: parsed.error.flatten().fieldErrors });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifySecurity(user.password, password)))
      return reply.code(401).send({ error: "Credenciais inválidas" });

    const jwtToken = token({ id: user.id, email: user.email });

    return reply.send({ message: "Login realizado", token: jwtToken });
  });
}
