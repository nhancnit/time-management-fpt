"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import confetti from "canvas-confetti"

interface KnowledgeSummaryModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<boolean>
}

export function KnowledgeSummaryModal({ isOpen, onOpenChange, onConfirm }: KnowledgeSummaryModalProps) {
  const [summary, setSummary] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValid = summary.trim().length >= 10

  const handleSubmit = async () => {
    if (!isValid) return

    setIsSubmitting(true)
    try {
      const success = await onConfirm()
      if (success) {
        // Trigger confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#a855f7']
        })
        
        onOpenChange(false)
        setSummary("")
      }
    } catch (error) {
      console.error("Lỗi khi nộp tóm tắt:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isSubmitting) return // Prevent closing while submitting
      onOpenChange(open)
      if (!open) setSummary("")
    }}>
      <DialogContent className="bg-card border-border sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Xác nhận hoàn thành & Tóm tắt kiến thức</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Hãy viết tóm tắt ngắn (ít nhất 10 ký tự) về những gì bạn vừa học hoặc làm được để củng cố kiến thức trước khi nhận thưởng nhé!
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Ví dụ: Hôm nay đã nắm được cách giải ma trận..."
            className="col-span-3 bg-secondary border-border text-foreground resize-none min-h-[120px]"
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center text-xs">
            <span className={`${summary.length < 10 ? "text-destructive" : "text-muted-foreground"}`}>
              {summary.length}/10 ký tự tối thiểu
            </span>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-border text-foreground hover:bg-secondary"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValid || isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? "Đang xử lý..." : "Nộp & Nhận Thưởng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
