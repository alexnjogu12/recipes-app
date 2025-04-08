const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the recipes database.');
    checkRecipes();
  }
});

function checkRecipes() {
  // Get all recipes count by mood
  db.all(`
    SELECT m.id as mood_id, m.name as mood_name, COUNT(r.id) as recipe_count
    FROM moods m
    LEFT JOIN recipes r ON m.id = r.mood_id
    GROUP BY m.id
    ORDER BY m.id
  `, (err, results) => {
    if (err) {
      console.error('Error counting recipes:', err.message);
      db.close();
      return;
    }

    console.log('===== RECIPE COUNTS BY MOOD =====');
    let totalRecipes = 0;
    
    results.forEach(row => {
      console.log(`${row.mood_name} Mood (ID: ${row.mood_id}): ${row.recipe_count} recipes`);
      totalRecipes += row.recipe_count;
    });
    
    console.log(`\nTotal Recipes: ${totalRecipes}`);
    
    // Now list sample recipes for each mood
    db.all(`
      SELECT m.id as mood_id, m.name as mood_name, r.id as recipe_id, r.title
      FROM moods m
      JOIN recipes r ON m.id = r.mood_id
      ORDER BY m.id, r.id
    `, (err, recipes) => {
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
      
      console.log('\n===== SAMPLE RECIPES BY MOOD =====');
      
      // Display a few sample recipes for each mood
      Object.keys(recipesByMood).forEach(moodId => {
        const moodName = recipesByMood[moodId][0].mood_name;
        const moodRecipes = recipesByMood[moodId];
        
        console.log(`\n${moodName} Mood (ID: ${moodId}):`);
        
        moodRecipes.forEach(recipe => {
          console.log(`  - [${recipe.recipe_id}] ${recipe.title}`);
        });
      });
      
      db.close();
    });
  });
}

process.on('SIGINT', () => {
  db.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
}); 