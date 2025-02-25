import { ImageResponse } from "next/server"
import { siteConfig } from "@/config/site"

export const runtime = "edge"
export const alt = "LexInvictus"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(to bottom right, #1a237e, #3949ab)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Montserrat",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-rlqupY5CGQyQMC7oceFN8xWNALWirf.png"
          alt="Logo"
          width={120}
          height={120}
          style={{ marginRight: "1rem" }}
        />
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            background: "white",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {siteConfig.name}
        </h1>
      </div>
      <p
        style={{
          fontSize: "1.5rem",
          color: "white",
          opacity: 0.8,
          maxWidth: "80%",
          textAlign: "center",
        }}
      >
        {siteConfig.description}
      </p>
    </div>,
    {
      ...size,
    },
  )
}

