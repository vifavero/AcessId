import fastifyPkg from "fastify";
import type { FastifyInstance } from "fastify";
import z from "zod";
import { verifyToken } from "../jwt.ts";
import { prisma } from "../prisma.ts";

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
  // app.get("/list", async (req, reply) => {
  //   try {
  //     const kids = await prisma.kid.findMany({
  //       select: {
  //         nameKids: true,
  //         nameParents: true,
  //         atipica: true,
  //         restricao: true,
  //         description: true,
  //       },
  //       orderBy: { nameKids: "asc" },
  //     });
  //     return reply.send(kids);
  //   } catch (error) {
  //     console.error(error);
  //     return reply
  //       .code(500)
  //       .send({ error: "Erro ao buscar lista de crianças" });
  //   }
  // });

  // Associação de pulseira
  app.post("/attendance/entrance", async (req, reply) => {
    const parsed = attendanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ error: parsed.error.flatten().fieldErrors });
    }

    const { kidId, qrCodeId } = parsed.data;
    const classDate = new Date().toISOString().split("T")[0];

    try {
      const attendance = await prisma.attendance.create({
        data: {
          kidId,
          qrCodeId,
          classDate: new Date(classDate),
        },
        include: { kid: true },
      });

      return reply.send({
        message: `Criança ${attendance.kid.nameKids} associada à pulseira ${qrCodeId}`,
      });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Erro ao associar pulseira" });
    }
  });

  // Registrar saída (via QR Code)
  app.post<{ Params: { qrCodeId: string } }>(
    "/attendance/exit/:qrCodeId",
    async (req, reply) => {
      const qrCodeId = Number(req.params.qrCodeId);
      const classDate = new Date().toISOString().split("T")[0];

      try {
        const attendance = await prisma.attendance.findFirst({
          where: {
            qrCodeId,
            classDate: new Date(classDate),
            timestampSaida: null,
          },
          include: { kid: true },
        });

        if (!attendance)
          return reply
            .code(404)
            .send({ error: "Pulseira não associada ou já liberada" });

        const updated = await prisma.attendance.update({
          where: { id: attendance.id },
          data: { timestampSaida: new Date() },
        });

        return reply.send({
          message: `Criança ${attendance.kid.nameKids} liberada com sucesso`,
          attendance: updated,
        });
      } catch (error) {
        console.error(error);
        return reply.code(500).send({ error: "Erro ao registrar saída" });
      }
    }
  );

  // Listar crianças presentes
  app.get("/attendance/presentes", async (req, reply) => {
    const classDate = new Date().toISOString().split("T")[0];

    try {
      const presentes = await prisma.attendance.findMany({
        where: { classDate: new Date(classDate), timestampSaida: null },
        include: { kid: true },
        orderBy: { timestampEntrada: "asc" },
      });

      return reply.send(
        presentes.map((p) => ({
          id: p.kid.id,
          nameKids: p.kid.nameKids,
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
}
