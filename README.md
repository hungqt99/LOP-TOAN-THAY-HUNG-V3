# Lớp Toán Thầy Hùng

Web app cá nhân quản lý kiểm tra và thi trực tuyến môn Toán, phát triển từ bộ mã nguồn được cung cấp.

## Chức năng chính

- Đăng nhập và phân quyền Admin / Giáo viên / Học sinh
- Quản lý ngân hàng câu hỏi
- Tạo, sửa, giao và tổ chức đề kiểm tra
- Học sinh làm bài trực tuyến
- Chấm điểm và theo dõi bài làm
- Hỗ trợ câu hỏi trắc nghiệm, đúng/sai, trả lời ngắn và tự luận
- Công thức Toán LaTeX, bảng và hình minh họa
- Bảng nháp / công cụ vẽ cho học sinh
- Phòng thi trực tuyến theo mã phòng
- Thống kê kết quả và phân tích dữ liệu
- AI hỗ trợ chấm tự luận / giải thích (cần Gemini API)
- Đồng bộ dữ liệu với Firebase Firestore

## 1. Cài đặt

Yêu cầu Node.js 20+.

```bash
npm install
```

## 2. Cấu hình Firebase

Tạo **Firebase project riêng của thầy**, bật Authentication và Firestore.

Sao chép `.env.example` thành `.env` và điền thông tin Firebase Web App:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=
VITE_FIREBASE_DATABASE_ID=
```

Không sử dụng lại cấu hình Firebase của dự án gốc.

Nếu sử dụng AI chấm tự luận, thêm:

```env
GEMINI_API_KEY=...
```

## 3. Chạy trên máy

```bash
npm run dev
```

## 4. Kiểm tra TypeScript

```bash
npm run lint
```

## 5. Build production

```bash
npm run build
```

## 6. Triển khai

Có thể triển khai frontend/backend trên Vercel, Railway hoặc máy chủ Node.js. Với Firebase, cần tạo Firestore rules và Authentication cho project riêng.

### Gợi ý cấu trúc triển khai

- GitHub: lưu mã nguồn
- Vercel/Railway: chạy web app
- Firebase: Authentication + Firestore
- Gemini API: AI chấm tự luận

## Thương hiệu

**LỚP TOÁN THẦY HÙNG**

*Mỗi bài toán là một thử thách – Mỗi lời giải là một bước trưởng thành*

> Lưu ý: File `.env` chứa khóa riêng của thầy và không được commit lên GitHub.
