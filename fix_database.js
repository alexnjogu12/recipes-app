const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the recipes database.');
    
    // Fix database issues
    fixDatabaseIssues();
  }
});

// Function to fix database issues
function fixDatabaseIssues() {
  // First, let's check for any corrupted entries
  db.all('SELECT id, title, mood_id FROM recipes ORDER BY id', (err, recipes) => {
    if (err) {
      console.error('Error fetching recipes:', err.message);
      db.close();
      return;
    }
    
    console.log(`Found ${recipes.length} total recipes`);
    
    // Step 1: Find and remove corrupted entries (those with corrupted titles)
    const corruptedRecipes = recipes.filter(recipe => {
      return recipe.title.includes('emon Bars') || 
             recipe.title.includes('Infused Water') || 
             recipe.title.includes('otter') ||
             recipe.title.includes('dillad Egg');
    });
    
    if (corruptedRecipes.length > 0) {
      console.log(`Found ${corruptedRecipes.length} corrupted recipe entries to fix:`);
      corruptedRecipes.forEach(recipe => {
        console.log(`  - ID ${recipe.id}: "${recipe.title}" (Mood ID: ${recipe.mood_id})`);
      });
      
      // Delete corrupted entries
      const deletePromises = corruptedRecipes.map(recipe => {
        return new Promise((resolve, reject) => {
          db.run('DELETE FROM recipes WHERE id = ?', [recipe.id], function(err) {
            if (err) {
              console.error(`Error deleting recipe ID ${recipe.id}:`, err.message);
              reject(err);
            } else {
              console.log(`Deleted corrupted recipe ID ${recipe.id}`);
              resolve();
            }
          });
        });
      });
      
      Promise.all(deletePromises)
        .then(() => {
          console.log('All corrupted entries removed.');
          // Add correct recipes for Tired mood
          addCorrectRecipes();
        })
        .catch(err => {
          console.error('Error during deletion process:', err);
          db.close();
        });
    } else {
      console.log('No corrupted entries found.');
      addCorrectRecipes();
    }
  });
}

// Function to add correct recipes for the Tired mood
function addCorrectRecipes() {
  // Check which mood IDs need additional recipes
  db.all('SELECT mood_id, COUNT(*) as count FROM recipes GROUP BY mood_id', (err, moodCounts) => {
    if (err) {
      console.error('Error counting recipes by mood:', err.message);
      db.close();
      return;
    }
    
    console.log('Recipe counts by mood:');
    const moodCountMap = {};
    moodCounts.forEach(mc => {
      moodCountMap[mc.mood_id] = mc.count;
      console.log(`  Mood ID ${mc.mood_id}: ${mc.count} recipes`);
    });
    
    // Define additional recipes to add for underrepresented moods
    const additionalRecipes = [
      // Sad Mood (id: 2)
      {
        title: 'Hearty Beef Stew',
        ingredients: 'Beef chuck, potatoes, carrots, onions, celery, beef broth, tomato paste, bay leaves, thyme, garlic',
        instructions: '1. Brown beef chunks in oil. 2. Add vegetables and sauté briefly. 3. Add broth and seasonings. 4. Simmer until beef is tender and vegetables are cooked.',
        mood_id: 2,
        image_url: 'https://images.unsplash.com/photo-1608835291095-33ee13f2309c?ixlib=rb-4.0.3'
      },
      
      // Tired Mood (id: 4)
      {
        title: 'Easy Chicken Wrap',
        ingredients: 'Rotisserie chicken, tortilla wraps, lettuce, tomato, avocado, ranch dressing',
        instructions: '1. Shred store-bought rotisserie chicken. 2. Warm tortillas in microwave for 10 seconds. 3. Layer ingredients on tortillas. 4. Roll up and enjoy.',
        mood_id: 4,
        image_url: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3'
      },
      {
        title: 'Three-Ingredient Pasta',
        ingredients: 'Pasta, jar of pasta sauce, pre-shredded cheese',
        instructions: '1. Cook pasta according to package directions. 2. Drain and return to pot. 3. Stir in pasta sauce and heat. 4. Top with cheese and serve.',
        mood_id: 4,
        image_url: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-4.0.3'
      }
    ];
    
    // Insert recipes sequentially
    function insertRecipe(index) {
      if (index >= additionalRecipes.length) {
        console.log('All additional recipes inserted successfully!');
        verifyDatabase();
        return;
      }
      
      const recipe = additionalRecipes[index];
      
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
    console.log('Adding new correct recipes...');
    insertRecipe(0);
  });
}

// Final verification of database integrity
function verifyDatabase() {
  db.all('SELECT mood_id, COUNT(*) as count FROM recipes GROUP BY mood_id', (err, moodCounts) => {
    if (err) {
      console.error('Error during final verification:', err.message);
      db.close();
      return;
    }
    
    console.log('\nFinal recipe counts by mood:');
    moodCounts.forEach(mc => {
      console.log(`  Mood ID ${mc.mood_id}: ${mc.count} recipes`);
    });
    
    console.log('\nDatabase repair completed successfully!');
    db.close();
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
