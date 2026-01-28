import { PrismaClient } from "../../../prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL não está definida.");

const adapter = new PrismaPg({ connectionString: databaseUrl });

const prisma = global.cachedPrisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") global.cachedPrisma = prisma;

export const db = prisma;
