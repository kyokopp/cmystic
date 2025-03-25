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
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)
  const youtubePlayerRef = useRef(null)
  const volumeTimeoutRef = useRef(null) // For debouncing volume changes

  const initialSongs = [
    {
      title: "Hino nacional",
      artist: "Artista Desconhecido",
      src: "https://music.youtube.com/watch?v=lzuK1Tye4-A&si=EzA2A0IzsrpIeKl0",
      isYouTube: true,
      cover: "",
    },
    {
      title: "All i need",
      artist: "Radiohead",
      src: "https://music.youtube.com/watch?v=FM7ALFsOH4g&si=gPXSWi569paTKuad3",
      isYouTube: true,
      cover: "",
    },
    {
      title: "Wutiwant",
      artist: "Saraunh0ly",
      src: "https://music.youtube.com/watch?v=11iIJ8uSFTw&si=MSyQJwNVL8G24aAT",
      isYouTube: true,
      cover: "",
    },
    {
      title: "Screaming",
      artist: "Loathe",
      src: "https://music.youtube.com/watch?v=tGdbXTdVFVU&list=RDAMVMtGdbXTdVFVU",
      isYouTube: true,
      cover: "",
    },

      // para colocar mais musicas é so a gente colocar o titulo, artista, link, isYoutube = true se for do youtube e cover como place ""

  ]

  const [songs, setSongs] = useState(initialSongs)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const currentSong = songs[currentSongIndex]

  // Load YouTube IFrame API and wait for it to be ready
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        setIsYouTubeApiReady(true)
      }
    } else {
      setIsYouTubeApiReady(true)
    }

    return () => {
      delete window.onYouTubeIframeAPIReady
    }
  }, [])

  // Dynamically set thumbnails for YouTube songs
  useEffect(() => {
    const updatedSongs = initialSongs.map((song) => {
      if (song.isYouTube) {
        try {
          const url = new URL(song.src)
          const videoId = url.searchParams.get("v") || song.src.split("v=")[1]?.split("&")[0]
          if (videoId) {
            return {
              ...song,
              cover: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            }
          }
        } catch (error) {
          console.error("Invalid YouTube URL for thumbnail:", song.src)
        }
      }
      return song
    })
    setSongs(updatedSongs)
  }, [])

  // Handle YouTube Player for YouTube tracks
  useEffect(() => {
    if (currentSong.isYouTube && isYouTubeApiReady) {
      if (!window.YT || !window.YT.Player) {
        setError("Failed to load YouTube API. Please try again later.")
        return
      }

      let videoId = ""
      try {
        const url = new URL(currentSong.src)
        videoId = url.searchParams.get("v") || currentSong.src.split("v=")[1]?.split("&")[0]
      } catch (error) {
        setError("Invalid YouTube URL: " + currentSong.src)
        return
      }

      if (!videoId) {
        setError("Could not extract video ID from URL: " + currentSong.src)
        return
      }

      const onPlayerReady = (event) => {
        event.target.setVolume(volume * 100)
        if (isPlaying) event.target.playVideo()
      }

      const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
          setIsPlaying(true)
          const duration = event.target.getDuration()
          setDuration(duration)

          const interval = setInterval(() => {
            const current = event.target.getCurrentTime()
            setCurrentTime(current)
            if (current >= duration) {
              clearInterval(interval)
              nextSong()
            }
          }, 1000)
          return () => clearInterval(interval)
        } else if (event.data === window.YT.PlayerState.PAUSED) {
          setIsPlaying(false)
        } else if (event.data === window.YT.PlayerState.ENDED) {
          nextSong()
        }
      }

      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy()
      }

      youtubePlayerRef.current = new window.YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      })
    }

    return () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy()
        youtubePlayerRef.current = null
      }
    }
  }, [currentSongIndex, isYouTubeApiReady]) // Removed 'volume' from dependencies

  // Update YouTube player volume when volume changes
  useEffect(() => {
    if (currentSong.isYouTube && youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
      youtubePlayerRef.current.setVolume(isMuted ? 0 : volume * 100)
    }
  }, [volume, isMuted])

  // Handle <audio> element for non-YouTube tracks
  useEffect(() => {
    if (!currentSong.isYouTube) {
      const audio = audioRef.current

      const updateTime = () => setCurrentTime(audio.currentTime)
      const updateDuration = () => setDuration(audio.duration)
      const endedHandler = () => nextSong()

      audio.addEventListener("timeupdate", updateTime)
      audio.addEventListener("loadedmetadata", updateDuration)
      audio.addEventListener("ended", endedHandler)

      if (isPlaying) {
        audio.play().catch((error) => {
          setError("Error playing audio: " + error.message)
        })
      }

      audio.volume = isMuted ? 0 : volume

      return () => {
        audio.removeEventListener("timeupdate", updateTime)
        audio.removeEventListener("loadedmetadata", updateDuration)
        audio.removeEventListener("ended", endedHandler)
      }
    }
  }, [currentSongIndex, isPlaying, volume, isMuted])

  const togglePlay = () => {
    if (currentSong.isYouTube) {
      if (!youtubePlayerRef.current || typeof youtubePlayerRef.current.playVideo !== "function") {
        setError("YouTube player not initialized. Please try again.")
        return
      }
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo()
      } else {
        youtubePlayerRef.current.playVideo()
      }
      setIsPlaying(!isPlaying)
    } else {
      const audio = audioRef.current
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play().catch((error) => {
          setError("Error playing audio: " + error.message)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleProgress = (e) => {
    const newTime = e.target.value
    setCurrentTime(newTime)
    if (currentSong.isYouTube) {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.seekTo === "function") {
        youtubePlayerRef.current.seekTo(newTime)
      }
    } else {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolume = (e) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)

    // Debounce the volume update to avoid rapid calls
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current)
    }

    volumeTimeoutRef.current = setTimeout(() => {
      if (currentSong.isYouTube) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
          youtubePlayerRef.current.setVolume(newVolume * 100)
        } else {
          setError("YouTube player not ready to adjust volume.")
        }
      } else {
        audioRef.current.volume = newVolume
      }
    }, 100)

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      if (currentSong.isYouTube) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
          youtubePlayerRef.current.setVolume(volume * 100)
        } else {
          setError("YouTube player not ready to adjust volume.")
        }
      } else {
        audioRef.current.volume = volume
      }
      setIsMuted(false)
    } else {
      if (currentSong.isYouTube) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
          youtubePlayerRef.current.setVolume(0)
        } else {
          setError("YouTube player not ready to adjust volume.")
        }
      } else {
        audioRef.current.volume = 0
      }
      setIsMuted(true)
    }
  }

  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1))
    setIsPlaying(true)
    setError(null)
    if (!currentSong.isYouTube) {
      setTimeout(() => {
        audioRef.current.play().catch((error) => {
          setError("Error playing audio: " + error.message)
        })
      }, 100)
    }
  }

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex === songs.length - 1 ? 0 : prevIndex + 1))
    setIsPlaying(true)
    setError(null)
    if (!currentSong.isYouTube) {
      setTimeout(() => {
        audioRef.current.play().catch((error) => {
          setError("Error playing audio: " + error.message)
        })
      }, 100)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="frosted-glass rounded-lg shadow-lg overflow-hidden">
        {error && (
          <div className="p-4 bg-red-500 text-white text-center">
            {error}
          </div>
        )}
        <div className="relative">
          <div
            className={cn(
              "aspect-square bg-muted overflow-hidden transition-transform duration-[20000ms] ease-linear",
              isPlaying && "animate-spin-slow",
            )}
          >
            <img
              src={currentSong.cover || "/placeholder.svg?height=300&width=300"}
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
            <button onClick={prevSong} className="p-2 rounded-full hover:bg-background/50 transition-colors">
              <SkipBack className="h-6 w-6" />
            </button>

            <button
              onClick={togglePlay}
              className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors active:scale-95"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button onClick={nextSong} className="p-2 rounded-full hover:bg-background/50 transition-colors">
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

      <audio ref={audioRef} src={currentSong.isYouTube ? undefined : currentSong.src} className="hidden" />
      <div id="youtube-player" className="hidden"></div>
    </div>
  )
}

export default MusicPlayer