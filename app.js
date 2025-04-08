const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up database connection
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the recipes database.');
    
    // Create tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS moods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      mood_id INTEGER,
      image_url TEXT,
      FOREIGN KEY (mood_id) REFERENCES moods (id)
    )`);
    
    // Check if moods table is empty and populate with initial data if needed
    db.get('SELECT COUNT(*) as count FROM moods', (err, row) => {
      if (err) {
        console.error('Error checking moods table:', err.message);
      } else if (row.count === 0) {
        // Insert initial moods
        const moods = ['Happy', 'Sad', 'Energetic', 'Tired', 'Stressed', 'Relaxed'];
        const moodInsertStmt = db.prepare('INSERT INTO moods (name) VALUES (?)');
        
        moods.forEach(mood => {
          moodInsertStmt.run(mood);
        });
        
        moodInsertStmt.finalize();
        console.log('Initial moods inserted.');
        
        // Insert sample recipes
        insertSampleRecipes();
      }
    });
  }
});

// Function to insert sample recipes
function insertSampleRecipes() {
  const recipes = [
    {
      title: 'Comforting Mac and Cheese',
      ingredients: 'Elbow macaroni, butter, flour, milk, cheddar cheese, salt, pepper, breadcrumbs',
      instructions: '1. Cook macaroni according to package. 2. Make cheese sauce with butter, flour, milk and cheese. 3. Combine and top with breadcrumbs. 4. Bake until golden.',
      mood_id: 2, // Sad
      image_url: 'https://images.unsplash.com/photo-1612152328814-e77a90f8bb29?ixlib=rb-4.0.3'
    },
    {
      title: 'Energizing Acai Bowl',
      ingredients: 'Frozen acai packet, banana, blueberries, almond milk, granola, honey, sliced fruits',
      instructions: '1. Blend acai packet with banana, blueberries and almond milk. 2. Pour into a bowl. 3. Top with granola and fresh fruits. 4. Drizzle with honey.',
      mood_id: 3, // Energetic
      image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3'
    },
    {
      title: 'Celebratory Chocolate Cake',
      ingredients: 'Flour, sugar, cocoa powder, baking powder, eggs, milk, vegetable oil, vanilla extract, chocolate frosting',
      instructions: '1. Mix dry ingredients. 2. Add wet ingredients and mix until smooth. 3. Bake at 350°F for 30 minutes. 4. Cool and frost with chocolate frosting.',
      mood_id: 1, // Happy
      image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3'
    },
    {
      title: 'Simple Chicken Soup',
      ingredients: 'Chicken broth, chicken breast, carrots, celery, onion, garlic, noodles, salt, pepper, herbs',
      instructions: '1. Sauté vegetables. 2. Add broth and chicken. 3. Simmer until chicken is cooked. 4. Add noodles and cook until tender.',
      mood_id: 4, // Tired
      image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3'
    },
    {
      title: 'De-Stress Chamomile Tea Cookies',
      ingredients: 'Flour, butter, sugar, egg, chamomile tea leaves, vanilla extract, salt',
      instructions: '1. Cream butter and sugar. 2. Add egg and vanilla. 3. Mix in dry ingredients and tea leaves. 4. Chill, slice, and bake at 350°F for 10 minutes.',
      mood_id: 5, // Stressed
      image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3'
    },
    {
      title: 'Soothing Lavender Lemon Bars',
      ingredients: 'Flour, butter, sugar, eggs, lemons, lavender, powdered sugar',
      instructions: '1. Make shortbread crust with flour, butter, and sugar. 2. Bake until golden. 3. Mix lemon filling with eggs, sugar, lemon, and lavender. 4. Pour over crust and bake again.',
      mood_id: 6, // Relaxed
      image_url: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?ixlib=rb-4.0.3'
    }
  ];
  
  const recipeInsertStmt = db.prepare('INSERT INTO recipes (title, ingredients, instructions, mood_id, image_url) VALUES (?, ?, ?, ?, ?)');
  
  recipes.forEach(recipe => {
    recipeInsertStmt.run(recipe.title, recipe.ingredients, recipe.instructions, recipe.mood_id, recipe.image_url);
  });
  
  recipeInsertStmt.finalize();
  console.log('Sample recipes inserted.');
}

// Routes
app.get('/', (req, res) => {
  // Get all moods for selection
  db.all('SELECT * FROM moods', (err, moods) => {
    if (err) {
      console.error('Error fetching moods:', err.message);
      return res.status(500).send('Error loading moods');
    }
    
    res.render('index', { moods });
  });
});

// Route to get a recipe based on mood
app.get('/recipe/:moodId', (req, res) => {
  const moodId = req.params.moodId;
  
  // First get the mood name
  db.get('SELECT name FROM moods WHERE id = ?', [moodId], (err, mood) => {
    if (err || !mood) {
      console.error('Error fetching mood:', err ? err.message : 'Mood not found');
      return res.status(404).send('Mood not found');
    }
    
    // Get a random recipe for this mood
    db.all('SELECT * FROM recipes WHERE mood_id = ?', [moodId], (err, recipes) => {
      if (err) {
        console.error('Error fetching recipes:', err.message);
        return res.status(500).send('Error loading recipes');
      }
      
      if (recipes.length === 0) {
        return res.status(404).send('No recipes found for this mood');
      }
      
      // Choose a random recipe
      const randomIndex = Math.floor(Math.random() * recipes.length);
      const recipe = recipes[randomIndex];
      
      res.json({
        mood: mood.name,
        recipe: recipe
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Close the database connection when the app is terminated
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



