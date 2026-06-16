"use client"

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const points: { x: number, y: number }[] = []
    
    const handleMouseMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY })
      if (points.length > 20) points.shift() // Quantidade de pontos no rastro
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (points.length < 2) {
        requestAnimationFrame(animate)
        return
      }

      ctx.beginPath()
      ctx.strokeStyle = '#00FF41'
      ctx.lineWidth = 1
      ctx.lineCap = 'round'    // Define a ponta da linha como arredondada
      ctx.lineJoin = 'round'   // Define a junção das linhas como arredondada

      // Começa no primeiro ponto
      ctx.moveTo(points[0].x, points[0].y)

      // Desenha curvas quadráticas entre os pontos para suavizar o trajeto
      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2
        const yc = (points[i].y + points[i + 1].y) / 2
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
      }

      // Finaliza o traçado nos últimos pontos
      if (points.length > 2) {
        ctx.quadraticCurveTo(
          points[points.length - 2].x, 
          points[points.length - 2].y, 
          points[points.length - 1].x, 
          points[points.length - 1].y
        )
      }

      ctx.stroke()
      requestAnimationFrame(animate)

      ctx.shadowBlur = 10;      // Espalhamento do brilho
      ctx.shadowColor = '#00FF41'; // Cor do brilho
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
}