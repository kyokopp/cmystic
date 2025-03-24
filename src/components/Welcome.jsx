"use client"

import { useState, useEffect } from "react"
import { Heart, Gift, Star, Quote, Calendar } from "lucide-react"

// GIFs para elementos animados
const heartGif = "https://i.pinimg.com/originals/5c/73/d8/5c73d837ad836e59d71afdd49826191a.gif" // Substitua pelo URL do seu GIF
const starGif = "https://i.pinimg.com/originals/5c/73/d8/5c73d837ad836e59d71afdd49826191a.gif" // Substitua pelo URL do seu GIF

function Welcome() {
  const [dailyPhrase, setDailyPhrase] = useState("")
  const [date, setDate] = useState("")

  // Frases motivacionais para cada dia da semana
  const phrases = [
    "a build do kayn azul tambem pode servir pro kayn vermelho.",
    "genshin vicia mais que droga.",
    "voce é peituda metida.",
    "bananada de marmelo.",
    "ler raio irrita.",
    "brainrot.",
    "frase do dia .",
  ]

  useEffect(() => {
    // Obter a data atual
    const today = new Date()
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    setDate(today.toLocaleDateString("pt-BR", options))

    // Selecionar uma frase com base no dia da semana (0-6, domingo-sábado)
    const dayOfWeek = today.getDay()
    setDailyPhrase(phrases[dayOfWeek])
  }, [])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="frosted-glass rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 animate-float opacity-30">
              <img src={heartGif || "/placeholder.svg"} alt="" className="w-16 h-16" />
            </div>
            <div className="absolute bottom-10 right-10 animate-float opacity-30" style={{ animationDelay: "1s" }}>
              <img src={starGif || "/placeholder.svg"} alt="" className="w-16 h-16" />
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <Heart className="h-16 w-16 text-white fill-white/80 animate-pulse-slow" />
            </div>
            <h2 className="text-3xl font-bold text-center">Bem-vinda, minha Piticurica </h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-lg text-center mb-6">
            seu site gaymer personalizado divonico
          </p>

          {/* Seção de frase diária */}
          <div className="my-8 p-6 rounded-lg frosted-glass">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Calendar className="h-5 w-5" />
              <h3 className="font-medium">{date}</h3>
            </div>

            <div className="flex gap-4">
              <div className="text-primary">
                <Quote className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg italic">{dailyPhrase}</p>
                <p className="text-right mt-2 text-sm text-muted-foreground">— te amo muitao</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <FeatureCard
              icon={<Gift className="h-8 w-8 text-pink-500" />}
              title="Seu lugar especial"
              description="totalmente livre de neguebas."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-amber-500" />}
              title="Features"
              description="Atualizacoes a cada 2 semanas."
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8 text-red-500" />}
              title="Para Sempre"
              description="Hai H1tler."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="frosted-glass rounded-lg p-4 text-center transition-all hover:scale-105">
      <div className="flex justify-center mb-2">{icon}</div>
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default Welcome

