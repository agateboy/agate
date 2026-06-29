import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Use /tmp on Vercel (serverless), ./dev.db locally
const dbPath =
  process.env.NODE_ENV === "production" || !process.env.DATABASE_URL
    ? "/tmp/agate.db"
    : process.env.DATABASE_URL?.replace("file:", "") || "./dev.db";

const connectionString = `file:${dbPath}`;

const prismaClientSingleton = () => {
  const adapter = new PrismaBetterSqlite3({ url: connectionString });
  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
export default prisma;
