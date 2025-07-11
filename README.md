# GRM Project - Ứng dụng Quản lý Công thức Nấu ăn

## 📝 Tổng quan
GRM Project là một ứng dụng web hiện đại được xây dựng để quản lý và chia sẻ công thức nấu ăn. Ứng dụng sử dụng các công nghệ web tiên tiến nhất để mang đến trải nghiệm người dùng tốt nhất.

## 🚀 Công nghệ chính

### Core Framework
- **React.js** (v19.1.0) - Framework UI chính
- **React Router DOM** (v7.6.2) - Quản lý routing và navigation
- **React Scripts** (v5.0.1) - Công cụ build và development

### UI/UX Libraries
- **Framer Motion** (v12.17.3) - Thư viện animation mạnh mẽ
- **React Icons** (v5.5.0) - Bộ icon phong phú
- **OGL** (v1.0.11) - Thư viện WebGL cho hiệu ứng 3D
- **Tailwind Merge** (v3.3.1) - Utility cho Tailwind CSS
- **CLSX** (v2.1.1) - Quản lý class names

### Testing
- **Jest DOM** - Testing DOM elements
- **React Testing Library** - Testing React components
- **User Event Testing Library** - Testing user interactions

## 📁 Cấu trúc dự án

### Components
- `Notification/` - Component thông báo
- `ConfirmationModal/` - Modal xác nhận
- `RecipeBadge/` - Badge hiển thị thông tin công thức
- `ProfileRecipeCard/` - Card hiển thị công thức trong profile
- `Stack/` - Component layout stack
- `TiltedCard/` - Card với hiệu ứng nghiêng
- `FeatureCarousel/` - Carousel hiển thị tính năng
- `Footer/` - Footer của ứng dụng
- `Aurora/` - Component hiệu ứng aurora
- `PopularRecipesCarousel/` - Carousel công thức phổ biến
- `RecipeCard/` - Card hiển thị công thức
- `Hero/` - Hero section
- `RecipeTagsCarousel/` - Carousel tags công thức
- `ThemeToggle/` - Nút chuyển đổi theme
- `Navbar/` - Navigation bar

### Pages
- `Home/` - Trang chủ
- `Auth/` - Xác thực người dùng
- `Profile/` - Trang cá nhân
- `Community/` - Cộng đồng
- `MealPlanner/` - Lập kế hoạch bữa ăn
- `RecipeDetails/` - Chi tiết công thức
- `Recipes/` - Danh sách công thức
- `Favorites/` - Công thức yêu thích
- `CreateRecipe/` - Tạo công thức mới
- `CreatePost/` - Tạo bài viết mới

### Thư mục khác
- `/src/context` - Quản lý state với React Context
- `/src/hooks` - Custom React hooks
- `/src/lib` - Utility functions và shared code
- `/src/assets` - Static assets (images, fonts, etc.)
- `/src/data` - Data files và constants

## 🛠 Development Tools
- **ESLint** - Code linting và style enforcement
- **Web Vitals** - Performance monitoring
- **Browser Compatibility** - Cấu hình cho production và development

## 📜 Scripts
```bash
npm start    # Chạy development server
npm build    # Build cho production
npm test     # Chạy tests
npm eject    # Eject từ Create React App
```

## ✨ Tính năng nổi bật
- 🎨 UI/UX hiện đại với animations mượt mà
- 🎮 Hiệu ứng 3D với WebGL
- 🔄 Routing thông minh với React Router
- 📱 Responsive design
- 🌓 Dark/Light mode
- 🔍 Tìm kiếm và lọc công thức
- 👥 Tính năng cộng đồng
- 📅 Lập kế hoạch bữa ăn
- 💾 Lưu trữ công thức yêu thích

## 🚀 Getting Started
1. Clone repository
2. Cài đặt dependencies:
```bash
npm install
```
3. Chạy development server:
```bash
npm start
```

## 📝 License
MIT License