# Plan: Backend API (3-Layer Architecture)

## Mô tả

Backend được xây dựng theo mô hình 3-layer architecture, sử dụng async/await, JWT authentication, và xử lý lỗi đầy đủ.

## Yêu cầu bắt buộc

### 1. 3-Layer Architecture

- [ ] **Controller Layer**: Xử lý HTTP requests/responses
- [ ] **Service Layer**: Business logic
- [ ] **Repository/Data Layer**: Database operations

### 2. Async/Await

- [ ] Sử dụng async/await thay vì callbacks
- [ ] Proper error handling với try-catch
- [ ] Không sử dụng callback hell

### 3. JWT Authentication

- [ ] Generate JWT token khi login
- [ ] Verify JWT token trong middleware
- [ ] Extract user info từ token
- [ ] Token expiration handling

### 4. Password Encryption

- [ ] Mã hóa password bằng bcrypt hoặc tương đương
- [ ] Hash password khi register
- [ ] Compare hashed password khi login

### 5. Middleware

- [ ] Authentication middleware (verify JWT)
- [ ] Authorization middleware (check role)
- [ ] Error handling middleware
- [ ] Request logging middleware (optional)

### 6. Error Handling

- [ ] Xử lý lỗi 404 (Not Found)
- [ ] Xử lý lỗi 401 (Unauthorized)
- [ ] Xử lý lỗi 400 (Bad Request)
- [ ] Xử lý lỗi 500 (Internal Server Error)
- [ ] Consistent error response format

## Yêu cầu không bắt buộc (Điểm cộng)

### 7. Tối ưu hóa

- [ ] Input validation (Joi, Zod, class-validator)
- [ ] Rate limiting
- [ ] Caching (Redis)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Logging system
- [ ] Database migrations

## Technical Implementation

### Project Structure

```
apps/api/
├── src/
│   ├── controllers/     # Controller layer
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── cart.controller.ts
│   │   └── order.controller.ts
│   ├── services/         # Service layer
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   └── order.service.ts
│   ├── repositories/    # Repository layer
│   │   ├── user.repository.ts
│   │   ├── product.repository.ts
│   │   ├── cart.repository.ts
│   │   └── order.repository.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/          # Database models
│   │   ├── user.model.ts
│   │   ├── product.model.ts
│   │   ├── cart.model.ts
│   │   └── order.model.ts
│   ├── utils/
│   │   ├── jwt.util.ts
│   │   ├── bcrypt.util.ts
│   │   └── error.util.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── cart.routes.ts
│   │   └── order.routes.ts
│   └── app.ts           # Express app
│   └── server.ts        # Server entry point
```

### Layer Responsibilities

#### Controller Layer

- Handle HTTP requests/responses
- Validate request data
- Call service layer
- Return response

```typescript
// Example
export const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};
```

#### Service Layer

- Business logic
- Data transformation
- Call repository layer
- Handle business rules

```typescript
// Example
export const getAllProducts = async () => {
  const products = await productRepository.findAll();
  return products.map((p) => transformProduct(p));
};
```

#### Repository Layer

- Database operations
- SQL queries
- Data access only
- No business logic

```typescript
// Example
export const findAll = async () => {
  return await db.query("SELECT * FROM products");
};
```

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user (optional)

#### Products

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (admin only)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin only, optional)
- `DELETE /api/products/:id` - Xóa sản phẩm (admin only, optional)

#### Cart (nếu dùng backend)

- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/:itemId` - Cập nhật số lượng
- `DELETE /api/cart/:itemId` - Xóa sản phẩm khỏi giỏ

#### Orders

- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng (checkout)
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng

### Error Response Format

```typescript
{
  statusCode: number,
  message: string,
  error?: string,
  details?: any
}
```

### Example Error Responses

```typescript
// 401 Unauthorized
{
  statusCode: 401,
  message: "UNAUTHORIZED"
}

// 404 Not Found
{
  statusCode: 404,
  message: "Product not found"
}

// 400 Bad Request
{
  statusCode: 400,
  message: "Validation error",
  details: { email: "Invalid email format" }
}

// 500 Internal Server Error
{
  statusCode: 500,
  message: "Internal server error"
}
```

## Database Setup

### Initial Data

- [ ] Create admin user khi khởi tạo database
- [ ] Seed sample products (optional)
- [ ] Database migrations

## Security

### Best Practices

- [ ] Environment variables cho sensitive data
- [ ] CORS configuration
- [ ] Input sanitization
- [ ] SQL injection prevention (use parameterized queries)
- [ ] Rate limiting (optional)
- [ ] HTTPS in production

## Checklist hoàn thành

- [ ] 3-layer architecture được implement đúng
- [ ] Tất cả endpoints sử dụng async/await
- [ ] JWT authentication hoạt động
- [ ] Password hashing với bcrypt
- [ ] Authentication middleware
- [ ] Authorization middleware (admin check)
- [ ] Error handling middleware
- [ ] 404 error handling
- [ ] 401 error handling với message "UNAUTHORIZED"
- [ ] Consistent error response format
- [ ] Database connection
- [ ] Admin user được tạo sẵn
- [ ] Code review và cleanup

## Notes

- Backend có thể dùng Express.js, Nest.js, hoặc framework khác
- Database có thể dùng PostgreSQL, MySQL, MongoDB, hoặc SQLite
- Cần có file .env để config database, JWT secret, etc.
- API nên có versioning (v1, v2) nếu cần
