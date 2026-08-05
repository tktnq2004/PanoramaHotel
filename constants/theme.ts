// Bảng màu duy nhất của app — mọi component nên import từ đây thay vì hardcode
// mã hex trực tiếp trong StyleSheet, để đổi màu chỉ cần sửa một chỗ.
//
// Hướng thiết kế: "dark luxury" cho app du lịch/lưu trú cao cấp — nền gần đen
// (không dùng đen tuyệt đối #000, mất chiều sâu), một accent vàng đồng ấm duy
// nhất xuyên suốt app (khác với xanh lam mặc định thường gặp), giữ thang chữ
// xám-xanh (slate) cho các cấp độ chữ vì vẫn đọc tốt trên nền ink.
export const Colors = {
  white: '#FFFFFF',
  black: '#000000',

  // Nền — off-black, không dùng #000 thuần để giữ chiều sâu/độ tương phản nhẹ
  // giữa các lớp UI chồng lên nhau (header, card, popup).
  ink: {
    950: '#0B0C0E',
    900: '#131518',
    800: '#1C1F24',
    700: '#2B2F36',
  },

  // Accent vàng đồng ấm — dùng nhất quán cho mọi điểm nhấn tương tác (hotspot,
  // nút chính, viền active) thay vì lam mặc định, gợi cảm giác hospitality
  // cao cấp mà không sa vào tổ hợp be+đồng bị lạm dụng (nền be, chữ espresso).
  gold: {
    400: '#DEC38F',
    500: '#C9A876',
    600: '#AD8B5C',
  },

  // Thang xám-xanh (slate) cho các cấp độ chữ trên nền tối.
  slate: {
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  red: {
    warning: '#F87171', // icon/text cảnh báo lỗi load ảnh
  },

  // Các lớp phủ (overlay) trong suốt, đặt tên theo vai trò để biết vì sao độ mờ
  // khác nhau giữa các chỗ dùng, thay vì để magic number rgba rải rác.
  overlay: {
    header: 'rgba(11, 12, 14, 0.7)', // nền thanh header/back button trong viewer (đi kèm BlurView)
    borderLight: 'rgba(255, 255, 255, 0.12)', // viền nhạt trên nền overlay tối
    borderSubtle: 'rgba(255, 255, 255, 0.24)', // viền nút back tròn trên GLView
    button: 'rgba(11, 12, 14, 0.55)', // nền nút tròn nổi trên ảnh panorama (đi kèm BlurView)
    scrim: 'rgba(6, 7, 8, 0.55)', // nền mờ phủ toàn màn hình (đi kèm BlurView cho popup)
    scrimLight: 'rgba(6, 7, 8, 0.35)', // overlay mờ trên ảnh thẻ property (đầu gradient)
    scrimStrong: 'rgba(6, 7, 8, 0.85)', // overlay đậm cuối gradient thẻ property, nền chip hotspot
  },
};

// Thang bo góc duy nhất của app (shape consistency lock) — mọi nơi dùng radius
// phải lấy từ đây, không tự đặt số tuỳ tiện.
export const Radius = {
  sm: 12,
  md: 16,
  lg: 24,
  pill: 999,
};

// Tên các family đã load qua @expo-google-fonts/outfit trong app/_layout.tsx.
export const Fonts = {
  regular: 'Outfit_400Regular',
  medium: 'Outfit_500Medium',
  semibold: 'Outfit_600SemiBold',
  bold: 'Outfit_700Bold',
};
