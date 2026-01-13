'use client'

export function triggerConfetti() {
  if (typeof window === 'undefined') return

  // Simple CSS-based confetti
  const colors = ['#FA4616', '#FCF6F5', '#141212', '#FFD700', '#FF6B6B']
  const count = 50

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div')
    confetti.className = 'confetti'
    confetti.style.left = `${Math.random() * 100}%`
    confetti.style.top = `${Math.random() * 100}%`
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)]
    confetti.style.animationDelay = `${Math.random() * 0.5}s`
    confetti.style.width = `${Math.random() * 10 + 5}px`
    confetti.style.height = `${Math.random() * 10 + 5}px`
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'

    document.body.appendChild(confetti)

    setTimeout(() => {
      confetti.remove()
    }, 3000)
  }
}

// Alternative: Use canvas-confetti if available
export async function triggerCanvasConfetti() {
  if (typeof window === 'undefined') return

  try {
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FA4616', '#FCF6F5', '#141212'],
    })
  } catch (error) {
    // Fallback to CSS confetti
    triggerConfetti()
  }
}
