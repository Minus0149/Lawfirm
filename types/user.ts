import { Role } from "@prisma/client"

export interface User {
  id: string
  name: string | null
  email: string
  emailLowercase: string
  emailVerified: Date | null
  image: string | null
  imageFile: Buffer | null
  role: Role
  twoFactorEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

