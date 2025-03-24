"use client"

import { useState } from "react"
import { PlusCircle, Trash2, CheckCircle, Circle } from "lucide-react"
import { cn } from "../lib/utils"

function TodoList() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false, id: Date.now() }])
      setTask("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <span className="bg-primary/10 text-primary p-2 rounded-full mr-2">
            <CheckCircle className="h-5 w-5" />
          </span>
          Lista de Tarefas
        </h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite uma tarefa..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            onClick={addTask}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            Adicionar
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground opacity-0 animate-fade-in">
            Nenhuma tarefa adicionada ainda.
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors animate-slide-in"
              >
                <div className="flex items-center">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mr-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  <span className={cn(task.completed && "line-through text-muted-foreground")}>{task.text}</span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TodoList

