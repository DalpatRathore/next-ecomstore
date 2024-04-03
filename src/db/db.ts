import { PrismaClient } from "@prisma/client";

const primsaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof primsaClientSingleton>;
}

const db = globalThis.prisma ?? primsaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
