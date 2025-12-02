import fastifyPkg from "fastify";
import type { FastifyInstance } from "fastify";
import z from "zod";
import { verifyToken } from "../jwt.js";
import { prisma } from "../prisma.js";
import { nowSP } from "../data.js";
import { toZonedTime, format } from "date-fns-tz";
import { startOfDay, endOfDay } from "date-fns";
import { Attendance, Kid } from "@prisma/client";

export default async function Routes(app: FastifyInstance) {
  // schemas
  const kidsSchema = z.object({
    nameKids: z.string().min(1, "Nome da criança é obrigatório"),
    nameParents: z.string().min(1, "Nome dos pais é obrigatório"),
    endereco: z.string().min(1, "Endereço é obrigatório"),
    telefone: z.number(),
    alergia: z.boolean(),
    atipica: z.boolean(),
    restricao: z.boolean(),
    description: z.string(),
  });

  const userSchema = z.object({
    nameKids: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  });

  const attendanceSchema = z.object({
    kidId: z.number(),
    qrCodeId: z.number(),
  });
  // hook global de autenticacao token - jwt
  app.addHook("preHandler", async (req, reply) => {
    const publicRoutes = ["/login", "/register"];
    if (publicRoutes.includes(req.url)) return;

    const authHeader = req.headers.authorization;
    if (!authHeader)
      return reply.code(401).send({ error: "Token não fornecido" });

    const [, jwtToken] = authHeader.split(" ");
    try {
      verifyToken(jwtToken);
    } catch {
      return reply.code(401).send({ error: "Token inválido ou expirado" });
    }
  });

  // Cadastro de crianças
  app.post("/forms", async (req, reply) => {
    const parsed = kidsSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: parsed.error.flatten().fieldErrors });
    }

    try {
      const kid = await prisma.kid.create({ data: parsed.data });
      return reply.code(201).send({
        message: "Criança cadastrada com sucesso",
        kidId: kid.id,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Erro interno do servidor" });
    }
  });

  // Lista de crianças
  app.get("/list", async (req, reply) => {
    try {
      const kids = await prisma.kid.findMany({
        select: {
          id: true,
          nameKids: true,
          nameParents: true,
          atipica: true,
          restricao: true,
          description: true,
        },
        orderBy: { nameKids: "asc" },
      });
      return reply.send(kids);
    } catch (error) {
      console.error(error);
      return reply
        .code(500)
        .send({ error: "Erro ao buscar lista de crianças" });
    }
  });

  app.get("/profile", async (req, reply) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return reply.status(401).send({ error: "No token provided" });
      }

      const payload = verifyToken(token);

      if (typeof payload === "string") {
        return reply.status(401).send({ error: "Invalid token payload" });
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      reply.send(user);
    } catch (error) {
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  // Cadastro de monitor
  app.post("/registerMonitors", async (req, reply) => {
    const parsed = userSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: parsed.error.flatten().fieldErrors });
    }

    try {
      const user = await prisma.user.create({ data: parsed.data });
      return reply.code(201).send({
        message: "Tia cadastrada com sucesso",
        userId: user.id,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Erro interno do servidor" });
    }
  });

  app.post("/qrcode", async (req, reply) => {
    const qrCodeExitSchema = z.object({
      qrCodeId: z
        .union([z.number(), z.string().transform((val) => Number(val))])
        .refine((val) => !isNaN(val) && val > 0, {
          message: "QR Code ID deve ser um número válido",
        }),
    });

    const parsed = qrCodeExitSchema.safeParse(req.body);

    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: parsed.error.flatten().fieldErrors });
    }

    const { qrCodeId } = parsed.data;

    try {
      const attendance = await prisma.attendance.findFirst({
        where: {
          qrCodeId: qrCodeId,
          timestampSaida: null,
        },
        include: {
          kid: true,
        },
      });

      if (!attendance) {
        return reply.code(404).send({
          error: "Pulseira não encontrada ou saída já registrada.",
        });
      }

      // registrar saída
      await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          timestampSaida: new Date(),
        },
      });

      // liberar pulseira
      await prisma.pulseiras.update({
        where: { id: qrCodeId },
        data: { status: true },
      });

      return reply.send({
        success: true,
        kidId: attendance.kidId,
        message: `Saída registrada para ${attendance.kid.nameKids}`,
      });
    } catch (error) {
      return reply.code(500).send({ error: "Erro interno do servidor" });
    }
  });

  app.post("/attendance", async (req, reply) => {
    console.log("=== ENDPOINT ATTENDANCE (ENTRADA) ===");

    const parsed = attendanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: parsed.error.flatten().fieldErrors });
    }

    const { qrCodeId, kidId, ...rest } = parsed.data;

    try {
      const pulseiras = await prisma.pulseiras.findUnique({
        where: { id: qrCodeId },
      });

      if (!pulseiras) {
        return reply.code(404).send({ error: "Pulseira não encontrada" });
      }

      if (!pulseiras.status) {
        return reply.code(400).send({ error: "Pulseira já está em uso" });
      }

      const child = await prisma.kid.findUnique({
        where: { id: kidId },
      });

      if (!child) {
        return reply.code(404).send({ error: "Criança não encontrada" });
      }

      const attendance = await prisma.attendance.create({
        data: {
          qrCodeId,
          kidId,
          timestampEntrada: nowSP(),
          ...rest,
        },
      });

      await prisma.pulseiras.update({
        where: { id: qrCodeId },
        data: { status: false },
      });

      return reply.code(201).send({
        message: "Presença registrada com sucesso",
        attendance,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Erro interno do servidor" });
    }
  });

  // listar crianças presentes
  app.get("/attendance/presentes", async (req, reply) => {
    try {
      const today = new Date();

      // Pegamos o dia de hoje em UTC
      const startUTC = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
          0,
          0,
          0
        )
      );
      const endUTC = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const presentes = await prisma.attendance.findMany({
        where: {
          timestampEntrada: {
            gte: startUTC, // >= início do dia UTC
            lte: endUTC, // <= fim do dia UTC
          },
          timestampSaida: null,
        },
        include: { kid: true },
        orderBy: { timestampEntrada: "asc" },
      });

      console.log("Registros encontrados:", presentes.length);

      return reply.send(
        presentes.map((p: any) => ({
          id: p.kid.id,
          nameKids: p.kid.nameKids,
          nameParents: p.kid.nameParents,
          description: p.kid.description,
          qrCodeId: p.qrCodeId,
          entrada: p.timestampEntrada,
        }))
      );
    } catch (error) {
      console.error(error);
      return reply
        .code(500)
        .send({ error: "Erro ao buscar lista de presentes" });
    }
  });

  //listar pulseiras
  app.get("/attendance", async (req, reply) => {
    try {
      const pulseiras = await prisma.pulseiras.findMany({
        select: {
          code: true,
        },
        orderBy: { code: "asc" },
      });
      return reply.send(pulseiras);
    } catch (error) {
      reply.status(500).send({ error: "Internal server error" });
    }
  });
}
