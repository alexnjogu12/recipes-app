const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the recipes database.');
    
    // Add Relaxed mood recipes
    addRelaxedRecipes();
  }
});

// Function to add Relaxed mood recipes
function addRelaxedRecipes() {
  // First, let's see what recipes are already in the database for Relaxed mood
  db.all('SELECT id, title FROM recipes WHERE mood_id = 6', (err, existingRecipes) => {
    if (err) {
      console.error('Error fetching existing recipes:', err.message);
      return;
    }
    
    console.log('Existing Relaxed mood recipes:');
    existingRecipes.forEach(recipe => {
      console.log(`- ${recipe.title}`);
    });
    
    const relaxedRecipes = [
      {
        title: 'Cucumber Mint Infused Water',
        ingredients: 'Cucumber, fresh mint leaves, lemon, water, ice',
        instructions: '1. Slice cucumber and lemon. 2. Tear mint leaves. 3. Combine all ingredients in a pitcher. 4. Refrigerate for at least 1 hour before serving.',
        mood_id: 6,
        image_url: 'https://images.unsplash.com/photo-1545146065-09ce6fab9ca0?ixlib=rb-4.0.3'
      },
      {
        title: 'Soothing Lavender Lemon Bars',
        ingredients: 'Flour, butter, sugar, eggs, lemons, lavender, powdered sugar',
        instructions: '1. Make shortbread crust with flour, butter, and sugar. 2. Bake until golden. 3. Mix lemon filling with eggs, sugar, lemon, and lavender. 4. Pour over crust and bake again.',
        mood_id: 6,
        image_url: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?ixlib=rb-4.0.3'
      },
      {
        title: 'Simple Herb Roasted Chicken',
        ingredients: 'Chicken, olive oil, rosemary, thyme, garlic, lemon, salt, pepper',
        instructions: '1. Combine herbs, oil, and garlic. 2. Rub over chicken. 3. Roast at 375°F until done. 4. Let rest before serving.',
        mood_id: 6,
        image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3'
      },
      {
        title: 'Cozy Vegetable Soup',
        ingredients: 'Vegetable broth, carrots, celery, onion, potatoes, peas, herbs, salt, pepper',
        instructions: '1. Sauté onion, carrots, and celery. 2. Add broth and potatoes. 3. Simmer until vegetables are tender. 4. Add peas and herbs at the end.',
        mood_id: 6,
        image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3'
      }
    ];

    // Insert recipes sequentially using a recursive function
    function insertRecipe(index) {
      if (index >= relaxedRecipes.length) {
        console.log('All Relaxed mood recipes inserted successfully!');
        db.close();
        return;
      }
      
      const recipe = relaxedRecipes[index];
      
      // Check if recipe already exists
      const existingRecipe = existingRecipes.find(r => r.title === recipe.title);
      
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