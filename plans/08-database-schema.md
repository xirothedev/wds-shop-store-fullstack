# Plan: Database Schema

## Mô tả

Thiết kế database schema cho hệ thống bán giày online dựa trên Prisma schema thực tế, bao gồm các bảng cần thiết cho users, sessions, products, cart, orders, và payment transactions.

## Schema Overview

Database sử dụng **PostgreSQL** với Prisma ORM. Tất cả các models được định nghĩa trong `apps/api/prisma/schema.prisma`.

## Yêu cầu bắt buộc

### 1. Users Table

- [ ] Lưu thông tin người dùng
- [ ] Fields:
  - [ ] `id` (String, UUID, Primary Key)
  - [ ] `email` (String, Unique, VarChar(255), required)
  - [ ] `password` (String?, Text, nullable - cho OAuth users)
  - [ ] `fullName` (String?, VarChar(100), optional)
  - [ ] `phone` (String?, VarChar(15), optional)
  - [ ] `avatar` (String?, Text, optional)
  - [ ] `role` (UserRole enum: CUSTOMER | ADMIN, default: CUSTOMER)
  - [ ] `emailVerified` (Boolean, default: false)
  - [ ] `phoneVerified` (Boolean, default: false)
  - [ ] `createdAt` (DateTime, default: now())
  - [ ] `updatedAt` (DateTime, auto-updated)
- [ ] Relations:
  - [ ] `orders` (Order[]) - One-to-many
  - [ ] `cart` (Cart?) - One-to-one (optional)
  - [ ] `sessions` (Session[]) - One-to-many

### 2. Sessions Table

- [ ] Lưu thông tin session/authentication tokens
- [ ] Fields:
  - [ ] `id` (String, CUID, Primary Key)
  - [ ] `token` (String, Unique, Text - JWT token)
  - [ ] `refreshToken` (String?, Unique, Text, optional)
  - [ ] `userId` (String, Foreign Key -> Users.id)
  - [ ] `ipAddress` (String?, VarChar(45), optional)
  - [ ] `userAgent` (String?, Text, optional)
  - [ ] `status` (SessionStatus enum: ACTIVE | INACTIVE | REVOKED, default: ACTIVE)
  - [ ] `expiresAt` (DateTime, required)
  - [ ] `revokedAt` (DateTime?, optional)
  - [ ] `createdAt` (DateTime, default: now())
  - [ ] `updatedAt` (DateTime, auto-updated)
- [ ] Indexes:
  - [ ] `userId` - Index for query by user
  - [ ] `token` - Index for token lookup
  - [ ] `status` - Index for filtering by status
  - [ ] `expiresAt` - Index for expiration checks

### 3. Products Table

- [ ] Lưu thông tin sản phẩm
- [ ] Fields:
  - [ ] `id` (String, UUID, Primary Key)
  - [ ] `slug` (String, Unique, VarChar(255), required)
  - [ ] `name` (String, VarChar(255), required)
  - [ ] `description` (String, Text, required)
  - [ ] `priceCurrent` (Decimal, Money, required)
  - [ ] `priceOriginal` (Decimal?, Money, optional - nếu có discount)
  - [ ] `priceDiscount` (Decimal?, Money, optional - số tiền giảm)
  - [ ] `badge` (String?, VarChar(50), optional - Limited Edition, Official Merch)
  - [ ] `ratingValue` (Decimal, default: 0, Decimal(3,2) - 0-5)
  - [ ] `ratingCount` (Int, default: 0)
  - [ ] `isPublished` (Boolean, default: true)
  - [ ] `createdAt` (DateTime, default: now())
  - [ ] `updatedAt` (DateTime, auto-updated)
- [ ] Relations:
  - [ ] `sizeStocks` (ProductSizeStock[]) - One-to-many
  - [ ] `cartItems` (CartItem[]) - One-to-many
  - [ ] `orderItems` (OrderItem[]) - One-to-many
- [ ] Indexes:
  - [ ] `slug` - Index for slug lookup

### 4. ProductSizeStock Table

- [ ] Quản lý stock theo size (bắt buộc cho tất cả sản phẩm)
- [ ] Fields:
  - [ ] `id` (String, UUID, Primary Key)
  - [ ] `size` (String, VarChar(10) - S, M, L, XL, etc.)
  - [ ] `stock` (Int, default: 0)
  - [ ] `productId` (String, Foreign Key -> Products.id)
- [ ] Constraints:
  - [ ] Unique constraint: [productId, size] - mỗi size của product chỉ có 1 record
- [ ] Indexes:
  - [ ] `productId` - Index for query by product

