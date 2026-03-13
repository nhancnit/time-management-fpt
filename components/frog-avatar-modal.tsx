"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Lock, Check, Coins } from "lucide-react"
import { FROG_LEVELS } from "@/lib/frog-levels"
import type { FrogLevel } from "@/lib/frog-levels"
import { cn } from "@/lib/utils"

interface FrogAvatarModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAvatarLevel: number
  unlockedLevels: number[]
  onSelectAvatar: (level: number) => void
  nextLevelInfo: { nextLevel: FrogLevel; coinsNeeded: number; progress: number } | null
  fCoins: number
}

export function FrogAvatarModal({
  open,
  onOpenChange,
  currentAvatarLevel,
  unlockedLevels,
  onSelectAvatar,
  nextLevelInfo,
  fCoins,
}: FrogAvatarModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            🐸 Tiến hóa Cóc FPT
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Chọn avatar Cóc yêu thích. Mở khóa bằng cách kiếm F-Coins!
          </DialogDescription>
        </DialogHeader>

        {/* Progress to next level */}
        {nextLevelInfo && (
          <div className="px-1 py-2">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Tiếp theo: <span className="text-foreground font-medium">{nextLevelInfo.nextLevel.name}</span>
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Coins className="h-3.5 w-3.5 text-yellow-500" />
                Cần thêm <span className="text-[#F27024] font-bold">{nextLevelInfo.coinsNeeded}</span> F-Coins
              </span>
            </div>
            <Progress
              value={nextLevelInfo.progress}
              className="h-2.5 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-[#F27024] [&>div]:to-[#FF8C42]"
            />
          </div>
        )}

        {/* Frog Grid */}
        <ScrollArea className="max-h-[55vh] pr-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
            {FROG_LEVELS.map((frog) => {
              const isUnlocked = unlockedLevels.includes(frog.level)
              const isSelected = currentAvatarLevel === frog.level

              return (
                <div
                  key={frog.level}
                  className={cn(
                    "relative group rounded-xl p-3 transition-all cursor-pointer",
                    "border-2",
                    isSelected
                      ? "border-[#F27024] bg-[#F27024]/10 shadow-[0_0_20px_rgba(242,112,36,0.15)]"
                      : isUnlocked
                        ? "border-border hover:border-[#F27024]/50 hover:bg-[#F27024]/5"
                        : "border-border/30 cursor-not-allowed",
                  )}
                  onClick={() => {
                    if (isUnlocked) {
                      onSelectAvatar(frog.level)
                    }
                  }}
                >
                  {/* Status badges */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-[#F27024] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}

                  {/* Frog image */}
                  <div
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden mb-2",
                      !isUnlocked && "grayscale opacity-40",
                    )}
                  >
                    <img
                      src={frog.image}
                      alt={frog.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Lock overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <Lock className="h-5 w-5 text-white/80" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Level info */}
                  <div className="text-center">
                    <p className={cn(
                      "text-xs font-bold",
                      isUnlocked ? "text-[#F27024]" : "text-muted-foreground"
                    )}>
                      Lv.{frog.level}
                    </p>
                    <p className={cn(
                      "text-sm font-semibold truncate",
                      isUnlocked ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {frog.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      {frog.requiredCoins === 0 ? "Miễn phí" : `${frog.requiredCoins}`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span>Số dư: <span className="text-foreground font-bold">{fCoins}</span> F-Coins</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
