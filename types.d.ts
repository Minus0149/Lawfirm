import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      twoFactorEnabled: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    twoFactorEnabled: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    twoFactorEnabled: boolean
  }
}

