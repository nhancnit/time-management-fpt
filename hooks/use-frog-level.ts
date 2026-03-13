"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { storage } from "@/lib/store"
import { getLevelByCoins, getUnlockedLevels, getLevelImage, getNextLevel, FROG_LEVELS } from "@/lib/frog-levels"
import type { FrogLevel } from "@/lib/frog-levels"
import { fireFPTConfetti } from "@/lib/confetti"
import { toast } from "sonner"

interface UseFrogLevelReturn {
  /** The highest level the user can currently reach */
  currentMaxLevel: FrogLevel
  /** The level the user is currently displaying as avatar */
  currentAvatarLevel: number
  /** All unlocked level numbers */
  unlockedLevels: number[]
  /** Image path for the currently displayed avatar */
  avatarImage: string
  /** Change the displayed avatar to a specific unlocked level */
  setAvatarLevel: (level: number) => void
  /** Progress info toward next level */
  nextLevelInfo: { nextLevel: FrogLevel; coinsNeeded: number; progress: number } | null
  /** Refresh state from storage */
  refresh: () => void
  /** Whether a level-up just occurred */
  levelUpInfo: FrogLevel | null
  /** Dismiss the level-up notification */
  dismissLevelUp: () => void
}

export function useFrogLevel(fCoins: number): UseFrogLevelReturn {
  const [currentAvatarLevel, setCurrentAvatarLevel] = useState(1)
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1])
  const [levelUpInfo, setLevelUpInfo] = useState<FrogLevel | null>(null)
  const prevMaxLevelRef = useRef<number>(1)

  // Load state from storage on mount
  useEffect(() => {
    const fstore = storage.getFStore()
    setCurrentAvatarLevel(fstore.currentAvatarLevel || 1)
    setUnlockedLevels(fstore.unlockedLevels || [1])
    prevMaxLevelRef.current = getLevelByCoins(fstore.fCoins).level
  }, [])

  // Detect level-up when fCoins changes
  useEffect(() => {
    if (fCoins === 0 && prevMaxLevelRef.current === 1) return // initial state, skip

    const newMaxLevel = getLevelByCoins(fCoins)
    const newUnlocked = getUnlockedLevels(fCoins)
    
    // Check if user reached a NEW level (higher than before)
    if (newMaxLevel.level > prevMaxLevelRef.current) {
      // Level UP! 🎉
      setLevelUpInfo(newMaxLevel)
      
      // Fire confetti
      setTimeout(() => {
        fireFPTConfetti()
      }, 300)

      // Show toast
      toast.success(`🎉 Chúc mừng! Cóc của bạn đã tiến hóa!`, {
        description: `Lên level ${newMaxLevel.level}: ${newMaxLevel.name}!`,
        duration: 5000,
      })

      // Auto-update avatar to the new level
      setCurrentAvatarLevel(newMaxLevel.level)
      
      // Persist
      const fstore = storage.getFStore()
      fstore.currentAvatarLevel = newMaxLevel.level
      fstore.unlockedLevels = newUnlocked
      storage.setFStore(fstore)
    }

    prevMaxLevelRef.current = newMaxLevel.level
    setUnlockedLevels(newUnlocked)

    // Also persist updated unlocked levels even without level-up (in case coins increased)
    storage.updateUnlockedLevels(newUnlocked)
  }, [fCoins])

  const currentMaxLevel = getLevelByCoins(fCoins)
  const nextLevelInfo = getNextLevel(fCoins)
  const avatarImage = getLevelImage(currentAvatarLevel)

  const handleSetAvatarLevel = useCallback((level: number) => {
    if (unlockedLevels.includes(level)) {
      setCurrentAvatarLevel(level)
      storage.setAvatarLevel(level)
    }
  }, [unlockedLevels])

  const refresh = useCallback(() => {
    const fstore = storage.getFStore()
    setCurrentAvatarLevel(fstore.currentAvatarLevel || 1)
    setUnlockedLevels(fstore.unlockedLevels || [1])
  }, [])

  const dismissLevelUp = useCallback(() => {
    setLevelUpInfo(null)
  }, [])

  return {
    currentMaxLevel,
    currentAvatarLevel,
    unlockedLevels,
    avatarImage,
    setAvatarLevel: handleSetAvatarLevel,
    nextLevelInfo,
    refresh,
    levelUpInfo,
    dismissLevelUp,
  }
}
