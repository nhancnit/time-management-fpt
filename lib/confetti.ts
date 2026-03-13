"use client"

import confetti from "canvas-confetti"

/**
 * Fire FPT-themed confetti burst (orange #F27024 + white)
 */
export function fireFPTConfetti() {
  const duration = 3000
  const end = Date.now() + duration

  const colors = ["#F27024", "#FFFFFF", "#FF8C42", "#FFD700"]

  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }

  // Initial big burst from center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    startVelocity: 30,
    gravity: 0.8,
  })

  frame()
}

/**
 * Single celebration burst (lighter version for smaller events)
 */
export function fireSmallConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ["#F27024", "#FFFFFF"],
  })
}
