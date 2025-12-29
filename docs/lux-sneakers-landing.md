## LUX Sneakers – Black & Gold Landing Concept

### 1. Mục tiêu & cảm xúc thương hiệu

- **Mục tiêu**: Trang landing giới thiệu bộ sưu tập giày cao cấp LUX SNEAKERS – Black & Gold Edition, nhấn mạnh sự sang trọng, hiện đại và cảm giác “luxury streetwear”.
- **Cảm xúc chính**:
  - Nền tối, điểm nhấn gold mạnh → high-end, premium.
  - Glassmorphism & blur → hiện đại, công nghệ.
  - Chuyển động mượt (float, hover, reveal) → sống động nhưng không rối.

### 2. Cấu trúc layout & section

1. **Navigation (LuxNavbar)**
   - Logo chữ `LUX` (trắng) + `SNEAKERS` (gradient gold).
   - Menu: Bộ sưu tập, Nam, Nữ, Giảm giá.
   - Icon Search, giỏ hàng với badge số lượng.
   - Glassmorphism bar, fixed top.

2. **Hero Section**
   - **Hero copy**:
     - Badge: `New Arrival 2025`.
     - Heading lớn: “NÂNG TẦM PHONG CÁCH” với từ khóa có gradient gold.
     - Đoạn mô tả ngắn về sự kết hợp công nghệ thể thao & thiết kế sang trọng.
   - **Hero actions**:
     - CTA chính: `MUA NGAY` (gold gradient).
     - CTA phụ: `TÌM HIỂU THÊM` (border, hover background nhẹ).
   - **Hero visual**:
     - SVG đôi giày với gradient gold.
     - Chữ nền khổng lồ “GOLD” nhạt phía sau.
     - Hiệu ứng float animation cho khối giày.

3. **Featured Products Slider Section**
   - Header:
     - Tiêu đề: “SẢN PHẨM NỔI BẬT” với từ khóa gold gradient.
     - Subtext: “Tuyển tập những mẫu giày cháy hàng nhất tuần qua”.
     - Nút điều hướng trái/phải dạng tròn (arrow icon).
   - Slider:
     - Layout horizontal scroll (`overflow-x-auto`, `snap-x`).
     - Mỗi card là một sản phẩm nổi bật với emoji/icon, tên, mô tả ngắn, giá, nút add to cart.
     - Badge HOT / NEW / LIMITED nếu cần.

4. **Linear Stat Section (StatsBar)**
   - 4 cột:
     - 150K+ Khách hàng.
     - 50+ Cửa hàng.
     - 200+ Mẫu thiết kế.
     - 4.9/5 Đánh giá.
   - Nền white/5, border trên/dưới white/10 → tạo cảm giác phân đoạn rõ ràng, nhưng vẫn high-end.

5. **Footer**
   - **Brand & newsletter**:
     - Logo LUX SNEAKERS.
     - Đoạn mô tả về email list (sản phẩm giới hạn, ưu đãi độc quyền).
     - Input email + nút GỬI với gradient gold.
   - **Liên kết**:
     - Về chúng tôi, Chính sách bảo mật, Điều khoản dịch vụ.
   - **Social**:
     - Icon tròn các mạng xã hội (FB, IG, TT).
   - **Copyright**:
     - “© 2025 LUX SNEAKERS. All rights reserved. Designed for WebDev Studios.”

### 3. Tone màu, typography & hiệu ứng

- **Màu sắc**:
  - Nền chính: `#0a0a0a` (dark).
  - Gold: từ `#fbbf24` đến `#d97706` (gradient).
  - Text phụ: `text-gray-400` / `text-gray-500`.
  - Border: `rgba(251, 191, 36, 0.2)` / `white/10`.
- **Typography**:
  - Font chính: `Plus Jakarta Sans` (hoặc thay bằng font tương đương nếu cần).
  - Heading: rất đậm (800+), tracking chặt.
  - Subtext: `text-gray-400`, kích thước vừa phải (text-lg).
- **Hiệu ứng**:
  - Glassmorphism: nền `rgba(255,255,255,0.05)`, blur, border nhẹ.
  - Gradient text: background gradient gold + `text-transparent` + `bg-clip-text`.
  - Float: hero shoe floating lên xuống nhẹ.
  - Hover:
    - Card phóng nhẹ (`scale(1.02)`).
    - Nút chuyển màu nền / viền / shadow gold.
  - Slider ngang: kéo/momentum + nút điều hướng dùng `scrollBy`.

### 4. Danh sách component tái sử dụng

#### 4.1. Layout & theme

- **`LuxLayout`**
  - Trách nhiệm:
    - Thiết lập nền dark, màu text, font cho trang LUX.
    - Bao bọc toàn bộ landing (bao gồm navbar, hero, footer).
  - Props chính:
    - `children: React.ReactNode`.

#### 4.2. Navigation

- **`LuxNavbar`**
  - Trách nhiệm:
    - Hiển thị logo, menu chính, nút search, giỏ hàng với badge.
    - Sticky/fixed top, glassmorphism background.
  - Props (có thể mở rộng):
    - `links: { label: string; href: string }[]`.
    - `cartCount?: number`.

