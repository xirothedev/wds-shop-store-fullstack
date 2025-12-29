# Plan: Trang chi tiết sản phẩm (Product Detail Page)

## Mô tả

Trang này hiển thị đầy đủ thông tin của một sản phẩm cụ thể mà người dùng đã chọn.

## Yêu cầu bắt buộc

### 1. Hiển thị thông tin sản phẩm

- [ ] Tên sản phẩm (name)
- [ ] Giá sản phẩm:
  - [ ] Giá hiện tại (priceCurrent)
  - [ ] Giá gốc (priceOriginal) - nếu có discount
  - [ ] Số tiền giảm (priceDiscount) - nếu có discount
- [ ] Mô tả sản phẩm (description)
- [ ] Hình ảnh sản phẩm (có thể nhiều ảnh)
- [ ] Badge (Limited Edition, Official Merch, etc.) - nếu có
- [ ] Rating (ratingValue, ratingCount) - nếu có
- [ ] Stock theo size (từ ProductSizeStock)

### 2. Chức năng thêm vào giỏ hàng

- [ ] Button "Thêm vào giỏ hàng"
- [ ] Tăng/giảm số lượng muốn mua
- [ ] Validation số lượng (min: 1, max: stock available)
- [ ] **Size selection (bắt buộc)**:
  - [ ] Hiển thị danh sách sizes từ ProductSizeStock
  - [ ] Hiển thị stock cho từng size
  - [ ] Disable size nếu hết hàng
  - [ ] Validation: phải chọn size trước khi thêm vào giỏ
- [ ] Thông báo khi thêm thành công
- [ ] Cập nhật giỏ hàng (gửi lên backend API)

## Yêu cầu không bắt buộc (Điểm cộng)

### 3. Phân loại sản phẩm

- [ ] **Size selection (bắt buộc)**:
  - [ ] Hiển thị size selector với stock từ ProductSizeStock
  - [ ] Tất cả sản phẩm đều phải có size
- [ ] Hiển thị stock theo size đã chọn
- [ ] Validation: phải chọn size trước khi thêm vào giỏ

### 4. Tối ưu hóa

- [ ] Image gallery với thumbnail
- [ ] Zoom image khi hover/click
- [ ] Related products (sản phẩm liên quan)
- [ ] Breadcrumb navigation
- [ ] Share button (optional)

## Technical Implementation

### Frontend (Next.js)

```typescript
// Route: /products/[slug] (sử dụng slug thay vì id)
// Component: ProductDetailPage
// Features:
- Fetch product detail từ API bằng slug
- Fetch ProductSizeStock (tất cả sản phẩm đều có sizes)
- Display product information
- Add to cart functionality
- Quantity selector
- Size selector (bắt buộc)
```

### API Endpoints cần thiết

- `GET /api/products/:slug` - Lấy chi tiết sản phẩm bằng slug
  - Response: Product với ProductSizeStock[] (tất cả sản phẩm đều có sizes)
- `POST /api/cart/items` - Thêm sản phẩm vào giỏ hàng
  - Body: { productId, size, quantity }
  - Validation: size là bắt buộc

### State Management

- Product detail state (với ProductSizeStock[])
- Selected quantity state
- Selected size state (required)
- Loading state
- Error state
- Cart state (context hoặc API state)

## UI/UX Considerations

- [ ] Responsive design
- [ ] Large, clear product images
- [ ] Easy-to-use quantity selector
- [ ] Clear call-to-action button
- [ ] Loading state khi fetch data
- [ ] Error handling (404 nếu sản phẩm không tồn tại)
- [ ] Smooth animations

## Data Flow

1. User click vào sản phẩm từ trang chủ
2. Navigate đến `/products/[slug]` (sử dụng slug)
3. Fetch product detail từ API bằng slug (với ProductSizeStock[])
4. Display product information (name, priceCurrent, priceOriginal, description, badge, rating, etc.)
5. Display sizes và stock từ ProductSizeStock
6. User chọn size (bắt buộc)
7. User chọn số lượng (validation với stock available cho size đã chọn)
8. User click "Thêm vào giỏ hàng"
9. Send POST request: { productId, size, quantity }
10. Backend check unique constraint [cartId, productId, size]
11. Update cart (backend)
12. Show success message

## Checklist hoàn thành

- [ ] API endpoint hoạt động
- [ ] Hiển thị đầy đủ thông tin sản phẩm
- [ ] Quantity selector hoạt động
- [ ] Add to cart functionality
- [ ] Validation số lượng
- [ ] Loading/Error states
- [ ] Responsive design
- [ ] Code review và cleanup

## Notes

- Sử dụng slug thay vì id trong URL (SEO-friendly)
- Cần xử lý trường hợp sản phẩm không tồn tại (404)
- Cần xử lý trường hợp hết hàng (disable size nếu stock = 0)
- Tất cả sản phẩm đều phải có size (ProductSizeStock)
- Phải chọn size trước khi thêm vào giỏ (bắt buộc)
- Hiển thị stock cho từng size từ ProductSizeStock
- Disable size nếu hết hàng (stock = 0)
- Giỏ hàng được lưu vào database (backend)
- CartItem có unique constraint [cartId, productId, size] - không thể thêm cùng product + size 2 lần
