import { Heart } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export const Header = () => {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          <h1 className="text-xl font-bold">Mystic</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground hidden sm:block">Um lugar especial só para você</p>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

