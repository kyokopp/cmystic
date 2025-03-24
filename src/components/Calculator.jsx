"use client"

import { useState, useEffect } from "react"
import { cn } from "../lib/utils"

function Calculator() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState([])

  const clearAll = () => {
    setDisplay("0")
    setMemory(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearDisplay = () => {
    setDisplay("0")
  }

  const toggleSign = () => {
    setDisplay(display.charAt(0) === "-" ? display.substring(1) : "-" + display)
  }

  const inputPercent = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(value / 100))
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
      return
    }

    if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? String(digit) : display + digit)
    }
  }

  const performOperation = (nextOperation) => {
    const inputValue = Number.parseFloat(display)

    if (memory === null) {
      setMemory(inputValue)
    } else if (operation) {
      const currentValue = memory || 0
      let newValue

      switch (operation) {
        case "+":
          newValue = currentValue + inputValue
          break
        case "-":
          newValue = currentValue - inputValue
          break
        case "×":
          newValue = currentValue * inputValue
          break
        case "÷":
          newValue = currentValue / inputValue
          break
        default:
          newValue = inputValue
      }

      setMemory(newValue)
      setDisplay(String(newValue))

      // Add to history
      setHistory([...history, `${currentValue} ${operation} ${inputValue} = ${newValue}`])
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const handleKeyDown = (event) => {
    let { key } = event

    if (key === "Enter") key = "="
    if (key === "/") key = "÷"
    if (key === "*") key = "×"

    if (/\d/.test(key)) {
      event.preventDefault()
      inputDigit(Number.parseInt(key, 10))
    } else if (key === ".") {
      event.preventDefault()
      inputDot()
    } else if (key === "Backspace") {
      event.preventDefault()
      if (display !== "0") {
        setDisplay(display.substring(0, display.length - 1) || "0")
      }
    } else if (key === "Clear" || key === "Escape") {
      event.preventDefault()
      clearAll()
    } else if (key === "+" || key === "-" || key === "×" || key === "÷") {
      event.preventDefault()
      performOperation(key)
    } else if (key === "=") {
      event.preventDefault()
      performOperation(null)
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [display, memory, operation, waitingForOperand])

  const CalculatorButton = ({ onClick, className, children, variant = "default" }) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "primary":
          return "bg-primary text-primary-foreground hover:bg-primary/90"
        case "secondary":
          return "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        case "accent":
          return "bg-accent text-accent-foreground hover:bg-accent/80"
        default:
          return "bg-background/50 hover:bg-background/70"
      }
    }

    return (
      <button
        onClick={onClick}
        className={cn(
          "rounded-lg font-medium text-lg flex items-center justify-center transition-all active:scale-95",
          getVariantClasses(),
          className,
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="max-w-xs mx-auto">
      <div className="frosted-glass rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-background/30">
          <h2 className="text-xl font-bold mb-2">Calculadora</h2>
          <div className="bg-background/50 rounded-lg p-4 text-right h-16 flex items-center justify-end overflow-hidden">
            <div className="text-2xl font-mono truncate animate-fade-in">{display}</div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-4 gap-2">
          <CalculatorButton onClick={clearAll} variant="secondary" className="col-span-2">
            AC
          </CalculatorButton>
          <CalculatorButton onClick={toggleSign} variant="secondary">
            +/-
          </CalculatorButton>
          <CalculatorButton onClick={() => performOperation("÷")} variant="accent">
            ÷
          </CalculatorButton>

          <CalculatorButton onClick={() => inputDigit(7)}>7</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit(8)}>8</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit(9)}>9</CalculatorButton>
          <CalculatorButton onClick={() => performOperation("×")} variant="accent">
            ×
          </CalculatorButton>

          <CalculatorButton onClick={() => inputDigit(4)}>4</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit(5)}>5</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit(6)}>6</CalculatorButton>
          <CalculatorButton onClick={() => performOperation("-")} variant="accent">
            -
          </CalculatorButton>

          <CalculatorButton onClick={() => inputDigit(1)}>1</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit(2)}>2</CalculatorButton>
          <CalculatorButton onClick={() => inputDigit(3)}>3</CalculatorButton>
          <CalculatorButton onClick={() => performOperation("+")} variant="accent">
            +
          </CalculatorButton>

          <CalculatorButton onClick={() => inputDigit(0)} className="col-span-2">
            0
          </CalculatorButton>
          <CalculatorButton onClick={inputDot}>.</CalculatorButton>
          <CalculatorButton onClick={() => performOperation(null)} variant="primary">
            =
          </CalculatorButton>
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-white/10">
            <h3 className="text-sm font-medium mb-2">Histórico</h3>
            <div className="max-h-32 overflow-y-auto text-xs text-muted-foreground">
              {history.map((item, index) => (
                <div key={index} className="mb-1 animate-fade-in">
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Calculator

