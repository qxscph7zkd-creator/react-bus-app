# 🚌 Hệ thống Báo cáo và Giám sát Đón trả Học sinh

Một ứng dụng web được xây dựng bằng React để quản lý, giám sát và báo cáo hoạt động đưa đón học sinh bằng xe buýt của trường học. Giao diện được thiết kế trực quan, tập trung vào việc cung cấp thông tin nhanh chóng, chính xác cho người quản lý.

![Ảnh chụp màn hình ứng dụng](httpss://i.imgur.com/your-screenshot-url.png)
*(Lưu ý: Thay thế link trên bằng ảnh chụp màn hình thực tế của ứng dụng bạn)*

## Mục lục

- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt và Chạy dự án](#-cài-đặt-và-chạy-dự-án)
- [Hướng phát triển tiếp theo](#-hướng-phát-triển-tiếp-theo)
- [Đóng góp](#-đóng-góp)
- [Giấy phép](#-giấy-phép)

## ✨ Tính năng chính

Ứng dụng cung cấp một trang dashboard báo cáo toàn diện với các chức năng:

- **📊 Dashboard KPI trực quan:**
  - **Tổng quan:** Hiển thị các chỉ số quan trọng (KPIs) như tổng số học sinh, tỷ lệ đã đón, số lượt đi muộn, số học sinh vắng/hủy, và số học sinh đang chờ phụ huynh.
  - **Tỷ lệ đúng giờ:** Thống kê tỷ lệ đúng giờ trung bình của tất cả các tuyến.

- **🗺️ Thống kê theo tuyến đường:**
  - Hiển thị chi tiết từng tuyến xe với các thông số: tiến độ đón, tỷ lệ đúng giờ, số học sinh muộn/chờ/vắng, và thời gian trễ trung bình.
  - Các tuyến có vấn đề (tỷ lệ đúng giờ thấp, có học sinh chờ) sẽ được **đánh dấu màu cam** để dễ dàng nhận biết.

- **⚠️ Báo cáo các trường hợp ngoại lệ:**
  - **Chưa đón / Chưa trả:** Liệt kê danh sách các học sinh chưa được đón/trả kèm theo đầy đủ 4 lý do: "Vắng mặt", "Chờ phụ huynh", "Không liên lạc được", "Thay đổi đột xuất". Toàn bộ các dòng trong bảng này có **màu cam** để nhấn mạnh sự chú ý.
  - **Đi muộn:** Danh sách các học sinh bị đón muộn và thời gian trễ tương ứng.

- **👨‍✈️ Bảng hiệu suất tài xế:**
  - Thống kê hiệu suất của từng tài xế dựa trên các chỉ số: số tuyến phụ trách, tổng số học sinh đã đón, số lượt muộn, và số sự cố (khi không liên lạc được với phụ huynh).
  - Cung cấp tỷ lệ đúng giờ chính xác theo phần trăm cho mỗi tài xế.

- **⚙️ Bộ lọc và tìm kiếm thông minh:**
  - Lọc báo cáo theo **ngày**, **ca** (sáng, chiều, cả ngày), và **tuyến đường** cụ thể.
  - Không cho phép xem báo cáo của các ngày trong tương lai để đảm bảo tính hợp lệ của dữ liệu.
  - Tìm kiếm nhanh thông tin theo tên học sinh hoặc tài xế.

- **📄 Xuất báo cáo và In ấn:**
  - **Xuất file CSV:** Cho phép xuất toàn bộ dữ liệu trong các bảng "Chưa đón/chưa trả" và "Đi muộn" ra file Excel (CSV) để lưu trữ hoặc phân tích thêm.
  - **In báo cáo:** Cung cấp chức năng in báo cáo trực tiếp từ trình duyệt. Form in được chuẩn hóa, tự động loại bỏ các thành phần không cần thiết như thanh tìm kiếm, footer, chỉ giữ lại nội dung báo cáo chính.

## 🚀 Công nghệ sử dụng

- **Framework:** [ReactJS](httpss://reactjs.org/)
- **Ngôn ngữ:** JavaScript (ES6+)
- **Build tool:** [Vite](httpss://vitejs.dev/)
- **Styling:** [Tailwind CSS](httpss://tailwindcss.com/) và CSS thuần
- **Routing:** [React Router](httpss://reactrouter.com/)
- **Linting:** [ESLint](httpss://eslint.org/)
- **Internationalization:** [i18next](httpss://www.i18next.com/)

> **Lưu ý:** Hiện tại, toàn bộ dữ liệu đang được mô phỏng (mock data) trực tiếp trong component để phục vụ cho việc phát triển giao diện. Trong giai đoạn tiếp theo, các tính toán này sẽ được chuyển về phía backend và ứng dụng sẽ giao tiếp qua API.

## 📁 Cấu trúc thư mục

```
/
├── public/              # Chứa các file tĩnh
├── src/
│   ├── assets/          # Chứa các tài nguyên như ảnh, icon
│   ├── components/      # Chứa các component tái sử dụng
│   ├── pages/           # Chứa các trang chính của ứng dụng
│   ├── App.jsx          # Component gốc của ứng dụng
│   ├── main.jsx         # Điểm vào của ứng dụng
│   └── index.css        # CSS toàn cục
├── .gitignore
├── eslint.config.js     # Cấu hình ESLint
├── index.html
├── package.json
├── README.md
└── vite.config.js       # Cấu hình Vite
```

## 🛠️ Cài đặt và Chạy dự án

1.  **Clone repository về máy của bạn:**
    ```bash
    git clone <your-repository-url>
    ```

2.  **Di chuyển vào thư mục dự án:**
    ```bash
    cd react-bus-app
    ```

3.  **Cài đặt các dependencies:**
    ```bash
    npm install
    ```

4.  **Khởi chạy ứng dụng ở chế độ development:**
    ```bash
    npm run dev
    ```

5.  Mở trình duyệt và truy cập vào `http://localhost:5173` (hoặc cổng khác do Vite chỉ định) để xem ứng dụng.

## 📝 Hướng phát triển tiếp theo

-   **Kết nối Backend:** Xây dựng và tích hợp API để quản lý dữ liệu thực (thông tin học sinh, tuyến đường, tài xế, lịch trình, báo cáo hàng ngày).
-   **Xác thực người dùng:** Xây dựng hệ thống đăng nhập cho các vai trò khác nhau (quản lý, tài xế).
-   **Thông báo real-time:** Sử dụng WebSocket để cập nhật trạng thái đón trả và các sự cố một cách tức thì.
-   **Giao diện cho tài xế:** Xây dựng một giao diện di động cho phép tài xế cập nhật trạng thái đón trả của từng học sinh trên tuyến.

## 🙌 Đóng góp

Mọi đóng góp đều được chào đón! Nếu bạn có ý tưởng để cải thiện ứng dụng, vui lòng tạo một "issue" hoặc "pull request".

## 📄 Giấy phép

Dự án này được cấp phép theo [Giấy phép MIT](LICENSE).

---

*Đồ án được thực hiện trong khuôn khổ môn học Công nghệ Phần mềm.*