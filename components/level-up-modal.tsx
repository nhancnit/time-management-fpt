"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { FrogLevel } from "@/lib/frog-levels"
import { cn } from "@/lib/utils"

interface LevelUpModalProps {
  levelInfo: FrogLevel | null
  onDismiss: () => void
}

export function LevelUpModal({ levelInfo, onDismiss }: LevelUpModalProps) {
  if (!levelInfo) return null

  return (
    <Dialog open={!!levelInfo} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-[#F27024]/30 shadow-[0_0_60px_rgba(242,112,36,0.15)]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center text-2xl font-bold text-foreground">
            🎉 Tiến hóa thành công!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6 space-y-4">
          {/* Frog image with glow */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#F27024]/20 blur-2xl animate-pulse" />
            <div className={cn(
              "relative w-36 h-36 rounded-full overflow-hidden",
              "border-4 border-[#F27024] shadow-[0_0_30px_rgba(242,112,36,0.4)]",
              "animate-level-up-entrance"
            )}>
              <img
                src={levelInfo.image}
                alt={levelInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 text-2xl animate-bounce">✨</div>
            <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDelay: "0.3s" }}>🌟</div>
          </div>

          {/* Level info */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F27024]/10 border border-[#F27024]/30">
              <span className="text-[#F27024] font-bold text-lg">Level {levelInfo.level}</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">{levelInfo.name}</h3>
            <p className="text-muted-foreground text-sm max-w-xs">{levelInfo.description}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onDismiss}
            className="bg-[#F27024] hover:bg-[#F27024]/90 text-white font-bold px-8 py-2 rounded-full shadow-lg shadow-[#F27024]/25 transition-all hover:scale-105"
          >
            Tuyệt vời! 🐸
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
