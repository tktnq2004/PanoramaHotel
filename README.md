# PanoraStay

Ứng dụng xem tour ảo 360° cho khách sạn/resort trên thiết bị di động, xây dựng bằng React Native + Expo.

## 1. Giới thiệu ứng dụng

PanoraStay cho phép người dùng khám phá những địa điểm lưu trú Resort/Khách sạn một cách chân thực, trực quan nhất thông qua các ảnh panorama 360° được kết nối với nhau bằng hotspot — giống trải nghiệm virtual tour của Matterport/Google Street View, nhưng chạy hoàn toàn native trên di động, không dùng WebView.

Từ màn hình chính, người dùng chọn địa điểm muốn xem. 
Trong màn hình xem panorama, người dùng có thể:
- Vuốt để xoay góc nhìn 360°, chụm/mở 2 ngón để zoom.
- Bấm vào các điểm hotspot nổi trên ảnh để xem thông tin (popup INFO) hoặc di chuyển sang không gian khác (NAVIGATION), có hiệu ứng chuyển cảnh mượt.
- Quay lại panorama vừa đi qua hotspoth hoặc Return hoặc thoát hẳn về màn hình chính (Back to home).

## 2. Kiến trúc dự án

```
app/
  index.tsx          Màn hình chính — danh sách địa điểm (data-driven từ constants/data.ts)
  viewer.tsx          Màn hình xem panorama — điều phối orientation, stack điều hướng, hiệu ứng chuyển cảnh
  _layout.tsx          Root layout — load font, theme, status bar

components/
  PanoramaViewer.tsx   Bọc GLView + lớp overlay UI (nút back, hotspot, thông báo lỗi)
  HotspotOverlay.tsx    Vẽ marker hotspot lên trên GLView (View thường, không phải đối tượng 3D)
  HotspotInfoModal.tsx  Popup thông tin cho hotspot loại INFO
  ViewerHeader.tsx      Header màn hình viewer (Return / Back to home / tên phòng)

hooks/
  usePanoramaScene.ts    Lõi Three.js: scene, camera, sphere, render loop, load texture
  useOrbitControls.ts    Gesture vuốt-để-xoay + chụm-để-zoom (PanResponder)
  useGLViewportSync.ts   Đồng bộ kích thước renderer/camera theo GL surface thật
  usePanoramaNavigation.ts  Stack điều hướng giữa các panorama trong 1 địa điểm
  useReducedMotion.ts     Đọc cài đặt "Giảm chuyển động" của hệ điều hành

utils/
  projectHotspot.ts    Hàm thuần chiếu toạ độ 3D của hotspot xuống toạ độ 2D màn hình

constants/
  data.ts       Toàn bộ dữ liệu: địa điểm, panorama, hotspot (data-driven, không hardcode UI theo từng phòng)
  theme.ts      Design token: màu, bo góc, font — nguồn chân lý duy nhất cho giao diện
```

**Nguyên tắc kiến trúc chính:**
- **Tách lõi render khỏi UI**: `usePanoramaScene` chỉ lo Three.js/WebGL, hoàn toàn không biết gì về React Native UI. Các nút, popup, hotspot label là các `View` React Native bình thường vẽ **đè lên trên** `GLView` bằng `position: absolute`, không phải đối tượng bên trong scene 3D — vừa dễ style bằng công cụ RN quen thuộc, vừa tránh xung đột giữa vòng lặp render GL và cây UI của React.
- **Custom hook theo từng trách nhiệm**: tách các chức năng thành các file đơn nhiệm `usePanoramaScene` (vòng đời scene), `useOrbitControls` (gesture), `useGLViewportSync` (đồng bộ kích thước) — mỗi hook có đúng 1 lý do để thay đổi.

## 3. Các thư viện đã sử dụng

| Thư viện | Mục đích |
|---|---|
| `expo-router` | Điều hướng theo file (Home ↔ Viewer), truyền tham số qua URL params |
| `expo-gl` | Tạo context OpenGL ES thật trong React Native — nền tảng cho render native, không qua WebView |
| `expo-three` | Cầu nối để Three.js vẽ lên context của `expo-gl` |
| `three` | Dựng scene 3D: sphere geometry, camera, texture, vòng lặp render |
| `expo-screen-orientation` | Khoá màn hình viewer về ngang (landscape) để xem panorama đúng tỉ lệ |
| `react-native-reanimated` + `react-native-worklets` | Toàn bộ animation: hiệu ứng vào màn, pulse hotspot, chuyển cảnh giữa panorama — chạy trên UI thread nên mượt |
| `expo-blur` | Bề mặt kính mờ (glass) cho marker hotspot, popup, header — style "dark luxury" |
| `expo-linear-gradient` | Gradient thật cho ảnh thẻ địa điểm ở màn hình chính |
| `@expo-google-fonts/outfit` | Font chữ Outfit, nhúng sẵn trong app lúc build (không tải qua mạng) |
| `@expo/vector-icons` (Ionicons) | Toàn bộ icon trong app |
| `expo-asset` | Đảm bảo ảnh panorama được bundle đúng cách vào app lúc build |
| `expo-file-system` | Peer dependency bắt buộc của `expo-three`, cần thiết để app không crash khi chạy bản build thật (ngoài Expo Go) |

