# Plan: Trang thêm sản phẩm (Admin - Add Product Page)

## Mô tả

Trang này phục vụ cho việc quản lý dữ liệu sản phẩm ở mức cơ bản, cho phép admin đăng sản phẩm mới lên website.

## Yêu cầu bắt buộc

### 1. Phân quyền truy cập

- [ ] **Chỉ tài khoản có role admin** mới được phép truy cập
- [ ] Sử dụng React Router để xử lý phân quyền ở Frontend
- [ ] Khi user (không phải admin) truy cập:
  - [ ] Hiển thị thông báo không có quyền truy cập
  - [ ] Redirect về trang chủ hoặc trang login
- [ ] Backend bắt buộc trả về:
  - [ ] `statusCode: 401`
  - [ ] `message: UNAUTHORIZED` nếu user không phải admin

### 2. Form thêm sản phẩm

- [ ] Input fields:
  - [ ] Slug (required, unique, VarChar(255)) - URL-friendly identifier
  - [ ] Tên sản phẩm (required, VarChar(255))
  - [ ] Mô tả sản phẩm (required, Text)
  - [ ] Giá hiện tại (priceCurrent, required, Decimal/Money)
  - [ ] Giá gốc (priceOriginal, optional, Decimal/Money) - nếu có discount
  - [ ] Số tiền giảm (priceDiscount, optional, Decimal/Money) - nếu có discount
  - [ ] Badge (badge, optional, VarChar(50)) - Limited Edition, Official Merch, etc.
  - [ ] Is Published (isPublished, Boolean, default: true)
  - [ ] Hình ảnh sản phẩm (optional, file upload hoặc URL)
- [ ] **Form để thêm ProductSizeStock (bắt buộc)**:
  - [ ] Tất cả sản phẩm đều phải có sizes
  - [ ] Input: size (VarChar(10)), stock (Int)
  - [ ] Có thể thêm nhiều sizes (S, M, L, XL, etc.)
  - [ ] Phải có ít nhất 1 ProductSizeStock
- [ ] Validation form:
  - [ ] Required fields
  - [ ] Slug phải unique
  - [ ] Price phải là số dương
  - [ ] Image format validation
  - [ ] Phải có ít nhất 1 ProductSizeStock
- [ ] Submit button
- [ ] Success message sau khi thêm thành công
- [ ] Error handling

## Yêu cầu không bắt buộc (Điểm cộng)

### 3. Tối ưu hóa

- [ ] Multiple images upload
- [ ] Image preview trước khi upload
- [ ] Rich text editor cho mô tả
- [ ] Size/Color variants
- [ ] Bulk upload (thêm nhiều sản phẩm cùng lúc)
- [ ] Edit/Delete sản phẩm đã tạo

## Technical Implementation

### Frontend (Next.js)

```typescript
// Route: /admin/products/add hoặc /admin/add-product
// Component: AdminAddProductPage
// Features:
- Protected route (admin only)
- Form với validation
- Image upload
- Submit to API
```

### Protected Route Implementation

```typescript
// Option 1: Route Guard Component
<ProtectedRoute role="admin">
  <AdminAddProductPage />
</ProtectedRoute>

// Option 2: Middleware/Server Component (Next.js 13+)
// Check role in server component hoặc middleware
```

### API Endpoints

- `POST /api/products` - Tạo sản phẩm mới
  - Headers: `Authorization: Bearer <admin_token>`
  - Body: {
    slug, name, description, priceCurrent, priceOriginal?, priceDiscount?,
    badge?, isPublished,
    sizeStocks: [{ size, stock }] // Bắt buộc - tất cả sản phẩm đều phải có sizes
    }
  - Response: 401 nếu không phải admin
  - Response: Created product với ProductSizeStock[]

### Authentication Check

- Frontend: Check role từ JWT token hoặc user context
- Backend: Middleware check role từ JWT token

## UI/UX Considerations

- [ ] Clear form layout
- [ ] Validation messages rõ ràng
- [ ] Loading state khi đang submit
- [ ] Success/Error messages
- [ ] Image preview
- [ ] Responsive design
- [ ] Accessible form (labels, error messages)

## Data Flow

1. User (admin) vào trang thêm sản phẩm
2. Check authentication và role
3. If not admin → Show error message → Redirect
4. If admin → Show form
5. User điền form (slug, name, description, priceCurrent, etc.)
6. User thêm ProductSizeStock cho từng size (bắt buộc)
7. User upload image (nếu có)
8. User click submit
9. Validate form (slug unique, required fields, phải có ít nhất 1 ProductSizeStock, etc.)
10. If valid → Send POST request to API
11. Backend check role → If not admin → Return 401
12. If admin → Create product → Create ProductSizeStock[] (bắt buộc) → Return success
13. Frontend show success message
14. Clear form hoặc redirect

## Backend Authorization Middleware

```typescript
// Example middleware
const adminOnly = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const user = verifyToken(token);

  if (user.role !== "admin") {
    return res.status(401).json({
      statusCode: 401,
      message: "UNAUTHORIZED",
    });
  }

  next();
};
```

## Checklist hoàn thành

- [ ] Protected route hoạt động (Frontend)
- [ ] Backend middleware check role
- [ ] Form với đầy đủ fields
- [ ] Form validation
- [ ] Image upload (nếu có)
- [ ] Submit to API
- [ ] Success/Error handling
- [ ] Unauthorized message khi user không phải admin
- [ ] Backend trả về 401 với message "UNAUTHORIZED"
- [ ] Responsive design
- [ ] Code review và cleanup

## Notes

- Phân quyền phải được check ở cả Frontend và Backend
- Backend check là bắt buộc, không thể chỉ dựa vào Frontend
- Admin account được tạo sẵn trong database với role = ADMIN
- Slug phải unique và URL-friendly
- Tất cả sản phẩm đều phải có sizes (ProductSizeStock)
- Phải tạo ProductSizeStock cho từng size khi thêm sản phẩm
- Stock được quản lý hoàn toàn qua ProductSizeStock, không dùng Product.stock
- Phải có ít nhất 1 ProductSizeStock khi tạo sản phẩm
- Có thể mở rộng thêm chức năng edit/delete sản phẩm
