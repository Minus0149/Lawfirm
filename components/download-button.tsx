"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function DownloadButton({ handleDownload }: { handleDownload: () => Promise<string> }) {
  const [isDownloading, setIsDownloading] = useState(false)

  const onDownload = async () => {
    setIsDownloading(true)
    try {
      const fileUrl = await handleDownload()
      const link = document.createElement("a")
      link.href = fileUrl
      link.download = fileUrl.split("/").pop() || "download"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button onClick={onDownload} disabled={isDownloading} className="flex items-center gap-2">
      <Download className="w-4 h-4" />
      {isDownloading ? "Downloading..." : "Download Attachment"}
    </Button>
  )
}

