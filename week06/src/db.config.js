import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/client.ts";
export const prisma = new PrismaClient({
  log: [
    {
      level: "query",
      emit: "event",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log(`[ORM] ${e.duration}ms | ${e.query} |params=${e.params}`);
});
dotenv.config();
