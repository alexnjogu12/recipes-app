const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the recipes database.');
    
    // List all moods and recipes
    listAllRecipesCounted();
  }
});

// Simpler function to list recipes by mood with counts
function listAllRecipesCounted() {
  console.log('===== RECIPES BY MOOD =====');
  
  // First get all moods
  db.all('SELECT * FROM moods ORDER BY id', (err, moods) => {
    if (err) {
      console.error('Error fetching moods:', err.message);
      db.close();
      return;
    }
    
    // Then get all recipes
    db.all('SELECT * FROM recipes ORDER BY mood_id, id', (err, recipes) => {
      if (err) {
        console.error('Error fetching recipes:', err.message);
        db.close();
        return;
      }
      
      // Group recipes by mood
      const recipesByMood = {};
      recipes.forEach(recipe => {
        if (!recipesByMood[recipe.mood_id]) {
          recipesByMood[recipe.mood_id] = [];
        }
        recipesByMood[recipe.mood_id].push(recipe);
      });
      
      // Display recipes by mood
      moods.forEach(mood => {
        const moodRecipes = recipesByMood[mood.id] || [];
        console.log(`\n${mood.name} Mood (${moodRecipes.length} recipes):`);
        
        if (moodRecipes.length === 0) {
          console.log('  No recipes found for this mood.');
        } else {
          moodRecipes.forEach(recipe => {
            console.log(`  - ${recipe.title}`);
          });
        }
      });
      
      // Summary count
      console.log('\nTotal Recipes by Mood:');
      moods.forEach(mood => {
        const count = (recipesByMood[mood.id] || []).length;
        console.log(`  ${mood.name}: ${count} recipes`);
      });
      
      const totalRecipes = recipes.length;
      console.log(`\nTotal Recipes: ${totalRecipes}`);
      
      // Close the database connection
      db.close();
    });
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