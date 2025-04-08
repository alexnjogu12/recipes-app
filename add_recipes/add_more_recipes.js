const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the recipes database.');
    
    // Add more recipes
    addMoreRecipes();
  }
});

// Function to add more recipes
function addMoreRecipes() {
  // First, let's see what recipes are already in the database
  db.all('SELECT id, title, mood_id FROM recipes', (err, existingRecipes) => {
    if (err) {
      console.error('Error fetching existing recipes:', err.message);
      return;
    }
    
    console.log('Existing recipes count by mood:');
    const moodCounts = {};
    existingRecipes.forEach(recipe => {
      moodCounts[recipe.mood_id] = (moodCounts[recipe.mood_id] || 0) + 1;
    });
    
    for (const [moodId, count] of Object.entries(moodCounts)) {
      console.log(`Mood ID ${moodId}: ${count} recipes`);
    }
    
    const moreRecipes = [
      // Happy Mood (id: 1)
      {
        title: 'Strawberry Shortcake',
        ingredients: 'Flour, sugar, baking powder, salt, butter, milk, vanilla extract, strawberries, whipped cream',
        instructions: '1. Make shortcake biscuits with flour, sugar, baking powder, salt, butter, milk. 2. Slice strawberries and mix with sugar. 3. Bake biscuits until golden. 4. Split biscuits, layer with strawberries and whipped cream.',
        mood_id: 1,
        image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3'
      },
      {
        title: 'Festive Taco Bar',
        ingredients: 'Ground beef, taco seasoning, tortillas, cheese, lettuce, tomatoes, avocado, sour cream, salsa',
        instructions: '1. Brown meat and add taco seasoning. 2. Prepare all toppings in separate bowls. 3. Warm tortillas. 4. Let everyone build their own tacos.',
        mood_id: 1,
        image_url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3'
      },
      
      // Sad Mood (id: 2)
      {
        title: 'Classic Meatloaf',
        ingredients: 'Ground beef, breadcrumbs, onion, eggs, ketchup, Worcestershire sauce, herbs, salt, pepper',
        instructions: '1. Mix all ingredients except ketchup. 2. Form into a loaf shape. 3. Top with ketchup. 4. Bake at 350°F for 1 hour.',
        mood_id: 2,
        image_url: 'https://images.unsplash.com/photo-1588168832635-6d79a5c8a95b?ixlib=rb-4.0.3'
      },
      {
        title: 'Homestyle Chicken and Dumplings',
        ingredients: 'Chicken, celery, carrots, onion, chicken broth, flour, butter, milk, baking powder, herbs',
        instructions: '1. Cook chicken with vegetables in broth. 2. Mix dumpling dough with flour, baking powder, butter, and milk. 3. Drop dumplings on top of simmering stew. 4. Cover and cook until dumplings are fluffy.',
        mood_id: 2,
        image_url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3'
      },
      
      // Energetic Mood (id: 3)
      {
        title: 'Spicy Breakfast Burrito',
        ingredients: 'Eggs, black beans, avocado, bell peppers, onion, cheese, salsa, tortillas, hot sauce',
        instructions: '1. Sauté peppers and onions. 2. Add eggs and scramble. 3. Warm tortillas. 4. Fill with egg mixture, beans, cheese, avocado, and salsa.',
        mood_id: 3,
        image_url: 'https://images.unsplash.com/photo-1584178639036-613ba57e5e60?ixlib=rb-4.0.3'
      },
      {
        title: 'Mediterranean Quinoa Bowl',
        ingredients: 'Quinoa, cucumber, cherry tomatoes, red onion, olives, feta cheese, chickpeas, lemon juice, olive oil, herbs',
        instructions: '1. Cook quinoa according to package. 2. Chop vegetables. 3. Combine all ingredients in a bowl. 4. Dress with lemon juice, olive oil, and herbs.',
        mood_id: 3,
        image_url: 'https://images.unsplash.com/photo-1529566652340-2c41a1eb6d93?ixlib=rb-4.0.3'
      },
      
      // Tired Mood (id: 4)
      {
        title: '5-Minute Microwave Quesadilla',
        ingredients: 'Tortillas, cheese, pre-cooked chicken or beans, salsa',
        instructions: '1. Place tortilla on a plate. 2. Add cheese and pre-cooked protein. 3. Top with second tortilla. 4. Microwave for 1 minute or until cheese melts.',
        mood_id: 4,
        image_url: 'https://images.unsplash.com/photo-1599789197514-47270cd526b4?ixlib=rb-4.0.3'
      },
      {
        title: 'Easy Tuna Melt',
        ingredients: 'Canned tuna, mayonnaise, celery, onion, bread, cheese, butter',
        instructions: '1. Mix tuna with mayo, celery, and onion. 2. Spread on bread. 3. Top with cheese. 4. Toast in a pan with butter until cheese melts.',
        mood_id: 4,
        image_url: 'https://images.unsplash.com/photo-1626078437255-19973f5d4efa?ixlib=rb-4.0.3'
      },
      
      // Stressed Mood (id: 5)
      {
        title: 'Dark Chocolate Covered Strawberries',
        ingredients: 'Strawberries, dark chocolate, white chocolate (optional)',
        instructions: '1. Wash and dry strawberries. 2. Melt dark chocolate. 3. Dip strawberries in chocolate. 4. Optional: drizzle with white chocolate.',
        mood_id: 5,
        image_url: 'https://images.unsplash.com/photo-1563599175592-c58dc214deff?ixlib=rb-4.0.3'
      },
      {
        title: 'Honey Vanilla Chamomile Latte',
        ingredients: 'Chamomile tea, milk, honey, vanilla extract',
        instructions: '1. Brew strong chamomile tea. 2. Heat milk until frothy. 3. Add honey and vanilla to tea. 4. Top with frothed milk.',
        mood_id: 5,
        image_url: 'https://images.unsplash.com/photo-1528552444144-164636f3d890?ixlib=rb-4.0.3'
      },
      
      // Relaxed Mood (id: 6)
      {
        title: 'Avocado Toast with Soft Boiled Egg',
        ingredients: 'Whole grain bread, avocado, eggs, salt, pepper, red pepper flakes, olive oil',
        instructions: '1. Toast bread. 2. Mash avocado and spread on toast. 3. Soft boil eggs for 6 minutes. 4. Top toast with egg, salt, pepper, and a drizzle of olive oil.',
        mood_id: 6,
        image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3'
      },
      {
        title: 'Simple Caprese Salad',
        ingredients: 'Tomatoes, fresh mozzarella, basil leaves, olive oil, balsamic glaze, salt, pepper',
        instructions: '1. Slice tomatoes and mozzarella. 2. Arrange on a plate with basil leaves. 3. Drizzle with olive oil and balsamic glaze. 4. Season with salt and pepper.',
        mood_id: 6,
        image_url: 'https://images.unsplash.com/photo-1608049261624-c9e8aaf802a8?ixlib=rb-4.0.3'
      }
    ];

    // Insert recipes sequentially using a recursive function
    function insertRecipe(index) {
      if (index >= moreRecipes.length) {
        console.log('All additional recipes inserted successfully!');
        db.close();
        return;
      }
      
      const recipe = moreRecipes[index];
      
      // Check if recipe already exists
      const existingRecipe = existingRecipes.find(r => 
        r.title === recipe.title && r.mood_id === recipe.mood_id
      );
      
      if (existingRecipe) {
        console.log(`Recipe already exists: ${recipe.title}`);
        insertRecipe(index + 1);
        return;
      }
      
      db.run(
        'INSERT INTO recipes (title, ingredients, instructions, mood_id, image_url) VALUES (?, ?, ?, ?, ?)',
        [recipe.title, recipe.ingredients, recipe.instructions, recipe.mood_id, recipe.image_url],
        function(err) {
          if (err) {
            console.error(`Error inserting recipe "${recipe.title}":`, err.message);
          } else {
            console.log(`Added recipe: ${recipe.title} (Mood ID: ${recipe.mood_id})`);
          }
          
          // Move to the next recipe
          insertRecipe(index + 1);
        }
      );
    }
    
    // Start inserting recipes
    insertRecipe(0);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}); 