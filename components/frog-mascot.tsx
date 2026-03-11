"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { FROG_EMOJIS, getRandomDialogue, type FrogMode } from "@/lib/frog-dialogues"
import { storage } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { FSTORE_ITEMS } from "@/lib/fstore-data"
import { toast } from "sonner"
import { Sparkles } from "lucide-react"

interface FrogMascotProps {
  mode?: FrogMode
  onModeChange?: (mode: FrogMode) => void
  className?: string
  showDialogue?: boolean
  size?: "sm" | "md" | "lg"
}

export function FrogMascot({
  mode: externalMode,
  onModeChange,
  className,
  showDialogue = true,
  size = "md",
}: FrogMascotProps) {
  const [internalMode, setInternalMode] = useState<FrogMode>("thanh_loc")
  const [dialogue, setDialogue] = useState<string>("")
  const [showBubble, setShowBubble] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [hasEasterEgg, setHasEasterEgg] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [equippedItems, setEquippedItems] = useState<{
    body?: string
    accessory?: string
    handheld?: string
    background?: string
  }>({})

  const mode = externalMode || internalMode

  // Load equipped items
  useEffect(() => {
    const fstore = storage.getFStore()
    if (fstore) {
      setEquippedItems(fstore.equippedItems)
    }
  }, [])

  // Initial scanning effect and Easter Egg logic 
  useEffect(() => {
    setIsScanning(true)
    const scanTimer = setTimeout(() => {
      setIsScanning(false)
      triggerDialogue("thanh_loc")
    }, 2000)

    // Easter Egg Logic: 10% chance to have an Easter Egg today (persisted in localStorage to avoid re-rolling on refresh)
    const today = new Date().toDateString()
    const storedEasterEgg = localStorage.getItem('fpt_study_easter_egg_date')
    const storedEasterEggClaimed = localStorage.getItem('fpt_study_easter_egg_claimed')

    if (storedEasterEgg === today) {
        if (storedEasterEggClaimed !== 'true') {
           setHasEasterEgg(true)
        }
    } else {
        // Roll for new Easter Egg
        const hasEgg = Math.random() < 0.10 // 10% chance
        if (hasEgg) {
            setHasEasterEgg(true)
            localStorage.setItem('fpt_study_easter_egg_date', today)
            localStorage.setItem('fpt_study_easter_egg_claimed', 'false')
        } else {
            localStorage.setItem('fpt_study_easter_egg_date', today)
            localStorage.setItem('fpt_study_easter_egg_claimed', 'true') // mark as claimed to ignore
        }
    }

    return () => clearTimeout(scanTimer)
  }, [])

  const triggerDialogue = useCallback(
    (newMode: FrogMode) => {
      const newDialogue = getRandomDialogue(newMode)
      setDialogue(newDialogue)
      setShowBubble(true)

      if (!externalMode) {
        setInternalMode(newMode)
      }
      onModeChange?.(newMode)

      // Auto hide after 4 seconds
      setTimeout(() => {
        setShowBubble(false)
      }, 4000)
    },
    [externalMode, onModeChange],
  )

  const handleClick = async () => {
    if (hasEasterEgg && !isClaiming) {
       setIsClaiming(true)
       // random coin from 10 to 50
       const bonus = Math.floor(Math.random() * 41) + 10 
       
       try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('f_coins')
            .eq('id', session.user.id)
            .single()

          if (!fetchError && profile) {
             const newTotal = (profile.f_coins || 0) + bonus
             const { error: updateError } = await supabase
              .from('profiles')
              .update({ f_coins: newTotal })
              .eq('id', session.user.id)

            if (!updateError) {
               // success claim
               setHasEasterEgg(false)
               localStorage.setItem('fpt_study_easter_egg_claimed', 'true')

               const fstoreToUpdate = storage.getFStore()
               fstoreToUpdate.fCoins = newTotal
               storage.setFStore(fstoreToUpdate)
               
               window.dispatchEvent(new Event('fcoins-updated'))

               toast.success("🐸 Lộc xỉu Cóc Tạp Hóa!", {
                  description: `Bạn vừa nhặt được +${bonus} F-Coins từ chú Cóc!`
               })
               triggerDialogue("slay")
               setIsClaiming(false)
               return
            }
          }
        }
       } catch (err) {
         console.error("Easter egg claim failed", err)
       }
       setIsClaiming(false)
    }

    setClickCount((prev) => prev + 1)

    // After 3 clicks, activate gia_truong mode
    if (clickCount >= 2) {
      setIsShaking(true)
      triggerDialogue("gia_truong")
      setTimeout(() => setIsShaking(false), 1000)
      setClickCount(0)
    } else {
      // Random mode
      const modes: FrogMode[] = ["thanh_loc", "slay", "tam_linh"]
      const randomMode = modes[Math.floor(Math.random() * modes.length)]
      triggerDialogue(randomMode)
    }
  }

  // Trigger slay mode when completing task
  const triggerSlay = useCallback(() => {
    triggerDialogue("slay")
  }, [triggerDialogue])

  // Trigger panic mode
  const triggerPanic = useCallback(() => {
    setIsShaking(true)
    triggerDialogue("hoang_loan")
    setTimeout(() => setIsShaking(false), 2000)
  }, [triggerDialogue])

  const getEquippedItemImage = (slot: "body" | "accessory" | "handheld") => {
    const itemId = equippedItems[slot]
    if (!itemId) return null
    return FSTORE_ITEMS.find((i) => i.id === itemId)?.image
  }

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-48 h-48",
  }

  const bubbleSizeClasses = {
    sm: "text-xs max-w-[150px]",
    md: "text-sm max-w-[200px]",
    lg: "text-base max-w-[280px]",
  }

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      {/* Speech Bubble */}
      {showDialogue && showBubble && (
        <div
          className={cn(
            "absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-full z-10",
            "bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-lg",
            "border-2 border-primary/20",
            "animate-in fade-in slide-in-from-bottom-2 duration-300",
            bubbleSizeClasses[size],
          )}
        >
          <p className="text-foreground font-medium text-center leading-relaxed">{dialogue}</p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-800 border-r-2 border-b-2 border-primary/20 rotate-45" />
        </div>
      )}

      {/* Frog Container */}
      <div
        className={cn(
          "relative cursor-pointer transition-transform",
          sizeClasses[size],
          isShaking && "animate-shake",
          !isShaking && "hover:scale-105",
        )}
        onClick={handleClick}
      >
        {/* Scanning Effect */}
        {isScanning && (
          <div className="absolute inset-0 overflow-hidden rounded-full z-20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan" />
          </div>
        )}

        {/* Frog Base */}
        <div
          className={cn(
            "relative w-full h-full rounded-full overflow-hidden",
            "bg-gradient-to-br from-green-400 to-green-600",
            "border-4 border-green-700",
            "flex items-center justify-center",
            "shadow-lg",
          )}
        >
          {/* Frog Face */}
          <div className="relative w-3/4 h-3/4 flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-3 mb-1">
              <div
                className={cn(
                  "w-4 h-4 bg-white rounded-full flex items-center justify-center",
                  size === "lg" && "w-6 h-6",
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 bg-black rounded-full",
                    size === "lg" && "w-3 h-3",
                    mode === "gia_truong" && "bg-red-600",
                  )}
                />
              </div>
              <div
                className={cn(
                  "w-4 h-4 bg-white rounded-full flex items-center justify-center",
                  size === "lg" && "w-6 h-6",
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 bg-black rounded-full",
                    size === "lg" && "w-3 h-3",
                    mode === "gia_truong" && "bg-red-600",
                  )}
                />
              </div>
            </div>

            {/* Emoji Expression */}
            <span className={cn("text-xl", size === "sm" && "text-base", size === "lg" && "text-3xl")}>
              {FROG_EMOJIS[mode]}
            </span>
          </div>

          {/* Accessory Overlay */}
          {equippedItems.accessory && (
            <img
              src={getEquippedItemImage("accessory") || ""}
              alt="Accessory"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 object-contain"
            />
          )}
        </div>

        {/* Body Overlay */}
        {equippedItems.body && equippedItems.body !== "ao-cam" && (
          <img
            src={getEquippedItemImage("body") || ""}
            alt="Body"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 object-contain opacity-90"
          />
        )}

        {/* Handheld Overlay */}
        {equippedItems.handheld && (
          <img
            src={getEquippedItemImage("handheld") || ""}
            alt="Handheld"
            className="absolute -right-2 bottom-0 w-1/3 h-1/3 object-contain"
          />
        )}

        {/* Mode indicator */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background",
            "flex items-center justify-center text-xs",
            mode === "thanh_loc" && "bg-blue-500",
            mode === "gia_truong" && "bg-red-500",
            mode === "slay" && "bg-yellow-500",
            mode === "tam_linh" && "bg-purple-500",
            mode === "hoang_loan" && "bg-orange-500",
          )}
        >
          {mode === "thanh_loc" && "🧘"}
          {mode === "gia_truong" && "👊"}
          {mode === "slay" && "✨"}
          {mode === "tam_linh" && "🔮"}
          {mode === "hoang_loan" && "🔥"}
        </div>

        {/* Easter Egg Indicator */}
        {hasEasterEgg && (
           <div className="absolute -top-2 -right-2 animate-bounce flex items-center justify-center p-1 bg-yellow-500 rounded-full shadow-lg">
              <Sparkles className="h-4 w-4 text-white" />
           </div>
        )}
      </div>

      {/* Mode Label */}
      <p
        className={cn(
          "mt-2 text-muted-foreground capitalize",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base",
        )}
      >
        {mode === "thanh_loc" && "Thanh Lọc"}
        {mode === "gia_truong" && "Gia Trưởng"}
        {mode === "slay" && "Slay"}
        {mode === "tam_linh" && "Tâm Linh"}
        {mode === "hoang_loan" && "Hoảng Loạn"}
      </p>
    </div>
  )
}

// Export trigger functions for external use
export const useFrogMascot = () => {
  const [mode, setMode] = useState<FrogMode>("thanh_loc")

  return {
    mode,
    setMode,
    triggerSlay: () => setMode("slay"),
    triggerPanic: () => setMode("hoang_loan"),
    triggerGiaTruong: () => setMode("gia_truong"),
    triggerThanhLoc: () => setMode("thanh_loc"),
    triggerTamLinh: () => setMode("tam_linh"),
  }
}
