import type { StudyTip, SubjectStudyTime, TimeSlot } from "./types"

export const studyTips: StudyTip[] = [
  {
    id: "1",
    title: "Kỹ thuật Pomodoro",
    content: `**Pomodoro** là phương pháp quản lý thời gian hiệu quả:

1. **Chọn một công việc** cần hoàn thành
2. **Đặt hẹn giờ 25 phút** và tập trung hoàn toàn
3. **Nghỉ ngắn 5 phút** sau mỗi pomodoro
4. **Sau 4 pomodoro**, nghỉ dài 15-30 phút

**Lợi ích:**
- Tăng khả năng tập trung
- Giảm mệt mỏi tinh thần
- Dễ dàng theo dõi tiến độ`,
    category: "pomodoro",
    imageUrl: "/image-method/promodo.jpg",
  },
  {
    id: "2",
    title: "Active Recall - Gợi nhớ chủ động",
    content: `**Active Recall** là phương pháp học bằng cách tự kiểm tra:

1. **Đọc và hiểu** nội dung một lần
2. **Đóng sách/tài liệu** lại
3. **Tự hỏi và trả lời** những gì vừa học
4. **Kiểm tra lại** những phần chưa nhớ

**Mẹo áp dụng:**
- Sử dụng flashcards
- Viết tóm tắt từ trí nhớ
- Dạy lại cho người khác
- Làm bài tập không nhìn đáp án`,
    category: "active-recall",
    imageUrl: "/image-method/active-recall.jpg",
  },
  {
    id: "3",
    title: "Spaced Repetition - Lặp lại ngắt quãng",
    content: `**Spaced Repetition** giúp ghi nhớ lâu dài:

**Lịch ôn tập tối ưu:**
- **Ngày 1:** Học lần đầu
- **Ngày 2:** Ôn lại lần 1
- **Ngày 4:** Ôn lại lần 2
- **Ngày 7:** Ôn lại lần 3
- **Ngày 14:** Ôn lại lần 4
- **Ngày 30:** Ôn lại lần 5

**Công cụ hỗ trợ:**
- Anki (flashcards)
- Quizlet
- Notion với reminder`,
    category: "spaced-repetition",
    imageUrls: [
      "/image-method/spaced-repeation.jpg",
      "/image-method/space-repeation2.jpg"
    ]
  },
  {
    id: "4",
    title: "Quy tắc 2 phút",
    content: `**Quy tắc 2 phút** giúp chống trì hoãn:

> "Nếu việc gì đó mất ít hơn 2 phút, hãy làm ngay!"

**Áp dụng cho học tập:**
- Trả lời email/tin nhắn của giáo viên
- Ghi chú nhanh ý tưởng
- Đánh dấu trang sách quan trọng
- Lên lịch nhắc nhở
- Sắp xếp bàn học

**Lợi ích:**
- Giảm khối lượng việc tồn đọng
- Tạo momentum làm việc
- Giảm căng thẳng`,
    category: "time-management",
    imageUrls: [
      "/image-method/quy-tac-2-phut.jpg",
      "/image-method/quy-tac-2-phut2.jpg"
    ]
  },
  {
    id: "5",
    title: "Kỹ thuật Feynman",
    content: `**Kỹ thuật Feynman** - Học bằng cách dạy:

1. **Chọn một khái niệm** muốn học
2. **Giải thích như dạy cho trẻ 12 tuổi**
3. **Xác định điểm yếu** trong hiểu biết
4. **Đơn giản hóa và sử dụng ví dụ**

**Tại sao hiệu quả:**
- Buộc bạn hiểu sâu vấn đề
- Phát hiện lỗ hổng kiến thức
- Ghi nhớ lâu hơn
- Có thể giải thích cho bất kỳ ai`,
    category: "active-recall",
    imageUrl: "/image-method/feyman.jpg",
  },
  {
    id: "6",
    title: "Môi trường học tập tối ưu",
    content: `**Tạo môi trường học tập hiệu quả:**

**Vật lý:**
- Bàn học sạch sẽ, ngăn nắp
- Ánh sáng đủ (tốt nhất là ánh sáng tự nhiên)
- Nhiệt độ mát mẻ (22-25°C)
- Ghế ngồi thoải mái

**Kỹ thuật số:**
- Tắt thông báo điện thoại
- Sử dụng app chặn website gây xao nhãng
- Đặt điện thoại ở phòng khác

**Âm thanh:**
- Nhạc không lời (lofi, classical)
- White noise/Brown noise
- Hoặc không gian hoàn toàn yên tĩnh`,
    category: "focus",
    imageUrl: "/image-method/moi-truong-hoc-toi-uu.jpg"
  },
  {
    id: "7",
    title: "Lộ trình học kỳ hiệu quả",
    content: `**Lập kế hoạch học kỳ:**

**Tuần 1-2:** 
- Nắm syllabus các môn
- Chuẩn bị tài liệu học tập
- Thiết lập thói quen học

**Tuần 3-10:**
- Học đều đặn theo lịch
- Ôn tập hàng tuần
- Làm bài tập đúng hạn

**Tuần 11-13:**
- Tổng ôn tập
- Làm đề thi mẫu
- Hỏi đáp thắc mắc với giảng viên

**Tuần 14-15:**
- Thi cuối kỳ
- Nghỉ ngơi hợp lý giữa các môn thi`,
    category: "time-management",
  },
  {
    id: "8",
    title: "Ngủ đủ giấc để học tốt",
    content: `**Giấc ngủ và học tập:**

**Tại sao quan trọng:**
- Não củng cố kiến thức khi ngủ
- Tăng khả năng tập trung
- Cải thiện trí nhớ dài hạn

**Thói quen ngủ tốt:**
- Ngủ 7-8 tiếng mỗi đêm
- Ngủ và dậy cùng giờ
- Tránh màn hình 1 tiếng trước khi ngủ
- Không caffeine sau 2 giờ chiều

**Power nap:**
- Ngủ trưa 15-20 phút
- Không ngủ quá 30 phút
- Tốt nhất từ 13h-15h`,
    category: "focus",
  },
  {
    id: "9",
    title: "Deep Work - Làm việc sâu",
    content: `**Deep Work** - Tập trung tối đa không gián đoạn:

**Nguyên tắc:**
- Làm việc trong block 90-120 phút
- Loại bỏ hoàn toàn xao nhãng
- Chọn công việc có giá trị cao

**Cách thực hiện:**
1. **Chọn thời điểm** năng lượng cao nhất
2. **Chuẩn bị trước** mọi thứ cần thiết
3. **Đặt timer** và cam kết không dừng
4. **Nghỉ ngơi** đúng cách sau đó

**Lợi ích:**
- Hoàn thành công việc nhanh hơn 2-3x
- Chất lượng công việc cao hơn
- Phát triển kỹ năng nhanh hơn`,
    category: "deep-work",
  },
  {
    id: "10",
    title: "Cornell Notes - Ghi chú Cornell",
    content: `**Phương pháp ghi chú Cornell:**

**Chia trang thành 3 phần:**
1. **Cột phải (70%):** Ghi chép chính trong lớp
2. **Cột trái (30%):** Từ khóa, câu hỏi
3. **Phần dưới:** Tóm tắt sau buổi học

**Quy trình 5R:**
- **Record:** Ghi chép trong lớp
- **Reduce:** Rút gọn thành từ khóa
- **Recite:** Che cột phải, tự trả lời
- **Reflect:** Suy ngẫm và liên hệ
- **Review:** Ôn tập định kỳ

**Ưu điểm:**
- Tổ chức thông tin rõ ràng
- Dễ ôn tập
- Kết hợp Active Recall`,
    category: "note-taking",
  },
  {
    id: "11",
    title: "Mind Mapping - Sơ đồ tư duy",
    content: `**Mind Mapping** - Tổ chức kiến thức trực quan:

**Cách tạo:**
1. **Chủ đề chính** ở trung tâm
2. **Nhánh chính** là các ý lớn
3. **Nhánh phụ** là chi tiết
4. **Sử dụng màu sắc** và hình ảnh

**Công cụ:**
- Giấy và bút màu
- XMind, MindMeister
- Notion, Miro

**Áp dụng:**
- Tóm tắt chương sách
- Lên kế hoạch dự án
- Brainstorm ý tưởng
- Ôn tập trước thi`,
    category: "note-taking",
  },
  {
    id: "12",
    title: "Eat That Frog - Ăn con ếch",
    content: `**Eat That Frog** - Làm việc khó trước:

> "Nếu bạn phải ăn một con ếch, hãy ăn ngay buổi sáng"

**Nguyên tắc:**
- Xác định việc khó/quan trọng nhất
- Làm đầu tiên mỗi ngày
- Không trì hoãn, không kiểm tra email trước

**Tại sao hiệu quả:**
- Năng lượng cao nhất vào buổi sáng
- Tạo momentum cho cả ngày
- Giảm stress về deadline
- Cảm giác hoàn thành sớm

**Áp dụng cho sinh viên:**
- Học môn khó nhất trước
- Làm assignment khó buổi sáng
- Để việc nhẹ nhàng buổi tối`,
    category: "time-management",
  },
  {
    id: "13",
    title: "Thời điểm vàng để học theo môn",
    content: `**Thời gian tối ưu theo loại môn học:**

**Môn tư duy logic (Toán, Lập trình, MAE):**
- **Tốt nhất:** 8h-11h sáng
- **Lý do:** Não hoạt động mạnh nhất
- **Thời lượng:** 45-90 phút/session

**Môn ghi nhớ (Tiếng Anh, Lý thuyết):**
- **Tốt nhất:** 7h-9h sáng hoặc 20h-22h tối
- **Lý do:** Trí nhớ dài hạn hoạt động tốt
- **Thời lượng:** 30-45 phút/session

**Môn sáng tạo (Thiết kế, Viết):**
- **Tốt nhất:** 14h-16h chiều
- **Lý do:** Não linh hoạt hơn
- **Thời lượng:** 60-90 phút/session

**Ôn tập/Review:**
- **Tốt nhất:** 21h-22h tối (trước khi ngủ)
- **Lý do:** Não củng cố kiến thức khi ngủ`,
    category: "optimal-time",
  },
  {
    id: "14",
    title: "Quy tắc 52-17",
    content: `**Quy tắc 52-17** - Chu kỳ làm việc hiệu quả:

**Nghiên cứu DeskTime:**
- Làm việc 52 phút liên tục
- Nghỉ 17 phút hoàn toàn

**So sánh với Pomodoro:**
- Pomodoro: 25-5 phút (phù hợp mới bắt đầu)
- 52-17: Phù hợp công việc phức tạp

**Cách nghỉ 17 phút hiệu quả:**
- Đi bộ, vận động nhẹ
- Uống nước, ăn nhẹ
- Nhìn xa (cây xanh, bầu trời)
- KHÔNG dùng điện thoại

**Khi nào dùng:**
- Viết luận, báo cáo dài
- Làm project lớn
- Học chuyên sâu một chủ đề`,
    category: "deep-work",
  },
  {
    id: "15",
    title: "Nhịp sinh học và học tập",
    content: `**Chronotype** - Hiểu nhịp sinh học của bạn:

**Loại Sơn ca (Early Bird):**
- Tỉnh táo: 6h-10h sáng
- Học môn khó: Buổi sáng
- Nghỉ ngơi: 21h-22h

**Loại Cú đêm (Night Owl):**
- Tỉnh táo: 18h-24h
- Học môn khó: Buổi tối
- Chú ý: Vẫn cần 7-8h ngủ

**Loại Trung gian:**
- Tỉnh táo: 10h-12h và 16h-20h
- Linh hoạt trong sắp xếp

**Cách xác định:**
- Quan sát khi nào bạn tỉnh táo nhất
- Thử nghiệm 1-2 tuần
- Điều chỉnh lịch học phù hợp`,
    category: "optimal-time",
  },
]

