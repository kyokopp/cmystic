"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Plus, X } from "lucide-react";
import { cn } from "../lib/utils";

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isYouTubeApiReady, setIsYouTubeApiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility
  const [youtubeLink, setYoutubeLink] = useState(""); // State for YouTube link input
  const audioRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const volumeTimeoutRef = useRef(null);
  const hasEndedRef = useRef(false);
  const intervalRef = useRef(null);
  const crossfadeIntervalRef = useRef(null);

  const crossfadeDuration = 2000;
  const crossfadeStart = 3000;
  const crossfadeSteps = 20;

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
  ];

  const [queue, setQueue] = useState(initialSongs); // Queue of songs to play
  const [currentSong, setCurrentSong] = useState(queue[0] || null); // Current song being played

  // Load YouTube IFrame API and wait for it to be ready
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsYouTubeApiReady(true);
      };
    } else {
      setIsYouTubeApiReady(true);
    }

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  // Dynamically set thumbnails for YouTube songs in the queue
  useEffect(() => {
    const updatedQueue = queue.map((song) => {
      if (song.isYouTube && !song.cover) {
        try {
          const url = new URL(song.src);
          const videoId = url.searchParams.get("v") || song.src.split("v=")[1]?.split("&")[0];
          if (videoId) {
            return {
              ...song,
              cover: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            };
          }
        } catch (error) {
          console.error("Invalid YouTube URL for thumbnail:", song.src);
        }
      }
      return song;
    });
    setQueue(updatedQueue);
  }, [queue.length]); // Update thumbnails when queue length changes

  // Reset currentTime, duration, and loading state when switching songs
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setError(null);
    setIsLoading(true);
    hasEndedRef.current = false;
    setCurrentSong(queue[0] || null);
  }, [queue]);

  // Handle YouTube Link Submission
  const handleAddSong = () => {
    if (!youtubeLink) {
      setError("Please enter a YouTube link.");
      return;
    }

    let videoId = "";
    try {
      const url = new URL(youtubeLink);
      videoId = url.searchParams.get("v") || youtubeLink.split("v=")[1]?.split("&")[0];
    } catch (error) {
      setError("Invalid YouTube URL. Please try again.");
      return;
    }

    if (!videoId) {
      setError("Could not extract video ID from URL.");
      return;
    }

    const newSong = {
      title: "Unknown Title", // YouTube API could be used to fetch the title
      artist: "Unknown Artist",
      src: youtubeLink,
      isYouTube: true,
      cover: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };

    setQueue((prevQueue) => [...prevQueue, newSong]);
    setYoutubeLink("");
    setIsPopupOpen(false);
    setError(null);
  };

  // Handle YouTube Player for YouTube tracks
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (currentSong?.isYouTube && isYouTubeApiReady) {
      if (!window.YT || !window.YT.Player) {
        setError("Failed to load YouTube API. Please try again later.");
        setIsLoading(false);
        return;
      }

      let videoId = "";
      try {
        const url = new URL(currentSong.src);
        videoId = url.searchParams.get("v") || currentSong.src.split("v=")[1]?.split("&")[0];
      } catch (error) {
        setError("Invalid YouTube URL: " + currentSong.src);
        setIsLoading(false);
        return;
      }

      if (!videoId) {
        setError("Could not extract video ID from URL: " + currentSong.src);
        setIsLoading(false);
        return;
      }

      const onPlayerReady = (event) => {
        setIsLoading(false);
        event.target.setVolume(isMuted ? 0 : volume * 100);
        if (isPlaying) event.target.playVideo();
      };

      const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
          setIsPlaying(true);
          const duration = event.target.getDuration();
          setDuration(duration);

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }

          intervalRef.current = setInterval(() => {
            if (youtubePlayerRef.current && typeof youtubePlayerRef.current.getCurrentTime === "function") {
              const current = youtubePlayerRef.current.getCurrentTime();
              console.log(`Song: ${currentSong.title}, Current: ${current}, Duration: ${duration}`);
              setCurrentTime(current);

              if (current >= duration - crossfadeStart && current < duration - crossfadeStart + 0.5 && !hasEndedRef.current) {
                console.log("Starting crossfade for YouTube track");
                startCrossfade(true, (nextVolume) => {
                  if (!hasEndedRef.current) {
                    hasEndedRef.current = true;
                    nextSongWithFadeIn(nextVolume);
                  }
                });
              }

              if (current >= duration - 0.5 && !hasEndedRef.current) {
                console.log("Switching song via interval (YouTube)");
                clearInterval(intervalRef.current);
                hasEndedRef.current = true;
                nextSongWithFadeIn(isMuted ? 0 : volume);
              }
            }
          }, 250);
        } else if (event.data === window.YT.PlayerState.PAUSED) {
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else if (event.data === window.YT.PlayerState.ENDED) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          if (!hasEndedRef.current) {
            console.log("Switching song via ENDED event (YouTube)");
            hasEndedRef.current = true;
            nextSongWithFadeIn(isMuted ? 0 : volume);
          }
        }
      };

      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
        youtubePlayerRef.current = null;
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
      });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (crossfadeIntervalRef.current) {
        clearInterval(crossfadeIntervalRef.current);
        crossfadeIntervalRef.current = null;
      }
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
        youtubePlayerRef.current = null;
      }
    };
  }, [currentSong, isYouTubeApiReady]);

  // Update YouTube player volume when volume changes
  useEffect(() => {
    if (currentSong?.isYouTube && youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
      youtubePlayerRef.current.setVolume(isMuted ? 0 : volume * 100);
    }
  }, [volume, isMuted]);

  // Handle <audio> element for non-YouTube tracks
  useEffect(() => {
    if (currentSong && !currentSong.isYouTube) {
      const audio = audioRef.current;

      const updateTime = () => {
        const current = audio.currentTime;
        setCurrentTime(current);

        if (current >= duration - crossfadeStart && current < duration - crossfadeStart + 0.5 && !hasEndedRef.current) {
          console.log("Starting crossfade for <audio> track");
          startCrossfade(false, (nextVolume) => {
            if (!hasEndedRef.current) {
              hasEndedRef.current = true;
              nextSongWithFadeIn(nextVolume);
            }
          });
        }
      };

      const updateDuration = () => {
        setDuration(audio.duration);
        setIsLoading(false);
      };

      const endedHandler = () => {
        if (!hasEndedRef.current) {
          console.log("Switching song via <audio> ended event");
          hasEndedRef.current = true;
          nextSongWithFadeIn(isMuted ? 0 : volume);
        }
      };

      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
      audio.addEventListener("ended", endedHandler);

      if (isPlaying) {
        audio.play().catch((error) => {
          setError("Error playing audio: " + error.message);
          setIsLoading(false);
        });
      }

      audio.volume = isMuted ? 0 : volume;

      return () => {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
        audio.removeEventListener("ended", endedHandler);
        audio.pause();
        if (crossfadeIntervalRef.current) {
          clearInterval(crossfadeIntervalRef.current);
          crossfadeIntervalRef.current = null;
        }
      };
    }
  }, [currentSong, isPlaying, volume, isMuted, duration]);

  const togglePlay = () => {
    if (currentSong?.isYouTube) {
      if (!youtubePlayerRef.current || typeof youtubePlayerRef.current.playVideo !== "function") {
        setError("YouTube player not initialized. Please try again.");
        return;
      }
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo();
      } else {
        youtubePlayerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    } else if (currentSong) {
      const audio = audioRef.current;
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          setError("Error playing audio: " + error.message);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgress = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (currentSong?.isYouTube) {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.seekTo === "function") {
        youtubePlayerRef.current.seekTo(newTime);
      }
    } else if (currentSong) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolume = (e) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);

    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }

    volumeTimeoutRef.current = setTimeout(() => {
      if (currentSong?.isYouTube) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
          youtubePlayerRef.current.setVolume(newVolume * 100);
        } else {
          setError("YouTube player not ready to adjust volume.");
        }
      } else if (currentSong) {
        audioRef.current.volume = newVolume;
      }
    }, 100);

    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      if (currentSong?.isYouTube) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
          youtubePlayerRef.current.setVolume(volume * 100);
        } else {
          setError("YouTube player not ready to adjust volume.");
        }
      } else if (currentSong) {
        audioRef.current.volume = volume;
      }
      setIsMuted(false);
    } else {
      if (currentSong?.isYouTube) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
          youtubePlayerRef.current.setVolume(0);
        } else {
          setError("YouTube player not ready to adjust volume.");
        }
      } else if (currentSong) {
        audioRef.current.volume = 0;
      }
      setIsMuted(true);
    }
  };

  const prevSong = () => {
    setQueue((prevQueue) => {
      if (prevQueue.length <= 1) {
        return initialSongs; // Reset to initial songs if queue is empty
      }
      const newQueue = [...prevQueue];
      const lastSong = newQueue.pop(); // Remove the current song
      return [lastSong, ...newQueue]; // Move the last song to the front
    });
  };

  const nextSong = () => {
    setQueue((prevQueue) => {
      if (prevQueue.length <= 1) {
        return initialSongs; // Reset to initial songs if queue is empty
      }
      const newQueue = prevQueue.slice(1); // Remove the current song
      return newQueue.length > 0 ? newQueue : initialSongs;
    });
  };

  const startCrossfade = (isYouTube, onComplete) => {
    if (crossfadeIntervalRef.current) {
      clearInterval(crossfadeIntervalRef.current);
    }

    let step = 0;
    const stepDuration = crossfadeDuration / crossfadeSteps;
    const volumeStep = (isMuted ? 0 : volume) / crossfadeSteps;

    let currentVolume = isMuted ? 0 : volume;
    let nextVolume = 0;

    crossfadeIntervalRef.current = setInterval(() => {
      step++;
      currentVolume = Math.max(0, currentVolume - volumeStep);
      nextVolume = Math.min(isMuted ? 0 : volume, nextVolume + volumeStep);

      if (isYouTube) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
          youtubePlayerRef.current.setVolume(currentVolume * 100);
        }
      } else {
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }

      if (step >= crossfadeSteps) {
        clearInterval(crossfadeIntervalRef.current);
        onComplete(nextVolume);
      }
    }, stepDuration);
  };

  const nextSongWithFadeIn = (startVolume) => {
    setQueue((prevQueue) => {
      if (prevQueue.length <= 1) {
        return initialSongs; // Reset to initial songs if queue is empty
      }
      const newQueue = prevQueue.slice(1);
      return newQueue.length > 0 ? newQueue : initialSongs;
    });

    // Set initial volume to 0 for fade-in
    if (currentSong?.isYouTube) {
      if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
        youtubePlayerRef.current.setVolume(0);
      }
    } else if (currentSong) {
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }

    // Fade in the next song
    let step = 0;
    const stepDuration = crossfadeDuration / crossfadeSteps;
    const volumeStep = startVolume / crossfadeSteps;
    let currentVolume = 0;

    if (crossfadeIntervalRef.current) {
      clearInterval(crossfadeIntervalRef.current);
    }

    crossfadeIntervalRef.current = setInterval(() => {
      step++;
      currentVolume = Math.min(startVolume, currentVolume + volumeStep);

      if (currentSong?.isYouTube) {
        if (youtubePlayerRef.current && typeof youtubePlayerRef.current.setVolume === "function") {
          youtubePlayerRef.current.setVolume(currentVolume * 100);
        }
      } else if (currentSong) {
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }

      if (step >= crossfadeSteps) {
        clearInterval(crossfadeIntervalRef.current);
      }
    }, stepDuration);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Music Player</h2>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label="Add Song"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Popup for adding YouTube link */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="frosted-glass rounded-lg p-6 w-full max-w-sm backdrop-blur-md bg-white/10 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Add YouTube Song</h3>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-white hover:text-gray-300"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="Enter YouTube link"
              className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSong}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Music Player */}
      <div className="frosted-glass rounded-lg shadow-lg overflow-hidden">
        {error && !isPopupOpen && (
          <div className="p-4 bg-red-500 text-white text-center">{error}</div>
        )}
        {currentSong ? (
          <>
            <div className="relative">
              <div className="w-full aspect-square bg-muted overflow-hidden">
                <div className="relative w-full h-full">
                  <img
                    src={currentSong.cover || "/placeholder.svg?height=300&width=300"}
                    alt={currentSong.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
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
                  disabled={isLoading}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
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
          </>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No songs in queue. Add a song to start playing.
          </div>
        )}
      </div>

      {/* Queue Display */}
      {queue.length > 1 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Up Next</h3>
          <ul className="space-y-2">
            {queue.slice(1).map((song, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <img
                  src={song.cover || "/placeholder.svg?height=40&width=40"}
                  alt={song.title}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <audio ref={audioRef} src={currentSong && !currentSong.isYouTube ? currentSong.src : undefined} className="hidden" />
      <div id="youtube-player" className="hidden"></div>
    </div>
  );
}

export default MusicPlayer;