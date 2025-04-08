const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the recipes database.');
    
    // Add Happy mood recipes
    addHappyRecipes();
  }
});

// Function to add Happy mood recipes
function addHappyRecipes() {
  // First, let's see what recipes are already in the database for Happy mood
  db.all('SELECT id, title FROM recipes WHERE mood_id = 1', (err, existingRecipes) => {
    if (err) {
      console.error('Error fetching existing recipes:', err.message);
      return;
    }
    
    console.log('Existing Happy mood recipes:');
    existingRecipes.forEach(recipe => {
      console.log(`- ${recipe.title}`);
    });
    
    const happyRecipes = [
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
      {
        title: 'Colorful Birthday Cake',
        ingredients: 'Cake flour, sugar, butter, eggs, milk, vanilla extract, food coloring, cream cheese, powdered sugar, sprinkles',
        instructions: '1. Make cake batter and divide into bowls. 2. Add different food coloring to each bowl. 3. Layer colored batters and bake. 4. Frost with cream cheese frosting and decorate with sprinkles.',
        mood_id: 1,
        image_url: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?ixlib=rb-4.0.3'
      },
      {
        title: 'Sunny Lemon Bars',
        ingredients: 'Flour, butter, sugar, eggs, lemon juice, lemon zest, powdered sugar',
        instructions: '1. Make shortbread crust with flour, butter, and sugar. 2. Bake until golden. 3. Mix lemon filling with eggs, sugar, lemon juice, and zest. 4. Pour over crust, bake, and dust with powdered sugar.',
        mood_id: 1,
        image_url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3'
      }
    ];

    // Insert recipes sequentially using a recursive function
    function insertRecipe(index) {
      if (index >= happyRecipes.length) {
        console.log('All Happy mood recipes inserted successfully!');
        db.close();
        return;
      }
      
      const recipe = happyRecipes[index];
      
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