import { Heart, Gift, Star } from "lucide-react"

function Welcome() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-white fill-white/80" />
          </div>
          <h2 className="text-3xl font-bold text-center">Bem-vinda, Amor!</h2>
        </div>

        <div className="p-6">
          <p className="text-lg text-center mb-6">
            Este site foi feito especialmente para você. Explore os aplicativos e divirta-se!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <FeatureCard
              icon={<Gift className="h-8 w-8 text-pink-500" />}
              title="Feito com Amor"
              description="Cada detalhe deste site foi criado pensando em você."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-amber-500" />}
              title="Especial"
              description="Um lugar só nosso, cheio de ferramentas úteis e memórias."
            />
            <FeatureCard
              icon={<Heart className="h-8 w-8 text-red-500" />}
              title="Para Sempre"
              description="Um símbolo do meu amor por você, que durará para sempre."
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <h3 className="font-medium text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export default Welcome