## 4. Các tính năng đã hoàn thành

- **Xem ảnh 360° native**: pan bằng vuốt tay, zoom bằng chụm 2 ngón (điều chỉnh FOV camera), không dùng WebView.
- **Hotspot 2 loại**: `INFO` (mở popup thông tin) và `NAVIGATION` (chuyển sang panorama khác, có hiệu ứng fade qua màu đen đồng bộ với thời điểm ảnh mới thật sự sẵn sàng, không đoán thời gian cố định).
- **Giữ hotspot để xem trước**: giữ tay lên hotspot NAVIGATION hiện thẻ ảnh xem trước của panorama đích trước khi quyết định chuyển cảnh.
- **Stack điều hướng**: mỗi lần chuyển panorama được đẩy vào 1 stack lịch sử; nút **Return** lùi lại đúng panorama vừa đi qua (giống nút back trình duyệt), nút **Back to home** thoát hẳn về màn hình chính. Stack tự khởi tạo lại mỗi lần vào 1 địa điểm mới từ Home.
- **Mô hình**: triển khai theo 2 mô hình ( Resort — 7 không gian, Hotel — 6 không gian), mỗi panorama có tối thiểu 3 hotspot theo đúng yêu cầu đề bài.
- **Bền vững với ảnh đầu vào bất kỳ kích thước nào**: kiểm tra `GL_MAX_TEXTURE_SIZE` trước khi tải texture, tránh crash/ảnh đen với ảnh chưa xử lí kích thước sau này.

## 5. Giải thích giải pháp đã lựa chọn

- **React Native + Expo Go**: đã từng làm việc với React nên lựa chọn React Native sẽ quen thuộc hơn trong việc implement và debug. Expo Go hỗ trợ nhiều thư viện native. Đồng thời Expo Go hoàn toàn miễn phí trong việc test trên máy thật Iphone ( Không có máy android ). 
- **Native rendering (expo-gl + Three.js) thay vì WebView**: đề bài khuyến khích hạn chế WebView vì lý do hiệu năng và trải nghiệm mượt. WebView phải khởi tạo cả 1 tầng trình duyệt con, tốn RAM và có thêm 1 lớp dịch giữa JS ↔ native. Render thẳng bằng `expo-gl` bỏ qua hoàn toàn tầng đó, animation/xoay ảnh mượt hơn, và cho phép tái sử dụng toàn bộ hệ sinh thái Three.js (rất trưởng thành cho việc dựng sphere/texture 360°) mà không phải tự viết native module OpenGL từ đầu.
- **UI overlay là View thường, không phải object 3D**: cân nhắc giữa việc vẽ hotspot/label ngay trong scene Three.js (dùng sprite 3D) so với vẽ bằng View RN đè lên trên (cách đã chọn). Chọn View RN vì: style bằng StyleSheet/Reanimated quen thuộc hơn nhiều so với dựng UI trong WebGL, dễ đảm bảo animation/accessibility nhất quán với phần còn lại của app, và tách biệt rõ "cái gì thuộc về scene 3D" (chỉ có sphere ảnh) với "cái gì thuộc về UI" (mọi thứ còn lại).
- **Stack điều hướng thay vì chỉ lưu 1 panorama hiện tại**: ban đầu chỉ lưu `currentId` đơn — bấm hotspot là ghi đè, không có cách quay lại đúng đường đã đi. Đổi sang stack (mảng lịch sử) để có nút Return giống hành vi back quen thuộc của trình duyệt, đúng yêu cầu "cho phép quay lại panorama trước đó" — đơn giản, dễ hiểu, không cần thư viện điều hướng phức tạp thêm vì phạm vi chỉ giới hạn trong 1 địa điểm tại 1 thời điểm.
- **Hiệu ứng chuyển cảnh "fade qua màu đen" đồng bộ theo tín hiệu sẵn sàng thực tế**: vì đổi panorama là remount lại `GLView` nên chọn fade qua màu đen — hiệu ứng tiêu chuẩn của các app tour ảo khi chuyển cảnh bằng remount. Điểm khác biệt: thời điểm mở lại màn hình dựa vào tín hiệu `isReady` (đã render xong khung hình đầu của ảnh mới) thay vì đoán 1 khoảng thời gian cố định — tránh mở ra quá sớm (còn thấy đen/méo) hoặc quá trễ (cảm giác lag) tuỳ theo tốc độ máy.

