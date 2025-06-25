# Hướng dẫn Áp dụng Animation Scroll cho Tất cả Trang

## Tổng quan
Dự án đã được tích hợp hệ thống animation scroll sử dụng Framer Motion. Khi người dùng scroll xuống, các phần tử sẽ xuất hiện với animation mượt mà.

## Các Component đã tạo

### 1. useScrollAnimation Hook
**File:** `src/hooks/useScrollAnimation.js`

- Cung cấp các animation variants: `fadeInUp`, `fadeInLeft`, `fadeInRight`, `scaleIn`, `staggerContainer`, `staggerItem`
- Hook `useScrollAnimation()` để detect khi element vào viewport

### 2. AnimatedSection Component
**File:** `src/components/AnimatedSection/AnimatedSection.jsx`

- Wrapper component để áp dụng animation cho từng section
- Props:
  - `variant`: Loại animation (mặc định: fadeInUp)
  - `delay`: Độ trễ animation (mặc định: 0)
  - `threshold`: Ngưỡng trigger animation (mặc định: 0.1)
  - `triggerOnce`: Chỉ chạy animation một lần (mặc định: true)
  - `as`: HTML tag (mặc định: 'div')

### 3. PageWrapper Component
**File:** `src/components/PageWrapper/PageWrapper.jsx`

- Wrapper cho toàn bộ trang
- Tự động áp dụng stagger animation cho các children
- Props:
  - `enableStagger`: Bật/tắt stagger effect (mặc định: true)
  - `className`: CSS class bổ sung

## Cách Áp dụng cho Trang Mới

### Bước 1: Import các component cần thiết
```jsx
import React from 'react';
import PageWrapper from '../../components/PageWrapper/PageWrapper';
import AnimatedSection from '../../components/AnimatedSection/AnimatedSection';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '../../hooks/useScrollAnimation';
```

### Bước 2: Wrap toàn bộ nội dung trang với PageWrapper
```jsx
const YourPage = () => {
  return (
    <PageWrapper className={styles.yourPageContainer}>
      {/* Nội dung trang */}
    </PageWrapper>
  );
};
```

### Bước 3: Wrap từng section với AnimatedSection
```jsx
<PageWrapper className={styles.yourPageContainer}>
  {/* Hero Section */}
  <AnimatedSection variant={fadeInUp}>
    <section className={styles.heroSection}>
      {/* Nội dung hero */}
    </section>
  </AnimatedSection>

  {/* Content Section */}
  <AnimatedSection variant={fadeInLeft} delay={0.2}>
    <section className={styles.contentSection}>
      {/* Nội dung */}
    </section>
  </AnimatedSection>

  {/* Features Section */}
  <AnimatedSection variant={fadeInRight} delay={0.4}>
    <section className={styles.featuresSection}>
      {/* Nội dung features */}
    </section>
  </AnimatedSection>
</PageWrapper>
```

## Các Loại Animation Có Sẵn

1. **fadeInUp**: Fade in từ dưới lên
2. **fadeInLeft**: Fade in từ trái sang phải
3. **fadeInRight**: Fade in từ phải sang trái
4. **scaleIn**: Scale từ nhỏ đến bình thường
5. **staggerContainer**: Container cho stagger animation
6. **staggerItem**: Item trong stagger animation

## Ví dụ Thực tế

### Trang đã được áp dụng:
- ✅ **Home** (`src/pages/Home/Home.jsx`)
- ✅ **AboutUs** (`src/pages/AboutUs/AboutUs.jsx`)

### Các trang cần áp dụng:
- ⏳ Auth
- ⏳ Profile
- ⏳ Recipes
- ⏳ RecipeDetails
- ⏳ CreateRecipe
- ⏳ Favorites
- ⏳ Community
- ⏳ CreatePost
- ⏳ MealPlanner
- ⏳ AuthorProfile

## Tips và Best Practices

1. **Delay Animation**: Sử dụng delay tăng dần (0, 0.2, 0.4, 0.6...) để tạo hiệu ứng cascade

2. **Chọn Animation phù hợp**:
   - `fadeInUp`: Cho hero sections, titles
   - `fadeInLeft/Right`: Cho content sections, alternating layout
   - `scaleIn`: Cho cards, buttons
   - `staggerContainer`: Cho lists, grids

3. **Performance**: 
   - Sử dụng `triggerOnce={true}` để animation chỉ chạy một lần
   - Điều chỉnh `threshold` phù hợp với kích thước element

4. **Responsive**: 
   - CSS đã có media queries để disable animation trên mobile nếu cần
   - Respect `prefers-reduced-motion` cho accessibility

## Customization

Bạn có thể tạo animation variants mới trong `useScrollAnimation.js`:

```jsx
export const customAnimation = {
  hidden: {
    opacity: 0,
    rotateY: 90,
    transition: { duration: 0.6 }
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    transition: { duration: 0.6 }
  }
};
```

## Troubleshooting

1. **Animation không chạy**: Kiểm tra import và viewport threshold
2. **Performance issues**: Giảm số lượng AnimatedSection hoặc tăng threshold
3. **Animation quá nhanh/chậm**: Điều chỉnh duration trong variants

---

**Lưu ý**: Hệ thống này đã được tối ưu cho performance và accessibility. Tất cả animation sẽ tự động tắt nếu người dùng có setting `prefers-reduced-motion`.