export const commonTimeSlots: TimeSlot[] = [
  // Sáng sớm (6:00 - 9:00)
  { period: "Sáng sớm", timeRange: "6:00 - 7:30", startTime: "06:00", endTime: "07:30" },
  { period: "Sáng sớm", timeRange: "7:00 - 8:30", startTime: "07:00", endTime: "08:30" },
  { period: "Sáng sớm", timeRange: "7:30 - 9:00", startTime: "07:30", endTime: "09:00" },

  // Sáng (8:00 - 12:00)
  { period: "Sáng", timeRange: "8:00 - 9:30", startTime: "08:00", endTime: "09:30" },
  { period: "Sáng", timeRange: "8:30 - 10:00", startTime: "08:30", endTime: "10:00" },
  { period: "Sáng", timeRange: "9:00 - 10:30", startTime: "09:00", endTime: "10:30" },
  { period: "Sáng", timeRange: "9:30 - 11:00", startTime: "09:30", endTime: "11:00" },
  { period: "Sáng", timeRange: "10:00 - 11:30", startTime: "10:00", endTime: "11:30" },
  { period: "Sáng", timeRange: "10:30 - 12:00", startTime: "10:30", endTime: "12:00" },

  // Trưa (12:00 - 14:00)
  { period: "Trưa", timeRange: "12:00 - 13:30", startTime: "12:00", endTime: "13:30" },
  { period: "Trưa", timeRange: "12:30 - 14:00", startTime: "12:30", endTime: "14:00" },

  // Chiều (14:00 - 18:00)
  { period: "Chiều", timeRange: "14:00 - 15:30", startTime: "14:00", endTime: "15:30" },
  { period: "Chiều", timeRange: "14:30 - 16:00", startTime: "14:30", endTime: "16:00" },
  { period: "Chiều", timeRange: "15:00 - 16:30", startTime: "15:00", endTime: "16:30" },
  { period: "Chiều", timeRange: "15:30 - 17:00", startTime: "15:30", endTime: "17:00" },
  { period: "Chiều", timeRange: "16:00 - 17:30", startTime: "16:00", endTime: "17:30" },
  { period: "Chiều", timeRange: "16:30 - 18:00", startTime: "16:30", endTime: "18:00" },

  // Tối sớm (18:00 - 20:00)
  { period: "Tối sớm", timeRange: "18:00 - 19:30", startTime: "18:00", endTime: "19:30" },
  { period: "Tối sớm", timeRange: "18:30 - 20:00", startTime: "18:30", endTime: "20:00" },
  { period: "Tối sớm", timeRange: "19:00 - 20:30", startTime: "19:00", endTime: "20:30" },

  // Tối (20:00 - 23:00)
  { period: "Tối", timeRange: "19:30 - 21:00", startTime: "19:30", endTime: "21:00" },
  { period: "Tối", timeRange: "20:00 - 21:30", startTime: "20:00", endTime: "21:30" },
  { period: "Tối", timeRange: "20:30 - 22:00", startTime: "20:30", endTime: "22:00" },
  { period: "Tối", timeRange: "21:00 - 22:30", startTime: "21:00", endTime: "22:30" },
  { period: "Tối", timeRange: "21:30 - 23:00", startTime: "21:30", endTime: "23:00" },
]

