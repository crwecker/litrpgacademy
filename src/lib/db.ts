import 'server-only'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

// Reuse one client across hot reloads in dev and warm serverless invocations.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL is not set')
  // pg already treats sslmode=require as verify-full; say so explicitly to keep that behavior in pg v9.
  const url = connectionString.replace('sslmode=require', 'sslmode=verify-full')
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url, max: 5 }) })
}

export const db = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