## 6. Những khó khăn gặp phải

- **Xung đột phiên bản giữa các thư viện trong app** khi sử dụng `Expo Go` sẽ tự động cài một số dependency đi kèm như `react@^19.2.8`, khi cài đặt `expo-router` dependency là `react@19.1.0` dẫn đến xảy ra xung đột khi chạy app. Mất 2h để tìm ra và cài lại `react@19.1.0`.
- **Nguồn ảnh Panorama (Khó khăn và tốn thời gian nhất)** nguồn ảnh trên GoogleMap đều có bản quyền không thể sử dụng. Skybox AI cần trả phí để có thể download. Các nguồn ảnh miễn phí như Poly Haven, Kuula.co chỉ có những ảnh đơn lẻ, ảnh không liên kết với nhau. Dẫn đến rất khó khăn cho việc hoàn thiện tính logic của các hotspot đến chuyển panorama. 
- **Ảnh panorama gốc quá nặng** (có ảnh tới 8192×4096, ~3MB, decode ra RAM ~128MB): vừa chậm vừa dễ vượt giới hạn texture GPU trên thiết bị/emulator yếu. Giải pháp: resize hàng loạt về 4096×2048 trước khi đưa vào app, kèm kiểm tra `GL_MAX_TEXTURE_SIZE` runtime để chủ động báo lỗi rõ ràng thay vì để ảnh đen khó hiểu.
- **Ảnh bị bóp méo/màn đen lúc mới mở app**: `expo-gl` chỉ đọc kích thước GL surface (`drawingBufferWidth/Height`) đúng 1 lần lúc tạo context, không tự cập nhật lại. Nếu `GLView` được mount trước khi màn hình xoay ngang xong (đặc biệt lúc cold start), context sẽ "đóng băng" với kích thước sai suốt vòng đời của nó. Giải pháp: chỉ mount `PanoramaViewer` sau khi `ScreenOrientation.lockAsync` đã resolve **và** `useWindowDimensions` đã thật sự phản ánh layout ngang, đồng thời đồng bộ lại kích thước renderer/camera mỗi khung hình để bắt kịp thời điểm ổn định.
- **App crash khi bấm hotspot INFO**: nguyên nhân là component `<Modal>` của React Native tạo ra 1 cửa sổ/surface native riêng, việc tạo/huỷ cửa sổ này giữa lúc `GLView` đang render mỗi khung hình làm gián đoạn EGL surface, gây crash (đặc biệt với kiến trúc mới - New Architecture). Giải pháp: bỏ hẳn `<Modal>`, thay bằng `View` overlay tuyệt đối trong cùng cây view của React Native.

## 7. Hướng phát triển nếu có thêm thời gian

- Phát triển App theo mô hình đặt phòng khách sạn: Người dùng có thể chọn 1 khách sạn và đi tuần tự: Từ sảnh đi đến hành lang hoặc ra cổng -> đi đến tầng 1/tầng 2,... vào từng phòng, xem nội thất, view, ... tham khảo một cách trực quan nhất trước khi quyết định đặt phòng.
- Thêm bản đồ/sơ đồ mặt bằng (mini-map) hiển thị đang đứng ở phòng nào trong tổng thể địa điểm.
- Cho phép preload/cache ảnh panorama sắp tới (dựa theo hotspot NAVIGATION đang hiển thị) để chuyển cảnh tức thời hơn.
- Nén ảnh động theo băng thông/thiết bị (tải bản độ phân giải thấp trước, nét dần) thay vì 1 kích thước cố định cho mọi thiết bị.
- Cho phép người dùng tự thêm/sửa hotspot ngay trong app (đã có sẵn 1 công cụ nội bộ dựng bằng Three.js + Vite để hiệu chỉnh toạ độ hotspot chính xác trước khi đưa vào `data.ts` — có thể tích hợp thành chế độ "chỉnh sửa" ngay trong app thật).
- Thêm tìm kiếm/lọc địa điểm, đánh dấu yêu thích khi có nhiều hơn 2 địa điểm.
