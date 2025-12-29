# Plans - Chi tiết Plan cho từng Module/Tính năng

Folder này chứa các plan chi tiết cho từng module/tính năng của dự án WDS Shop Store.

## Danh sách Plans

### Frontend Pages

1. **[01-home-page.md](./01-home-page.md)** - Trang chủ
   - Hiển thị danh sách sản phẩm
   - Search bar
   - Bộ lọc sản phẩm (optional)
   - Lazy loading và Image optimization (optional)

2. **[02-product-detail.md](./02-product-detail.md)** - Trang chi tiết sản phẩm
   - Hiển thị thông tin chi tiết sản phẩm
   - Thêm vào giỏ hàng
   - Tăng/giảm số lượng
   - Phân loại theo size/màu (optional)

3. **[03-cart.md](./03-cart.md)** - Trang giỏ hàng
   - Hiển thị danh sách sản phẩm trong giỏ
   - Thay đổi số lượng
   - Xóa sản phẩm
   - Persist giỏ hàng (localStorage)
   - Hoàn tất mua hàng (mock)

4. **[04-purchase-history.md](./04-purchase-history.md)** - Trang ĐÃ MUA
   - Hiển thị lịch sử mua hàng
   - Tính tổng số tiền đã chi tiêu (optional)

5. **[05-admin-add-product.md](./05-admin-add-product.md)** - Trang thêm sản phẩm (Admin)
   - Phân quyền truy cập (admin only)
   - Form thêm sản phẩm
   - Image upload
   - Validation

6. **[06-auth.md](./06-auth.md)** - Đăng ký và Đăng nhập
   - Form đăng ký (user only)
   - Form đăng nhập (user + admin)
   - JWT authentication
   - Password encryption
   - Phân quyền sử dụng

### Backend & Infrastructure

7. **[07-backend-api.md](./07-backend-api.md)** - Backend API (3-layer)
   - 3-layer architecture
   - Async/await
   - JWT authentication
   - Password encryption
   - Middleware
   - Error handling

8. **[08-database-schema.md](./08-database-schema.md)** - Database Schema
   - Users table
   - Products table
   - Orders table
   - OrderItems table
   - Cart tables (optional)
   - Relationships và indexes

### Design & UX

9. **[09-ui-ux-design.md](./09-ui-ux-design.md)** - UI/UX Design System
   - Color palette
   - Typography
   - Component library
   - Responsive design
   - Accessibility
   - Animations

## Cách sử dụng

Mỗi file plan chứa:

- **Mô tả**: Tổng quan về module/tính năng
- **Yêu cầu bắt buộc**: Checklist các tính năng cần implement
- **Yêu cầu không bắt buộc**: Tính năng optional (điểm cộng)
- **Technical Implementation**: Hướng dẫn kỹ thuật
- **UI/UX Considerations**: Lưu ý về giao diện
- **Data Flow**: Luồng xử lý dữ liệu
- **Checklist hoàn thành**: Checklist để track progress

## Thứ tự ưu tiên triển khai

### Phase 1: Foundation

1. Database Schema (08)
2. Backend API - Basic setup (07)
3. Authentication (06)

### Phase 2: Core Features

4. Home Page (01)
5. Product Detail Page (02)
6. Cart Page (03)

### Phase 3: Additional Features

7. Purchase History (04)
8. Admin Add Product (05)

### Phase 4: Polish

9. UI/UX Design System (09) - Có thể làm song song với các phase khác

## Notes

- Mỗi plan có thể được cập nhật trong quá trình phát triển
- Các tính năng optional (điểm cộng) nên được implement sau khi hoàn thành các tính năng bắt buộc
- Ưu tiên tính ổn định và luồng sử dụng rõ ràng