export const studyTimeResearch = {
  logic: {
    bestPeriods: ["Sáng sớm", "Sáng"],
    reason:
      "Cortisol cao nhất vào buổi sáng, tư duy logic và analytical thinking đạt đỉnh. Não bộ sau giấc ngủ có khả năng xử lý thông tin phức tạp tốt nhất.",
    researchSource:
      "Nghiên cứu của Harvard về Circadian Rhythm cho thấy khả năng giải quyết vấn đề logic cao nhất trong 2-4 giờ sau khi thức dậy (Dr. Michael Breus, The Power of When, 2016)",
  },
  memory: {
    bestPeriods: ["Sáng sớm", "Tối"],
    reason:
      "Trí nhớ dài hạn hoạt động tốt vào sáng sớm khi não được nghỉ ngơi. Học trước khi ngủ giúp củng cố kiến thức qua quá trình sleep consolidation.",
    researchSource:
      "MIT Language Acquisition Study (2018): declarative memory cao nhất vào buổi sáng. Sleep consolidation research (Walker, 2017): học trước khi ngủ tăng retention 20-30%",
  },
  creative: {
    bestPeriods: ["Chiều", "Tối sớm"],
    reason:
      "Vào buổi chiều, prefrontal cortex relaxed hơn, giảm ức chế tư duy giúp sáng tạo tốt hơn. Não linh hoạt hơn trong việc kết nối các ý tưởng.",
    researchSource:
      "UC Berkeley Creative Cognition Lab (Mareike Wieth, 2011): creative thinking và insight problems hiệu quả hơn vào buổi chiều khi analytical mind giảm hoạt động",
  },
  practice: {
    bestPeriods: ["Sáng sớm", "Chiều"],
    reason:
      "Cơ thể tươi mới vào sáng sớm sau giấc ngủ. Buổi chiều (14h-17h) là thời điểm body temperature và muscle strength đạt đỉnh.",
    researchSource:
      "Exercise Science Journal (2019): morning workouts có adherence rate cao hơn 90%. Afternoon workouts (14h-17h) có peak physical performance do core body temperature cao nhất",
  },
}

