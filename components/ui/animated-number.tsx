"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    let raf: number
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const progress = Math.min(1, (ts - startRef.current) / duration)
      setDisplay(Math.floor(progress * value))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <span>{display.toLocaleString()}</span>
}
