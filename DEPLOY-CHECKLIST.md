# Checklist đưa Lớp Toán Thầy Hùng lên mạng

1. Tạo repository GitHub mới.
2. Upload toàn bộ mã nguồn, không upload `.env`.
3. Tạo Firebase project riêng.
4. Bật Google Authentication (và phương thức đăng nhập cần dùng).
5. Tạo Firestore Database.
6. Thiết lập Firestore Rules từ `firestore.rules` rồi rà soát lại quyền truy cập trước khi dùng thật.
7. Tạo Firebase Web App và lấy các biến cấu hình.
8. Tạo biến môi trường trên nền tảng deploy.
9. Thêm `GEMINI_API_KEY` nếu dùng AI chấm tự luận.
10. Chạy `npm install` và `npm run build` để kiểm tra trước khi deploy.
