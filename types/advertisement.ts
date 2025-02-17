export interface Advertisement {
  id: string
  title?: string
  image?: string
  imageFile?: Buffer
  link: string
  width?: number
  height?: number
  placement: "TOP_BANNER" | "SIDEBAR"
  startDate: Date
  endDate: Date
  views: number
  clicks: number
}

