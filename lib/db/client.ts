import { PrismaClient } from '../generated/prisma/client'

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = client
    }
    
    return client
  })()