export function getRecommendedTimeSlots(category: string) {
  const research = studyTimeResearch[category as keyof typeof studyTimeResearch]
  if (!research) {
    const defaultResearch = studyTimeResearch.logic
    const recommended = commonTimeSlots.filter((slot) => defaultResearch.bestPeriods.includes(slot.period))
    const other = commonTimeSlots.filter((slot) => !defaultResearch.bestPeriods.includes(slot.period))
    return {
      recommended,
      other,
      research: defaultResearch,
    }
  }

  const recommended = commonTimeSlots.filter((slot) => research.bestPeriods.includes(slot.period))
  const other = commonTimeSlots.filter((slot) => !research.bestPeriods.includes(slot.period))

  return {
    recommended,
    other,
    research,
  }
}

export function guessCategoryFromSubjectCode(code: string): string {
  const codePrefix = code.substring(0, 3).toUpperCase()

  // Môn logic/toán/lập trình
  const logicPrefixes = [
    "MAE",
    "MAD",
    "PRF",
    "DBI",
    "CSD",
    "PHY",
    "CEA",
    "WED",
    "OSG",
    "NWC",
    "SWE",
    "PRO",
    "PRJ",
    "IOT",
    "MAS",
    "MLN",
    "AIF",
    "DSA",
    "JPD",
    "JPR",
    "PRM",
    "MOB",
    "SWP",
    "SWT",
    "SWD",
    "NET",
    "SEC",
    "DAT",
    "BIG",
    "DEV",
    "OOP",
    "FER",
  ]

  // Môn ghi nhớ/ngôn ngữ
  const memoryPrefixes = ["ENG", "ENW", "JAV", "KOR", "CHI", "VIE", "LIT", "HIS", "GEO", "LAW", "ECO"]

  // Môn sáng tạo
  const creativePrefixes = ["SSG", "MKT", "DES", "ART", "GRA", "MUL", "GAM", "ANI", "UI", "UX"]

  // Môn thực hành
  const practicePrefixes = ["VOV", "PED", "SPO", "LAB", "PRN", "WOR", "INT", "OJT"]

  if (logicPrefixes.some((p) => codePrefix.startsWith(p.substring(0, 2)) || codePrefix === p)) {
    return "logic"
  }
  if (memoryPrefixes.some((p) => codePrefix.startsWith(p.substring(0, 2)) || codePrefix === p)) {
    return "memory"
  }
  if (creativePrefixes.some((p) => codePrefix.startsWith(p.substring(0, 2)) || codePrefix === p)) {
    return "creative"
  }
  if (practicePrefixes.some((p) => codePrefix.startsWith(p.substring(0, 2)) || codePrefix === p)) {
    return "practice"
  }

  // Mặc định là logic
  return "logic"
}

