"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { storage } from "@/lib/store"
import { getLevelByCoins, getUnlockedLevels, getLevelImage, getNextLevel, FROG_LEVELS } from "@/lib/frog-levels"
import type { FrogLevel } from "@/lib/frog-levels"
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
  const prevMaxUnlockedRef = useRef<number>(1)
  const isInitialMount = useRef(true)

  // Load state from storage on mount
  useEffect(() => {
    const fstore = storage.getFStore()
    setCurrentAvatarLevel(fstore.currentAvatarLevel || 1)
    const currentUnlocked = fstore.unlockedLevels || [1]
    setUnlockedLevels(currentUnlocked)
    prevMaxUnlockedRef.current = Math.max(...currentUnlocked)
  }, [])

  // Detect level-up when fCoins changes
  useEffect(() => {
    const newlyReachableLevels = getUnlockedLevels(fCoins)
    const newMaxReachable = getLevelByCoins(fCoins)
    
    // Ngăn hiển thị pháo hoa LevelUp ngay khi vừa kéo data F-Coins từ Database (vốn thường là lần Load mới của trang)
    if (isInitialMount.current) {
      if (fCoins > 0) isInitialMount.current = false;
      
      // Vẫn cập nhật tiến độ Max ngầm ẩn dưới background
      if (newMaxReachable.level > prevMaxUnlockedRef.current) {
        setCurrentAvatarLevel(newMaxReachable.level)
        prevMaxUnlockedRef.current = newMaxReachable.level
        storage.updateUnlockedLevels(newlyReachableLevels)
        storage.setAvatarLevel(newMaxReachable.level)
        const fstore = storage.getFStore()
        setUnlockedLevels(fstore.unlockedLevels)
      }
      return;
    }

    // Check if user reached a NEW level (higher than any previously unlocked)
    if (newMaxReachable.level > prevMaxUnlockedRef.current) {
      // Level UP! 🎉
      setLevelUpInfo(newMaxReachable)

      // Show toast
      toast.success(`🎉 Chúc mừng! Cóc của bạn đã tiến hóa!`, {
        description: `Lên level ${newMaxReachable.level}: ${newMaxReachable.name}!`,
        duration: 5000,
      })

      // Auto-update avatar to the new level
      setCurrentAvatarLevel(newMaxReachable.level)
      prevMaxUnlockedRef.current = newMaxReachable.level
      
      // Persist
      storage.updateUnlockedLevels(newlyReachableLevels)
      storage.setAvatarLevel(newMaxReachable.level)
      
      // Sync state
      const fstore = storage.getFStore()
      setUnlockedLevels(fstore.unlockedLevels)
    } else {
      // Coins dropped or just increased naturally without hitting a new max level.
      // We still update to grab any intermediate levels not previously unlocked (though normally sequential)
      storage.updateUnlockedLevels(newlyReachableLevels)
      const fstore = storage.getFStore()
      setUnlockedLevels(fstore.unlockedLevels)
      prevMaxUnlockedRef.current = Math.max(...fstore.unlockedLevels)
    }
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
