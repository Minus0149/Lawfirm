export interface EmailVerification {
    id: string
    userId: string
    code: string
    expiresAt: Date
    createdAt: Date
  }
  
  