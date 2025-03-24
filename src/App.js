"use client"

import { useState } from "react"
import { Home, ListTodo, CalculatorIcon, FileText, Music } from "lucide-react"
import { ThemeProvider } from "./components/theme-provider"
import TodoList from "./components/TodoList"
import Calculator from "./components/Calculator"
import NoteApp from "./components/NoteApp"
import MusicPlayer from "./components/MusicPlayer"
import Welcome from "./components/Welcome"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { cn } from "./lib/utils"

function App() {
  const [activeTab, setActiveTab] = useState("welcome")

  const tabs = [
    { id: "welcome", label: "Bem-vinda", icon: <Home className="h-5 w-5" /> },
    { id: "todo", label: "Lista de Tarefas", icon: <ListTodo className="h-5 w-5" /> },
    { id: "calc", label: "Calculadora", icon: <CalculatorIcon className="h-5 w-5" /> },
    { id: "notes", label: "Notas", icon: <FileText className="h-5 w-5" /> },
    { id: "music", label: "Tocador de Música", icon: <Music className="h-5 w-5" /> },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "welcome":
        return <Welcome />
      case "todo":
        return <TodoList />
      case "calc":
        return <Calculator />
      case "notes":
        return <NoteApp />
      case "music":
        return <MusicPlayer />
      default:
        return <Welcome />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="app-theme">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        {/* Tab Bar */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-primary text-primary font-medium"
                      : "border-transparent hover:text-primary/80 hover:border-primary/30",
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">{renderContent()}</main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App