#### 4.3. Hero

- **`HeroSection`**
  - Trách nhiệm:
    - Khối text hero (badge, heading, mô tả, CTA).
  - Props:
    - `badge: string`.
    - `titleLines: React.ReactNode[]` (hoặc đơn giản là `title: React.ReactNode`).
    - `description: string`.
    - `primaryCtaLabel: string`.
    - `secondaryCtaLabel?: string`.

- **`HeroVisual`**
  - Trách nhiệm:
    - SVG đôi giày gradient + chữ nền “GOLD”.
    - Hiệu ứng float.
  - Props:
    - Có thể không cần props (design cố định), hoặc thêm `labelBackgroundText?: string`.

#### 4.4. Product slider

- **`ProductSliderSection`**
  - Trách nhiệm:
    - Wrapper cho tiêu đề, mô tả, navigation button và vùng slider.
  - Props:
    - `title: React.ReactNode`.
    - `description: string`.
    - `products: ProductCardProps[]`.

- **`ProductCard`**
  - Props đề xuất:
    - `icon: React.ReactNode` (emoji/Icon component).
    - `title: string`.
    - `subtitle?: string`.
    - `priceLabel: string`.
    - `badge?: { label: string; variant?: 'hot' | 'new' | 'default' }`.

#### 4.5. Stats

- **`StatsBar`**
  - Trách nhiệm:
    - Hiển thị dãy thống kê tuyến tính.
  - Props:
    - `items: { value: string; label: string }[]`.

#### 4.6. Footer

- **`LuxFooter`**
  - Trách nhiệm:
    - Khối footer đầy đủ (brand + newsletter + links + social).
  - Props:
    - `links: { label: string; href: string }[]`.
    - `socials: { label: string; href: string }[]`.

#### 4.7. Interaction components

- **`CustomCursor`**
  - Trách nhiệm:
    - Render 2 div cursor (core + follower).
    - Lắng nghe `mousemove` + `mouseenter/mouseleave` trên các selector tương tác.
  - Ghi chú:
    - Chỉ chạy client (`"use client"`).

- **`RevealOnScroll`**
  - Trách nhiệm:
    - Bọc quanh element và dùng `IntersectionObserver` để animate opacity/translateY khi xuất hiện.
  - Props:
    - `children: React.ReactNode`.
    - `delay?: number`.

### 5. Motion & interaction chi tiết

- **Custom cursor**:
  - Ẩn `cursor` mặc định, thay bằng 2 vòng tròn:
    - Lõi vàng nhỏ.
    - Vòng viền lớn hơn, di chuyển chậm hơn (tạo cảm giác đuổi theo).
  - Khi hover button/link/card:
    - Lõi scale lớn + opacity thấp.
    - Vòng ngoài scale to, đổi màu viền sang trắng.

- **Scroll reveal**:
  - Mặc định: `opacity: 0`, `translateY: 30px`.
  - Khi vào viewport (threshold ~0.1): `opacity: 1`, `translateY: 0`, transition 0.8s.

- **Slider ngang**:
  - Container:
    - `display: flex`, `gap-6`, `overflow-x-auto`, `snap-x snap-mandatory`, `scroll-smooth`, `no-scrollbar`.
  - Button left/right:
    - Gọi `scrollBy({ left: ±cardWidth, behavior: 'smooth' })`.

### 6. Ánh xạ vào Next.js (App Router)

- App: `apps/web` (Next.js 16, App Router).
- Landing chính:
  - Dùng route gốc `src/app/page.tsx` cho LUX Sneakers landing.
  - `RootLayout` giữ nguyên, chỉ đổi background & font nếu cần qua class.
- Thư mục component đề xuất:
  - `apps/web/src/components/lux/LuxLayout.tsx`
  - `apps/web/src/components/lux/LuxNavbar.tsx`
  - `apps/web/src/components/lux/HeroSection.tsx`
  - `apps/web/src/components/lux/HeroVisual.tsx`
  - `apps/web/src/components/lux/ProductSliderSection.tsx`
  - `apps/web/src/components/lux/ProductCard.tsx`
  - `apps/web/src/components/lux/StatsBar.tsx`
  - `apps/web/src/components/lux/LuxFooter.tsx`
  - `apps/web/src/components/lux/CustomCursor.tsx`
  - `apps/web/src/components/lux/RevealOnScroll.tsx`

### 7. Sơ đồ component (mermaid)

```mermaid
flowchart TD
  homePage[HomePage (page.tsx)]
  luxLayout[LuxLayout]
  navbar[LuxNavbar]
  heroSection[HeroSection]
  heroVisual[HeroVisual]
  productSlider[ProductSliderSection]
  productCard[ProductCard]
  statsBar[StatsBar]
  luxFooter[LuxFooter]
  customCursor[CustomCursor]

  homePage --> luxLayout
  luxLayout --> customCursor
  luxLayout --> navbar
  luxLayout --> heroSection
  luxLayout --> heroVisual
  luxLayout --> productSlider
  productSlider --> productCard
  luxLayout --> statsBar
  luxLayout --> luxFooter
```
