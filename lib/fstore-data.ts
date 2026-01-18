import type { FStoreItem } from "./types"

export const FSTORE_ITEMS: FStoreItem[] = [
  // Slot Trang Phục (Body) - "Thời trang FPT"
  {
    id: "ao-cam",
    name: "Áo Cam Huyền Thoại",
    description: "Áo phông cam FPT cơ bản - Mặc định.",
    price: 0,
    slot: "body",
    image: "/orange-fpt-t-shirt-cartoon-style.jpg",
    isDefault: true,
  },
  {
    id: "vo-phuc-vovinam",
    name: "Võ Phục Vovinam (Blue Fighter)",
    description: "Môn thể chất bắt buộc và đặc sản của FPT. Tăng 100% sức mạnh tinh thần khi chạy deadline.",
    price: 200,
    slot: "body",
    image: "/blue-vovinam-martial-arts-uniform-cartoon.jpg",
  },
  {
    id: "hoodie-fpt",
    name: "Áo Hoodie F-FPT",
    description: "Trang phục mùa đông quen thuộc tại cơ sở Hòa Lạc/Hà Nội.",
    price: 150,
    slot: "body",
    image: "/orange-hoodie-fpt-cartoon-style.jpg",
  },
  {
    id: "vest-bao-ve",
    name: "Vest Bảo Vệ Đồ Án",
    description: "Bộ vest đen lịch lãm dùng cho ngày bảo vệ Capstone.",
    price: 500,
    slot: "body",
    image: "/black-formal-vest-suit-cartoon.jpg",
  },

  // Slot Phụ Kiện (Accessories) - "Phong cách Gen Z"
  {
    id: "the-sv",
    name: "Thẻ Sinh Viên Đeo Cổ",
    description: "Vật bất ly thân để qua cổng kiểm soát.",
    price: 50,
    slot: "accessory",
    image: "/student-id-card-lanyard-cartoon.jpg",
  },
  {
    id: "kinh-thug",
    name: "Kính Thug Life (Pixel)",
    description: "Dành cho những chú Cóc 'ngầu lời', code 1 lần chạy luôn không bug.",
    price: 120,
    slot: "accessory",
    image: "/pixel-sunglasses-thug-life-meme-cartoon.jpg",
  },
  {
    id: "tai-nghe-rgb",
    name: "Tai nghe Gaming (RGB)",
    description: "Phát sáng 7 màu. Tập trung học bài hiệu quả.",
    price: 300,
    slot: "accessory",
    image: "/rgb-gaming-headset-colorful-cartoon.jpg",
  },
  {
    id: "mu-cu-nhan",
    name: "Mũ Cử Nhân",
    description: "Mục tiêu tối thượng - Tốt nghiệp ra trường! Biểu tượng của sự thành công.",
    price: 1000,
    slot: "accessory",
    image: "/graduation-cap-mortarboard-cartoon.jpg",
    isLimited: true,
  },
  {
    id: "dai-vovinam",
    name: "Đai Vovinam Vàng",
    description: "Minh chứng cho những ngày tháng lăn lộn trên sân tập võ.",
    price: 200,
    slot: "accessory",
    image: "/yellow-martial-arts-belt-cartoon.jpg",
  },

  // Slot Cầm Nắm (Hand-held) - "Vũ khí chạy Deadline"
  {
    id: "coc-highlands",
    name: "Cốc Highlands Coffee",
    description: "Nguồn sống của sinh viên mỗi sáng. Biểu tượng tỉnh táo.",
    price: 80,
    slot: "handheld",
    image: "/highlands-coffee-cup-takeaway-cartoon.jpg",
  },
  {
    id: "laptop-gaming",
    name: "Laptop Gaming (Alienware/ROG)",
    description: "Cấu hình khủng để code AI/Đồ họa. Món đồ đắt giá nhất!",
    price: 1000,
    slot: "handheld",
    image: "/gaming-laptop-alienware-rgb-cartoon.jpg",
    isLimited: true,
  },
  {
    id: "banh-mi",
    name: "Ổ Bánh Mì Que",
    description: "Bữa sáng vội vã trước giờ vào lớp.",
    price: 30,
    slot: "handheld",
    image: "/vietnamese-banh-mi-sandwich-cartoon.jpg",
  },
  {
    id: "hao-hao",
    name: "Hảo Hảo Ly",
    description: '"Người bạn thân" những đêm chạy đồ án cuối tháng.',
    price: 45,
    slot: "handheld",
    image: "/instant-noodle-cup-hao-hao-cartoon.jpg",
  },

  // Slot Phông Nền (Background) - "Địa điểm Check-in"
  {
    id: "bg-default",
    name: "Sân Trường FPT",
    description: "Không gian mặc định - sân trường xanh mát.",
    price: 0,
    slot: "background",
    image: "/fpt-university-campus-green-trees.jpg",
    isDefault: true,
  },
  {
    id: "bg-library",
    name: "Thư viện FPT",
    description: "Yên tĩnh, nhiều sách. Nơi học tập lý tưởng.",
    price: 100,
    slot: "background",
    image: "/modern-library-bookshelves-quiet-study-area.jpg",
  },
  {
    id: "bg-hosen",
    name: "Hồ Sen (Cơ sở Hòa Lạc)",
    description: "Chill, thơ mộng. View đẹp nhất campus.",
    price: 150,
    slot: "background",
    image: "/lotus-pond-peaceful-scenery-sunset.jpg",
  },
  {
    id: "bg-lab",
    name: "Phòng Lab (Phòng máy)",
    description: "Đèn neon, code xuyên đêm.",
    price: 200,
    slot: "background",
    image: "/computer-lab-neon-lights-night-coding.jpg",
  },
  {
    id: "bg-vovinam",
    name: "Sân Vovinam",
    description: "Nắng và gió. Rèn luyện thể chất.",
    price: 120,
    slot: "background",
    image: "/outdoor-martial-arts-training-ground-sunny.jpg",
  },
]

