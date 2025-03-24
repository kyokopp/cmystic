"use client"

import { useState, useRef } from "react"
import { Dices } from "lucide-react"
import { cn } from "../lib/utils"

function Roulette() {
  const [options, setOptions] = useState(["Opção 1", "Opção 2", "Opção 3", "Opção 4", "Opção 5", "Opção 6"])

  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [newOption, setNewOption] = useState("")

  const wheelRef = useRef(null)

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setSelectedOption(null)

    // Gerar um número aleatório de rotações (entre 5 e 10 rotações completas)
    const spins = 5 + Math.random() * 5

    // Calcular o ângulo final (360 graus * número de rotações + ângulo adicional)
    const extraAngle = Math.floor(Math.random() * 360)
    const totalRotation = rotation + spins * 360 + extraAngle

    // Definir a rotação
    setRotation(totalRotation)

    // Calcular qual opção foi selecionada após a rotação
    setTimeout(() => {
      // O ângulo normalizado (0-360)
      const normalizedAngle = totalRotation % 360

      // Calcular qual seção da roda corresponde ao ângulo
      // Cada opção ocupa (360 / número de opções) graus
      const sectionSize = 360 / options.length

      // Calcular o índice da opção selecionada
      // Precisamos inverter a direção porque a roda gira no sentido horário
      // e queremos o item que está na posição "superior" (270 graus)
      const selectedIndex = Math.floor(((360 - normalizedAngle + 270) % 360) / sectionSize)

      setSelectedOption(options[selectedIndex % options.length])
      setIsSpinning(false)
    }, 5000) // 5 segundos de animação
  }

  const handleAddOption = () => {
    if (newOption.trim() && options.length < 12) {
      setOptions([...options, newOption.trim()])
      setNewOption("")
    }
  }

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = [...options]
      newOptions.splice(index, 1)
      setOptions(newOptions)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddOption()
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="frosted-glass rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <Dices className="h-6 w-6 text-primary" />
          <span>Roleta da Sorte</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Roda da roleta */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 mb-6">
              {/* Marcador de seleção (triângulo) */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[15px] border-l-transparent border-r-transparent border-t-primary"></div>
              </div>

              {/* Roda */}
              <div
                ref={wheelRef}
                className="w-full h-full rounded-full overflow-hidden border-4 border-primary/30 relative"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? "transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
                }}
              >
                {options.map((option, index) => {
                  const angle = (index * 360) / options.length
                  const skewCorrection = options.length % 2 === 0 ? 0 : 90 / options.length

                  return (
                    <div
                      key={index}
                      className="absolute top-0 left-0 w-full h-full origin-center"
                      style={{ transform: `rotate(${angle}deg)` }}
                    >
                      <div
                        className={cn(
                          "absolute top-0 left-0 w-1/2 h-full origin-right text-center flex items-center justify-center",
                          index % 2 === 0 ? "bg-primary/20" : "bg-primary/40",
                        )}
                        style={{
                          transform: `skew(${skewCorrection}deg)`,
                          paddingRight: "25%",
                        }}
                      >
                        <span
                          className="text-sm font-medium transform -rotate-90 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]"
                          style={{ transform: `rotate(${90 - angle}deg)` }}
                        >
                          {option}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Botão de girar */}
            <button
              onClick={spinWheel}
              disabled={isSpinning}
              className={cn(
                "px-6 py-3 rounded-full font-bold text-white transition-all",
                isSpinning ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/90 hover:scale-105",
              )}
            >
              <span className="flex items-center gap-2">
                {isSpinning ? (
                  <>
                    <Dices className="h-5 w-5 animate-spin" />
                    Girando...
                  </>
                ) : (
                  <>
                    <Dices className="h-5 w-5" />
                    Girar Roleta
                  </>
                )}
              </span>
            </button>

            {/* Resultado */}
            {selectedOption && (
              <div className="mt-4 text-center animate-fade-in">
                <p className="text-lg">Resultado:</p>
                <p className="text-2xl font-bold text-primary">{selectedOption}</p>
              </div>
            )}
          </div>

          {/* Gerenciamento de opções */}
          <div className="frosted-glass p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Opções da Roleta</h3>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar nova opção..."
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={20}
              />
              <button
                onClick={handleAddOption}
                disabled={!newOption.trim() || options.length >= 12}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Adicionar
              </button>
            </div>

            <div className="text-sm text-muted-foreground mb-2">{options.length}/12 opções (mínimo: 2)</div>

            <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-background/50 animate-fade-in"
                >
                  <span>{option}</span>
                  <button
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                    className="text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Roulette

