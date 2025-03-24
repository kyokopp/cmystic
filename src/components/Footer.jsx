import { Heart } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="border-t py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-center items-center">
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          te amo <Heart className="h-4 w-4 text-red-500 fill-red-500" /> | 2025
        </p>
      </div>
    </footer>
  )
}

