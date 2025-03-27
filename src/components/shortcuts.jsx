"use client"

import { useState, useEffect } from "react"
import { Plus, X, Edit, Trash2, Link, Image, Check, Loader2, Search } from "lucide-react"

function Shortcuts() {
  const [shortcuts, setShortcuts] = useState(() => {
    const saved = localStorage.getItem("shortcuts")
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Google",
            url: "https://google.com",
            icon: "https://www.google.com/favicon.ico",
            color: "#4285F4",
          },
          {
            id: 2,
            title: "YouTube",
            url: "https://youtube.com",
            icon: "https://www.youtube.com/favicon.ico",
            color: "#FF0000",
          },
          {
            id: 3,
            title: "Instagram",
            url: "https://instagram.com",
            icon: "https://www.instagram.com/favicon.ico",
            color: "#E1306C",
          },
        ]
  })

  const [isAddingShortcut, setIsAddingShortcut] = useState(false)
  const [isEditingShortcut, setIsEditingShortcut] = useState(null)
  const [newShortcut, setNewShortcut] = useState({
    title: "",
    url: "",
    icon: "",
    color: "#6d28d9",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts))
  }, [shortcuts])

  const handleAddShortcut = () => {
    if (!newShortcut.title.trim() || !newShortcut.url.trim()) return

    // Garantir que a URL tenha o protocolo
    let url = newShortcut.url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
    }

    const shortcutToAdd = {
      ...newShortcut,
      id: Date.now(),
      url: url,
      // Se não houver ícone definido, usar o favicon do site
      icon: newShortcut.icon || `https://www.google.com/s2/favicons?domain=${url}&sz=128`,
    }

    if (isEditingShortcut) {
      setShortcuts(shortcuts.map((s) => (s.id === isEditingShortcut ? { ...shortcutToAdd, id: isEditingShortcut } : s)))
      setIsEditingShortcut(null)
    } else {
      setShortcuts([...shortcuts, shortcutToAdd])
    }

    setNewShortcut({ title: "", url: "", icon: "", color: "#6d28d9" })
    setIsAddingShortcut(false)
  }

  const handleEditShortcut = (shortcut) => {
    setNewShortcut({ ...shortcut })
    setIsEditingShortcut(shortcut.id)
    setIsAddingShortcut(true)
  }

  const handleDeleteShortcut = (id) => {
    setShortcuts(shortcuts.filter((s) => s.id !== id))
  }

  const handleFetchFavicon = async () => {
    if (!newShortcut.url) return

    setIsLoading(true)

    // Garantir que a URL tenha o protocolo
    let url = newShortcut.url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url
    }

    try {
      // Usar o serviço do Google para obter o favicon
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=128`

      setNewShortcut({
        ...newShortcut,
        icon: faviconUrl,
        url: url,
      })
    } catch (error) {
      console.error("Erro ao buscar favicon:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsAddingShortcut(false)
    setIsEditingShortcut(null)
    setNewShortcut({ title: "", url: "", icon: "", color: "#6d28d9" })
  }

  const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.url.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="frosted-glass rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Link className="h-6 w-6 text-primary" />
            <span>Meus Atalhos</span>
          </h2>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar atalhos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <button
              onClick={() => setIsAddingShortcut(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Plus className="h-5 w-5 mr-1" />
              Adicionar
            </button>
          </div>
        </div>

        {/* Modal para adicionar/editar atalho */}
        {isAddingShortcut && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in">
            <div className="frosted-glass-strong rounded-lg p-6 max-w-md w-full mx-4 my-16 animate-slide-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-background/80 backdrop-blur-sm py-2 -mt-2 -mx-2 px-2 rounded-t-lg">
                <h3 className="text-xl font-bold">{isEditingShortcut ? "Editar Atalho" : "Novo Atalho"}</h3>
                <button onClick={handleCancel} className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Título</label>
                  <input
                    type="text"
                    value={newShortcut.title}
                    onChange={(e) => setNewShortcut({ ...newShortcut, title: e.target.value })}
                    placeholder="Ex: Google"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newShortcut.url}
                      onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
                      placeholder="Ex: google.com"
                      className="flex-1 px-3 py-2 rounded-md border border-input bg-background/50"
                    />
                    <button
                      onClick={handleFetchFavicon}
                      disabled={!newShortcut.url || isLoading}
                      className="px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50"
                      title="Buscar ícone automaticamente"
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Ícone (opcional)</label>
                  <input
                    type="text"
                    value={newShortcut.icon}
                    onChange={(e) => setNewShortcut({ ...newShortcut, icon: e.target.value })}
                    placeholder="URL do ícone ou deixe em branco para automático"
                    className="w-full px-3 py-2 rounded-md border border-input bg-background/50"
                  />
                  {newShortcut.icon && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-background/50 flex items-center justify-center">
                        <img
                          src={newShortcut.icon || "/placeholder.svg"}
                          alt="Ícone"
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=24&width=24"
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">Pré-visualização do ícone</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Cor de destaque</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newShortcut.color}
                      onChange={(e) => setNewShortcut({ ...newShortcut, color: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground">{newShortcut.color}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button onClick={handleCancel} className="px-4 py-2 rounded-md border border-input hover:bg-accent">
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddShortcut}
                    disabled={!newShortcut.title || !newShortcut.url}
                    className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" />
                    {isEditingShortcut ? "Atualizar" : "Adicionar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid de atalhos */}
        {filteredShortcuts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm ? (
              <>
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum atalho encontrado para "{searchTerm}"</p>
              </>
            ) : (
              <>
                <Link className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Você ainda não tem atalhos. Clique em "Adicionar" para criar seu primeiro atalho.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredShortcuts.map((shortcut) => (
              <ShortcutCard
                key={shortcut.id}
                shortcut={shortcut}
                onEdit={() => handleEditShortcut(shortcut)}
                onDelete={() => handleDeleteShortcut(shortcut.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ShortcutCard({ shortcut, onEdit, onDelete }) {
  const [showControls, setShowControls] = useState(false)

  const handleClick = (e) => {
    // Evitar abrir o link se estiver clicando nos controles
    if (e.target.closest(".shortcut-controls")) return

    window.open(shortcut.url, "_blank")
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div
        onClick={handleClick}
        className="shortcut-card frosted-glass aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 border-2 border-transparent hover:border-primary/20 group-hover:scale-105 group-hover:shadow-lg group-active:scale-95"
        style={{
          "--highlight-color": shortcut.color || "hsl(var(--primary))",
        }}
      >
        {/* Efeito de brilho no hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--highlight-color)]/10 to-transparent"></div>
        </div>

        {/* Ícone */}
        <div className="relative w-12 h-12 mb-2 flex items-center justify-center">
          <img
            src={shortcut.icon || `https://www.google.com/s2/favicons?domain=${shortcut.url}&sz=128`}
            alt={shortcut.title}
            className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=40&width=40"
            }}
          />
        </div>

        {/* Título (visível apenas no hover) */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[var(--highlight-color)]/30 to-transparent p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-center text-sm font-medium truncate">{shortcut.title}</p>
        </div>
      </div>

      {/* Controles de edição/exclusão */}
      {showControls && (
        <div className="shortcut-controls absolute top-1 right-1 flex gap-1 animate-fade-in z-10">
          <button
            onClick={onEdit}
            className="p-1 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
            title="Editar atalho"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
            title="Remover atalho"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Shortcuts

