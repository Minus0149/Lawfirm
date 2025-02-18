import { put } from "@vercel/blob"
import { del } from "@vercel/blob"

export async function uploadFile(file: File): Promise<string> {
  try {
    const response = await put(file.name, file, {
      access: "public",
    })

    return response.url
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error("Failed to upload file")
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw new Error("Failed to delete file")
  }
}

