// "use client"

// import { useEffect, useState , useCallback} from "react"
// import Image from "next/image"
// import type { Advertisement as AdvertisementType } from "@/types/advertisement"
// import { bufferToBase64 } from "@/lib/utils"
// import { usePathname } from "next/navigation"

// interface AdvertisementProps {
//   position: string
//   category?: string
// }

// export function Advertisement({ position, category }: AdvertisementProps) {
//   const [ad, setAd] = useState<AdvertisementType | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const pathname = usePathname()

//   const getLocation = useCallback((path: string): "HOME" | "CATEGORY" | "ARTICLE" | "ALL" => {
//     if (path === "/") return "HOME"
//     if (path.startsWith("/article/")) return "ARTICLE"
//     if (/^\/[^/]+(\/[^/]+)?$/.test(path)) return "CATEGORY"
//     return "ALL"
//   }, [])

//   useEffect(() => {
//     const loadAd = async () => {
//       const location = getLocation(pathname)
      
//       try {
//         const response = await fetch(`/api/advertisements/get?position=${position}&category=${category|| null }&location=${location}`)
//         if (!response.ok) {
//           throw new Error(`Failed to load advertisement: ${response.statusText}`)
//         }
//         const data = await response.json()
//         setAd(data)
//         console.log(data)
//         if (data?.id) {
//           await fetch(`/api/advertisements/view`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ id: data.id }),
//           })
//         }
//       } catch (error) {
//         console.error("Error loading advertisement:", error)
//         setError("Failed to load advertisement")
//       }
//     }

//     loadAd()
//   }, [position, category, pathname, getLocation])

//   if (!ad) return null
  
//   if (error) {
//     return <div className="text-destructive">{error}</div>
//   }

  

//   const handleClick = async () => {
//     try {
//       await fetch(`/api/advertisements/click`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: ad.id }),
//       })
//       window.open(ad.link, "_blank")
//     } catch (error) {
//       console.error("Error recording click:", error)
//       window.open(ad.link, "_blank")
//     }
//   }


//   const style = {
//     'TOP_BANNER': 'w-full h-24 md:h-48 bg-card flex items-center justify-center mb-8',
//     // 'FOOTER': 'w-full h-24 bg-card flex items-center justify-center mt-8',
//     'SIDEBAR': 'w-full h-64 bg-card flex items-center justify-center mb-8',
//     // 'IN_ARTICLE': 'w-full h-64 bg-card flex items-center justify-center my-8'
//   }[position]

//   return (
//     <div className={`${style} relative overflow-hidden rounded-lg shadow-md cursor-pointer`} onClick={handleClick}>
//       <Image
//         src={ad.image || `data:image/jpeg;base64,${ad.imageFile instanceof Uint8Array ? bufferToBase64(ad.imageFile) : ad.imageFile}`}
//         alt={ad.title || "Advertisement"}
//         width={300}
//         height={250}
//         className="object-cover w-full h-full"
//         unoptimized
//       />
//       {ad.title && (
//         <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white">
//           <p className="text-sm font-medium">{ad.title}</p>
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import type { Advertisement as AdvertisementType } from "@/types/advertisement"
import { bufferToBase64 } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface AdvertisementProps {
  position: string
  category?: string
}

export function Advertisement({ position, category }: AdvertisementProps) {
  const [ad, setAd] = useState<AdvertisementType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // ✅ Improved getLocation function
  const getLocation = useCallback((path: string): "HOME" | "CATEGORY" | "ARTICLE" | "ALL" => {
    if (path === "/") return "HOME"
    if (path.startsWith("/article/")) return "ARTICLE"
    if (/^\/[^/]+(\/[^/]+)?$/.test(path)) return "CATEGORY" // Works for both category & subcategory
    return "ALL"
  }, [])

  useEffect(() => {
    const loadAd = async () => {
      const location = getLocation(pathname)

      try {
        // ✅ Construct URL properly
        const queryParams = new URLSearchParams({
          position,
          location,
        })

        if (category) {
          queryParams.append("category", category)
        }
        const response = await fetch(`/api/advertisements/get?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error(`Failed to load advertisement: ${response.statusText}`)
        }

        const data: AdvertisementType | null = await response.json()
        if (!data) return

        setAd(data)

        if (data.id) {
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
  }, [position, category, pathname, getLocation])

  if (!ad) return null

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

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
    TOP_BANNER: "w-full h-24 md:h-48 bg-card flex items-center justify-center mb-8",
    CATEGORY_PAGE: "w-full h-24 md:h-48 bg-card flex items-center justify-center mb-8",
  }[position]

  // ✅ Improved image handling
  const adImage =
    ad.image ||
    (ad.imageFile instanceof Uint8Array ? `data:image/jpeg;base64,${bufferToBase64(ad.imageFile)}` : null)

  return (
    <div className={`${style} relative overflow-hidden rounded-lg shadow-md cursor-pointer`} onClick={handleClick}>
      <Image
        src={ad.image || `data:image/jpeg;base64,${ad.imageFile instanceof Uint8Array ? bufferToBase64(ad.imageFile) : ad.imageFile}`}
        alt={ad.title || "Advertisement"}
        width={300}
        height={250}
        className="object-contain w-full h-full"
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
