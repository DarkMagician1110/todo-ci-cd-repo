# 🚀 Ứng dụng Quản lý Công việc (Todo App) với CI/CD

Dự án này là một ứng dụng Fullstack đơn giản được xây dựng để minh họa quy trình **CI/CD (Tích hợp và Triển khai liên tục)** tự động bằng cách sử dụng **GitHub Actions** và nền tảng **Render**.

---

## 📌 Mô tả dự án
Hệ thống này trình diễn một luồng công việc (workflow) tự động hóa hoàn toàn: Từ khi lập trình viên đẩy mã nguồn (push code) lên GitHub, hệ thống sẽ tự động kiểm thử và triển khai phiên bản mới nhất lên môi trường chạy thực tế.

---

## ✨ Tính năng chính
* ➕ **Thêm công việc:** Tạo mới nhiệm vụ nhanh chóng.
* 📄 **Xem danh sách:** Hiển thị toàn bộ công việc trong thời gian thực.
* ❌ **Xóa công việc:** Loại bỏ các nhiệm vụ đã hoàn thành hoặc không cần thiết.
* 🛠️ **Hệ thống CI/CD:** Tự động hóa khâu kiểm tra chất lượng và phát hành.

---

## 🛠️ Công nghệ sử dụng
| Thành phần | Công nghệ |
| :--- | :--- |
| **Backend** | Node.js (Express) |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Công cụ CI/CD** | GitHub Actions |
| **Nền tảng triển khai** | Render |

---

## 🔄 Quy trình CI/CD Pipeline
Luồng tự động hóa được thiết lập như sau:
1. **Đẩy mã nguồn:** Lập trình viên `push code` lên kho lưu trữ GitHub.
2. **GitHub Actions kích hoạt:**
    * 🏗️ **Khởi tạo:** Thiết lập môi trường và cài đặt các thư viện cần thiết (`dependencies`).
    * 🧪 **Kiểm thử:** Chạy các bài test tự động (`npm test`).
3. **Triển khai:** Nếu tất cả các bài test đều vượt qua 🟢, hệ thống sẽ gửi lệnh kích hoạt để **Render** tự động cập nhật bản build mới nhất lên server.

---

## 📂 Cấu trúc dự án
```text
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   └── routes/
│   ├── app.js
│   └── tests/      <-- Nơi chứa các bài kiểm thử tự động
└── frontend/
    ├── index.html
    └── script.js