export const SLOT_NAMES = {
  body: "Trang Phục",
  accessory: "Phụ Kiện",
  handheld: "Cầm Nắm",
  background: "Phông Nền",
}

export const SLOT_DESCRIPTIONS = {
  body: "Thời trang FPT",
  accessory: "Phong cách Gen Z",
  handheld: "Vũ khí chạy Deadline",
  background: "Địa điểm Check-in",
}

export const PSYCHOLOGY_EFFECTS = [
  {
    name: "Hiệu ứng Diderot (The Diderot Effect)",
    concept: 'Khi người ta mua một món đồ mới, họ có xu hướng mua thêm các món đồ khác để "đồng bộ".',
    application:
      'Nếu sinh viên mua "Võ phục Vovinam", họ sẽ muốn cày thêm tiền để mua "Đai vàng" hoặc "Nền sân tập" cho đủ bộ. Điều này giữ chân họ ở lại web lâu dài.',
  },
  {
    name: "Sự khan hiếm nhân tạo (Artificial Scarcity)",
    concept: 'Tạo ra các vật phẩm "Limited Edition" chỉ bán trong thời gian giới hạn.',
    application:
      '"Áo dài Tết" chỉ bán trong tuần lễ Tết Nguyên Đán. Nếu tuần đó không học chăm chỉ để kiếm tiền mua thì sẽ mất cơ hội vĩnh viễn. → Kích thích FOMO (Sợ bỏ lỡ).',
  },
  {
    name: "Tín hiệu Lợi ích (Signaling Theory)",
    concept:
      'Một con Cóc mặc "Vest Bảo Vệ" và cầm "Laptop Gaming" là tín hiệu cho thấy chủ nhân của nó là một sinh viên chăm chỉ, điểm cao (vì phải học rất nhiều giờ mới đủ tiền mua).',
    application: "Sinh viên sẽ muốn chụp ảnh con Cóc này khoe lên Story Facebook.",
  },
]
