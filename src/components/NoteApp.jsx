"use client"

import { useState, useEffect } from "react"
import { Save, Trash2, Plus, FileText } from "lucide-react"
import { cn } from "../lib/utils"

function NoteApp() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes")
    return savedNotes
      ? JSON.parse(savedNotes)
      : [{ id: 1, title: "Nota 1", content: "", date: new Date().toISOString() }]
  })

  const [activeNoteId, setActiveNoteId] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNoteId) || notes[0]
  }

  const updateNoteContent = (content) => {
    setNotes(
      notes.map((note) => (note.id === activeNoteId ? { ...note, content, date: new Date().toISOString() } : note)),
    )
  }

  const addNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: `Nota ${notes.length + 1}`,
      content: "",
      date: new Date().toISOString(),
    }
    setNotes([...notes, newNote])
    setActiveNoteId(newNote.id)
  }

  const deleteNote = (id) => {
    if (notes.length <= 1) return

    const newNotes = notes.filter((note) => note.id !== id)
    setNotes(newNotes)

    if (activeNoteId === id) {
      setActiveNoteId(newNotes[0].id)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      <div className="md:col-span-1 frosted-glass rounded-lg shadow-lg p-4 h-[500px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-1">
            <FileText className="h-4 w-4" /> Minhas Notas
          </h3>
          <button onClick={addNewNote} className="p-1 rounded-full hover:bg-accent transition-colors" title="Nova nota">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Pesquisar notas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background/50 mb-2"
        />

        <div className="overflow-y-auto flex-grow">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhuma nota encontrada.</div>
          ) : (
            <ul className="space-y-1">
              {filteredNotes.map((note) => (
                <li key={note.id} className="animate-fade-in">
                  <button
                    onClick={() => setActiveNoteId(note.id)}
                    className={cn(
                      "w-full text-left p-2 rounded-md transition-colors",
                      activeNoteId === note.id ? "bg-primary/10 text-primary" : "hover:bg-accent",
                    )}
                  >
                    <div className="font-medium truncate">{note.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{formatDate(note.date)}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="md:col-span-2 frosted-glass rounded-lg shadow-lg p-4 h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={getActiveNote()?.title || ""}
            onChange={(e) => {
              setNotes(
                notes.map((note) =>
                  note.id === activeNoteId ? { ...note, title: e.target.value, date: new Date().toISOString() } : note,
                ),
              )
            }}
            className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
          />

          <div className="flex gap-2">
            <button
              onClick={() => deleteNote(activeNoteId)}
              className="p-1 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
              title="Excluir nota"
              disabled={notes.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              className="p-1 rounded-full hover:bg-primary/10 text-primary transition-colors"
              title="Salvo automaticamente"
            >
              <Save className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          Última edição: {formatDate(getActiveNote()?.date || new Date().toISOString())}
        </div>

        <textarea
          value={getActiveNote()?.content || ""}
          onChange={(e) => updateNoteContent(e.target.value)}
          placeholder="Escreva suas notas aqui..."
          className="flex-grow resize-none p-2 bg-transparent border-none focus:outline-none focus:ring-0 transition-all duration-200"
        />
      </div>
    </div>
  )
}

export default NoteApp

