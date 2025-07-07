export const mockRecipes = [
  {
    id: 1,
    title: "Chocolate Lava Cake",
    description:
      "Rich molten chocolate cake with a gooey center that flows like lava when cut. This indulgent dessert is perfect for special occasions and will impress your guests with its restaurant-quality presentation.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    cookingTime: 45,
    servings: 4,
    difficulty: "Medium",
    category: "Dessert",
    foodType: "Dinner",
    rating: 4.9,
    totalRatings: 234,
    tags: ["chocolate", "dessert", "sweet", "cake", "indulgent", "party"],

    commentCount: 15, 
    topRate: 1146.6, // rating * totalRatings
    popularityScore: 1161.6, // topRate + commentCount
    recipeaward: "TOP_RATED", // Scenario in real production application - Admin-selected award: 'TOP_RATED', 'POPULAR', or empty

    ingredients: [
      "dark chocolate",
      "unsalted butter",
      "large eggs",
      "egg yolks",
      "caster sugar",
      "plain flour",
      "butter for greasing",
      "cocoa powder",
    ],

    detailedIngredients: [
      {
        item: "200g dark chocolate (70% cocoa)",
        amount: "200g",
        name: "dark chocolate",
      },
      { item: "200g unsalted butter", amount: "200g", name: "unsalted butter" },
      { item: "4 large eggs", amount: "4", name: "large eggs" },
      { item: "4 egg yolks", amount: "4", name: "egg yolks" },
      { item: "100g caster sugar", amount: "100g", name: "caster sugar" },
      { item: "60g plain flour", amount: "60g", name: "plain flour" },
      {
        item: "Butter for greasing",
        amount: "as needed",
        name: "butter for greasing",
      },
      {
        item: "Cocoa powder for dusting",
        amount: "as needed",
        name: "cocoa powder",
      },
    ],

    instructions: [
      {
        step: 1,
        title: "Prepare the ramekins",
        description:
          "Preheat oven to 200°C. Butter 4 ramekins and dust with cocoa powder, tapping out excess. Place on a baking tray.",
        time: "5 minutes",
      },
      {
        step: 2,
        title: "Melt chocolate and butter",
        description:
          "Break chocolate into pieces and melt with butter in a double boiler or microwave, stirring until smooth. Set aside to cool slightly.",
        time: "8 minutes",
      },
      {
        step: 3,
        title: "Prepare the batter",
        description:
          "Whisk whole eggs, egg yolks and sugar until thick and pale. Fold in melted chocolate mixture, then sift in flour and fold gently.",
        time: "10 minutes",
      },
      {
        step: 4,
        title: "Bake the cakes",
        description:
          "Divide mixture between ramekins. Bake for 12-14 minutes until edges are firm but centers still wobble slightly. Rest for 1 minute.",
        time: "15 minutes",
      },
      {
        step: 5,
        title: "Serve immediately",
        description:
          "Run a knife around edges and turn out onto plates. Dust with icing sugar and serve with vanilla ice cream or berries.",
        time: "2 minutes",
      },
    ],

    nutrition: {
      kcal: 520,
      fat: "28g",
      saturates: "17g",
      carbs: "65g",
      sugars: "58g",
      fibre: "4g",
      protein: "8g",
      salt: "0.2g",
    },

    author: {
      id: "chef-maria-rodriguez",
      name: "Chef Maria Rodriguez",
      avatar:
        "https://ui-avatars.com/api/?name=Chef+Maria&background=00bf63&color=fff",
      bio: "Professional pastry chef with 15 years of experience in fine dining restaurants",
      location: "Barcelona, Spain",
      joinDate: "2020-03-15T00:00:00Z",
      totalRecipes: 45,
      followers: 1250,
      following: 320,
    },

    comments: [
      {
        id: 1,
        username: "ChocolateLover",
        avatar:
          "https://ui-avatars.com/api/?name=Chocolate+Lover&background=random",
        comment:
          "Absolutely divine! The center was perfectly molten and the flavor was incredible.",
        rating: 5,
        timestamp: "2025-06-10T14:30:00Z",
      },
      {
        id: 2,
        username: "DessertQueen",
        avatar:
          "https://ui-avatars.com/api/?name=Dessert+Queen&background=random",
        comment:
          "Made this for my anniversary dinner. My partner was blown away!",
        rating: 5,
        timestamp: "2025-06-09T19:45:00Z",
      },
    ],

    relatedRecipes: [2, 7, 8],
    createdAt: "2025-06-01T10:00:00Z",
    updatedAt: "2025-06-10T15:30:00Z",
  },

  {
    id: 2,
    title: "Spaghetti Carbonara",
    description:
      "Classic Italian pasta with eggs, cheese, and pancetta. This authentic Roman recipe creates a creamy sauce without cream, using only eggs, cheese, and pasta water for the perfect silky texture.",
    image:
      "https://stinkingood.com/wp-content/uploads/2022/01/iStock-178702421-768x681.jpg",
    cookingTime: 20,
    servings: 2,
    difficulty: "Easy",
    category: "Dinner",
    foodType: "Dinner",
    rating: 4.8,
    totalRatings: 189,
    tags: ["pasta", "italian", "creamy", "quick", "comfort-food", "classic"],

    commentCount: 8,
    topRate: 907.2,
    popularityScore: 915.2,
    recipeaward: "POPULAR", 

    ingredients: [
      "spaghetti",
      "pancetta",
      "large eggs",
      "egg yolk",
      "Pecorino Romano",
      "Parmesan",
      "black pepper",
      "sea salt",
    ],

    detailedIngredients: [
      { item: "200g spaghetti", amount: "200g", name: "spaghetti" },
      {
        item: "100g pancetta or guanciale, diced",
        amount: "100g",
        name: "pancetta",
      },
      { item: "2 large eggs", amount: "2", name: "large eggs" },
      { item: "1 egg yolk", amount: "1", name: "egg yolk" },
      {
        item: "50g Pecorino Romano, grated",
        amount: "50g",
        name: "Pecorino Romano",
      },
      { item: "25g Parmesan, grated", amount: "25g", name: "Parmesan" },
      {
        item: "Freshly ground black pepper",
        amount: "to taste",
        name: "black pepper",
      },
      { item: "Sea salt", amount: "to taste", name: "sea salt" },
    ],

    instructions: [
      {
        step: 1,
        title: "Cook the pasta",
        description:
          "Bring a large pot of salted water to boil. Add spaghetti and cook according to package directions until al dente. Reserve 1 cup pasta water before draining.",
        time: "10 minutes",
      },
      {
        step: 2,
        title: "Prepare the pancetta",
        description:
          "While pasta cooks, heat a large skillet over medium heat. Add pancetta and cook until crispy and golden, about 5-6 minutes.",
        time: "6 minutes",
      },
      {
        step: 3,
        title: "Make the egg mixture",
        description:
          "In a bowl, whisk together eggs, egg yolk, grated cheeses, and a generous amount of black pepper until well combined.",
        time: "2 minutes",
      },
      {
        step: 4,
        title: "Combine everything",
        description:
          "Add hot drained pasta to the skillet with pancetta. Remove from heat and quickly toss with egg mixture, adding pasta water gradually until creamy.",
        time: "2 minutes",
      },
    ],

    nutrition: {
      kcal: 650,
      fat: "35g",
      saturates: "15g",
      carbs: "55g",
      sugars: "3g",
      fibre: "3g",
      protein: "25g",
      salt: "1.8g",
    },

    author: {
      id: "giuseppe-romano",
      name: "Giuseppe Romano",
      avatar:
        "https://ui-avatars.com/api/?name=Giuseppe+Romano&background=34C759&color=fff",
      bio: "Traditional Italian chef from Rome, specializing in authentic pasta dishes",
      location: "Rome, Italy",
      joinDate: "2019-08-22T00:00:00Z",
      totalRecipes: 38,
      followers: 890,
      following: 245,
    },

    comments: [
      {
        id: 1,
        username: "PastaLover",
        avatar:
          "https://ui-avatars.com/api/?name=Pasta+Lover&background=random",
        comment:
          "Perfect carbonara! The technique for the creamy sauce is spot on.",
        rating: 5,
        timestamp: "2025-06-11T18:20:00Z",
      },
    ],

    relatedRecipes: [3, 4, 11],
    createdAt: "2025-06-02T12:00:00Z",
    updatedAt: "2025-06-11T20:15:00Z",
  },

  {
    id: 3,
    title: "Avocado Toast Supreme",
    description:
      "Nutritious avocado toast with fresh toppings and a perfect balance of flavors. This healthy breakfast option is packed with good fats, fiber, and vitamins to start your day right.",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
    cookingTime: 10,
    servings: 1,
    difficulty: "Easy",
    category: "Breakfast",
    foodType: "Breakfast",
    rating: 4.6,
    totalRatings: 156,
    tags: [
      "healthy",
      "vegan",
      "breakfast",
      "avocado",
      "toast",
      "fresh",
      "quick",
    ],

    commentCount: 12,
    topRate: 717.6,
    popularityScore: 729.6,
    recipeaward: "TOP_RATED", 

    ingredients: [
      "sourdough bread",
      "ripe avocado",
      "lime",
      "tomato",
      "pumpkin seeds",
      "olive oil",
      "sea salt",
      "black pepper",
      "red pepper flakes",
    ],

    detailedIngredients: [
      {
        item: "2 slices sourdough bread",
        amount: "2 slices",
        name: "sourdough bread",
      },
      { item: "1 ripe avocado", amount: "1", name: "ripe avocado" },
      { item: "1/2 lime, juiced", amount: "1/2", name: "lime" },
      { item: "1 small tomato, diced", amount: "1", name: "tomato" },
      { item: "2 tbsp pumpkin seeds", amount: "2 tbsp", name: "pumpkin seeds" },
      { item: "1 tbsp olive oil", amount: "1 tbsp", name: "olive oil" },
      { item: "Sea salt flakes", amount: "to taste", name: "sea salt" },
      { item: "Black pepper", amount: "to taste", name: "black pepper" },
      { item: "Red pepper flakes", amount: "pinch", name: "red pepper flakes" },
    ],

    instructions: [
      {
        step: 1,
        title: "Toast the bread",
        description:
          "Toast sourdough slices until golden brown and crispy on the outside but still soft inside.",
        time: "3 minutes",
      },
      {
        step: 2,
        title: "Prepare the avocado",
        description:
          "Mash avocado in a bowl with lime juice, salt, and pepper until smooth but still slightly chunky.",
        time: "2 minutes",
      },
      {
        step: 3,
        title: "Assemble the toast",
        description:
          "Spread avocado mixture generously on toast. Top with diced tomatoes, pumpkin seeds, and a drizzle of olive oil.",
        time: "3 minutes",
      },
      {
        step: 4,
        title: "Final touches",
        description:
          "Season with sea salt flakes, black pepper, and red pepper flakes. Serve immediately while toast is still warm.",
        time: "2 minutes",
      },
    ],

    nutrition: {
      kcal: 320,
      fat: "18g",
      saturates: "3g",
      carbs: "35g",
      sugars: "6g",
      fibre: "12g",
      protein: "12g",
      salt: "0.8g",
    },

    author: {
      name: "Sarah Green",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Green&background=4ECDC4&color=fff",
      bio: "Nutritionist and healthy eating advocate, specializing in plant-based recipes",
    },

    comments: [
      {
        id: 1,
        username: "HealthyEater",
        avatar:
          "https://ui-avatars.com/api/?name=Healthy+Eater&background=random",
        comment:
          "Love this combination! The pumpkin seeds add such a nice crunch.",
        rating: 5,
        timestamp: "2025-06-12T08:15:00Z",
      },
    ],

    relatedRecipes: [5, 10, 12],
    createdAt: "2025-06-03T08:30:00Z",
    updatedAt: "2025-06-12T09:00:00Z",
  },

  {
    id: 4,
    title: "Thai Green Curry",
    description:
      "Authentic Thai green curry with coconut milk, fresh vegetables, and aromatic herbs. This fragrant and spicy dish brings the flavors of Thailand to your kitchen with its perfect balance of heat and creaminess.",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400",
    cookingTime: 35,
    servings: 4,
    difficulty: "Medium",
    category: "Dinner",
    foodType: "Dinner",
    rating: 4.7,
    totalRatings: 198,
    tags: [
      "thai",
      "spicy",
      "curry",
      "coconut",
      "vegetables",
      "asian",
      "aromatic",
    ],

    commentCount: 6,
    topRate: 930.6,
    popularityScore: 936.6,
    recipeaward: "POPULAR",

    ingredients: [
      "coconut milk",
      "green curry paste",
      "chicken thigh",
      "eggplant",
      "green beans",
      "red bell pepper",
      "kaffir lime leaves",
      "fish sauce",
      "palm sugar",
      "Thai basil",
      "red chili",
    ],

    detailedIngredients: [
      { item: "400ml coconut milk", amount: "400ml", name: "coconut milk" },
      {
        item: "3 tbsp green curry paste",
        amount: "3 tbsp",
        name: "green curry paste",
      },
      {
        item: "500g chicken thigh, sliced",
        amount: "500g",
        name: "chicken thigh",
      },
      { item: "1 eggplant, cubed", amount: "1", name: "eggplant" },
      {
        item: "100g green beans, trimmed",
        amount: "100g",
        name: "green beans",
      },
      {
        item: "1 red bell pepper, sliced",
        amount: "1",
        name: "red bell pepper",
      },
      { item: "3 kaffir lime leaves", amount: "3", name: "kaffir lime leaves" },
      { item: "2 tbsp fish sauce", amount: "2 tbsp", name: "fish sauce" },
      { item: "1 tbsp palm sugar", amount: "1 tbsp", name: "palm sugar" },
      { item: "Thai basil leaves", amount: "handful", name: "Thai basil" },
      { item: "1 red chili, sliced", amount: "1", name: "red chili" },
    ],

    instructions: [
      {
        step: 1,
        title: "Prepare the curry base",
        description:
          "Heat 2 tbsp of thick coconut cream in a wok over medium heat. Add curry paste and fry for 2-3 minutes until fragrant.",
        time: "5 minutes",
      },
      {
        step: 2,
        title: "Cook the chicken",
        description:
          "Add chicken pieces and cook for 5-6 minutes until they change color and are nearly cooked through.",
        time: "6 minutes",
      },
      {
        step: 3,
        title: "Add vegetables",
        description:
          "Pour in remaining coconut milk, add eggplant, green beans, and bell pepper. Simmer for 10-12 minutes until vegetables are tender.",
        time: "12 minutes",
      },
      {
        step: 4,
        title: "Season and finish",
        description:
          "Add lime leaves, fish sauce, and palm sugar. Taste and adjust seasoning. Garnish with Thai basil and sliced chili before serving.",
        time: "5 minutes",
      },
    ],

    nutrition: {
      kcal: 420,
      fat: "22g",
      saturates: "18g",
      carbs: "25g",
      sugars: "20g",
      fibre: "6g",
      protein: "28g",
      salt: "2.1g",
    },

    author: {
      name: "Siriporn Thai",
      avatar:
        "https://ui-avatars.com/api/?name=Siriporn+Thai&background=FF6B6B&color=fff",
      bio: "Thai cooking instructor with 20 years of experience in traditional Thai cuisine",
    },

    comments: [
      {
        id: 1,
        username: "SpiceLover",
        avatar:
          "https://ui-avatars.com/api/?name=Spice+Lover&background=random",
        comment: "Authentic flavors! Reminds me of my trip to Bangkok.",
        rating: 5,
        timestamp: "2025-06-11T19:30:00Z",
      },
    ],

    relatedRecipes: [6, 11, 2],
    createdAt: "2025-06-04T14:20:00Z",
    updatedAt: "2025-06-11T21:00:00Z",
  },

  {
    id: 5,
    title: "Mediterranean Quinoa Salad",
    description:
      "Fresh Mediterranean salad with quinoa, vegetables, and herbs. This protein-rich salad is perfect for lunch or as a side dish, packed with Mediterranean flavors and healthy ingredients.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    cookingTime: 25,
    servings: 3,
    difficulty: "Easy",
    category: "Lunch",
    foodType: "Lunch",
    rating: 4.5,
    totalRatings: 142,
    tags: [
      "healthy",
      "mediterranean",
      "quinoa",
      "salad",
      "vegetarian",
      "protein-rich",
    ],

    commentCount: 9,
    topRate: 639.0,
    popularityScore: 648.0,
    recipeaward: "TOP_RATED", 

    ingredients: [
      "quinoa",
      "cucumber",
      "cherry tomatoes",
      "Kalamata olives",
      "feta cheese",
      "red onion",
      "olive oil",
      "lemon juice",
      "fresh parsley",
      "fresh mint",
    ],

    detailedIngredients: [
      { item: "200g quinoa", amount: "200g", name: "quinoa" },
      { item: "1 cucumber, diced", amount: "1", name: "cucumber" },
      {
        item: "200g cherry tomatoes, halved",
        amount: "200g",
        name: "cherry tomatoes",
      },
      {
        item: "100g Kalamata olives, pitted",
        amount: "100g",
        name: "Kalamata olives",
      },
      {
        item: "150g feta cheese, crumbled",
        amount: "150g",
        name: "feta cheese",
      },
      {
        item: "1/2 red onion, finely sliced",
        amount: "1/2",
        name: "red onion",
      },
      { item: "3 tbsp olive oil", amount: "3 tbsp", name: "olive oil" },
      { item: "2 tbsp lemon juice", amount: "2 tbsp", name: "lemon juice" },
      {
        item: "2 tbsp fresh parsley, chopped",
        amount: "2 tbsp",
        name: "fresh parsley",
      },
      {
        item: "1 tbsp fresh mint, chopped",
        amount: "1 tbsp",
        name: "fresh mint",
      },
    ],

    instructions: [
      {
        step: 1,
        title: "Cook the quinoa",
        description:
          "Rinse quinoa under cold water. Bring 400ml water to boil, add quinoa, reduce heat and simmer covered for 15 minutes until tender.",
        time: "18 minutes",
      },
      {
        step: 2,
        title: "Prepare vegetables",
        description:
          "While quinoa cooks, dice cucumber, halve tomatoes, slice red onion, and chop herbs. Crumble feta cheese.",
        time: "5 minutes",
      },
      {
        step: 3,
        title: "Make dressing",
        description:
          "Whisk together olive oil, lemon juice, salt, and pepper in a small bowl until well combined.",
        time: "2 minutes",
      },
      {
        step: 4,
        title: "Assemble salad",
        description:
          "Fluff cooled quinoa with a fork. Add all vegetables, herbs, and feta. Drizzle with dressing and toss gently to combine.",
        time: "5 minutes",
      },
    ],

    nutrition: {
      kcal: 380,
      fat: "16g",
      saturates: "6g",
      carbs: "45g",
      sugars: "8g",
      fibre: "6g",
      protein: "15g",
      salt: "1.2g",
    },

    author: {
      name: "Elena Kostas",
      avatar:
        "https://ui-avatars.com/api/?name=Elena+Kostas&background=9B59B6&color=fff",
      bio: "Greek chef specializing in healthy Mediterranean cuisine and traditional recipes",
    },

    comments: [
      {
        id: 1,
        username: "MediterraneanFan",
        avatar: "https://ui-avatars.com/api/?name=Med+Fan&background=random",
        comment: "So fresh and flavorful! Perfect for summer lunches.",
        rating: 5,
        timestamp: "2025-06-10T13:45:00Z",
      },
    ],

    relatedRecipes: [3, 10, 12],
    createdAt: "2025-06-05T11:15:00Z",
    updatedAt: "2025-06-10T14:30:00Z",
  },

  {
    id: 6,
    title: "Chicken Wings BBQ",
    description: "Crispy chicken wings with smoky BBQ sauce and spices.",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400",
    cookingTime: 40,
    servings: 4,
    difficulty: "Medium",
    category: "Appetizer",
    foodType: "FingerFood",
    rating: 4.8,
    totalRatings: 167,
    tags: ["chicken", "bbq", "wings", "spicy"],

    commentCount: 11,
    topRate: 801.6,
    popularityScore: 812.6,
    recipeaward: "POPULAR", 

    ingredients: [
      "chicken wings",
      "bbq sauce",
      "honey",
      "garlic powder",
      "paprika",
      "salt",
    ],

    detailedIngredients: [
      { item: "1kg chicken wings", amount: "1kg", name: "chicken wings" },
      { item: "1/2 cup BBQ sauce", amount: "1/2 cup", name: "bbq sauce" },
      { item: "2 tbsp honey", amount: "2 tbsp", name: "honey" },
      { item: "1 tsp garlic powder", amount: "1 tsp", name: "garlic powder" },
      { item: "1 tsp paprika", amount: "1 tsp", name: "paprika" },
      { item: "Salt to taste", amount: "to taste", name: "salt" },
    ],

    instructions: [
      {
        step: 1,
        title: "Prepare wings",
        description:
          "Season chicken wings with spices and marinate for 30 minutes.",
        time: "35 minutes",
      },
    ],

    nutrition: {
      kcal: 380,
      fat: "24g",
      saturates: "7g",
      carbs: "12g",
      sugars: "10g",
      fibre: "1g",
      protein: "32g",
      salt: "1.5g",
    },

    author: {
      name: "Chef Tony Rodriguez",
      avatar:
        "https://ui-avatars.com/api/?name=Tony+Rodriguez&background=F39C12&color=fff",
      bio: "BBQ specialist and wing master",
    },

    comments: [],
    relatedRecipes: [1, 2, 3],
    createdAt: "2025-06-06T16:45:00Z",
    updatedAt: "2025-06-09T21:30:00Z",
  },

  {
    id: 7,
    title: "Korean BBQ Tacos",
    description:
      "Fusion tacos with Korean BBQ beef, kimchi, and spicy mayo. A perfect blend of Korean and Mexican flavors that creates an exciting and delicious meal.",
    image:
      "https://www.vegkit.com/wp-content/uploads/sites/2/2024/07/korean_bbq_taco_1.jpg",
    cookingTime: 30,
    servings: 4,
    difficulty: "Medium",
    category: "Dinner",
    foodType: "FastFood",
    rating: 4.6,
    totalRatings: 134,
    tags: ["korean", "tacos", "fusion", "beef", "spicy", "kimchi"],

    commentCount: 8,
    topRate: 616.4,
    popularityScore: 624.4,
    recipeaward: "", 

    ingredients: [
      "beef bulgogi",
      "corn tortillas",
      "kimchi",
      "spicy mayo",
      "green onions",
      "sesame seeds",
      "cilantro",
    ],

    detailedIngredients: [
      { item: "500g beef bulgogi", amount: "500g", name: "beef bulgogi" },
      { item: "8 corn tortillas", amount: "8", name: "corn tortillas" },
      { item: "1 cup kimchi, chopped", amount: "1 cup", name: "kimchi" },
      { item: "1/4 cup spicy mayo", amount: "1/4 cup", name: "spicy mayo" },
      { item: "2 green onions, sliced", amount: "2", name: "green onions" },
      { item: "1 tbsp sesame seeds", amount: "1 tbsp", name: "sesame seeds" },
      { item: "Fresh cilantro", amount: "handful", name: "cilantro" },
    ],

    instructions: [
      {
        step: 1,
        title: "Cook the beef",
        description:
          "Heat a large skillet over high heat. Cook bulgogi beef for 3-4 minutes until caramelized and cooked through.",
        time: "5 minutes",
      },
      {
        step: 2,
        title: "Warm tortillas",
        description:
          "Warm corn tortillas in a dry skillet or directly over gas flame until slightly charred and pliable.",
        time: "3 minutes",
      },
      {
        step: 3,
        title: "Assemble tacos",
        description:
          "Fill each tortilla with bulgogi beef, top with kimchi, drizzle with spicy mayo, and garnish with green onions and cilantro.",
        time: "5 minutes",
      },
    ],

    nutrition: {
      kcal: 420,
      fat: "18g",
      saturates: "6g",
      carbs: "32g",
      sugars: "8g",
      fibre: "4g",
      protein: "28g",
      salt: "1.8g",
    },

    author: {
      name: "Chef Kim Park",
      avatar:
        "https://ui-avatars.com/api/?name=Kim+Park&background=E74C3C&color=fff",
      bio: "Korean-Mexican fusion specialist",
    },

    comments: [],
    relatedRecipes: [4, 6, 8],
    createdAt: "2025-06-07T12:00:00Z",
    updatedAt: "2025-06-12T15:30:00Z",
  },

  {
    id: 8,
    title: "Classic Caesar Salad",
    description:
      "Traditional Caesar salad with crispy romaine, parmesan, and homemade croutons. A timeless salad that never goes out of style.",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    cookingTime: 15,
    servings: 2,
    difficulty: "Easy",
    category: "Lunch",
    foodType: "Lunch",
    rating: 4.4,
    totalRatings: 89,
    tags: ["salad", "classic", "caesar", "parmesan", "croutons"],

    commentCount: 5,
    topRate: 391.6,
    popularityScore: 396.6,
    recipeaward: "", 

    ingredients: [
      "romaine lettuce",
      "parmesan cheese",
      "bread",
      "caesar dressing",
      "anchovies",
      "garlic",
      "lemon",
    ],

    detailedIngredients: [
      {
        item: "2 heads romaine lettuce",
        amount: "2 heads",
        name: "romaine lettuce",
      },
      {
        item: "1/2 cup parmesan cheese, grated",
        amount: "1/2 cup",
        name: "parmesan cheese",
      },
      { item: "2 slices bread, cubed", amount: "2 slices", name: "bread" },
      {
        item: "1/4 cup caesar dressing",
        amount: "1/4 cup",
        name: "caesar dressing",
      },
      { item: "2 anchovy fillets", amount: "2", name: "anchovies" },
      { item: "1 garlic clove", amount: "1", name: "garlic" },
      { item: "1 lemon, juiced", amount: "1", name: "lemon" },
    ],

    instructions: [
      {
        step: 1,
        title: "Make croutons",
        description:
          "Cube bread and toast in oven at 200°C for 8-10 minutes until golden and crispy.",
        time: "10 minutes",
      },
      {
        step: 2,
        title: "Prepare lettuce",
        description:
          "Wash and chop romaine lettuce into bite-sized pieces. Pat dry thoroughly.",
        time: "3 minutes",
      },
      {
        step: 3,
        title: "Assemble salad",
        description:
          "Toss lettuce with caesar dressing, add croutons and parmesan. Serve immediately.",
        time: "2 minutes",
      },
    ],

    nutrition: {
      kcal: 280,
      fat: "22g",
      saturates: "6g",
      carbs: "12g",
      sugars: "3g",
      fibre: "4g",
      protein: "12g",
      salt: "1.1g",
    },

    author: {
      name: "Chef Marcus Italian",
      avatar:
        "https://ui-avatars.com/api/?name=Marcus+Italian&background=27AE60&color=fff",
      bio: "Italian cuisine expert",
    },

    comments: [],
    relatedRecipes: [5, 3, 9],
    createdAt: "2025-06-08T10:30:00Z",
    updatedAt: "2025-06-11T14:00:00Z",
  },

  {
    id: 9,
    title: "Beef Burger Deluxe",
    description:
      "Juicy beef burger with all the fixings. A classic American burger that satisfies every craving.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    cookingTime: 20,
    servings: 2,
    difficulty: "Easy",
    category: "Dinner",
    foodType: "FastFood",
    rating: 4.7,
    totalRatings: 156,
    tags: ["burger", "beef", "american", "classic", "cheese"],

    commentCount: 12,
    topRate: 733.2,
    popularityScore: 745.2,
    recipeaward: "", 

    ingredients: [
      "ground beef",
      "burger buns",
      "cheese",
      "lettuce",
      "tomato",
      "onion",
      "pickles",
    ],

    detailedIngredients: [
      { item: "400g ground beef", amount: "400g", name: "ground beef" },
      { item: "2 burger buns", amount: "2", name: "burger buns" },
      { item: "2 cheese slices", amount: "2", name: "cheese" },
      { item: "Lettuce leaves", amount: "4 leaves", name: "lettuce" },
      { item: "1 tomato, sliced", amount: "1", name: "tomato" },
      { item: "1/2 onion, sliced", amount: "1/2", name: "onion" },
      { item: "Pickles", amount: "4 slices", name: "pickles" },
    ],

    instructions: [
      {
        step: 1,
        title: "Form patties",
        description:
          "Shape ground beef into 2 patties, season with salt and pepper.",
        time: "3 minutes",
      },
      {
        step: 2,
        title: "Cook patties",
        description:
          "Cook patties in a hot skillet for 4-5 minutes per side until cooked through.",
        time: "10 minutes",
      },
      {
        step: 3,
        title: "Assemble burger",
        description:
          "Toast buns, add patty with cheese, lettuce, tomato, onion, and pickles.",
        time: "5 minutes",
      },
    ],

    nutrition: {
      kcal: 520,
      fat: "28g",
      saturates: "12g",
      carbs: "35g",
      sugars: "6g",
      fibre: "3g",
      protein: "32g",
      salt: "1.8g",
    },

    author: {
      name: "Chef Mike American",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+American&background=3498DB&color=fff",
      bio: "American grill master",
    },

    comments: [],
    relatedRecipes: [6, 7, 10],
    createdAt: "2025-06-09T16:00:00Z",
    updatedAt: "2025-06-12T18:30:00Z",
  },

  {
    id: 10,
    title: "Pancakes with Berries",
    description:
      "Fluffy pancakes topped with fresh berries and maple syrup. Perfect weekend breakfast treat.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    cookingTime: 20,
    servings: 3,
    difficulty: "Easy",
    category: "Breakfast",
    foodType: "Breakfast",
    rating: 4.8,
    totalRatings: 203,
    tags: ["pancakes", "breakfast", "berries", "sweet", "fluffy"],

    commentCount: 15,
    topRate: 974.4,
    popularityScore: 989.4,
    recipeaward: "", 

    ingredients: [
      "flour",
      "eggs",
      "milk",
      "sugar",
      "baking powder",
      "mixed berries",
      "maple syrup",
    ],

    detailedIngredients: [
      { item: "200g plain flour", amount: "200g", name: "flour" },
      { item: "2 large eggs", amount: "2", name: "eggs" },
      { item: "300ml milk", amount: "300ml", name: "milk" },
      { item: "2 tbsp sugar", amount: "2 tbsp", name: "sugar" },
      { item: "2 tsp baking powder", amount: "2 tsp", name: "baking powder" },
      { item: "150g mixed berries", amount: "150g", name: "mixed berries" },
      { item: "Maple syrup", amount: "to taste", name: "maple syrup" },
    ],

    instructions: [
      {
        step: 1,
        title: "Make batter",
        description:
          "Whisk together flour, sugar, and baking powder. In another bowl, beat eggs and milk, then combine with dry ingredients.",
        time: "5 minutes",
      },
      {
        step: 2,
        title: "Cook pancakes",
        description:
          "Heat a non-stick pan, pour batter to form pancakes. Cook for 2-3 minutes per side until golden.",
        time: "12 minutes",
      },
      {
        step: 3,
        title: "Serve",
        description:
          "Stack pancakes, top with fresh berries and drizzle with maple syrup.",
        time: "3 minutes",
      },
    ],

    nutrition: {
      kcal: 350,
      fat: "8g",
      saturates: "3g",
      carbs: "58g",
      sugars: "18g",
      fibre: "4g",
      protein: "14g",
      salt: "0.8g",
    },

    author: {
      name: "Chef Sarah Baker",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Baker&background=F39C12&color=fff",
      bio: "Breakfast and baking specialist",
    },

    comments: [],
    relatedRecipes: [3, 11, 12],
    createdAt: "2025-06-10T08:00:00Z",
    updatedAt: "2025-06-12T09:15:00Z",
  },

  {
    id: 11,
    title: "Fish and Chips",
    description:
      "Classic British fish and chips with crispy batter and golden fries. A traditional comfort food favorite.",
    image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400",
    cookingTime: 35,
    servings: 2,
    difficulty: "Medium",
    category: "Dinner",
    foodType: "FastFood",
    rating: 4.5,
    totalRatings: 178,
    tags: ["fish", "chips", "british", "fried", "comfort food"],

    commentCount: 7,
    topRate: 801.0,
    popularityScore: 808.0,
    recipeaward: "", 

    ingredients: [
      "white fish fillets",
      "potatoes",
      "flour",
      "beer",
      "oil",
      "salt",
      "vinegar",
    ],

    detailedIngredients: [
      {
        item: "400g white fish fillets",
        amount: "400g",
        name: "white fish fillets",
      },
      { item: "500g potatoes", amount: "500g", name: "potatoes" },
      { item: "150g plain flour", amount: "150g", name: "flour" },
      { item: "200ml beer", amount: "200ml", name: "beer" },
      { item: "Oil for frying", amount: "for frying", name: "oil" },
      { item: "Salt to taste", amount: "to taste", name: "salt" },
      { item: "Malt vinegar", amount: "for serving", name: "vinegar" },
    ],

    instructions: [
      {
        step: 1,
        title: "Prepare chips",
        description:
          "Cut potatoes into thick chips, soak in water for 30 minutes, then fry until golden.",
        time: "20 minutes",
      },
      {
        step: 2,
        title: "Make batter",
        description:
          "Mix flour with beer to create a smooth batter. Season fish with salt.",
        time: "5 minutes",
      },
      {
        step: 3,
        title: "Fry fish",
        description:
          "Dip fish in batter and fry in hot oil for 4-5 minutes until golden and crispy.",
        time: "8 minutes",
      },
    ],

    nutrition: {
      kcal: 580,
      fat: "28g",
      saturates: "4g",
      carbs: "52g",
      sugars: "3g",
      fibre: "5g",
      protein: "32g",
      salt: "1.5g",
    },

    author: {
      name: "Chef William British",
      avatar:
        "https://ui-avatars.com/api/?name=William+British&background=8E44AD&color=fff",
      bio: "Traditional British cuisine expert",
    },

    comments: [],
    relatedRecipes: [9, 6, 4],
    createdAt: "2025-06-11T17:30:00Z",
    updatedAt: "2025-06-12T19:45:00Z",
  },

  {
    id: 12,
    title: "Greek Yogurt Parfait",
    description:
      "Healthy parfait with Greek yogurt, granola, and fresh fruits. Perfect for a nutritious breakfast or snack.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
    cookingTime: 5,
    servings: 1,
    difficulty: "Easy",
    category: "Breakfast",
    foodType: "Breakfast",
    rating: 4.6,
    totalRatings: 124,
    tags: ["healthy", "yogurt", "granola", "fruits", "quick"],

    commentCount: 8,
    topRate: 570.4,
    popularityScore: 578.4,
    recipeaward: "", 

    ingredients: [
      "Greek yogurt",
      "granola",
      "honey",
      "mixed berries",
      "banana",
      "almonds",
    ],

    detailedIngredients: [
      { item: "200g Greek yogurt", amount: "200g", name: "Greek yogurt" },
      { item: "3 tbsp granola", amount: "3 tbsp", name: "granola" },
      { item: "1 tbsp honey", amount: "1 tbsp", name: "honey" },
      { item: "100g mixed berries", amount: "100g", name: "mixed berries" },
      { item: "1/2 banana, sliced", amount: "1/2", name: "banana" },
      { item: "2 tbsp sliced almonds", amount: "2 tbsp", name: "almonds" },
    ],

    instructions: [
      {
        step: 1,
        title: "Layer ingredients",
        description:
          "In a glass or bowl, layer half the yogurt, then granola, berries, and banana slices.",
        time: "2 minutes",
      },
      {
        step: 2,
        title: "Repeat layers",
        description:
          "Add remaining yogurt, top with more granola, fruits, and almonds.",
        time: "2 minutes",
      },
      {
        step: 3,
        title: "Finish",
        description: "Drizzle with honey and serve immediately.",
        time: "1 minute",
      },
    ],

    nutrition: {
      kcal: 320,
      fat: "12g",
      saturates: "3g",
      carbs: "38g",
      sugars: "28g",
      fibre: "6g",
      protein: "18g",
      salt: "0.2g",
    },

    author: {
      name: "Chef Anna Healthy",
      avatar:
        "https://ui-avatars.com/api/?name=Anna+Healthy&background=1ABC9C&color=fff",
      bio: "Health and wellness nutrition expert",
    },

    comments: [],
    relatedRecipes: [3, 10, 5],
    createdAt: "2025-06-12T07:00:00Z",
    updatedAt: "2025-06-12T08:30:00Z",
  },

  {
    id: 13,
    title: "Chicken Quesadilla",
    description:
      "Crispy quesadilla filled with seasoned chicken and melted cheese. A quick and satisfying Mexican-inspired meal.",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=400",
    cookingTime: 15,
    servings: 2,
    difficulty: "Easy",
    category: "Lunch",
    foodType: "FastFood",
    rating: 4.7,
    totalRatings: 145,
    tags: ["quesadilla", "chicken", "cheese", "mexican", "quick"],

    commentCount: 9,
    topRate: 681.5,
    popularityScore: 690.5,
    recipeaward: "", 

    ingredients: [
      "flour tortillas",
      "cooked chicken",
      "cheese",
      "bell peppers",
      "onion",
      "spices",
    ],

    detailedIngredients: [
      { item: "4 flour tortillas", amount: "4", name: "flour tortillas" },
      {
        item: "200g cooked chicken, shredded",
        amount: "200g",
        name: "cooked chicken",
      },
      { item: "150g cheese, grated", amount: "150g", name: "cheese" },
      { item: "1 bell pepper, diced", amount: "1", name: "bell peppers" },
      { item: "1/2 onion, diced", amount: "1/2", name: "onion" },
      { item: "Mexican spice mix", amount: "1 tsp", name: "spices" },
    ],

    instructions: [
      {
        step: 1,
        title: "Prepare filling",
        description:
          "Mix shredded chicken with spices, diced peppers, and onions.",
        time: "3 minutes",
      },
      {
        step: 2,
        title: "Assemble quesadilla",
        description:
          "Place filling and cheese on one tortilla, top with another tortilla.",
        time: "2 minutes",
      },
      {
        step: 3,
        title: "Cook",
        description:
          "Cook in a hot skillet for 2-3 minutes per side until golden and cheese melts.",
        time: "6 minutes",
      },
    ],

    nutrition: {
      kcal: 450,
      fat: "20g",
      saturates: "10g",
      carbs: "35g",
      sugars: "4g",
      fibre: "3g",
      protein: "28g",
      salt: "1.6g",
    },

    author: {
      name: "Chef Carlos Mexican",
      avatar:
        "https://ui-avatars.com/api/?name=Carlos+Mexican&background=E67E22&color=fff",
      bio: "Mexican cuisine specialist",
    },

    comments: [],
    relatedRecipes: [7, 9, 6],
    createdAt: "2025-06-13T12:30:00Z",
    updatedAt: "2025-06-13T14:00:00Z",
  },

  {
    id: 14,
    title: "Vegetable Stir Fry",
    description:
      "Colorful vegetable stir fry with Asian flavors. A healthy and quick dinner option packed with nutrients.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
    cookingTime: 12,
    servings: 3,
    difficulty: "Easy",
    category: "Dinner",
    foodType: "Dinner",
    rating: 4.4,
    totalRatings: 98,
    tags: ["vegetables", "stir fry", "healthy", "asian", "quick"],

    commentCount: 6,
    topRate: 431.2,
    popularityScore: 437.2,
    recipeaward: "", 

    ingredients: [
      "mixed vegetables",
      "soy sauce",
      "garlic",
      "ginger",
      "sesame oil",
      "rice",
    ],

    detailedIngredients: [
      {
        item: "400g mixed vegetables",
        amount: "400g",
        name: "mixed vegetables",
      },
      { item: "3 tbsp soy sauce", amount: "3 tbsp", name: "soy sauce" },
      { item: "2 garlic cloves, minced", amount: "2", name: "garlic" },
      { item: "1 inch ginger, grated", amount: "1 inch", name: "ginger" },
      { item: "1 tbsp sesame oil", amount: "1 tbsp", name: "sesame oil" },
      { item: "Cooked rice for serving", amount: "for serving", name: "rice" },
    ],

    instructions: [
      {
        step: 1,
        title: "Prepare vegetables",
        description: "Cut all vegetables into uniform pieces for even cooking.",
        time: "3 minutes",
      },
      {
        step: 2,
        title: "Stir fry",
        description:
          "Heat oil in wok, add garlic and ginger, then vegetables. Stir fry for 5-6 minutes.",
        time: "7 minutes",
      },
      {
        step: 3,
        title: "Season and serve",
        description:
          "Add soy sauce and sesame oil, toss well. Serve over rice.",
        time: "2 minutes",
      },
    ],

    nutrition: {
      kcal: 180,
      fat: "6g",
      saturates: "1g",
      carbs: "25g",
      sugars: "12g",
      fibre: "8g",
      protein: "8g",
      salt: "1.2g",
    },

    author: {
      name: "Chef Lin Asian",
      avatar:
        "https://ui-avatars.com/api/?name=Lin+Asian&background=16A085&color=fff",
      bio: "Asian cuisine and healthy cooking expert",
    },

    comments: [],
    relatedRecipes: [4, 5, 8],
    createdAt: "2025-06-14T18:00:00Z",
    updatedAt: "2025-06-14T19:30:00Z",
  },

  {
    id: 15,
    title: "Chocolate Chip Cookies",
    description:
      "Classic homemade chocolate chip cookies that are crispy on the outside and chewy on the inside.",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
    cookingTime: 25,
    servings: 24,
    difficulty: "Easy",
    category: "Dessert",
    foodType: "FingerFood",
    rating: 4.9,
    totalRatings: 267,
    tags: ["cookies", "chocolate", "dessert", "baking", "sweet"],

    commentCount: 18,
    topRate: 1308.3,
    popularityScore: 1326.3,
    recipeaward: "", 

    ingredients: [
      "flour",
      "butter",
      "brown sugar",
      "white sugar",
      "eggs",
      "chocolate chips",
      "vanilla",
    ],

    detailedIngredients: [
      { item: "250g plain flour", amount: "250g", name: "flour" },
      { item: "200g butter, softened", amount: "200g", name: "butter" },
      { item: "150g brown sugar", amount: "150g", name: "brown sugar" },
      { item: "100g white sugar", amount: "100g", name: "white sugar" },
      { item: "2 large eggs", amount: "2", name: "eggs" },
      { item: "200g chocolate chips", amount: "200g", name: "chocolate chips" },
      { item: "1 tsp vanilla extract", amount: "1 tsp", name: "vanilla" },
    ],

    instructions: [
      {
        step: 1,
        title: "Mix wet ingredients",
        description:
          "Cream butter with both sugars, add eggs and vanilla extract.",
        time: "5 minutes",
      },
      {
        step: 2,
        title: "Add dry ingredients",
        description: "Gradually mix in flour, then fold in chocolate chips.",
        time: "3 minutes",
      },
      {
        step: 3,
        title: "Bake",
        description:
          "Drop spoonfuls on baking sheet, bake at 180°C for 10-12 minutes until golden.",
        time: "15 minutes",
      },
    ],

    nutrition: {
      kcal: 180,
      fat: "8g",
      saturates: "5g",
      carbs: "26g",
      sugars: "18g",
      fibre: "1g",
      protein: "3g",
      salt: "0.1g",
    },

    author: {
      name: "Chef Betty Baker",
      avatar:
        "https://ui-avatars.com/api/?name=Betty+Baker&background=D35400&color=fff",
      bio: "Professional baker and dessert specialist",
    },

    comments: [],
    relatedRecipes: [1, 10, 12],
    createdAt: "2025-06-15T14:00:00Z",
    updatedAt: "2025-06-15T16:30:00Z",
  },

  {
    id: 16,
    title: "Chicken Caesar Wrap",
    description:
      "Grilled chicken Caesar salad wrapped in a soft tortilla. Perfect for lunch on the go.",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400",
    cookingTime: 15,
    servings: 2,
    difficulty: "Easy",
    category: "Lunch",
    foodType: "FastFood",
    rating: 4.5,
    totalRatings: 112,
    tags: ["wrap", "chicken", "caesar", "portable", "quick"],

    commentCount: 7,
    topRate: 504.0,
    popularityScore: 511.0,
    recipeaward: "", 

    ingredients: [
      "chicken breast",
      "large tortillas",
      "romaine lettuce",
      "caesar dressing",
      "parmesan cheese",
      "croutons",
    ],

    detailedIngredients: [
      { item: "300g chicken breast", amount: "300g", name: "chicken breast" },
      { item: "2 large tortillas", amount: "2", name: "large tortillas" },
      {
        item: "4 cups romaine lettuce, chopped",
        amount: "4 cups",
        name: "romaine lettuce",
      },
      {
        item: "1/4 cup caesar dressing",
        amount: "1/4 cup",
        name: "caesar dressing",
      },
      {
        item: "1/4 cup parmesan cheese, grated",
        amount: "1/4 cup",
        name: "parmesan cheese",
      },
      {
        item: "1/2 cup croutons, crushed",
        amount: "1/2 cup",
        name: "croutons",
      },
    ],

    instructions: [
      {
        step: 1,
        title: "Cook chicken",
        description:
          "Season and grill chicken breast for 6-7 minutes per side until cooked through. Slice thinly.",
        time: "8 minutes",
      },
      {
        step: 2,
        title: "Prepare salad",
        description:
          "Toss lettuce with caesar dressing, add parmesan and crushed croutons.",
        time: "3 minutes",
      },
      {
        step: 3,
        title: "Assemble wrap",
        description:
          "Place chicken and caesar salad on tortilla, wrap tightly and cut in half.",
        time: "4 minutes",
      },
    ],

    nutrition: {
      kcal: 420,
      fat: "18g",
      saturates: "5g",
      carbs: "32g",
      sugars: "4g",
      fibre: "4g",
      protein: "35g",
      salt: "1.4g",
    },

    author: {
      name: "Chef David Wrap",
      avatar:
        "https://ui-avatars.com/api/?name=David+Wrap&background=2ECC71&color=fff",
      bio: "Quick meal and wrap specialist",
    },

    comments: [],
    relatedRecipes: [8, 13, 9],
    createdAt: "2025-06-16T11:00:00Z",
    updatedAt: "2025-06-16T13:15:00Z",
  },
];

