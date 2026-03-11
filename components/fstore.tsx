"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Coins, ShoppingBag, Shirt, Sparkles, Hand, ImageIcon, Check, Lock, Flame, Clock, Brain } from "lucide-react"
import { storage } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { FSTORE_ITEMS, SLOT_NAMES, SLOT_DESCRIPTIONS, PSYCHOLOGY_EFFECTS } from "@/lib/fstore-data"
import type { UserFStore, FStoreItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { FrogMascot } from "@/components/frog-mascot"
import type { FrogMode } from "@/lib/frog-dialogues"
import { toast } from "sonner"

const SLOT_ICONS = {
  body: Shirt,
  accessory: Sparkles,
  handheld: Hand,
  background: ImageIcon,
}

export function FStore() {
  const [fstore, setFstore] = useState<UserFStore | null>(null)
  const [activeSlot, setActiveSlot] = useState<"body" | "accessory" | "handheld" | "background">("body")
  const [selectedItem, setSelectedItem] = useState<FStoreItem | null>(null)
  const [showBuyDialog, setShowBuyDialog] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [frogMode, setFrogMode] = useState<FrogMode>("thanh_loc")

  useEffect(() => {
    setFstore(storage.getFStore())

    const fetchCoins = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('f_coins')
            .eq('id', session.user.id)
            .single()

          if (data && !error) {
            setFstore((prev) => prev ? { ...prev, fCoins: data.f_coins || 0 } : null)
            
            // Sync fallback
            const fs = storage.getFStore()
            fs.fCoins = data.f_coins || 0
            storage.setFStore(fs)
          }
        }
      } catch (err) {
        console.error("Failed to fetch f_coins", err)
      }
    }

    fetchCoins()

    const handleCoinsUpdate = () => {
      setFstore(storage.getFStore())
    }

    window.addEventListener('fcoins-updated', handleCoinsUpdate)

    return () => {
      window.removeEventListener('fcoins-updated', handleCoinsUpdate)
    }
  }, [])

  const refreshFStore = () => {
    setFstore(storage.getFStore())
  }

  const handleBuyItem = () => {
    if (!selectedItem || !fstore) return
    const success = storage.buyItem(selectedItem.id, selectedItem.price)
    if (success) {
      setFrogMode("slay")
      refreshFStore()
      setShowBuyDialog(false)
    }
  }

  const handleEquipItem = (item: FStoreItem) => {
    if (!fstore) return
    if (!fstore.ownedItems.includes(item.id)) return
    storage.equipItem(item.id, item.slot)
    setFrogMode("slay")
    refreshFStore()
  }

  const handleCheckIn = async () => {
    const { bonus, alreadyCheckedIn } = storage.checkInAndCalculateBonus()

    if (alreadyCheckedIn) {
      setFrogMode("gia_truong")
      toast.error("Bạn đã check-in hôm nay rồi!")
      return
    }

    if (bonus > 0) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          // Lấy số f_coins hiện tại và cộng thêm bonus
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

            if (updateError) {
              console.error("Lỗi cập nhật F-Coins lên server:", updateError)
            } else {
               // Update local state if supabase succeded to assure consistency
               const fstoreToUpdate = storage.getFStore()
               fstoreToUpdate.fCoins = newTotal
               storage.setFStore(fstoreToUpdate)
               
               // Phát event để các tab khác (Dashboard) cập nhật UI realtime
               window.dispatchEvent(new Event('fcoins-updated'))
            }
          }
        }
      } catch (err) {
         console.error("Failed to sync check-in to server", err)
      }

      setFrogMode("slay")
      toast.success(`🎉 Check-in thành công!`, {
          description: `Bạn nhận được +${bonus} F-Coins. (Bao gồm +20 điểm cơ bản và các bonus khác)`
      })
    }
    
    refreshFStore()
  }

  if (!fstore) return null

  const slotItems = FSTORE_ITEMS.filter((item) => item.slot === activeSlot)
  const equippedItemId = fstore.equippedItems[activeSlot]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">F-Store</h1>
          <p className="text-muted-foreground">Tiệm Tạp Hóa Cóc - Trang bị cho chú Cóc của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowInfoDialog(true)}>
            <Brain className="h-4 w-4 mr-2" />
            Cơ chế tâm lý
          </Button>
          <Button variant="outline" size="sm" onClick={handleCheckIn}>
            <Clock className="h-4 w-4 mr-2" />
            Check-in
          </Button>
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-foreground">{fstore.fCoins}</span>
            <span className="text-sm text-muted-foreground">F-Coins</span>
          </div>
        </div>
      </div>

      {/* Streak Info */}
      {fstore.streakDays > 0 && (
        <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
          <CardContent className="py-3 flex items-center gap-3">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-foreground">
              Streak: <strong>{fstore.streakDays} ngày</strong> liên tiếp!
              {fstore.streakDays >= 3 && " (Đạt 3 ngày = +50 F-Coins bonus)"}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Coin Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Coins className="h-5 w-5 text-yellow-500" />
            Cách kiếm F-Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Hoàn thành Task</p>
                <p className="text-sm text-muted-foreground">1 giờ học = 10 F-Coins</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Combo Chăm chỉ</p>
                <p className="text-sm text-muted-foreground">3 ngày liên tiếp = +50 F-Coins</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Early Bird</p>
                <p className="text-sm text-muted-foreground">Check-in trước 7h = +5 F-Coins</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Diệt Boss (Task Đỏ)</p>
                <p className="text-sm text-muted-foreground">Hoàn thành đúng hạn = +100 F-Coins</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Preview with Frog Mascot */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Chú Cóc của bạn</CardTitle>
            <CardDescription>Click vào Cóc để tương tác!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                {/* Background */}
                <img
                  src={
                    FSTORE_ITEMS.find((i) => i.id === fstore.equippedItems.background)?.image ||
                    "/placeholder.svg?height=300&width=300&query=FPT campus background" ||
                    "/placeholder.svg"
                  }
                  alt="Background"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Frog Mascot */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <FrogMascot size="lg" showDialogue={true} mode={frogMode} onModeChange={setFrogMode} />
                </div>
              </div>
            </div>

            {/* Equipped items list */}
            <div className="mt-4 space-y-2">
              {(["body", "accessory", "handheld", "background"] as const).map((slot) => {
                const item = FSTORE_ITEMS.find((i) => i.id === fstore.equippedItems[slot])
                const Icon = SLOT_ICONS[slot]
                return (
                  <div key={slot} className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{SLOT_NAMES[slot]}:</span>
                    <span className="text-foreground">{item?.name || "Chưa trang bị"}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Store */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Cửa hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeSlot} onValueChange={(v) => setActiveSlot(v as typeof activeSlot)}>
              <TabsList className="grid grid-cols-4 mb-4">
                {(["body", "accessory", "handheld", "background"] as const).map((slot) => {
                  const Icon = SLOT_ICONS[slot]
                  return (
                    <TabsTrigger key={slot} value={slot} className="flex items-center gap-1.5">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{SLOT_NAMES[slot]}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              <div className="mb-3">
                <p className="text-sm text-muted-foreground italic">"{SLOT_DESCRIPTIONS[activeSlot]}"</p>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slotItems.map((item) => {
                    const owned = fstore.ownedItems.includes(item.id)
                    const equipped = equippedItemId === item.id
                    const canAfford = fstore.fCoins >= item.price

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "relative rounded-lg border p-3 transition-all cursor-pointer hover:border-primary",
                          equipped && "border-primary bg-primary/5",
                          !owned && !canAfford && "opacity-60",
                        )}
                        onClick={() => {
                          if (owned) {
                            handleEquipItem(item)
                          } else {
                            setSelectedItem(item)
                            setShowBuyDialog(true)
                          }
                        }}
                      >
                        {/* Status badges */}
                        {equipped && <Badge className="absolute top-1 right-1 bg-primary text-xs">Đang dùng</Badge>}
                        {owned && !equipped && (
                          <Badge variant="outline" className="absolute top-1 right-1 text-xs">
                            Đã mua
                          </Badge>
                        )}
                        {item.isLimited && (
                          <Badge variant="destructive" className="absolute top-1 left-1 text-xs">
                            Limited
                          </Badge>
                        )}

                        {/* Item image */}
                        <div className="aspect-square rounded-md overflow-hidden bg-muted mb-2">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item info */}
                        <h4 className="font-medium text-sm text-foreground truncate">{item.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 h-8">{item.description}</p>

                        {/* Price */}
                        <div className="mt-2 flex items-center justify-between">
                          {item.price === 0 ? (
                            <span className="text-xs text-green-500 font-medium">Miễn phí</span>
                          ) : owned ? (
                            <span className="text-xs text-muted-foreground">Đã sở hữu</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Coins className="h-3 w-3 text-yellow-500" />
                              <span className={cn("text-sm font-medium", !canAfford && "text-red-500")}>
                                {item.price}
                              </span>
                            </div>
                          )}
                          {!owned && !canAfford && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mua vật phẩm</DialogTitle>
            <DialogDescription>Bạn có chắc muốn mua vật phẩm này?</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="flex gap-4">
              <img
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{selectedItem.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="font-bold">{selectedItem.price} F-Coins</span>
                </div>
                {fstore.fCoins < selectedItem.price && (
                  <p className="text-sm text-red-500 mt-1">
                    Bạn cần thêm {selectedItem.price - fstore.fCoins} F-Coins nữa!
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBuyDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleBuyItem} disabled={!selectedItem || fstore.fCoins < (selectedItem?.price || 0)}>
              Mua ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Psychology Info Dialog - Updated */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Cơ chế Tâm lý học đằng sau F-Store
            </DialogTitle>
            <DialogDescription>Để thuyết phục giáo viên rằng tính năng này "khoa học"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {PSYCHOLOGY_EFFECTS.map((effect, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted">
                <h4 className="font-bold text-foreground mb-2">
                  {index + 1}. {effect.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">Khái niệm:</strong> {effect.concept}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Ứng dụng:</strong> {effect.application}
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
