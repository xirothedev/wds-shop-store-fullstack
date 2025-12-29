# Plan: Trang giỏ hàng (Cart Page)

## Mô tả

Trang giỏ hàng cho phép người dùng kiểm tra lại các sản phẩm đã chọn trước khi hoàn tất mua hàng.

## Yêu cầu bắt buộc

### 1. Hiển thị danh sách sản phẩm trong giỏ hàng

- [ ] Danh sách các sản phẩm đã thêm vào giỏ
- [ ] Mỗi sản phẩm hiển thị:
  - [ ] Tên sản phẩm
  - [ ] Giá sản phẩm (priceCurrent)
  - [ ] Size (bắt buộc - từ CartItem.size)
  - [ ] Số lượng
  - [ ] Tổng tiền tương ứng (giá × số lượng)
  - [ ] Hình ảnh sản phẩm (optional nhưng nên có)

### 2. Chức năng quản lý giỏ hàng

- [ ] Thay đổi số lượng sản phẩm (tăng/giảm)
- [ ] Xóa sản phẩm khỏi giỏ hàng
- [ ] Validation số lượng (min: 1, max: stock available)
- [ ] Validation size (phải chọn size trước khi thêm vào giỏ)
- [ ] Tính tổng tiền toàn bộ giỏ hàng (sum of all items)
- [ ] Hiển thị tổng tiền rõ ràng
- [ ] Xử lý unique constraint: [cartId, productId, size] - không thể thêm cùng product + size 2 lần

### 3. Persist giỏ hàng

- [ ] Lưu giỏ hàng
- [ ] Sync giỏ hàng giữa các tab (optional)

### 4. Hoàn tất mua hàng (Mock)

- [ ] Button "Hoàn tất mua hàng" hoặc "Thanh toán"
- [ ] Không yêu cầu thanh toán thật
- [ ] Hiển thị thông báo "Mua hàng thành công" hoặc modal xác nhận
- [ ] Sau khi hoàn tất:
  - [ ] Làm trống giỏ hàng
  - [ ] Lưu sản phẩm vào danh sách "ĐÃ MUA"
  - [ ] Navigate đến trang "ĐÃ MUA" hoặc hiển thị thông báo

## Yêu cầu không bắt buộc (Điểm cộng)

### 5. Tối ưu hóa

- [ ] Mã giảm giá (coupon code)
- [ ] Shipping calculator
- [ ] Estimated delivery date
- [ ] Save for later (lưu sản phẩm để mua sau)
- [ ] Related products suggestions

## Technical Implementation

### Frontend (Next.js)

```typescript
// Route: /cart
// Component: CartPage
// Features:
- Read cart from localStorage/state
- Display cart items
- Update quantity
- Remove items
- Calculate total
- Checkout (mock)
```

### API Endpoints

- `GET /api/cart` - Lấy giỏ hàng của user (với items và products)
- `POST /api/cart/items` - Thêm sản phẩm vào giỏ (body: { productId, size, quantity })
- `PUT /api/cart/items/:itemId` - Cập nhật số lượng (body: { quantity })
- `DELETE /api/cart/items/:itemId` - Xóa sản phẩm khỏi giỏ
- `POST /api/orders` - Tạo đơn hàng (checkout)

### State Management

- Cart items state (có thể dùng Context hoặc localStorage)
- Total price state (computed từ cart items)
- Loading state (khi checkout)
- Error state

### Data Structure

```typescript
// Based on Prisma schema
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product; // Populated from relation
  size: string; // Required - VarChar(10)
  quantity: number; // Default: 1
}

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCurrent: number; // Decimal (Money)
  priceOriginal?: number; // Decimal (Money)
  priceDiscount?: number; // Decimal (Money)
  stock: number;
  badge?: string; // Limited Edition, Official Merch, etc.
  ratingValue: number; // 0-5
  ratingCount: number;
  isPublished: boolean;
}

// Frontend display structure
interface CartItemDisplay {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  price: number; // priceCurrent
  quantity: number;
  size: string; // Required
  total: number; // price * quantity
  product?: Product; // Full product details
}
```

## UI/UX Considerations

- [ ] Responsive design
- [ ] Clear layout với table hoặc card layout
- [ ] Easy-to-use quantity controls
- [ ] Clear delete/remove button
- [ ] Prominent total price display
- [ ] Clear checkout button
- [ ] Empty state khi giỏ hàng trống
- [ ] Loading state khi đang checkout
- [ ] Success/Error messages

## Data Flow

1. User vào trang giỏ hàng
2. Load cart từ localStorage/state
3. Display cart items
4. User thay đổi số lượng → Update cart → Save to localStorage
5. User xóa sản phẩm → Remove from cart → Save to localStorage
6. User click "Hoàn tất mua hàng"
7. Show confirmation modal
8. Create order (mock)
9. Clear cart
10. Save to purchase history
11. Show success message
12. Navigate to purchase history page

## Checklist hoàn thành

- [ ] Hiển thị danh sách sản phẩm trong giỏ
- [ ] Update số lượng hoạt động
- [ ] Xóa sản phẩm hoạt động
- [ ] Tính tổng tiền chính xác
- [ ] Persist giỏ hàng vào localStorage
- [ ] Checkout functionality (mock)
- [ ] Lưu vào purchase history
- [ ] Empty state
- [ ] Loading/Error states
- [ ] Responsive design
- [ ] Code review và cleanup

## Notes

- Giỏ hàng được lưu vào database (Cart và CartItem tables)
- Mỗi user có 1 Cart duy nhất (1:1 relationship)
- CartItem có unique constraint trên [cartId, productId, size] - không thể thêm cùng product + size 2 lần
- Size là bắt buộc trong CartItem (VarChar(10))
- Khi thêm sản phẩm vào giỏ, cần check:
  - Tất cả sản phẩm đều phải chọn size (bắt buộc)
- Checkout tạo Order và OrderItems, sau đó clear Cart
- Sau checkout, cần clear cart và lưu vào purchase history
