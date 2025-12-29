# Plan: Trang ĐÃ MUA (Purchase History Page)

## Mô tả

Trang này cho phép người dùng xem lại lịch sử mua hàng của mình.

## Yêu cầu bắt buộc

### 1. Hiển thị lịch sử mua hàng

- [ ] Danh sách các đơn hàng đã mua
- [ ] Mỗi đơn hàng hiển thị:
  - [ ] Mã đơn hàng (code - e.g., #ORD-1234)
  - [ ] Trạng thái đơn hàng (status)
  - [ ] Trạng thái thanh toán (paymentStatus)
  - [ ] Danh sách sản phẩm trong đơn (OrderItems)
  - [ ] Mỗi sản phẩm hiển thị:
    - [ ] Tên sản phẩm (productName - snapshot)
    - [ ] Size (size - snapshot)
    - [ ] Giá sản phẩm (price - snapshot tại thời điểm mua)
    - [ ] Số lượng đã mua (quantity)
  - [ ] Tổng tiền đơn hàng (totalAmount)
  - [ ] Phí vận chuyển (shippingFee)
  - [ ] Giảm giá (discountValue)
  - [ ] Ngày mua (createdAt)

### 2. Tổ chức dữ liệu

- [ ] Group theo đơn hàng (nếu có nhiều đơn)
- [ ] Hoặc hiển thị flat list tất cả sản phẩm đã mua
- [ ] Sort theo thời gian (mới nhất trước)

## Yêu cầu không bắt buộc (Điểm cộng)

### 3. Tính tổng số tiền đã chi tiêu

- [ ] Hiển thị tổng số tiền người dùng đã chi tiêu trên website
- [ ] Có thể tính theo thời gian (tháng, năm)

### 4. Tối ưu hóa

- [ ] Filter theo thời gian
- [ ] Search trong lịch sử mua hàng
- [ ] Export lịch sử (PDF, CSV)
- [ ] Re-order functionality (mua lại sản phẩm)
- [ ] Rating/Review sản phẩm đã mua

## Technical Implementation

### Frontend (Next.js)

```typescript
// Route: /purchases hoặc /orders hoặc /history
// Component: PurchaseHistoryPage
// Features:
- Fetch purchase history từ API hoặc localStorage
- Display orders/products
- Calculate total spent
- Filter/Sort (optional)
```

### API Endpoints (nếu dùng backend)

- `GET /api/orders` - Lấy danh sách đơn hàng của user
- `GET /api/orders/:orderId` - Lấy chi tiết đơn hàng
- `GET /api/users/me/total-spent` - Tính tổng tiền đã chi (optional)

### State Management

- Purchase history state
- Total spent state (computed)
- Loading state
- Error state

### Data Structure

```typescript
// Based on Prisma schema
interface Order {
  id: string;
  code: string; // Unique order code (e.g., #ORD-1234)
  userId: string;
  status: OrderStatus; // PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED
  paymentStatus: PaymentStatus; // PENDING | PAID | FAILED | REFUNDED
  totalAmount: number; // Decimal (Money)
  shippingFee: number; // Decimal (Money), default: 0
  discountValue: number; // Decimal (Money), default: 0
  // Shipping address snapshot
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: string;
  items: OrderItem[];
  paymentTransaction?: PaymentTransaction;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  orderId: string;
  productId?: string; // Nullable if product is deleted
  product?: Product; // Populated from relation (if productId exists)
  // Snapshot data (stored to prevent changes)
  productSlug: string; // VarChar(255)
  productName: string; // VarChar(255)
  size: string; // VarChar(10) - Required
  price: number; // Decimal (Money) - Price at time of purchase
  quantity: number;
}

interface PaymentTransaction {
  id: string;
  orderId: string;
  transactionCode: string; // Unique PayOS transaction code
  amount: number; // Decimal (Money)
  status: PaymentTransactionStatus; // PENDING | PAID | CANCELLED | EXPIRED | FAILED
  paymentUrl?: string;
  payosData?: any; // Json
  createdAt: Date;
  updatedAt: Date;
}

enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}
```

## UI/UX Considerations

- [ ] Responsive design
- [ ] Clear layout (timeline hoặc card layout)
- [ ] Easy-to-read order information
- [ ] Empty state khi chưa có đơn hàng nào
- [ ] Loading state khi fetch data
- [ ] Error state
- [ ] Visual distinction giữa các đơn hàng

## Data Flow

1. User vào trang "ĐÃ MUA"
2. Fetch purchase history từ API hoặc localStorage
3. Display orders/products
4. Calculate total spent (optional)
5. User có thể filter/sort (optional)

## Storage

### Backend Database

- Orders và OrderItems được lưu vào database khi checkout
- OrderItem lưu snapshot data (productName, productSlug, price) để tránh thay đổi khi product bị update/xóa
- productId có thể null nếu product bị xóa sau khi đặt hàng
- Có thể query và filter tốt hơn
- Persist across devices

## Checklist hoàn thành

- [ ] API endpoint hoạt động (nếu dùng backend)
- [ ] Hiển thị danh sách đơn hàng/sản phẩm đã mua
- [ ] Hiển thị thông tin đầy đủ (tên, giá, số lượng)
- [ ] Tính tổng tiền đã chi tiêu (optional)
- [ ] Sort theo thời gian
- [ ] Empty state
- [ ] Loading/Error states
- [ ] Responsive design
- [ ] Code review và cleanup

## Notes

- Purchase history được tạo khi user checkout thành công
- Order có code unique (e.g., #ORD-1234) để dễ reference
- OrderItem lưu snapshot data để đảm bảo thông tin không thay đổi:
  - productName, productSlug, price được lưu tại thời điểm mua
  - productId có thể null nếu product bị xóa
- Order có status và paymentStatus để track trạng thái
- Có thể tính tổng tiền đã chi tiêu từ totalAmount của các orders có paymentStatus = PAID
