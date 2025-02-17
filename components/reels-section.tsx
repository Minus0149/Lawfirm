'use client'

import { useState, useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { Reel } from '@/types/reel'
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from 'lucide-react'

export function ReelsSection() {
  const [reels, setReels] = useState<Reel[]>([])
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [page, setPage] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ref, inView] = useInView()

  const fetchReels = async () => {
    const response = await fetch(`/api/reels?page=${page}`)
    const newReels = await response.json()
    setReels((prevReels) => [...prevReels, ...newReels])
    setPage((prevPage) => prevPage + 1)
  }

  useEffect(() => {
    fetchReels()
  }, [])

  useEffect(() => {
    if (inView && currentReelIndex === reels.length - 1) {
      fetchReels()
    }
  }, [inView, currentReelIndex, reels.length])

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, currentReelIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault()
        changeReel(-1)
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        changeReel(1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentReelIndex, reels.length])

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const handleVideoEnded = () => {
    changeReel(1)
  }

  const changeReel = (direction: number) => {
    setCurrentReelIndex((prevIndex) => {
      const newIndex = prevIndex + direction
      if (newIndex >= 0 && newIndex < reels.length) {
        setIsPlaying(true)
        return newIndex
      }
      return prevIndex
    })
  }

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.deltaY > 0) {
      changeReel(1)
    } else if (event.deltaY < 0) {
      changeReel(-1)
    }
  }

  if (reels.length === 0) {
    return <div className="text-center p-4">Loading reels...</div>
  }

  const currentReel = reels[currentReelIndex]

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[9/16] overflow-hidden bg-black rounded-lg shadow-md"
      onWheel={handleScroll}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      <video
        ref={videoRef}
        src={currentReel.videoUrl}
        className="w-full h-full object-cover"
        loop={false}
        muted={isMuted}
        playsInline
        onClick={handleVideoClick}
        onEnded={handleVideoEnded}
      />
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <p className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
          {currentReel.title}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="text-white bg-black bg-opacity-50 hover:bg-opacity-75"
          onClick={handleMuteToggle}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
      </div>
      {currentReelIndex === reels.length - 1 && (
        <div ref={ref} className="absolute bottom-0 w-full h-1" />
      )}
    </div>
  )
}

