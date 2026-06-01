# SmartTask-Pro


Ứng dụng quản lý công việc và dự án được xây dựng bằng Laravel, React/Inertia, và Tailwind CSS.

## Tổng quan

SmartTask-Pro là một hệ thống quản lý công việc cho người dùng và quản trị viên, bao gồm:

- Quản lý công việc (Task) cho từng người dùng
- Giao việc theo dự án và quản lý quyền của từng người dùng trong dự án
- Thống kê và báo cáo tiến độ công việc
- Xuất báo cáo PDF
- Hỗ trợ phản hồi (support request)
- Trang hồ sơ cá nhân và tính năng tạo CV thông minh
- Khu vực quản trị (Admin) để quản lý người dùng, nhiệm vụ và dự án

## Tính năng chính

### Người dùng

- Xem bảng điều khiển với tổng quan công việc và tiến độ
- Tạo, sửa, xóa công việc cá nhân
- Cập nhật trạng thái công việc
- Gửi và xem phản hồi theo mỗi task
- Xem và quản lý dự án được phân công
- Xem CV thông minh từ dữ liệu công việc
- Xuất báo cáo công việc ra PDF

### Quản trị viên

- Quản lý người dùng (CRUD)
- Quản lý task toàn hệ thống
- Duyệt hoặc từ chối task
- Quản lý phản hồi hỗ trợ người dùng
- Quản lý dự án và phân công công việc cho người dùng
- Xuất bảng xếp hạng công việc dưới dạng PDF

## Công nghệ sử dụng

- PHP 8.3
- Laravel 13
- Inertia.js với React
- Tailwind CSS
- Vite
- SQLite / MySQL (tuỳ môi trường)
- DOMPDF để xuất PDF

## Cài đặt nhanh

1. Clone repository:

```bash
git clone <repository-url>
cd Duantt
```

2. Cài đặt PHP dependencies:

```bash
composer install
```

3. Tạo file môi trường và khóa ứng dụng:

```bash
copy .env.example .env
php artisan key:generate
```

4. Cấu hình database trong `.env` (ví dụ SQLite hoặc MySQL)

5. Chạy migrate:

```bash
php artisan migrate --force
```

6. Cài đặt Node dependencies và build frontend:

```bash
npm install
npm run dev
```

## Chạy ứng dụng

- Chạy môi trường phát triển:

```bash
npm run dev
```

- Build sản phẩm cho production:

```bash
npm run build
```

- Chạy kiểm thử:

```bash
php artisan test
```

## Cấu trúc chính

- `app/Http/Controllers` - controller xử lý request
- `app/Models` - model dữ liệu chính
- `resources/js/Pages` - giao diện React/Inertia
- `routes/web.php` - định nghĩa tuyến đường web
- `database/migrations` - schema database và bảng
- `resources/views` - template Blade cho xuất PDF

## Một số route quan trọng

- `/dashboard` - trang chính người dùng đã đăng nhập
- `/quan-ly-cong-viec` - quản lý task người dùng
- `/du-an-cua-toi` - danh sách dự án của người dùng
- `/Cv-thong-minh` - trang CV thông minh
- `/pdf-preview` và `/pdf-export` - xem và xuất PDF
- `/admin` - khu vực quản trị

## Ghi chú

- Ứng dụng sử dụng middleware `auth` và `verified` cho hầu hết chức năng người dùng
- Khu vực admin sử dụng `AdminMiddleware` để phân quyền
- Nếu dùng SQLite, hãy đảm bảo file database có quyền ghi và tồn tại
