"use client"

export interface FrogLevel {
  level: number
  name: string
  description: string
  requiredCoins: number
  image: string
}

export const FROG_LEVELS: FrogLevel[] = [
  {
    level: 1,
    name: "Cóc Mầm",
    description: "Chú Cóc non nớt vừa bắt đầu hành trình học tập tại FPT",
    requiredCoins: 0,
    image: "/images/frogs/level-1.png",
  },
  {
    level: 2,
    name: "Cóc Sĩ",
    description: "Cóc chăm chỉ, miệt mài bên bàn học mỗi ngày",
    requiredCoins: 50,
    image: "/images/frogs/level-2.png",
  },
  {
    level: 3,
    name: "Cóc Võ",
    description: "Cóc mạnh mẽ, rèn luyện thể chất với Vovinam",
    requiredCoins: 200,
    image: "/images/frogs/level-3.png",
  },
  {
    level: 4,
    name: "Cóc Nhạc",
    description: "Cóc tài năng, đàn hát vui vẻ giữa giờ nghỉ",
    requiredCoins: 500,
    image: "/images/frogs/level-4.png",
  },
  {
    level: 5,
    name: "Cóc Số",
    description: "Cóc công nghệ, thành thạo code và máy tính",
    requiredCoins: 1000,
    image: "/images/frogs/level-5.png",
  },
  {
    level: 6,
    name: "Cóc Vàng",
    description: "Cóc quý hiếm, tỏa sáng rực rỡ như vàng",
    requiredCoins: 2000,
    image: "/images/frogs/level-6.png",
  },
  {
    level: 7,
    name: "Cóc Vương",
    description: "Cóc Vua, ngồi trên ngai vàng trị vì vương quốc FPT",
    requiredCoins: 5000,
    image: "/images/frogs/level-7.png",
  },
  {
    level: 8,
    name: "Legend",
    description: "Huyền thoại tối thượng, đỉnh cao của mọi chú Cóc",
    requiredCoins: 10000,
    image: "/images/frogs/level-8.png",
  },
]

/**
 * Get the highest level a user can reach based on their F-Coins
 */
export function getLevelByCoins(coins: number): FrogLevel {
  let result = FROG_LEVELS[0]
  for (const level of FROG_LEVELS) {
    if (coins >= level.requiredCoins) {
      result = level
    } else {
      break
    }
  }
  return result
}

/**
 * Get all levels that a user has unlocked based on their F-Coins
 */
export function getUnlockedLevels(coins: number): number[] {
  return FROG_LEVELS.filter((l) => coins >= l.requiredCoins).map((l) => l.level)
}

/**
 * Get the image path for a specific level
 */
export function getLevelImage(level: number): string {
  const found = FROG_LEVELS.find((l) => l.level === level)
  return found?.image || FROG_LEVELS[0].image
}

/**
 * Get the next level info (for progress display)
 */
export function getNextLevel(coins: number): { nextLevel: FrogLevel; coinsNeeded: number; progress: number } | null {
  const currentLevel = getLevelByCoins(coins)
  const nextIndex = FROG_LEVELS.findIndex((l) => l.level === currentLevel.level) + 1
  if (nextIndex >= FROG_LEVELS.length) return null
  
  const nextLevel = FROG_LEVELS[nextIndex]
  const coinsNeeded = nextLevel.requiredCoins - coins
  const progress = ((coins - currentLevel.requiredCoins) / (nextLevel.requiredCoins - currentLevel.requiredCoins)) * 100
  
  return { nextLevel, coinsNeeded, progress: Math.min(100, Math.max(0, progress)) }
}