### 5. Cart Table

- [ ] Lưu giỏ hàng của user
- [ ] Fields:
  - [ ] `id` (String, CUID, Primary Key)
  - [ ] `userId` (String, Unique, Foreign Key -> Users.id)
  - [ ] `updatedAt` (DateTime, auto-updated)
- [ ] Relations:
  - [ ] `user` (User) - Many-to-one
  - [ ] `items` (CartItem[]) - One-to-many
- [ ] Notes:
  - [ ] Mỗi user chỉ có 1 Cart (1:1 relationship)

### 6. CartItems Table

- [ ] Lưu sản phẩm trong giỏ hàng
- [ ] Fields:
  - [ ] `id` (String, CUID, Primary Key)
  - [ ] `cartId` (String, Foreign Key -> Cart.id)
  - [ ] `productId` (String, Foreign Key -> Products.id)
  - [ ] `size` (String, VarChar(10), required)
  - [ ] `quantity` (Int, default: 1)
- [ ] Constraints:
  - [ ] Unique constraint: [cartId, productId, size] - không thể thêm cùng product + size 2 lần
- [ ] Relations:
  - [ ] `cart` (Cart) - Many-to-one
  - [ ] `product` (Product) - Many-to-one
- [ ] Indexes:
  - [ ] `cartId` - Index for query by cart

### 7. Orders Table