export const subjectStudyTimes: SubjectStudyTime[] = [
  {
    subjectCode: "MAE101",
    subjectName: "Mathematics for Engineering",
    category: "logic",
    studyDuration: "45-60 phút mỗi session",
    breakSuggestion: "Nghỉ 10-15 phút giữa các session",
    tips: [
      "Làm bài tập ngay sau khi học lý thuyết",
      "Không học quá 2 tiếng liên tục",
      "Sử dụng Pomodoro 25-5 cho bài tập khó",
      "Review công thức trước khi ngủ",
    ],
  },
  {
    subjectCode: "MAD101",
    subjectName: "Discrete Mathematics",
    category: "logic",
    studyDuration: "45-60 phút mỗi session",
    breakSuggestion: "Nghỉ 10-15 phút, đi bộ nhẹ",
    tips: ["Vẽ sơ đồ logic để hiểu rõ vấn đề", "Làm nhiều bài tập chứng minh", "Học nhóm để thảo luận các định lý"],
  },
  {
    subjectCode: "PRF192",
    subjectName: "Programming Fundamentals",
    category: "logic",
    studyDuration: "60-90 phút mỗi session (Deep Work)",
    breakSuggestion: "Nghỉ 15-20 phút, tránh xa màn hình",
    tips: [
      "Code thực hành nhiều hơn đọc lý thuyết (70/30)",
      "Debug từng phần nhỏ",
      "Sử dụng Deep Work 90 phút cho project lớn",
      "Review code của người khác để học patterns mới",
    ],
  },
  {
    subjectCode: "PHY101",
    subjectName: "Physics",
    category: "logic",
    studyDuration: "45-60 phút lý thuyết, 60 phút bài tập",
    breakSuggestion: "Nghỉ 10 phút giữa lý thuyết và bài tập",
    tips: ["Hiểu công thức trước khi áp dụng", "Vẽ hình minh họa cho mỗi bài toán", "Làm bài tập từ dễ đến khó"],
  },
  {
    subjectCode: "DBI202",
    subjectName: "Database Introduction",
    category: "logic",
    studyDuration: "45 phút lý thuyết, 60-90 phút thực hành SQL",
    breakSuggestion: "Nghỉ 10 phút sau mỗi 45 phút làm queries",
    tips: [
      "Thực hành SQL trên dataset thực tế",
      "Vẽ ERD diagram trước khi viết queries phức tạp",
      "Học query optimization từ đầu",
    ],
  },
  {
    subjectCode: "CSD201",
    subjectName: "Data Structures",
    category: "logic",
    studyDuration: "60-90 phút mỗi session",
    breakSuggestion: "Nghỉ 15 phút, đi bộ hoặc vận động nhẹ",
    tips: [
      "Vẽ hình minh họa cho mỗi cấu trúc dữ liệu",
      "Code tay trước khi dùng IDE",
      "Phân tích độ phức tạp Big-O",
      "LeetCode/HackerRank để luyện tập",
    ],
  },
  {
    subjectCode: "ENG101",
    subjectName: "English 1",
    category: "memory",
    studyDuration: "30-45 phút mỗi session",
    breakSuggestion: "Nghỉ 5-10 phút, nghe nhạc tiếng Anh",
    tips: [
      "Học 15-20 từ vựng mỗi ngày",
      "Nghe podcast/video tiếng Anh",
      "Viết nhật ký bằng tiếng Anh",
      "Sử dụng Anki cho từ vựng",
    ],
  },
  {
    subjectCode: "ENG102",
    subjectName: "English 2",
    category: "memory",
    studyDuration: "30-45 phút mỗi session",
    breakSuggestion: "Nghỉ 5-10 phút, xem video tiếng Anh",
    tips: [
      "Luyện speaking với bạn bè",
      "Viết essay ngắn mỗi tuần",
      "Đọc articles tiếng Anh",
      "Shadowing - lặp lại theo native speakers",
    ],
  },
  {
    subjectCode: "SSG101",
    subjectName: "Study Skills & Group Work",
    category: "creative",
    studyDuration: "30-45 phút cá nhân, 60-90 phút nhóm",
    breakSuggestion: "Nghỉ 10 phút giữa các hoạt động",
    tips: [
      "Áp dụng ngay kỹ năng vào các môn học khác",
      "Thực hành presentation trước gương",
      "Ghi nhật ký học tập mỗi tối",
    ],
  },
  {
    subjectCode: "VOV114",
    subjectName: "Traditional Martial Arts",
    category: "practice",
    studyDuration: "60-90 phút mỗi session",
    breakSuggestion: "Nghỉ 10 phút, uống nước, hít thở sâu",
    tips: ["Khởi động kỹ trước khi tập", "Tập chậm để thuộc động tác", "Quay video để tự review"],
  },
  {
    subjectCode: "CEA201",
    subjectName: "Computer Organization and Architecture",
    category: "logic",
    studyDuration: "45-60 phút mỗi session",
    breakSuggestion: "Nghỉ 10-15 phút giữa các session",
    tips: ["Vẽ sơ đồ kiến trúc máy tính", "Hiểu binary trước khi học assembly", "Thực hành với simulator"],
  },
  {
    subjectCode: "WED201c",
    subjectName: "Web Development",
    category: "logic",
    studyDuration: "60-90 phút mỗi session",
    breakSuggestion: "Nghỉ 15 phút, tránh xa màn hình",
    tips: [
      "Code theo project thực tế",
      "Học HTML/CSS trước JavaScript",
      "Sử dụng DevTools để debug",
      "Clone các website đơn giản để luyện tập",
    ],
  },
  {
    subjectCode: "OSG202",
    subjectName: "Operating Systems",
    category: "logic",
    studyDuration: "45-60 phút mỗi session",
    breakSuggestion: "Nghỉ 10-15 phút giữa các session",
    tips: ["Hiểu process vs thread", "Thực hành với Linux commands", "Vẽ diagram cho scheduling algorithms"],
  },
  {
    subjectCode: "NWC203c",
    subjectName: "Computer Networking",
    category: "logic",
    studyDuration: "45-60 phút mỗi session",
    breakSuggestion: "Nghỉ 10-15 phút giữa các session",
    tips: ["Học mô hình OSI từ layer 1 lên", "Thực hành với Wireshark", "Cấu hình router/switch ảo"],
  },
  {
    subjectCode: "SWE201c",
    subjectName: "Software Engineering",
    category: "creative",
    studyDuration: "45-60 phút mỗi session",
    breakSuggestion: "Nghỉ 10-15 phút giữa các session",
    tips: ["Áp dụng Agile/Scrum vào project nhóm", "Vẽ UML diagrams", "Học Git/GitHub workflow"],
  },
]
