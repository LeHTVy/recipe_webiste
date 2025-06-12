// src/data/mockData.js
export const mockRecipes = [
  {
    id: 1,
    title: "Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    rating: 4.9,
    difficulty: "Medium",
    time: "45 min",
    category: "Dessert",
    tags: ["chocolate", "dessert", "sweet", "cake", "indulgent", "party"],
    description: "Rich molten chocolate cake with a gooey center",
    ingredients: ["dark chocolate", "butter", "eggs", "sugar", "flour"],
    cookingTime: 45,
    servings: 4,
    nutritionalInfo: { calories: 520, protein: 8, fat: 28, carbs: 65 }
  },
  {
    id: 2,
    title: "Spaghetti Carbonara",
    image: "https://stinkingood.com/wp-content/uploads/2022/01/iStock-178702421-768x681.jpg",
    rating: 4.8,
    difficulty: "Easy",
    time: "20 min",
    category: "Dinner",
    tags: ["pasta", "italian", "creamy", "quick", "comfort-food", "classic"],
    description: "Classic Italian pasta with eggs, cheese, and pancetta",
    ingredients: ["spaghetti", "eggs", "parmesan", "pancetta", "black pepper"],
    cookingTime: 20,
    servings: 2,
    nutritionalInfo: { calories: 650, protein: 25, fat: 35, carbs: 55 }
  },
  {
    id: 3,
    title: "Avocado Toast Supreme",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
    rating: 4.6,
    difficulty: "Easy",
    time: "10 min",
    category: "Breakfast",
    tags: ["healthy", "vegan", "breakfast", "avocado", "toast", "fresh", "quick"],
    description: "Nutritious avocado toast with fresh toppings",
    ingredients: ["avocado", "sourdough bread", "lime", "tomatoes", "seeds"],
    cookingTime: 10,
    servings: 1,
    nutritionalInfo: { calories: 320, protein: 12, fat: 18, carbs: 35 }
  },
  {
    id: 4,
    title: "Thai Green Curry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400",
    rating: 4.7,
    difficulty: "Medium",
    time: "35 min",
    category: "Dinner",
    tags: ["thai", "spicy", "curry", "coconut", "vegetables", "asian", "aromatic"],
    description: "Authentic Thai green curry with coconut milk",
    ingredients: ["green curry paste", "coconut milk", "chicken", "vegetables"],
    cookingTime: 35,
    servings: 4,
    nutritionalInfo: { calories: 420, protein: 28, fat: 22, carbs: 25 }
  },
  {
    id: 5,
    title: "Mediterranean Quinoa Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    rating: 4.5,
    difficulty: "Easy",
    time: "25 min",
    category: "Lunch",
    tags: ["healthy", "mediterranean", "quinoa", "salad", "vegetarian", "protein-rich"],
    description: "Fresh Mediterranean salad with quinoa and vegetables",
    ingredients: ["quinoa", "cucumber", "tomatoes", "olives", "feta cheese"],
    cookingTime: 25,
    servings: 3,
    nutritionalInfo: { calories: 380, protein: 15, fat: 16, carbs: 45 }
  },
  {
    id: 6,
    title: "Korean BBQ Tacos",
    image: "https://isernio.com/wp-content/uploads/2023/02/2.8.23-18.jpg",
    rating: 4.8,
    difficulty: "Medium",
    time: "40 min",
    category: "Dinner",
    tags: ["korean", "fusion", "tacos", "bbq", "spicy", "street-food", "innovative"],
    description: "Fusion tacos with Korean BBQ flavors",
    ingredients: ["beef bulgogi", "corn tortillas", "kimchi", "cilantro"],
    cookingTime: 40,
    servings: 4,
    nutritionalInfo: { calories: 480, protein: 32, fat: 20, carbs: 38 }
  },
  {
    id: 7,
    title: "Classic French Croissants",
    image: "https://www.thespruceeats.com/thmb/9njpCr_xmbVOg8OBsJ5XRqEYPTg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/french-almond-croissants-recipe-1374853-hero-08-099c4ecc03b449d7a4e9c7ecce427f0c.jpg",
    rating: 4.4,
    difficulty: "Hard",
    time: "4 hours",
    category: "Breakfast",
    tags: ["french", "pastry", "buttery", "flaky", "breakfast", "artisan", "challenging"],
    description: "Traditional French croissants with buttery layers",
    ingredients: ["flour", "butter", "yeast", "milk", "sugar"],
    cookingTime: 240,
    servings: 8,
    nutritionalInfo: { calories: 280, protein: 6, fat: 16, carbs: 28 }
  },
  {
    id: 8,
    title: "Mango Sticky Rice",
    image: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_1220,h_915/tk%2Fphoto%2F2025%2F04-2025%2F2025-03-mango-sticky-rice%2Fmango-sticky-rice-336",
    rating: 4.6,
    difficulty: "Easy",
    time: "30 min",
    category: "Dessert",
    tags: ["thai", "dessert", "mango", "sticky-rice", "coconut", "tropical", "sweet"],
    description: "Traditional Thai dessert with sweet sticky rice",
    ingredients: ["sticky rice", "coconut milk", "mango", "sugar"],
    cookingTime: 30,
    servings: 4,
    nutritionalInfo: { calories: 350, protein: 5, fat: 12, carbs: 58 }
  },
  {
    id: 9,
    title: "Beef Wellington",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    rating: 4.9,
    difficulty: "Hard",
    time: "2 hours",
    category: "Dinner",
    tags: ["beef", "wellington", "pastry", "elegant", "special-occasion", "challenging"],
    description: "Elegant beef tenderloin wrapped in puff pastry",
    ingredients: ["beef tenderloin", "puff pastry", "mushrooms", "prosciutto"],
    cookingTime: 120,
    servings: 6,
    nutritionalInfo: { calories: 720, protein: 45, fat: 38, carbs: 35 }
  },
  {
    id: 10,
    title: "Vegan Buddha Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    rating: 4.5,
    difficulty: "Easy",
    time: "25 min",
    category: "Lunch",
    tags: ["vegan", "healthy", "buddha-bowl", "colorful", "nutritious", "plant-based"],
    description: "Colorful vegan bowl packed with nutrients",
    ingredients: ["quinoa", "chickpeas", "sweet potato", "kale", "tahini"],
    cookingTime: 25,
    servings: 2,
    nutritionalInfo: { calories: 420, protein: 18, fat: 15, carbs: 55 }
  },
  {
    id: 11,
    title: "Japanese Ramen",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    rating: 4.7,
    difficulty: "Medium",
    time: "50 min",
    category: "Dinner",
    tags: ["japanese", "ramen", "noodles", "comfort-food", "umami", "warming"],
    description: "Authentic Japanese ramen with rich broth",
    ingredients: ["ramen noodles", "pork bone broth", "chashu", "green onions"],
    cookingTime: 50,
    servings: 2,
    nutritionalInfo: { calories: 580, protein: 28, fat: 22, carbs: 65 }
  },
  {
    id: 12,
    title: "Mexican Street Corn",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400",
    rating: 4.4,
    difficulty: "Easy",
    time: "15 min",
    category: "Snack",
    tags: ["mexican", "street-food", "corn", "spicy", "tangy", "quick", "grilled"],
    description: "Grilled corn with Mexican spices and lime",
    ingredients: ["corn", "mayo", "cotija cheese", "chili powder", "lime"],
    cookingTime: 15,
    servings: 4,
    nutritionalInfo: { calories: 180, protein: 6, fat: 8, carbs: 25 }
  }
];

// Extract all unique tags for the carousel
export const getAllTags = () => {
  const allTags = mockRecipes.flatMap(recipe => recipe.tags);
  return [...new Set(allTags)];
};

// Get recipes by tag
export const getRecipesByTag = (tag) => {
  return mockRecipes.filter(recipe => recipe.tags.includes(tag));
};