- [ ] Lưu thông tin đơn hàng
- [ ] Fields:
  - [ ] `id` (String, UUID, Primary Key)
  - [ ] `code` (String, Unique, required - e.g., #ORD-1234)
  - [ ] `userId` (String, Foreign Key -> Users.id)
  - [ ] `status` (OrderStatus enum: PENDING | PROCESSING | SHIPPED | DELIVERED | CANCELLED, default: PENDING)
  - [ ] `paymentStatus` (PaymentStatus enum: PENDING | PAID | FAILED | REFUNDED, default: PENDING)
  - [ ] `totalAmount` (Decimal, Money, required)
  - [ ] `shippingFee` (Decimal, Money, default: 0)
  - [ ] `discountValue` (Decimal, Money, default: 0)
  - [ ] Shipping address snapshot (stored để tránh thay đổi khi user edit profile):
    - [ ] `shippingAddress` (String?, Text, optional)
    - [ ] `shippingCity` (String?, VarChar(100), optional)
    - [ ] `shippingState` (String?, VarChar(100), optional)
    - [ ] `shippingZip` (String?, VarChar(10), optional)
    - [ ] `shippingCountry` (String?, VarChar(100), optional)
  - [ ] `createdAt` (DateTime, default: now())
  - [ ] `updatedAt` (DateTime, auto-updated)
- [ ] Relations:
  - [ ] `user` (User) - Many-to-one
  - [ ] `items` (OrderItem[]) - One-to-many
  - [ ] `paymentTransaction` (PaymentTransaction?) - One-to-one (optional)

### 8. OrderItems Table

- [ ] Lưu chi tiết sản phẩm trong đơn hàng (snapshot data)
- [ ] Fields:
  - [ ] `id` (String, UUID, Primary Key)
  - [ ] `orderId` (String, Foreign Key -> Orders.id)
  - [ ] `productId` (String?, Foreign Key -> Products.id, nullable - nếu product bị xóa)
  - [ ] Snapshot data (lưu để tránh thay đổi khi product update):
    - [ ] `productSlug` (String, VarChar(255), required)
    - [ ] `productName` (String, VarChar(255), required)
    - [ ] `size` (String, VarChar(10), required)
    - [ ] `price` (Decimal, Money, required - giá tại thời điểm mua)
  - [ ] `quantity` (Int, required)
- [ ] Relations:
  - [ ] `order` (Order) - Many-to-one
  - [ ] `product` (Product?) - Many-to-one (optional)
- [ ] Indexes:
  - [ ] `orderId` - Index for query by order

### 9. PaymentTransactions Table

- [ ] Lưu thông tin giao dịch thanh toán (PayOS integration)
- [ ] Fields:
  - [ ] `id` (String, UUID, Primary Key)
  - [ ] `orderId` (String, Unique, Foreign Key -> Orders.id)
  - [ ] `transactionCode` (String, Unique, required - PayOS transaction code)
  - [ ] `amount` (Decimal, Money, required)
  - [ ] `status` (PaymentTransactionStatus enum: PENDING | PAID | CANCELLED | EXPIRED | FAILED, default: PENDING)
  - [ ] `paymentUrl` (String?, optional - URL để redirect)
  - [ ] `payosData` (Json?, optional - raw data từ PayOS)
  - [ ] `createdAt` (DateTime, default: now())
  - [ ] `updatedAt` (DateTime, auto-updated)
- [ ] Relations:
  - [ ] `order` (Order) - One-to-one

## Enums

### UserRole

```typescript
enum UserRole {
  CUSTOMER  // Default role
  ADMIN     // Admin role
}
```

### SessionStatus

```typescript
enum SessionStatus {
  ACTIVE
  INACTIVE
  REVOKED
}
```

### OrderStatus

```typescript
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### PaymentStatus

```typescript
enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

### PaymentTransactionStatus

```typescript
enum PaymentTransactionStatus {
  PENDING
  PAID
  CANCELLED
  EXPIRED
  FAILED
}
```

## Relationships

### Entity Relationships Diagram

```
Users (1) ----< (N) Orders
Users (1) ----< (1) Cart
Users (1) ----< (N) Sessions

Orders (1) ----< (N) OrderItems
Orders (1) ----< (1) PaymentTransaction

Products (1) ----< (N) CartItems
Products (1) ----< (N) OrderItems
Products (1) ----< (N) ProductSizeStock

Cart (1) ----< (N) CartItems
```

## Indexes

### Recommended Indexes

- [ ] `users.email` - Unique index
- [ ] `sessions.userId` - Index for query sessions by user
- [ ] `sessions.token` - Index for token lookup
- [ ] `sessions.status` - Index for filtering by status
- [ ] `sessions.expiresAt` - Index for expiration checks
- [ ] `products.slug` - Index for slug lookup
- [ ] `product_size_stocks.productId` - Index for query by product
- [ ] `cart_items.cartId` - Index for query by cart
- [ ] `order_items.orderId` - Index for query by order
- [ ] `orders.userId` - Index for query orders by user

## Initial Data

### Admin User

- [ ] Create admin user khi khởi tạo database
- [ ] Email: `admin@example.com` (hoặc config)
- [ ] Password: Hash password với argon2
- [ ] Role: `ADMIN`
- [ ] FullName: Optional
- [ ] EmailVerified: true (optional)

### Sample Products (Optional)

- [ ] Seed một số sản phẩm mẫu để test
- [ ] Tất cả sản phẩm đều phải có ProductSizeStock

## Database Migrations

### Migration Files

- [ ] Create users table
- [ ] Create sessions table
- [ ] Create products table
- [ ] Create product_size_stocks table
- [ ] Create cart table
- [ ] Create cart_items table
- [ ] Create orders table
- [ ] Create order_items table
- [ ] Create payment_transactions table
- [ ] Create indexes
- [ ] Seed admin user
- [ ] Seed sample products (optional)

## Prisma Schema Location

Schema được định nghĩa trong: `apps/api/prisma/schema.prisma`

### Key Features

- PostgreSQL database
- UUID cho IDs (users, products, orders, order_items, payment_transactions)
- CUID cho IDs (sessions, cart, cart_items)
- Decimal type với @db.Money cho các trường tiền
- Enums cho status và roles
- Unique constraints cho business logic
- Cascade delete cho relationships
- Indexes cho performance

## Checklist hoàn thành

- [ ] Users table với đầy đủ fields
- [ ] Sessions table với đầy đủ fields
- [ ] Products table với đầy đủ fields
- [ ] ProductSizeStock table với đầy đủ fields
- [ ] Cart table với đầy đủ fields
- [ ] CartItems table với đầy đủ fields
- [ ] Orders table với đầy đủ fields
- [ ] OrderItems table với đầy đủ fields
- [ ] PaymentTransactions table với đầy đủ fields
- [ ] Foreign keys được setup đúng
- [ ] Unique constraints được setup đúng
- [ ] Indexes được tạo cho các fields quan trọng
- [ ] Admin user được tạo sẵn
- [ ] Database migrations
- [ ] Seed data (optional)
- [ ] Database connection trong backend
- [ ] Code review và cleanup

## Notes

- Database sử dụng PostgreSQL với Prisma ORM
- UUID được dùng cho các entities chính (users, products, orders)
- CUID được dùng cho các entities phụ (sessions, cart, cart_items)
- Decimal type với @db.Money cho tất cả các trường tiền
- OrderItem lưu snapshot data để đảm bảo thông tin không thay đổi
- CartItem có unique constraint trên [cartId, productId, size]
- Tất cả sản phẩm đều phải có ProductSizeStock (không có hasSizes field)
- Stock được quản lý hoàn toàn qua ProductSizeStock
- Session management cho authentication với status tracking
- PaymentTransaction tích hợp với PayOS (optional)
