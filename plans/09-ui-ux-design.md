# Plan: UI/UX Design System

## Mô tả

Thiết kế hệ thống UI/UX nhất quán, dễ nhìn, dễ sử dụng cho toàn bộ website. Đây là điểm cộng quan trọng trong đánh giá.

## Yêu cầu (Điểm cộng)

### 1. Giao diện dễ nhìn, bố cục rõ ràng

- [ ] Clear visual hierarchy
- [ ] Proper spacing và padding
- [ ] Consistent layout structure
- [ ] Readable typography
- [ ] Balanced white space

### 2. Màu sắc hài hòa, font chữ dễ đọc

- [ ] Color palette nhất quán
- [ ] Contrast ratio đủ cho accessibility
- [ ] Font size phù hợp
- [ ] Font family dễ đọc
- [ ] Line height hợp lý

### 3. UI nhất quán giữa các trang

- [ ] Consistent header/navigation
- [ ] Consistent footer (optional)
- [ ] Consistent button styles
- [ ] Consistent form styles
- [ ] Consistent card/product card styles
- [ ] Consistent spacing system

### 4. Trải nghiệm sử dụng mượt, không gây rối

- [ ] Smooth transitions và animations
- [ ] Loading states rõ ràng
- [ ] Error states dễ hiểu
- [ ] Empty states có hướng dẫn
- [ ] Clear call-to-action buttons
- [ ] Intuitive navigation

## Design System Components

### 1. Color Palette

- [ ] Primary color (brand color)
- [ ] Secondary color
- [ ] Success color (green)
- [ ] Error color (red)
- [ ] Warning color (yellow/orange)
- [ ] Neutral colors (gray scale)
- [ ] Background colors
- [ ] Text colors

### 2. Typography

- [ ] Heading styles (h1, h2, h3, h4, h5, h6)
- [ ] Body text styles
- [ ] Link styles
- [ ] Button text styles
- [ ] Caption/small text styles

### 3. Components

#### Buttons

- [ ] Primary button
- [ ] Secondary button
- [ ] Outline button
- [ ] Text button
- [ ] Disabled state
- [ ] Loading state
- [ ] Hover/Active states

#### Forms

- [ ] Input fields
- [ ] Textarea
- [ ] Select/Dropdown
- [ ] Checkbox
- [ ] Radio button
- [ ] File upload
- [ ] Validation messages
- [ ] Error states

#### Cards

- [ ] Product card
- [ ] Order card
- [ ] Info card
- [ ] Hover effects

#### Navigation

- [ ] Header/Navbar
- [ ] Breadcrumbs
- [ ] Pagination (optional)
- [ ] Sidebar (optional)

#### Feedback

- [ ] Loading spinner/skeleton
- [ ] Success message/Toast
- [ ] Error message/Toast
- [ ] Empty state illustration
- [ ] Modal/Dialog

## Responsive Design

### Breakpoints

- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)

### Responsive Considerations

- [ ] Mobile-first approach
- [ ] Flexible grid layout
- [ ] Responsive images
- [ ] Touch-friendly buttons (min 44x44px)
- [ ] Readable font sizes trên mobile
- [ ] Navigation menu cho mobile (hamburger menu)

## Accessibility

### WCAG Guidelines

- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] ARIA labels
- [ ] Alt text cho images
- [ ] Color contrast ratio (AA minimum)
- [ ] Screen reader friendly

## Implementation

### CSS Framework Options

- [ ] Tailwind CSS (recommended)
- [ ] CSS Modules
- [ ] Styled Components
- [ ] Material-UI / Chakra UI
- [ ] Custom CSS

### Component Library

- [ ] Build custom components
- [ ] Use component library (shadcn/ui, etc.)
- [ ] Mix of both

## Page-Specific Design

### Home Page

- [ ] Hero section (optional)
- [ ] Search bar prominent
- [ ] Product grid layout
- [ ] Filter sidebar (optional)
- [ ] Pagination hoặc infinite scroll

### Product Detail Page

- [ ] Large product images
- [ ] Clear product information
- [ ] Prominent add to cart button
- [ ] Quantity selector
- [ ] Related products (optional)

### Cart Page

- [ ] Clear cart items list
- [ ] Easy quantity controls
- [ ] Prominent total price
- [ ] Clear checkout button
- [ ] Empty cart state

### Purchase History Page

- [ ] Timeline hoặc card layout
- [ ] Clear order information
- [ ] Total spent display (optional)

### Admin Add Product Page

- [ ] Clear form layout
- [ ] Image upload area
- [ ] Validation messages
- [ ] Success feedback

### Auth Pages (Login/Register)

- [ ] Clean, focused layout
- [ ] Clear form fields
- [ ] Error messages
- [ ] Link between login/register

## Animation & Transitions

### Micro-interactions

- [ ] Button hover effects
- [ ] Card hover effects
- [ ] Form focus states
- [ ] Page transitions (optional)
- [ ] Loading animations

### Performance

- [ ] Optimize images
- [ ] Lazy loading
- [ ] Code splitting
- [ ] Minimize bundle size

## Design Inspiration

### Do's

- ✅ Tham khảo bố cục của các website bán giày
- ✅ Học hỏi UX patterns tốt
- ✅ Tự thiết kế lại với style riêng

### Don'ts

- ❌ Sao chép y nguyên thiết kế
- ❌ Copy code CSS từ website khác
- ❌ Sử dụng hình ảnh không có bản quyền

## Checklist hoàn thành

- [ ] Color palette được định nghĩa
- [ ] Typography system được setup
- [ ] Component library được tạo
- [ ] Consistent styling across pages
- [ ] Responsive design cho mobile/tablet/desktop
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Accessibility considerations
- [ ] Smooth animations/transitions
- [ ] Performance optimization
- [ ] Code review và cleanup

## Notes

- Không yêu cầu thiết kế cầu kỳ, chỉ cần chỉn chu và hợp lý
- Ưu tiên tính ổn định và luồng sử dụng rõ ràng
- Giao diện dễ nhìn, bố cục rõ ràng quan trọng hơn sáng tạo cao
- Có thể dùng design system có sẵn (Tailwind, Material-UI) nhưng phải customize
