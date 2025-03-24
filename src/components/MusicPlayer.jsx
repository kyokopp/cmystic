"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { cn } from "../lib/utils"

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)

  const songs = [
    {
      title: "Música Relaxante",
      artist: "Artista Desconhecido",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      cover: "/placeholder.svg?height=300&width=300",
    },
    {
      title: "Melodia Suave",
      artist: "Artista Anônimo",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      cover: "/placeholder.svg?height=300&width=300",
    },
    {
      title: "Ritmo Tranquilo",
      artist: "Músico Desconhecido",
      src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      cover: "/placeholder.svg?height=300&width=300",
    },
  ]

  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const currentSong = songs[currentSongIndex]

  useEffect(() => {
    const audio = audioRef.current

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const endedHandler = () => nextSong()

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", endedHandler)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", endedHandler)
    }
  }, [currentSongIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleProgress = (e) => {
    const newTime = e.target.value
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
  }

  const handleVolume = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    audioRef.current.volume = newVolume
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (isMuted) {
      audio.volume = volume
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1))
    setIsPlaying(true)
    setTimeout(() => {
      audioRef.current.play()
    }, 100)
  }

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === songs.length - 1 ? 0 : prevIndex + 1))
    setIsPlaying(true)
    setTimeout(() => {
      audioRef.current.play()
    }, 100)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <div
            className={cn(
              "aspect-square bg-muted overflow-hidden transition-transform duration-[20000ms] ease-linear",
              isPlaying && "animate-spin-slow",
            )}
          >
            <img
              src={currentSong.cover || "/placeholder.svg"}
              alt={currentSong.title}
              className="w-full h-full object-cover rounded-full p-16"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white w-full">
              <h3 className="text-xl font-bold truncate">{currentSong.title}</h3>
              <p className="text-sm opacity-80 truncate">{currentSong.artist}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgress}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex justify-center items-center gap-4">
            <button onClick={prevSong} className="p-2 rounded-full hover:bg-muted transition-colors">
              <SkipBack className="h-6 w-6" />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors active:scale-95"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button onClick={nextSong} className="p-2 rounded-full hover:bg-muted transition-colors">
              <SkipForward className="h-6 w-6" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-muted-foreground">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={currentSong.src} className="hidden" />
    </div>
  )
}

export default MusicPlayer

