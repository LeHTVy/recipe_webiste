// Mock data for Community page
export const communityUsers = [
  {
    id: 1,
    username: "chef_maria",
    displayName: "Maria Rodriguez",
    avatar: "https://img.freepik.com/free-photo/lifestyle-people-emotions-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-help-listening-coworkers-taking-part-conversation_1258-59335.jpg?semt=ais_hybrid&w=740",
    bio: "Professional chef with 15 years experience. Specializing in Mediterranean cuisine.",
    followers: 12500,
    following: 340,
    totalRecipes: 89,
    isVerified: true,
    userType: "Professional Chef",
    location: "Barcelona, Spain"
  },
  {
    id: 2,
    username: "home_cook_jenny",
    displayName: "Jenny Chen",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    bio: "Home cook sharing family recipes and quick weeknight meals.",
    followers: 3200,
    following: 180,
    totalRecipes: 45,
    isVerified: false,
    userType: "Home Cook",
    location: "San Francisco, CA"
  },
  {
    id: 3,
    username: "baker_tom",
    displayName: "Tom Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    bio: "Pastry chef and bread enthusiast. Teaching the art of baking.",
    followers: 8900,
    following: 220,
    totalRecipes: 67,
    isVerified: true,
    userType: "Pastry Chef",
    location: "London, UK"
  },
  {
    id: 4,
    username: "healthy_sarah",
    displayName: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    bio: "Nutritionist sharing healthy and delicious recipes for better living.",
    followers: 15600,
    following: 290,
    totalRecipes: 123,
    isVerified: true,
    userType: "Nutritionist",
    location: "Los Angeles, CA"
  },
  {
    id: 5,
    username: "spice_master",
    displayName: "Raj Patel",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    bio: "Indian cuisine expert. Bringing authentic flavors to your kitchen.",
    followers: 7800,
    following: 150,
    totalRecipes: 78,
    isVerified: false,
    userType: "Home Cook",
    location: "Mumbai, India"
  }
];

export const communityPosts = [
  {
    id: 1,
    user: communityUsers[0],
    recipeId: 1,
    title: "Perfect Chocolate Lava Cake",
    description: "Just made this incredible chocolate lava cake for tonight's dinner party! The molten center is absolutely divine. Here's my secret tip: add a pinch of sea salt to enhance the chocolate flavor. 🍫✨",
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600",
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600"
    ],
    cookingTime: 45,
    servings: 4,
    difficulty: "Medium",
    category: "Dessert",
    tags: ["chocolate", "dessert", "romantic", "party"],
    likes: 342,
    comments: 28,
    shares: 15,
    bookmarks: 89,
    rating: 4.9,
    createdAt: "2024-01-15T18:30:00Z",
    isLiked: false,
    isBookmarked: true
  },
  {
    id: 2,
    user: communityUsers[1],
    recipeId: 15,
    title: "Quick Weeknight Pasta",
    description: "When you need dinner on the table in 20 minutes! This creamy garlic pasta with cherry tomatoes is a lifesaver. My kids absolutely love it, and it's made with ingredients I always have on hand. 🍝",
    images: [
      "https://abraskitchen.com/wp-content/uploads/2023/12/lobster-pasta-11-1024x1536.jpg"
    ],
    cookingTime: 20,
    servings: 4,
    difficulty: "Easy",
    category: "Main Course",
    tags: ["pasta", "quick", "family-friendly", "weeknight"],
    likes: 156,
    comments: 12,
    shares: 8,
    bookmarks: 45,
    rating: 4.6,
    createdAt: "2024-01-15T16:45:00Z",
    isLiked: true,
    isBookmarked: false
  },
  {
    id: 3,
    user: communityUsers[2],
    title: "Artisan Sourdough Bread",
    description: "After 3 days of patience, my sourdough starter finally produced this beautiful loaf! The crust is perfectly crispy and the crumb is so airy. Nothing beats the smell of fresh bread in the morning. 🍞",
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600"
    ],
    cookingTime: 240,
    servings: 8,
    difficulty: "Hard",
    category: "Bread",
    tags: ["sourdough", "artisan", "homemade", "traditional"],
    likes: 289,
    comments: 34,
    shares: 22,
    bookmarks: 67,
    rating: 4.8,
    createdAt: "2024-01-15T14:20:00Z",
    isLiked: false,
    isBookmarked: true
  },
  {
    id: 4,
    user: communityUsers[3],
    title: "Rainbow Buddha Bowl",
    description: "Meal prep Sunday done right! These colorful buddha bowls are packed with nutrients and flavor. Quinoa, roasted vegetables, avocado, and my signature tahini dressing. Healthy never tasted so good! 🌈",
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600"
    ],
    cookingTime: 35,
    servings: 4,
    difficulty: "Easy",
    category: "Healthy",
    tags: ["healthy", "vegan", "meal-prep", "colorful"],
    likes: 198,
    comments: 19,
    shares: 11,
    bookmarks: 78,
    rating: 4.7,
    createdAt: "2024-01-15T12:10:00Z",
    isLiked: true,
    isBookmarked: true
  },
  {
    id: 5,
    user: communityUsers[4],
    title: "Authentic Chicken Biryani",
    description: "Grandmother's recipe finally perfected! This biryani has been in our family for generations. The secret is in the layering and the perfect blend of spices. Each grain of rice is infused with flavor. 🍛",
    images: [
      "https://ministryofcurry.com/wp-content/uploads/2024/06/chicken-biryani.jpg",
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600"
    ],
    cookingTime: 90,
    servings: 6,
    difficulty: "Hard",
    category: "Main Course",
    tags: ["indian", "spicy", "traditional", "family-recipe"],
    likes: 267,
    comments: 41,
    shares: 18,
    bookmarks: 92,
    rating: 4.9,
    createdAt: "2024-01-15T10:30:00Z",
    isLiked: false,
    isBookmarked: false
  }
];

