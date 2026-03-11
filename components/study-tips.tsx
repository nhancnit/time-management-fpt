"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Timer,
  Brain,
  Repeat,
  Clock,
  Target,
  Lightbulb,
  BookOpen,
  Zap,
  PenTool,
  Sun,
  Moon,
  Star,
  FlaskConical,
} from "lucide-react"
import { studyTips, subjectStudyTimes, getRecommendedTimeSlots, studyTimeResearch } from "@/lib/study-tips"
import { storage } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const CATEGORIES = [
  { value: "all", label: "Tất cả", icon: Lightbulb },
  { value: "pomodoro", label: "Pomodoro", icon: Timer },
  { value: "active-recall", label: "Active Recall", icon: Brain },
  { value: "spaced-repetition", label: "Lặp lại ngắt quãng", icon: Repeat },
  { value: "time-management", label: "Quản lý thời gian", icon: Clock },
  { value: "focus", label: "Tập trung", icon: Target },
  { value: "deep-work", label: "Deep Work", icon: Zap },
  { value: "note-taking", label: "Ghi chú", icon: PenTool },
  { value: "optimal-time", label: "Thời gian học", icon: Sun },
]

const CATEGORY_NAMES: Record<string, string> = {
  logic: "Tư duy logic",
  memory: "Ghi nhớ",
  creative: "Sáng tạo",
  practice: "Thực hành",
}