export const FOOD_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "Breakfast", label: "Breakfast" },
  { value: "Lunch", label: "Lunch" },
  { value: "Dinner", label: "Dinner" },
  { value: "Dessert", label: "Dessert" },
  { value: "Appetizer", label: "Appetizer" },
  { value: "FastFood", label: "Fast Food" },
  { value: "FingerFood", label: "Finger Food" },
];


export const getAllTags = () => {
  const allTags = mockRecipes.flatMap((recipe) => recipe.tags);
  return [...new Set(allTags)];
};

export const getRecipesByTag = (tag) => {
  return mockRecipes.filter((recipe) => recipe.tags.includes(tag));
};

export const getRecipesByCategory = (category) => {
  if (category === "all") return mockRecipes;
  return mockRecipes.filter((recipe) => recipe.category === category);
};

export const getRecipeById = (id) => {
  const mockRecipe = mockRecipes.find((recipe) => recipe.id === parseInt(id));
  if (mockRecipe) return mockRecipe;

  const userRecipes = JSON.parse(localStorage.getItem("recipes") || "[]");
  return userRecipes.find((recipe) => recipe.id === parseInt(id));
};

export const getRelatedRecipes = (recipeId, limit = 3) => {
  const recipe = getRecipeById(recipeId);
  if (!recipe || !recipe.relatedRecipes) return [];

  return recipe.relatedRecipes
    .map((id) => getRecipeById(id))
    .filter(Boolean)
    .slice(0, limit);
};

export const getPopularRecipes = (limit = 6) => {
  return [...mockRecipes]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit);
};

export const getTopRatedRecipes = (limit = 6) => {
  return [...mockRecipes].sort((a, b) => b.rating - a.rating).slice(0, limit);
};

export const getRandomRecipes = (limit = 3) => {
  const shuffled = [...mockRecipes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};

export const searchRecipes = (query, category = "all") => {
  let recipesToSearch =
    category === "all" ? mockRecipes : getRecipesByCategory(category);

  if (!query.trim()) return recipesToSearch;

  const searchTerm = query.toLowerCase();
  return recipesToSearch.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm)
      )
  );
};