export const communityComments = [
  {
    id: 1,
    postId: 1,
    user: communityUsers[1],
    content: "This looks absolutely divine! Can't wait to try it for my anniversary dinner. Thanks for the sea salt tip! 💕",
    likes: 12,
    createdAt: "2024-01-15T19:15:00Z",
    replies: [
      {
        id: 11,
        user: communityUsers[0],
        content: "You're so welcome! Let me know how it turns out! 😊",
        likes: 5,
        createdAt: "2024-01-15T19:30:00Z"
      }
    ]
  },
  {
    id: 2,
    postId: 2,
    user: communityUsers[3],
    content: "Perfect for busy weeknights! I added some spinach for extra nutrition. My kids didn't even notice! 🥬",
    likes: 8,
    createdAt: "2024-01-15T17:20:00Z",
    replies: []
  }
];

export const trendingRecipes = [
  {
    id: 1,
    title: "Viral TikTok Pasta",
    image: "https://s.lightorangebean.com/media/20240914160809/Spicy-Penne-Pasta_-done.png.webp",
    views: 125000,
    trend: "+45%"
  },
  {
    id: 2,
    title: "Cloud Bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300",
    views: 89000,
    trend: "+32%"
  },
  {
    id: 3,
    title: "Dalgona Coffee",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300",
    views: 76000,
    trend: "+28%"
  }
];

export const suggestedChefs = [
  {
    id: 6,
    username: "italian_nonna",
    displayName: "Nonna Giuseppe",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
    speciality: "Italian Cuisine",
    followers: 45600,
    totalRecipes: 156,
    isVerified: true
  },
  {
    id: 7,
    username: "sushi_master",
    displayName: "Kenji Tanaka",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150",
    speciality: "Japanese Cuisine",
    followers: 32100,
    totalRecipes: 89,
    isVerified: true
  },
  {
    id: 8,
    username: "french_patissier",
    displayName: "Claire Dubois",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    speciality: "French Pastries",
    followers: 28900,
    totalRecipes: 134,
    isVerified: true
  }
];

export const recipeCategories = [
  { name: "Italian", count: 1250, color: "#e74c3c" },
  { name: "Vegetarian", count: 980, color: "#27ae60" },
  { name: "Dessert", count: 756, color: "#f39c12" },
  { name: "Quick Meals", count: 634, color: "#3498db" },
  { name: "Healthy", count: 589, color: "#2ecc71" },
  { name: "Asian", count: 445, color: "#e67e22" }
];

export const communityStats = {
  totalUsers: 125000,
  totalRecipes: 45600,
  totalLikes: 2300000,
  totalComments: 890000,
  activeToday: 12500
};