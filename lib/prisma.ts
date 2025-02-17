import { PrismaClient } from '@prisma/client'

// Remove or comment out the line causing the error:
// declare global {
//  var prisma: PrismaClient | undefined
// }

// Replace it with:
let prisma: PrismaClient;

// Modify the prisma initialization:
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

// The rest of the file can remain the same
export { prisma };


// Proper error handling and connection management
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

