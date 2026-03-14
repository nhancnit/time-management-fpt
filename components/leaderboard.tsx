"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Medal, Coins, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { User } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LeaderboardProps {
  user: User
}

interface ProfileRecord {
  id: string
  name: string
  nickname: string | null
  student_id: string
  major: string
  f_coins: number
  avatar_url: string
}

export function Leaderboard({ user }: LeaderboardProps) {
  const [leaders, setLeaders] = useState<ProfileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) setCurrentUserId(session.user.id)

        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, nickname, student_id, major, f_coins, avatar_url')
          .order('f_coins', { ascending: false, nullsFirst: false })
          .limit(20)

        if (error) {
          console.error("Supabase Error:", error)
          return
        }
        
        if (data) setLeaders(data)
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaders()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const getRankStyle = (index: number) => {
    switch(index) {
      case 0: return "bg-yellow-500/20 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)] text-yellow-500"
      case 1: return "bg-gray-400/20 border-gray-400/50 shadow-[0_0_15px_rgba(156,163,175,0.2)] text-gray-400"
      case 2: return "bg-amber-700/20 border-amber-700/50 shadow-[0_0_15px_rgba(180,83,9,0.2)] text-amber-700"
      default: return "bg-card border-border text-muted-foreground"
    }
  }

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400 drop-shadow-[0_0_5px_rgba(156,163,175,0.5)]" />
    if (index === 2) return <Medal className="h-6 w-6 text-amber-700 drop-shadow-[0_0_5px_rgba(180,83,9,0.5)]" />
    return <span className="text-lg font-bold w-6 text-center">{index + 1}</span>
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bảng xếp hạng</h1>
        <p className="text-muted-foreground">TOP 20 Sinh viên FPT chăm chỉ nhất</p>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <div className="bg-primary/5 p-4 border-b border-border flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-full">
            <Trophy className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground">Đại Tôn Sư F-Timers</h2>
            <p className="text-sm text-muted-foreground">Cạnh tranh học tập để vinh danh trên bảng vàng</p>
          </div>
        </div>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[65vh]">
            <div className="divide-y divide-border">
              {leaders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">Chưa có dữ liệu nào!</div>
              ) : (
                leaders.map((leader, index) => {
                  const isCurrentUser = leader.id === currentUserId
                  
                  return (
                    <div 
                      key={leader.id} 
                      className={cn(
                        "p-4 flex items-center gap-4 transition-colors hover:bg-secondary/50",
                        isCurrentUser ? "bg-primary/10 relative overflow-hidden" : ""
                      )}
                    >
                      {/* Highlight current user */}
                      {isCurrentUser && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary animate-pulse shadow-[0_0_10px_theme(colors.primary.DEFAULT)]" />
                      )}
                      
                      {/* Rank */}
                      <div className="w-12 flex justify-center">
                        {getMedalIcon(index)}
                      </div>

                      {/* Avatar */}
                      <div className={cn(
                        "w-12 h-12 rounded-full border-2 overflow-hidden bg-muted shrink-0 flex items-center justify-center",
                        index < 3 ? getRankStyle(index).split(" ")[1] : "border-border",
                        isCurrentUser && index >= 3 ? "border-primary/50" : ""
                      )}>
                        <img 
                          src={leader.avatar_url || "/images/frogs/level-1.png"} 
                          alt={leader.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={cn(
                            "font-bold truncate",
                            isCurrentUser ? "text-primary" : "text-foreground"
                          )}>
                            {leader.nickname || leader.name} {isCurrentUser && "(Bạn)"}
                          </h3>
                          {leader.student_id && (
                            <Badge variant="outline" className="text-[10px] h-5 hidden sm:inline-flex bg-secondary">
                              {leader.student_id}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{leader.major || "Chưa cập nhật chuyên ngành"}</p>
                      </div>

                      {/* Score */}
                      <div className="flex items-center gap-1.5 bg-background rounded-full px-3 py-1 border border-border shrink-0 shadow-sm">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-foreground">{leader.f_coins || 0}</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
