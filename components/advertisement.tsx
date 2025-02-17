"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { Advertisement as AdvertisementType } from "@/types/advertisement"
import { AdPlacement } from "@prisma/client"
import { bufferToBase64 } from "@/lib/utils"

interface AdvertisementProps {
  position: string
}

export function Advertisement({ position }: AdvertisementProps) {
  const [ad, setAd] = useState<AdvertisementType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAd = async () => {
      try {
        const response = await fetch(`/api/advertisements/get?position=${position}`)
        if (!response.ok) {
          throw new Error(`Failed to load advertisement: ${response.statusText}`)
        }
        const data = await response.json()
        setAd(data)

        // Record view
        if (data?.id) {
          await fetch(`/api/advertisements/view`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: data.id }),
          })
        }
      } catch (error) {
        console.error("Error loading advertisement:", error)
        setError("Failed to load advertisement")
      }
    }

    loadAd()
  }, [position])

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  if (!ad) return null

  const handleClick = async () => {
    try {
      await fetch(`/api/advertisements/click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ad.id }),
      })
      window.open(ad.link, "_blank")
    } catch (error) {
      console.error("Error recording click:", error)
      window.open(ad.link, "_blank")
    }
  }


  const style = {
    'TOP_BANNER': 'w-full h-48 bg-card flex items-center justify-center mb-8',
    // 'FOOTER': 'w-full h-24 bg-card flex items-center justify-center mt-8',
    'SIDEBAR': 'w-full h-64 bg-card flex items-center justify-center mb-8',
    // 'IN_ARTICLE': 'w-full h-64 bg-card flex items-center justify-center my-8'
  }[position]

  return (
    <div className={`${style} relative overflow-hidden rounded-lg shadow-md cursor-pointer`} onClick={handleClick}>
      <Image
        src={ad.image || `data:image/jpeg;base64,${ad.imageFile instanceof Uint8Array ? bufferToBase64(ad.imageFile) : ad.imageFile}`}
        alt={ad.title || "Advertisement"}
        width={300}
        height={250}
        className="object-cover w-full h-full"
        unoptimized
      />
      {ad.title && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white">
          <p className="text-sm font-medium">{ad.title}</p>
        </div>
      )}
    </div>
  )
}

