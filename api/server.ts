import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Routes from "./utils/routes/routes.js";
import { authRoutes } from "./utils/routes/auth.js";

dotenv.config();

const fastify = Fastify({ logger: true });

// CORS
fastify.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

// Registrando rotas da API
fastify.register(authRoutes);
fastify.register(Routes);

// Rota teste
fastify.get("/api", async () => {
  return { message: "Servidor Fastify rodando 🎯" };
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend");

fastify.register(fastifyStatic, {
  root: frontendPath,
});

fastify.setNotFoundHandler((req, reply) => {
  if (req.url.startsWith("/api")) {
    reply.code(404).send({ error: "Rota não encontrada" });
  } else {
    reply.sendFile("index.html");
  }
});

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Servidor rodando na porta ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
