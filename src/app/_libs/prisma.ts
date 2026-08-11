import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
/*
SQLiteからPosgtresQLに変更により削除
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
*/
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });


export const prisma = new PrismaClient({ adapter })
/*
SQLiteからPosgtresQLに変更により削除
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
*/