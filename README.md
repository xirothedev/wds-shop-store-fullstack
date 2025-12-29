# WDS Shop Store - Website Bán Giày Online

## Giới thiệu

Đây là bài kiểm tra đầu vào WebDev Studios Gen 8 - một mini project mô phỏng môi trường làm việc thực tế. Website được xây dựng nhằm mô phỏng một hệ thống bán giày online ở mức cơ bản, tập trung vào các luồng sử dụng chính của người dùng.

## Mục tiêu

Bài kiểm tra này tập trung vào việc quan sát:

- Cách đọc, hiểu và triển khai một yêu cầu thực tế
- Tư duy xây dựng một sản phẩm web hoàn chỉnh ở mức cơ bản
- Cách tổ chức công việc, phân chia nhiệm vụ và phối hợp trong nhóm
- Thái độ học tập, tinh thần trách nhiệm và sự chủ động của từng cá nhân

## Công nghệ sử dụng

### Frontend

- **Framework**: Next.js (React)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Styling**: CSS/Tailwind CSS

### Backend

- **Architecture**: 3-layer architecture
- **Language**: TypeScript/JavaScript
- **Authentication**: JWT
- **Password Encryption**: argon2

### Quản lý Source Code

- **Version Control**: Git
- **Monorepo**: Turborepo

## Cấu trúc Project

```
wds-shop-store-fullstack/
├── apps/
│   ├── web/          # Frontend (Next.js)
│   └── api/          # Backend (3-layer architecture)
├── plans/            # Chi tiết plan cho từng module/tính năng
└── README.md
```

## Cài đặt và Chạy Project

### Yêu cầu hệ thống

- Node.js >= 24.x.x
- pnpm >= 10.26.1

### Cài đặt dependencies

```bash
pnpm install
```

### Chạy development

```bash
# Chạy tất cả apps
pnpm dev

# Chạy riêng Frontend
pnpm dev --filter=web

# Chạy riêng Backend
pnpm dev --filter=api
```

### Build

```bash
# Build tất cả apps
pnpm build

# Build riêng Frontend
pnpm build --filter=web

# Build riêng Backend
pnpm build --filter=api
```

## Các Tính Năng Chính

### 1. Trang chủ (Home)

- Hiển thị danh sách sản phẩm dưới dạng thumbnail
- Search bar tìm kiếm giày theo tên
- Click vào sản phẩm để xem chi tiết
- Bộ lọc sản phẩm (tùy chọn)
- Lazy loading và Image optimization (tùy chọn)

### 2. Trang chi tiết sản phẩm

- Hiển thị đầy đủ thông tin sản phẩm
- Thêm sản phẩm vào giỏ hàng
- Tăng/giảm số lượng muốn mua
- Chọn size (bắt buộc cho tất cả sản phẩm)

### 3. Trang giỏ hàng

- Hiển thị danh sách sản phẩm đã thêm
- Thay đổi số lượng sản phẩm
- Xóa sản phẩm khỏi giỏ hàng
- Lưu giỏ hàng
- Hoàn tất mua hàng

### 4. Trang ĐÃ MUA

- Hiển thị lịch sử mua hàng
- Tính tổng số tiền đã chi tiêu (tùy chọn)

### 5. Trang thêm sản phẩm (Admin)

- Chỉ admin mới được truy cập
- Form thêm sản phẩm mới
- Xử lý phân quyền ở Frontend và Backend

### 6. Đăng ký - Đăng nhập

- Đăng ký tài khoản user (email + password)
- Đăng nhập cho cả user và admin
- Tài khoản admin được tạo sẵn trong database
- JWT authentication

## Yêu cầu Kỹ thuật

### Frontend

- ✅ ReactJS/NextJS
- ✅ Fetch API bằng Axios + Tanstack query
- ✅ Form action bằng react-hook-form
- ✅ Xử lý loading, error, empty state
- ✅ Code rõ ràng, tránh anti-pattern

### Backend

- ✅ 3-layer architecture
- ✅ Sử dụng async/await
- ✅ JWT authentication
- ✅ Mã hóa password
- ✅ Middleware cho xác thực và phân quyền
- ✅ Xử lý lỗi 404 và các lỗi hệ thống cơ bản

### CRUD Operations

Website phải có đầy đủ các chức năng CRUD:

- **Create**: Tạo mới sản phẩm, giỏ hàng, đơn mua
- **Read**: Hiển thị danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng
- **Update**: Cập nhật số lượng, thông tin sản phẩm
- **Delete**: Xóa sản phẩm khỏi giỏ hàng

## UI/UX (Điểm cộng)

- Giao diện dễ nhìn, bố cục rõ ràng
- Màu sắc hài hòa, font chữ dễ đọc
- UI nhất quán giữa các trang
- Trải nghiệm sử dụng mượt mà

**Lưu ý**: Không được sao chép y nguyên thiết kế từ các website khác. Có thể tham khảo bố cục nhưng phải tự thiết kế lại.

## Lưu ý khi Test Hệ thống

1. **Tài khoản Admin**: Được tạo sẵn trong database khi khởi tạo
2. **Tài khoản User**: Cần đăng ký mới qua form đăng ký
3. **Giỏ hàng**: Dữ liệu được lưu vào database, mỗi user có 1 giỏ hàng duy nhất
4. **Phân quyền**:
   - User không thể truy cập trang thêm sản phẩm
   - Backend sẽ trả về `statusCode: 401, message: UNAUTHORIZED` nếu user không phải admin
5. **Thanh toán**: Không có thanh toán thật, chỉ mock luồng hoàn tất mua hàng

## Phân chia Công việc

Xem chi tiết plan cho từng module/tính năng trong folder `plans/`:

- `01-home-page.md` - Trang chủ
- `02-product-detail.md` - Trang chi tiết sản phẩm
- `03-cart.md` - Trang giỏ hàng
- `04-purchase-history.md` - Trang ĐÃ MUA
- `05-admin-add-product.md` - Trang thêm sản phẩm (Admin)
- `06-auth.md` - Đăng ký và Đăng nhập
- `07-backend-api.md` - Backend API (3-layer)
- `08-database-schema.md` - Database Schema
- `09-ui-ux-design.md` - UI/UX Design System

## Thời gian nộp bài

- **Deadline**: 23:59 ngày 15/01/2025
- Các commit sau thời điểm này không được tính

## Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [NestJs Documentation](https://docs.nestjs.com/)
- [Turborepo Documentation](https://turborepo.org/docs)
