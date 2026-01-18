// Bộ từ điển "Mỏ Hỗn" 2025 - Kịch bản thoại của Cóc

export type FrogMode = "thanh_loc" | "gia_truong" | "slay" | "tam_linh" | "hoang_loan"

export const FROG_DIALOGUES: Record<FrogMode, string[]> = {
  // Chế độ Thanh Lọc (Khi mới mở web / Cần sự tĩnh tâm)
  thanh_loc: [
    "Năm nay năm thanh lọc, lười là tui 'block' khỏi trái đất nha!",
    "Đang quét virus 'trì hoãn'... Phát hiện 1 ca dương tính! Bíp bíp!",
    "Tiễn vong deadline! Úm ba la xì bùa đi ra chỗ khác!",
    "Thanh lọc tâm hồn, loại bỏ tạp niệm, chỉ nạp kiến thức!",
    "Say bye sự lười biếng! Say hi điểm 10!",
    "Tâm phải tịnh, bài phải xinh!",
    "Đang loading nhân phẩm... Vui lòng chờ!",
  ],

  // Chế độ Gia Trưởng (Khi sinh viên lười / Không làm bài tập)
  gia_truong: [
    "Học đi! Gia trưởng mới lo được cho em!",
    "Tui là Cóc gia trưởng, tui nói là phải làm!",
    "Không học thì đừng có trách tại sao nước biển lại mặn!",
    "Nhìn gì? Nhìn vào tương lai tăm tối của bạn kìa!",
    "Em sai rồi, em xin lỗi deadline đi!",
    "Ở đây chúng tôi không 'nuông chiều', chỉ có 'tiêu chuẩn kép' (Học nhiều thưởng nhiều)!",
    "Anh không thích em lười, anh thích em làm Lab!",
    "Đừng để anh nóng!",
  ],

  // Chế độ Slay (Khi hoàn thành nhiệm vụ / Mua được đồ xịn)
  slay: [
    "Keo lỳ tái châu! Mãi mận mãi kem!",
    "Slay quá elm ơi! 10 điểm về chỗ!",
    "Flexing thành công! Hào quang rực rỡ!",
    "Bất ngờ chưa bà dà? Chăm chỉ đột xuất!",
    "Đúng là con của Cóc gia trưởng có khác! Tự hào!",
    "Chấn động địa cầu! Quá dữ!",
    "Cứu tinh của GPA đây rồi!",
  ],

  // Chế độ Tâm Linh (Ngẫu nhiên)
  tam_linh: [
    "Tín hiệu vũ trụ bảo: Đừng lướt TikTok nữa!",
    "Tam tai không đáng sợ, rớt môn mới đáng sợ!",
    "Gieo nhân 'code', gặt quả 'pass môn'.",
    "Hôm nay không học, ngày mai 'đăng xuất' khỏi trường!",
  ],

  // Chế độ Hoảng Loạn (Khi sắp hết giờ Deadline)
  hoang_loan: [
    "Cháy nhà rồi! Deadline tới cổ rồi!",
    "Cứu tui! Ét o ét! 🆘",
    "Còn cái nịt! Chạy lẹ đi!",
    "AAAAAA! Sao không học từ đầu?!",
    "May quá còn kịp... KHÔNG! HẾT GIỜ RỒI!",
  ],
}

export const FROG_EMOJIS: Record<FrogMode, string> = {
  thanh_loc: "🧐",
  gia_truong: "😤",
  slay: "😎",
  tam_linh: "🔮",
  hoang_loan: "😱",
}

export function getRandomDialogue(mode: FrogMode): string {
  const dialogues = FROG_DIALOGUES[mode]
  return dialogues[Math.floor(Math.random() * dialogues.length)]
}
