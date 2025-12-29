# Plan: Trang chủ (Home Page)

## Mô tả

Trang chủ là nơi người dùng tiếp cận website lần đầu, cần hiển thị rõ ràng danh sách sản phẩm và hỗ trợ tìm kiếm.

## Yêu cầu bắt buộc

### 1. Hiển thị danh sách sản phẩm

- [ ] Hiển thị sản phẩm dưới dạng thumbnail (grid layout)
- [ ] Mỗi sản phẩm hiển thị:
  - [ ] Hình ảnh sản phẩm
  - [ ] Tên sản phẩm (name)
  - [ ] Giá sản phẩm:
    - [ ] Giá hiện tại (priceCurrent)
    - [ ] Giá gốc (priceOriginal) - nếu có discount
    - [ ] Badge discount (nếu có priceDiscount)
  - [ ] Badge (Limited Edition, Official Merch, etc.) - nếu có
  - [ ] Rating (ratingValue, ratingCount) - optional
- [ ] Click vào sản phẩm để chuyển sang trang chi tiết (sử dụng slug)

### 2. Search Bar

- [ ] Input field để tìm kiếm giày theo tên
- [ ] Real-time search hoặc search khi submit
- [ ] Hiển thị kết quả tìm kiếm
- [ ] Xử lý trường hợp không tìm thấy sản phẩm

## Yêu cầu không bắt buộc (Điểm cộng)

### 3. Bộ lọc sản phẩm

- [ ] Lọc theo giá (min - max)
- [ ] Lọc theo hãng/brand
- [ ] Lọc theo size
- [ ] Lọc theo màu sắc
- [ ] Kết hợp nhiều bộ lọc cùng lúc

### 4. Tối ưu hóa

- [ ] Lazy loading cho hình ảnh
- [ ] Image optimization (Next.js Image component)
- [ ] Pagination hoặc infinite scroll
- [ ] Loading state khi fetch data
- [ ] Error state khi fetch fail
- [ ] Empty state khi không có sản phẩm

## Technical Implementation

### Frontend (Next.js)

```typescript
// Route: / hoặc /home
// Component: HomePage
// Features:
- Fetch products từ API (chỉ isPublished = true)
- Search functionality (search by name)
- Filter functionality (optional)
- Product grid layout
- Navigation to product detail bằng slug
```

### API Endpoints cần thiết

- `GET /api/products` - Lấy danh sách sản phẩm (chỉ isPublished = true)
  - Query params: search, filter, page, limit
- `GET /api/products?search=keyword` - Tìm kiếm sản phẩm theo name
- `GET /api/products?filter=...` - Lọc sản phẩm (optional)
  - Filter by: price, brand, category, etc.

### State Management

- Products list state
- Search query state
- Filter state (optional)
- Loading state
- Error state

## UI/UX Considerations

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Loading skeleton khi đang fetch data
- [ ] Smooth transitions
- [ ] Clear visual hierarchy
- [ ] Accessible (keyboard navigation, screen readers)

## Checklist hoàn thành

- [ ] API endpoint hoạt động
- [ ] Hiển thị danh sách sản phẩm
- [ ] Search bar hoạt động
- [ ] Navigation đến trang chi tiết
- [ ] Loading/Error/Empty states
- [ ] Responsive design
- [ ] Code review và cleanup

## Notes

- Không được sao chép y nguyên thiết kế từ website khác
- Có thể tham khảo bố cục nhưng phải tự thiết kế lại
- Ưu tiên tính ổn định và luồng sử dụng rõ ràng
- Chỉ hiển thị products có isPublished = true
- Sử dụng slug để navigate đến product detail (SEO-friendly)
- Hiển thị priceCurrent, priceOriginal (nếu có discount), và badge
