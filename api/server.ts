import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import dotenv from "dotenv";
import Routes from "./utils/routes/routes";
import { authRoutes } from "./utils/routes/auth";

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

fastify.register(authRoutes);
fastify.register(Routes);

// Rota da API principal
fastify.get("/api", async () => {
  return { message: "Servidor Fastify rodando 🎯" };
});

// Função de start
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3333;
    await fastify.listen({ port, host: "0.0.0.0" }); // host definido para acesso externo
    console.log(`🚀 Servidor rodando na porta ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
