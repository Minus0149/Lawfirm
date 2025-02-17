import { Prisma } from '@prisma/client'

export type ActivityLog = Prisma.ActivityLogGetPayload<{
  include: { user: true }
}>

export type ActivityLogCreateInput = Prisma.ActivityLogCreateInput

