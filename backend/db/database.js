const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'recipes.db');

const db = new sqlite3.Database(dbPath);

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tables if they don't exist
      db.run(`CREATE TABLE IF NOT EXISTS moods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        prep_time INTEGER,
        cook_time INTEGER,
        image_url TEXT,
        mood_id INTEGER,
        FOREIGN KEY (mood_id) REFERENCES moods (id)
      )`, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Check if data already exists
        db.get("SELECT COUNT(*) as count FROM moods", (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          // Only populate if no data exists
          if (row.count === 0) {
            populateDatabase()
              .then(resolve)
              .catch(reject);
          } else {
            resolve();
          }
        });
      });
    });
  });
}

function populateDatabase() {
  return new Promise((resolve, reject) => {
    // Insert moods
    const moods = [
      "Happy", 
      "Sad", 
      "Energetic", 
      "Tired", 
      "Nostalgic", 
      "Adventurous", 
      "Romantic", 
      "Stressed", 
      "Cozy"
    ];

    const moodInsertStmt = db.prepare("INSERT INTO moods (name) VALUES (?)");
    moods.forEach(mood => {
      moodInsertStmt.run(mood);
    });
    moodInsertStmt.finalize();

    // Insert unique recipes for each mood
    const recipes = [
      // Happy Mood Recipes
      {
        mood: "Happy",
        title: "Sunshine Citrus Tart",
        description: "A vibrant, zesty tart that's as bright as your mood",
        ingredients: JSON.stringify([
          "1 pre-made tart shell",
          "4 different citrus fruits (blood orange, grapefruit, lemon, lime)",
          "1 cup mascarpone cheese",
          "1/3 cup honey",
          "1 tsp vanilla extract",
          "Edible flowers for garnish",
          "Mint leaves"
        ]),
        instructions: "1. Whip mascarpone with honey and vanilla until fluffy\n2. Spread into tart shell\n3. Segment citrus fruits and arrange in a colorful pattern\n4. Drizzle with additional honey\n5. Garnish with edible flowers and mint",
        prep_time: 30,
        cook_time: 0,
        image_url: "https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        mood: "Happy",
        title: "Rainbow Confetti Pancakes",
        description: "Start your day with a smile with these colorful, celebratory pancakes",
        ingredients: JSON.stringify([
          "2 cups pancake mix",
          "1 1/2 cups milk",
          "2 eggs",
          "1/4 cup rainbow sprinkles",
          "1 tsp vanilla extract",
          "Whipped cream",
          "Fresh berries",
          "Maple syrup"
        ]),
        instructions: "1. Mix pancake batter according to instructions with milk and eggs\n2. Fold in sprinkles and vanilla\n3. Cook on medium heat until bubbles form, then flip\n4. Stack and top with whipped cream, fresh berries, and maple syrup",
        prep_time: 10,
        cook_time: 15,
        image_url: "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      
      // Sad Mood Recipes
      {
        mood: "Sad",
        title: "Healing Miso Soup with Shiitake & Ginger",
        description: "A comforting, nurturing bowl of warmth when you need gentle care",
        ingredients: JSON.stringify([
          "4 cups dashi stock or vegetable broth",
          "3 tbsp white miso paste",
          "1 cup sliced shiitake mushrooms",
          "1 tbsp freshly grated ginger",
          "2 green onions, thinly sliced",
          "1 package silken tofu, cubed",
          "1 sheet nori, cut into thin strips",
          "1 tsp sesame oil"
        ]),
        instructions: "1. Heat dashi stock until just before boiling\n2. Add mushrooms and ginger, simmer for 5 minutes\n3. Remove a small amount of broth and whisk with miso paste until smooth\n4. Return miso mixture to pot and add tofu\n5. Simmer gently for 2 minutes (do not boil)\n6. Garnish with green onions, nori strips, and a few drops of sesame oil",
        prep_time: 10,
        cook_time: 15,
        image_url: "https://images.unsplash.com/photo-1582284540942-3fae5d537147?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        mood: "Sad",
        title: "Lavender Hot Chocolate Embrace",
        description: "A soothing, aromatic cocoa hug in a mug",
        ingredients: JSON.stringify([
          "2 cups whole milk",
          "1 cup heavy cream",
          "1 tbsp dried culinary lavender",
          "8 oz high-quality dark chocolate, chopped",
          "2 tbsp honey",
          "Pinch of sea salt",
          "Whipped cream (optional)",
          "Dried lavender buds for garnish"
        ]),
        instructions: "1. In a saucepan, heat milk and cream over medium heat\n2. Add lavender, remove from heat and let steep for 10 minutes\n3. Strain out lavender buds\n4. Return mixture to low heat and add chocolate, honey, and salt\n5. Whisk until chocolate is completely melted and mixture is smooth\n6. Pour into mugs and top with whipped cream and a sprinkle of lavender",
        prep_time: 15,
        cook_time: 10,
        image_url: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      
      // Energetic Mood Recipes
      {
        mood: "Energetic",
        title: "Power-Packed Quinoa Bowl with Chili-Lime Dressing",
        description: "A vibrant, nutrient-dense bowl to fuel your energetic day",
        ingredients: JSON.stringify([
          "1 cup quinoa, rinsed",
          "2 cups water or vegetable broth",
          "1 large sweet potato, diced and roasted",
          "1 cup black beans, rinsed and drained",
          "1 avocado, sliced",
          "1/2 cup pickled red cabbage",
          "1/4 cup pumpkin seeds",
          "Handful of fresh cilantro",
          "For dressing: 3 tbsp lime juice, 2 tbsp olive oil, 1 minced garlic clove, 1/2 tsp chili flakes, 1 tsp honey, salt and pepper"
        ]),
        instructions: "1. Cook quinoa in water or broth until fluffy and water is absorbed\n2. Whisk together all dressing ingredients\n3. Assemble bowl with quinoa as the base\n4. Arrange sweet potato, black beans, avocado, and pickled cabbage on top\n5. Drizzle with chili-lime dressing\n6. Sprinkle with pumpkin seeds and cilantro",
        prep_time: 15,
        cook_time: 25,
        image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        mood: "Energetic",
        title: "Firecracker Shrimp Tacos with Mango Salsa",
        description: "Zesty, spicy tacos that pack a punch and wake up your taste buds",
        ingredients: JSON.stringify([
          "1 lb shrimp, peeled and deveined",
          "2 tbsp sriracha",
          "1 tbsp honey",
          "2 tbsp lime juice",
          "2 cloves garlic, minced",
          "1 tsp smoked paprika",
          "8 corn tortillas",
          "For mango salsa: 1 ripe mango (diced), 1/2 red bell pepper (diced), 1/4 red onion (finely chopped), 1 jalapeño (seeded and minced), juice of 1 lime, 1/4 cup cilantro (chopped), salt to taste",
          "Lime wedges and extra cilantro for serving"
        ]),
        instructions: "1. Marinate shrimp in sriracha, honey, lime juice, garlic, and paprika for 15 minutes\n2. Meanwhile, prepare mango salsa by combining all ingredients\n3. Grill or sauté shrimp until pink and cooked through (2-3 minutes per side)\n4. Warm tortillas in a dry skillet\n5. Assemble tacos with shrimp and top with generous spoonfuls of mango salsa\n6. Serve with lime wedges and extra cilantro",
        prep_time: 20,
        cook_time: 10,
        image_url: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      
      // Continue with more unique recipes for other moods...
      // Tired Mood Recipes
      {
        mood: "Tired",
        title: "One-Pot Lemon Pasta with Ricotta and Herbs",
        description: "A simple, comforting pasta that requires minimal effort but delivers maximum satisfaction",
        ingredients: JSON.stringify([
          "8 oz pasta (any shape)",
          "2 1/2 cups vegetable broth",
          "Zest and juice of 1 lemon",
          "2 tbsp olive oil",
          "2 cloves garlic, thinly sliced",
          "1/2 cup ricotta cheese",
          "1/4 cup grated Parmesan",
          "Handful of fresh herbs (basil, parsley, or chives)",
          "Red pepper flakes (optional)",
          "Salt and pepper to taste"
        ]),
        instructions: "1. In a large pot, combine pasta, broth, lemon zest, olive oil, and garlic\n2. Bring to a boil, then reduce heat and simmer, stirring occasionally until pasta is tender and most liquid is absorbed (about 9-12 minutes)\n3. Stir in lemon juice\n4. Dollop spoonfuls of ricotta on top\n5. Sprinkle with Parmesan, herbs, red pepper flakes if using, and season with salt and pepper",
        prep_time: 5,
        cook_time: 15,
        image_url: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      
      // Nostalgic Mood Recipes
      {
        mood: "Nostalgic",
        title: "Grandma's Upgraded PB&J French Toast",
        description: "Childhood favorite transformed into a decadent breakfast treat",
        ingredients: JSON.stringify([
          "8 slices brioche bread",
          "1/2 cup natural peanut butter",
          "1/4 cup homemade berry jam (or high-quality store-bought)",
          "3 eggs",
          "1/2 cup milk",
          "1 tsp vanilla extract",
          "1/4 tsp cinnamon",
          "2 tbsp butter",
          "Fresh berries for serving",
          "Maple syrup",
          "Powdered sugar for dusting"
        ]),
        instructions: "1. Make 4 peanut butter and jelly sandwiches using the brioche slices\n2. In a shallow dish, whisk together eggs, milk, vanilla, and cinnamon\n3. Dip each sandwich into the egg mixture, allowing it to soak for about 30 seconds on each side\n4. Melt butter in a large skillet over medium heat\n5. Cook sandwiches until golden brown and crispy on both sides (about 3 minutes per side)\n6. Cut diagonally and serve with fresh berries, a drizzle of maple syrup, and a dusting of powdered sugar",
        prep_time: 10,
        cook_time: 10,
        image_url: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      
      // Adventurous Mood Recipes
      {
        mood: "Adventurous",
        title: "Moroccan Spiced Lamb Tagine with Preserved Lemon",
        description: "An aromatic journey through North African flavors",
        ingredients: JSON.stringify([
          "1.5 lbs lamb shoulder, cut into 1.5-inch cubes",
          "2 tbsp olive oil",
          "1 large onion, diced",
          "4 cloves garlic, minced",
          "1 tbsp fresh ginger, grated",
          "1 tsp ground cumin",
          "1 tsp ground coriander",
          "1/2 tsp cinnamon",
          "1/2 tsp turmeric",
          "1/4 tsp cayenne pepper",
          "1 preserved lemon, rinsed and chopped",
          "1 cup green olives",
          "2 cups chicken stock",
          "1 can chickpeas, drained",
          "1/4 cup dried apricots, chopped",
          "Fresh cilantro and mint for garnish",
          "Couscous for serving"
        ]),
        instructions: "1. In a large Dutch oven or tagine, heat olive oil over medium-high heat\n2. Season lamb with salt and pepper, then brown on all sides (about 8 minutes), then remove\n3. Add onion to the pot and sauté until softened\n4. Add garlic, ginger, and all spices, cooking until fragrant (about 1 minute)\n5. Return lamb to the pot along with stock, preserved lemon, and apricots\n6. Bring to a simmer, cover, and cook on low for 1.5 hours\n7. Add chickpeas and olives, cook for another 30 minutes until lamb is tender\n8. Serve over couscous, garnished with fresh herbs",
        prep_time: 20,
        cook_time: 120,
        image_url: "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      
      // Romantic Mood Recipes
      {
        mood: "Romantic",
        title: "Saffron Risotto with Seared Scallops & Champagne",
        description: "An elegant, indulgent dish perfect for a romantic evening",
        ingredients: JSON.stringify([
          "1 cup Arborio rice",
          "1/2 cup dry champagne or prosecco",
          "3 1/2 cups hot chicken or vegetable stock",
          "1 shallot, finely diced",
          "2 tbsp butter, divided",
          "2 tbsp olive oil, divided",
          "1/4 tsp saffron threads",
          "1/3 cup grated Parmesan cheese",
          "8 large sea scallops, patted very dry",
          "Zest of 1 lemon",
          "2 tbsp fresh chives, chopped",
          "Salt and white pepper to taste"
        ]),
        instructions: "1. In a saucepan, warm stock and add saffron threads to infuse\n2. In a heavy-bottomed pot, heat 1 tbsp butter and 1 tbsp oil over medium heat\n3. Add shallot and cook until translucent\n4. Add rice and toast for 2 minutes, stirring constantly\n5. Add champagne and simmer until mostly absorbed\n6. Add hot stock one ladle at a time, stirring frequently and waiting until liquid is absorbed before adding more\n7. When rice is creamy and al dente (about 20-25 minutes), stir in Parmesan and 1 tbsp butter\n8. Meanwhile, heat 1 tbsp oil in a skillet until very hot\n9. Season scallops with salt and pepper, then sear 1-2 minutes per side until caramelized\n10. Serve risotto with scallops on top, garnished with lemon zest and chives",
        prep_time: 15,
        cook_time: 35,
        image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      
      // Stressed Mood Recipes
      {
        mood: "Stressed",
        title: "Dark Chocolate Tahini Banana Bread",
        description: "A comforting, stress-relieving treat with mood-boosting ingredients",
        ingredients: JSON.stringify([
          "3 very ripe bananas, mashed",
          "1/3 cup tahini",
          "1/4 cup olive oil",
          "1/2 cup maple syrup",
          "2 eggs",
          "1 tsp vanilla extract",
          "1 3/4 cups whole wheat flour",
          "1/4 cup cocoa powder",
          "1 tsp baking soda",
          "1/2 tsp cinnamon",
          "1/2 tsp salt",
          "3/4 cup dark chocolate chunks",
          "2 tbsp sesame seeds for topping"
        ]),
        instructions: "1. Preheat oven to 350°F (175°C) and line a 9x5 inch loaf pan with parchment paper\n2. In a large bowl, mix mashed bananas, tahini, olive oil, maple syrup, eggs, and vanilla\n3. In another bowl, whisk together flour, cocoa powder, baking soda, cinnamon, and salt\n4. Fold dry ingredients into wet mixture until just combined\n5. Fold in chocolate chunks, being careful not to overmix\n6. Pour batter into prepared pan and sprinkle with sesame seeds\n7. Bake for 55-60 minutes, or until a toothpick inserted comes out mostly clean\n8. Let cool in the pan for 10 minutes before transferring to a wire rack",
        prep_time: 15,
        cook_time: 60,
        image_url: "https://images.unsplash.com/photo-1589366025912-a7f32da05997?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      
      // Cozy Mood Recipes
      {
        mood: "Cozy",
        title: "Chai-Spiced Apple Cider Soup with Grilled Cheese Croutons",
        description: "A warm hug in a bowl, perfect for chilly days and comfort-seeking souls",
        ingredients: JSON.stringify([
          "6 cups vegetable broth",
          "4 apples (mix of sweet and tart), peeled, cored and chopped",
          "1 large sweet potato, peeled and cubed",
          "1 onion, diced",
          "2 carrots, chopped",
          "2 chai tea bags",
          "1 cinnamon stick",
          "4 cloves",
          "1 star anise pod",
          "1/2 tsp freshly grated nutmeg",
          "1 cup coconut milk",
          "1 tbsp maple syrup",
          "For croutons: sourdough bread, sharp cheddar cheese, butter"
        ]),
        instructions: "1. In a large pot, combine broth, apples, sweet potato, onion, carrots, chai tea bags, and all spices\n2. Bring to a boil, then reduce heat and simmer for 25-30 minutes until vegetables are tender\n3. Remove tea bags and whole spices\n4. Use an immersion blender to purée soup until smooth\n5. Stir in coconut milk and maple syrup; keep warm\n6. For croutons: make grilled cheese sandwiches, let cool slightly, then cut into 1-inch cubes\n7. Serve soup topped with grilled cheese croutons",
        prep_time: 15,
        cook_time: 40,
        image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ];

    const recipeInsertStmt = db.prepare(`
      INSERT INTO recipes (
        title, description, ingredients, instructions, 
        prep_time, cook_time, image_url, mood_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT id FROM moods WHERE name = ?))
    `);

    recipes.forEach(recipe => {
      recipeInsertStmt.run(
        recipe.title,
        recipe.description,
        recipe.ingredients,
        recipe.instructions,
        recipe.prep_time,
        recipe.cook_time,
        recipe.image_url,
        recipe.mood
      );
    });

    recipeInsertStmt.finalize(() => {
      resolve();
    });
  });
}

function getRecipesByMood(mood) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM recipes 
      WHERE mood_id = (SELECT id FROM moods WHERE name = ?)
    `;
    
    db.all(query, [mood], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Parse the JSON ingredients string
      const recipes = rows.map(row => {
        return {
          ...row,
          ingredients: JSON.parse(row.ingredients)
        };
      });
      
      resolve(recipes);
    });
  });
}

function getAllMoods() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM moods", (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  getRecipesByMood,
  getAllMoods
}; 