# Plan: Đăng ký và Đăng nhập (Authentication)

## Mô tả

Chức năng đăng ký và đăng nhập nhằm quản lý người dùng và phân quyền trong hệ thống.

## Yêu cầu bắt buộc

### 1. Đăng ký (Register)

- [ ] Form đăng ký với:
  - [ ] Email (required, validate format)
  - [ ] Password (required, min length)
  - [ ] Confirm password (optional nhưng nên có)
- [ ] **Role user**: Đăng ký tài khoản gồm email và password
- [ ] **Role admin**: Không có chức năng đăng ký
  - [ ] Tài khoản admin được tạo sẵn khi khởi tạo database
- [ ] Validation:
  - [ ] Email format
  - [ ] Password strength (min length, có thể yêu cầu uppercase, number, etc.)
  - [ ] Password match (nếu có confirm password)
- [ ] Error handling:
  - [ ] Email đã tồn tại
  - [ ] Validation errors
- [ ] Success: Tạo tài khoản thành công → Redirect to login hoặc auto login

### 2. Đăng nhập (Login)

- [ ] Form đăng nhập với:
  - [ ] Email
  - [ ] Password
- [ ] Cả user và admin đều đăng nhập bằng email và password
- [ ] Validation:
  - [ ] Email format
  - [ ] Required fields
- [ ] Error handling:
  - [ ] Email không tồn tại
  - [ ] Password sai
  - [ ] Account bị khóa (optional)
- [ ] Success: Đăng nhập thành công → Lưu JWT token → Redirect

### 3. Session Management (JWT-based)

- [ ] Tạo Session record khi login thành công
- [ ] Session chứa:
  - [ ] token (JWT token - unique)
  - [ ] refreshToken (optional - unique)
  - [ ] userId
  - [ ] ipAddress (optional)
  - [ ] userAgent (optional)
  - [ ] status (ACTIVE/INACTIVE/REVOKED)
  - [ ] expiresAt (expiration time)
  - [ ] revokedAt (nếu bị revoke)
- [ ] Lưu token vào localStorage hoặc httpOnly cookie
- [ ] Send token trong Authorization header cho các protected routes
- [ ] Token expiration handling
- [ ] Refresh token support (optional)
- [ ] Revoke session khi logout

### 4. Password Encryption

- [ ] Mã hóa password bằng argon2 (theo README)
- [ ] Hash password khi đăng ký
- [ ] Compare hashed password khi đăng nhập
- [ ] Không lưu plain text password
- [ ] Password có thể null (cho OAuth users)

### 5. Phân quyền sử dụng

- [ ] Ngoại trừ chức năng "thêm sản phẩm":
  - [ ] User và admin đều có thể sử dụng các chức năng còn lại
- [ ] Admin được phép sử dụng thêm:
  - [ ] Thêm sản phẩm mới

## Yêu cầu không bắt buộc (Điểm cộng)

### 6. Tối ưu hóa

- [ ] Remember me (extend token expiration)
- [ ] Forgot password
- [ ] Reset password
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Facebook)
- [ ] Logout functionality
- [ ] Session management

## Technical Implementation

### Frontend (Next.js)

```typescript
// Routes:
// /register - Đăng ký
// /login - Đăng nhập
// /logout - Đăng xuất (optional)

// Components:
// - RegisterPage
// - LoginPage
// - AuthContext (optional, để manage auth state)
```

### API Endpoints

- `POST /api/auth/register` - Đăng ký
  - Body: { email, password, fullName? (optional), phone? (optional) }
  - Response: { user, token, session } hoặc { message, error }
- `POST /api/auth/login` - Đăng nhập
  - Body: { email, password }
  - Response: { user, token, session } hoặc { message, error }
- `POST /api/auth/logout` - Đăng xuất
  - Headers: Authorization: Bearer <token>
  - Action: Revoke session (status = REVOKED, revokedAt = now)
- `GET /api/auth/me` - Lấy thông tin user hiện tại
  - Headers: Authorization: Bearer <token>
  - Response: { id, email, role, fullName, phone, avatar, emailVerified, phoneVerified }

### Backend Implementation

#### Register Endpoint

```typescript
// 1. Validate input
// 2. Check if email exists
// 3. Hash password với argon2
// 4. Create user với role = CUSTOMER (default)
// 5. Generate JWT token
// 6. Create Session record
// 7. Return user + token
```

#### Login Endpoint

```typescript
// 1. Validate input
// 2. Find user by email
// 3. Compare password (hashed với argon2)
// 4. Generate JWT token
// 5. Create Session record (status: ACTIVE, expiresAt)
// 6. Return user + token
```

#### Authentication Middleware

```typescript
// 1. Extract token from Authorization header
// 2. Verify JWT token
// 3. Check Session exists và status = ACTIVE
// 4. Check Session chưa hết hạn (expiresAt > now)
// 5. Extract user info từ token
// 6. Attach user to request
// 7. Check role if needed (CUSTOMER vs ADMIN)
```

### Password Hashing

```typescript
// Using argon2 (as per README)
import * as argon2 from "argon2";

const hashedPassword = await argon2.hash(password);
const isMatch = await argon2.verify(hashedPassword, password);
```

## UI/UX Considerations

- [ ] Clear form layout
- [ ] Validation messages rõ ràng
- [ ] Loading state khi đang submit
- [ ] Success/Error messages
- [ ] Password visibility toggle (show/hide)
- [ ] Responsive design
- [ ] Accessible forms
- [ ] Link giữa login và register pages

## Data Flow

### Register Flow

1. User điền form đăng ký (email, password, fullName?, phone?)
2. Validate form
3. Submit to API
4. Backend hash password với argon2
5. Create user với role CUSTOMER (default)
6. Generate JWT token
7. Create Session record (status: ACTIVE, expiresAt)
8. Return user + token + session
9. Frontend save token
10. Redirect to home hoặc auto login

### Login Flow

1. User điền form đăng nhập (email, password)
2. Validate form
3. Submit to API
4. Backend find user by email
5. Compare password với argon2
6. Generate JWT token
7. Create Session record (status: ACTIVE, expiresAt, ipAddress?, userAgent?)
8. Return token + user info + session
9. Frontend save token
10. Redirect to home hoặc previous page

## Security Considerations

- [ ] Password không được log hoặc expose
- [ ] JWT secret key phải secure
- [ ] Token expiration time hợp lý
- [ ] HTTPS trong production
- [ ] Rate limiting cho login/register (optional)
- [ ] CORS configuration

## Checklist hoàn thành

- [ ] Register form và API
- [ ] Login form và API
- [ ] Password hashing
- [ ] JWT token generation
- [ ] Token storage (localStorage hoặc cookie)
- [ ] Authentication middleware
- [ ] Protected routes
- [ ] Role-based access control
- [ ] Error handling
- [ ] Validation
- [ ] Responsive design
- [ ] Code review và cleanup

## Notes

- Admin account được tạo sẵn trong database với role = ADMIN, không có chức năng đăng ký admin
- User role: CUSTOMER (default) hoặc ADMIN
- Password có thể null (cho OAuth users trong tương lai)
- Session management:
  - Mỗi login tạo 1 Session record mới
  - Session có status (ACTIVE/INACTIVE/REVOKED)
  - Session có expiresAt để check expiration
  - Có thể revoke session khi logout
- JWT token nên có expiration time và được lưu trong Session
- Có thể dùng httpOnly cookie thay vì localStorage cho security tốt hơn
- Cần xử lý token refresh nếu token hết hạn (dùng refreshToken nếu có)
