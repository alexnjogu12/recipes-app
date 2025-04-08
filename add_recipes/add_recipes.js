const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the recipes database.');
    
    // Add additional recipes
    addAdditionalRecipes();
  }
});

// Function to add more recipes
function addAdditionalRecipes() {
  // First, let's see what recipes are already in the database
  db.all('SELECT id, title, mood_id FROM recipes', (err, existingRecipes) => {
    if (err) {
      console.error('Error fetching existing recipes:', err.message);
      return;
    }
    
    console.log('Existing recipes:');
    existingRecipes.forEach(recipe => {
      console.log(`- ${recipe.title} (Mood ID: ${recipe.mood_id})`);
    });
    
    const additionalRecipes = [
      // Happy Mood (id: 1)
      {
        title: 'Rainbow Fruit Salad',
        ingredients: 'Strawberries, oranges, pineapple, kiwi, blueberries, grapes, honey, mint',
        instructions: '1. Wash and chop all fruits. 2. Combine in a large bowl. 3. Drizzle with honey. 4. Garnish with mint leaves.',
        mood_id: 1,
        image_url: 'https://images.unsplash.com/photo-1564093497595-593b96d80180?ixlib=rb-4.0.3'
      },
      {
        title: 'Confetti Birthday Pancakes',
        ingredients: 'Flour, milk, eggs, sugar, baking powder, vanilla extract, rainbow sprinkles, butter, maple syrup',
        instructions: '1. Mix dry ingredients. 2. Add wet ingredients and fold in sprinkles. 3. Cook on a hot griddle. 4. Serve with butter and maple syrup.',
        mood_id: 1,
        image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3'
      },
      
      // Sad Mood (id: 2)
      {
        title: 'Warm Chocolate Pudding',
        ingredients: 'Milk, sugar, cocoa powder, cornstarch, vanilla extract, butter, salt, chocolate chips',
        instructions: '1. Mix sugar, cocoa, cornstarch, and salt. 2. Add milk and heat until thickened. 3. Remove from heat and stir in butter, vanilla, and chocolate chips. 4. Serve warm.',
        mood_id: 2,
        image_url: 'https://images.unsplash.com/photo-1551529634-126ba3ccb0be?ixlib=rb-4.0.3'
      },
      {
        title: 'Creamy Tomato Soup with Grilled Cheese',
        ingredients: 'Canned tomatoes, onion, garlic, vegetable broth, heavy cream, butter, bread, cheddar cheese',
        instructions: '1. Sauté onion and garlic. 2. Add tomatoes and broth, simmer. 3. Blend and add cream. 4. Serve with grilled cheese sandwich.',
        mood_id: 2,
        image_url: 'https://images.unsplash.com/photo-1602849479162-143fc1966fec?ixlib=rb-4.0.3'
      },
      
      // Energetic Mood (id: 3)
      {
        title: 'Protein Power Smoothie',
        ingredients: 'Greek yogurt, banana, strawberries, protein powder, spinach, almond milk, chia seeds',
        instructions: '1. Combine all ingredients in a blender. 2. Blend until smooth. 3. Add ice if desired. 4. Pour into glass and top with chia seeds.',
        mood_id: 3,
        image_url: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?ixlib=rb-4.0.3'
      },
      {
        title: 'Sweet Potato Energy Bowls',
        ingredients: 'Sweet potatoes, quinoa, black beans, avocado, kale, lime, olive oil, cumin, chili powder',
        instructions: '1. Roast sweet potatoes with spices. 2. Cook quinoa. 3. Sauté kale. 4. Assemble bowl with all ingredients and top with avocado.',
        mood_id: 3,
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3'
      },
      
      // Tired Mood (id: 4)
      {
        title: 'One-Pot Pasta',
        ingredients: 'Pasta, cherry tomatoes, basil, garlic, olive oil, parmesan cheese, water, salt, pepper',
        instructions: '1. Place all ingredients except cheese in pot. 2. Bring to boil and cook until pasta is done. 3. Stir occasionally. 4. Top with parmesan cheese.',
        mood_id: 4,
        image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3'
      },
      {
        title: 'Microwave Baked Potato',
        ingredients: 'Russet potato, olive oil, salt, cheese, sour cream, chives, bacon bits',
        instructions: '1. Pierce potato with fork. 2. Rub with oil and salt. 3. Microwave 5 minutes, turn over, microwave 5 more minutes. 4. Top with desired toppings.',
        mood_id: 4,
        image_url: 'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?ixlib=rb-4.0.3'
      },
      
      // Stressed Mood (id: 5)
      {
        title: 'Lavender Shortbread Cookies',
        ingredients: 'Butter, sugar, flour, dried culinary lavender, vanilla extract, salt',
        instructions: '1. Cream butter and sugar. 2. Add vanilla and lavender. 3. Mix in dry ingredients. 4. Roll, cut, and bake at 325°F for 12-15 minutes.',
        mood_id: 5,
        image_url: 'https://images.unsplash.com/photo-1614145121029-83a9f7b68bf4?ixlib=rb-4.0.3'
      },
      {
        title: 'Calming Herbal Tea Blend',
        ingredients: 'Chamomile flowers, lavender buds, lemon balm, honey, lemon',
        instructions: '1. Combine herbs in a tea infuser. 2. Pour hot water over herbs. 3. Steep for 5 minutes. 4. Add honey and lemon to taste.',
        mood_id: 5,
        image_url: 'https://images.unsplash.com/photo-1592839843380-19a15e336d2e?ixlib=rb-4.0.3'
      },
      
      // Relaxed Mood (id: 6)
      {
        title: 'Cucumber Mint Infused Water',
        ingredients: 'Cucumber, fresh mint leaves, lemon, water, ice',
        instructions: '1. Slice cucumber and lemon. 2. Tear mint leaves. 3. Combine all ingredients in a pitcher. 4. Refrigerate for at least 1 hour before serving.',
        mood_id: 6,
        image_url: 'https://images.unsplash.com/photo-1545146065-09ce6fab9ca0?ixlib=rb-4.0.3'
      },
      {
        title: 'Easy Mediterranean Platter',
        ingredients: 'Hummus, pita bread, cucumber, cherry tomatoes, olives, feta cheese, olive oil',
        instructions: '1. Arrange hummus in center of platter. 2. Slice pita, cucumber, and tomatoes. 3. Arrange all ingredients around hummus. 4. Drizzle with olive oil.',
        mood_id: 6,
        image_url: 'https://images.unsplash.com/photo-1542345849-a13a5bb42a3f?ixlib=rb-4.0.3'
      }
    ];

    // Insert recipes sequentially using a recursive function
    function insertRecipe(index) {
      if (index >= additionalRecipes.length) {
        console.log('All additional recipes inserted successfully!');
        db.close();
        return;
      }
      
      const recipe = additionalRecipes[index];
      
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