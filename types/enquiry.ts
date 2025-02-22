export type EnquiryStatus = "ACTIVE" | "COMPLETE" | "DENIED"

export interface Enquiry {
  id: string
  title: string
  description: string
  name: string
  email: string
  phone?: string | null
  status: EnquiryStatus
  response?: string
  createdAt: Date
  updatedAt: Date
}