export function StudyTips() {
  const [category, setCategory] = useState("all")
  const [readingRewards, setReadingRewards] = useState<Record<string, boolean>>({})
  const [dailyReads, setDailyReads] = useState(0)
  
  const user = storage.getUser()
  const userSubjects = user?.subjects || []

  const filteredTips = category === "all" ? studyTips : studyTips.filter((tip) => tip.category === category)

  const getCategoryIcon = (cat: string) => {
    const found = CATEGORIES.find((c) => c.value === cat)
    return found?.icon || Lightbulb
  }

  const getCategoryLabel = (cat: string) => {
    const found = CATEGORIES.find((c) => c.value === cat)
    return found?.label || cat
  }

  const relevantSubjectTimes = subjectStudyTimes.filter(
    (st) => userSubjects.some((us) => us.code === st.subjectCode) || userSubjects.length === 0,
  )

  const handleReadTip = async (tipId: string) => {
     // Check local limits first
     const today = new Date().toDateString()
     const storedDate = localStorage.getItem('fpt_study_read_date')
     const storedCount = Number.parseInt(localStorage.getItem('fpt_study_read_count') || '0')
     const readItems = JSON.parse(localStorage.getItem('fpt_study_read_items') || '{}')

     let currentCount = storedCount
     if (storedDate !== today) {
         currentCount = 0
         localStorage.setItem('fpt_study_read_date', today)
         localStorage.setItem('fpt_study_read_items', '{}') // reset read items today
     }

     if (currentCount >= 3 || readItems[tipId]) {
         return // max reached or already read this specific tip today
     }

     // Mark as reading locally
     const newReadItems = { ...readItems, [tipId]: true }
     localStorage.setItem('fpt_study_read_items', JSON.stringify(newReadItems))
     
     const newCount = currentCount + 1
     localStorage.setItem('fpt_study_read_count', newCount.toString())
     setDailyReads(newCount)
     
     // 3 F-Coins per tip
     const bonus = 3

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
               const fstoreToUpdate = storage.getFStore()
               fstoreToUpdate.fCoins = newTotal
               storage.setFStore(fstoreToUpdate)
               
               window.dispatchEvent(new Event('fcoins-updated'))

               toast.success("🧠 Kiến thức là sức mạnh!", {
                  description: `Bạn nhận được +${bonus} F-Coins vì đã chăm chỉ đọc bài. (${newCount}/3 lần hôm nay)`
               })
            }
          }
        }
     } catch (err) {
       console.error("Reading reward claim failed", err)
     }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Phương pháp học tập</h1>
        <p className="text-muted-foreground">Các kỹ thuật học tập hiệu quả dành cho sinh viên FPT</p>
      </div>

      <Tabs defaultValue="tips" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="tips">Phương pháp học</TabsTrigger>
          <TabsTrigger value="optimal-time">Thời gian học tối ưu</TabsTrigger>
          <TabsTrigger value="roadmap">Lộ trình học</TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="space-y-6">
          {/* Quick Tips */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Pomodoro</h3>
                    <p className="text-sm text-muted-foreground">25 phút học, 5 phút nghỉ</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Brain className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Active Recall</h3>
                    <p className="text-sm text-muted-foreground">Tự kiểm tra kiến thức</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Repeat className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Spaced Repetition</h3>
                    <p className="text-sm text-muted-foreground">Ôn tập theo lịch tối ưu</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Deep Work</h3>
                    <p className="text-sm text-muted-foreground">52 phút tập trung tối đa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Badge
                key={cat.value}
                variant={category === cat.value ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                onClick={() => setCategory(cat.value)}
              >
                <cat.icon className="h-3 w-3 mr-1" />
                {cat.label}
              </Badge>
            ))}
          </div>

          {/* Tips Accordion */}
          <Accordion type="single" collapsible className="space-y-3" onValueChange={(value) => {
             if (value) handleReadTip(value)
          }}>
            {filteredTips.map((tip) => {
              const Icon = getCategoryIcon(tip.category)
              return (
                <AccordionItem
                  key={tip.id}
                  value={tip.id}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:bg-secondary/50 [&[data-state=open]]:bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-foreground">{tip.title}</h3>
                        <p className="text-xs text-muted-foreground">{getCategoryLabel(tip.category)}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="prose prose-sm prose-invert max-w-none">
                      {tip.content.split("\n").map((line, i) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return (
                            <h4 key={i} className="text-foreground font-semibold mt-4 mb-2">
                              {line.replace(/\*\*/g, "")}
                            </h4>
                          )
                        }
                        if (line.startsWith(">")) {
                          return (
                            <blockquote
                              key={i}
                              className="border-l-2 border-primary pl-4 italic text-muted-foreground my-2"
                            >
                              {line.replace("> ", "")}
                            </blockquote>
                          )
                        }
                        if (line.startsWith("- ")) {
                          return (
                            <li key={i} className="text-muted-foreground ml-4">
                              {line.replace("- ", "")}
                            </li>
                          )
                        }
                        if (line.match(/^\d+\./)) {
                          return (
                            <li key={i} className="text-muted-foreground ml-4 list-decimal">
                              {line.replace(/^\d+\.\s*/, "")}
                            </li>
                          )
                        }
                        if (line.trim() === "") {
                          return <br key={i} />
                        }
                        return (
                          <p key={i} className="text-muted-foreground">
                            {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                          </p>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </TabsContent>

        <TabsContent value="optimal-time" className="space-y-6">
          {/* Nghiên cứu khoa học tổng quan */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-primary" />
                Nghiên cứu khoa học về thời gian học tập
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Dựa trên các nghiên cứu về nhịp sinh học (Circadian Rhythm) và khoa học thần kinh, thời gian học tập ảnh
                hưởng trực tiếp đến hiệu quả tiếp thu kiến thức.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(studyTimeResearch).map(([key, research]) => (
                  <div key={key} className="p-4 bg-secondary/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-primary text-primary">
                        {CATEGORY_NAMES[key] || key}
                      </Badge>
                      <div className="flex gap-1">
                        {research.bestPeriods.map((period) => (
                          <Badge key={period} variant="secondary" className="text-xs">
                            {period}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{research.reason}</p>
                    <p className="text-xs text-muted-foreground/70 italic border-t border-border pt-2">
                      📚 {research.researchSource}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* General Time Guide */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="h-5 w-5 text-amber-500" />
                  <h4 className="font-semibold text-foreground">Buổi sáng (6h-12h)</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>6:00-9:00:</strong> Thời điểm vàng cho môn tư duy logic (Toán, Lập trình)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>7:00-9:00:</strong> Học từ vựng, ngữ pháp (trí nhớ dài hạn cao)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>9:00-11:30:</strong> Làm bài tập khó, giải quyết vấn đề
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold text-foreground">Buổi tối (19h-22h)</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>19:00-21:00:</strong> Ôn tập, review kiến thức trong ngày
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>20:00-22:00:</strong> Đọc tài liệu, học từ vựng (củng cố khi ngủ)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>21:00-22:00:</strong> Thực hành code nhẹ (yên tĩnh, ít gián đoạn)
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Subject-specific recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Khung giờ tối ưu theo môn học</h3>
            <div className="grid gap-4">
              {(relevantSubjectTimes.length > 0 ? relevantSubjectTimes : subjectStudyTimes).map((subject) => {
                const timeSlots = getRecommendedTimeSlots(subject.category)
                return (
                  <Card key={subject.subjectCode} className="bg-card border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-lg text-foreground">
                          {subject.subjectCode} - {subject.subjectName}
                        </CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="border-primary text-primary">
                            {CATEGORY_NAMES[subject.category] || subject.category}
                          </Badge>
                          <Badge variant="secondary">{subject.studyDuration}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Research info */}
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm text-muted-foreground">
                          <strong className="text-foreground">Tại sao?</strong> {timeSlots.research.reason}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-2 italic">
                          📚 {timeSlots.research.researchSource}
                        </p>
                      </div>

                      {/* Recommended Time Slots */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" />
                          Khung giờ đề xuất
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {timeSlots.recommended.slice(0, 8).map((time, idx) => (
                            <Badge
                              key={idx}
                              variant="default"
                              className="bg-primary/20 text-primary border border-primary/30"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {time.timeRange} ({time.period})
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Break suggestion */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Timer className="h-4 w-4" />
                        <span>{subject.breakSuggestion}</span>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Mẹo học hiệu quả:</h4>
                        <ul className="grid md:grid-cols-2 gap-2">
                          {subject.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        {/* Roadmap Tab - giữ nguyên */}
        <TabsContent value="roadmap" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Lộ trình học hiệu quả cho sinh viên FPT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Chuẩn bị trước khi học",
                      items: [
                        "Đọc lướt syllabus và tài liệu",
                        "Chuẩn bị câu hỏi về bài học",
                        "Thiết lập môi trường học yên tĩnh",
                        "Xác định mục tiêu cụ thể cho buổi học",
                      ],
                    },
                    {
                      step: 2,
                      title: "Trong buổi học",
                      items: [
                        "Ghi chép tích cực (Active note-taking)",
                        "Sử dụng phương pháp Cornell Notes",
                        "Đặt câu hỏi khi chưa hiểu",
                        "Liên hệ với kiến thức đã biết",
                      ],
                    },
                    {
                      step: 3,
                      title: "Sau buổi học (trong ngày)",
                      items: [
                        "Ôn lại ghi chép trong 24h",
                        "Tóm tắt bằng lời của mình",
                        "Làm bài tập ngay khi còn nhớ",
                        "Áp dụng kỹ thuật Feynman",
                      ],
                    },
                    {
                      step: 4,
                      title: "Ôn tập định kỳ",
                      items: [
                        "Áp dụng Spaced Repetition (1-2-4-7-14 ngày)",
                        "Sử dụng Active Recall với flashcards",
                        "Giải đề thi các năm trước",
                        "Học nhóm và dạy lại cho bạn bè",
                      ],
                    },
                  ].map((phase) => (
                    <div key={phase.step} className="relative pl-10">
                      <div className="absolute left-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {phase.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{phase.title}</h4>
                        <ul className="mt-2 space-y-1">
                          {phase.items.map((item, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Schedule Template */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Mẫu lịch học trong ngày
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "6:30 - 7:00", activity: "Thức dậy, vệ sinh cá nhân", type: "personal" },
                  { time: "7:00 - 8:30", activity: "Học môn tư duy logic (Toán, Lập trình)", type: "study" },
                  { time: "8:30 - 8:45", activity: "Nghỉ ngắn, uống nước", type: "break" },
                  { time: "8:45 - 10:15", activity: "Tiếp tục học môn logic hoặc làm bài tập", type: "study" },
                  { time: "10:15 - 10:30", activity: "Nghỉ ngắn, đi bộ nhẹ", type: "break" },
                  { time: "10:30 - 12:00", activity: "Học môn ghi nhớ (Tiếng Anh, Lý thuyết)", type: "study" },
                  { time: "12:00 - 13:30", activity: "Ăn trưa & nghỉ ngơi", type: "break" },
                  { time: "13:30 - 15:00", activity: "Power nap 20 phút + Học nhóm / Project", type: "study" },
                  { time: "15:00 - 16:30", activity: "Môn sáng tạo (Thiết kế, Marketing)", type: "study" },
                  { time: "16:30 - 18:00", activity: "Thể dục / Hoạt động cá nhân", type: "personal" },
                  { time: "18:00 - 19:00", activity: "Ăn tối & nghỉ ngơi", type: "break" },
                  { time: "19:00 - 20:30", activity: "Tự học / Làm bài tập", type: "study" },
                  { time: "20:30 - 21:30", activity: "Ôn tập, học từ vựng (trước khi ngủ)", type: "study" },
                  { time: "21:30 - 22:00", activity: "Thư giãn (không màn hình)", type: "personal" },
                  { time: "22:00", activity: "Đi ngủ", type: "personal" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      item.type === "study"
                        ? "bg-primary/10 border border-primary/20"
                        : item.type === "break"
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-secondary/50"
                    }`}
                  >
                    <span className="text-sm font-mono text-muted-foreground w-28 flex-shrink-0">{item.time}</span>
                    <span className="text-sm text-foreground">{item.activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
