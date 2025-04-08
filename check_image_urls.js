const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./database/recipes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to the recipes database.');
    checkImageUrls();
  }
});

function checkImageUrls() {
  // Get all recipes with their image URLs
  db.all('SELECT id, title, image_url FROM recipes ORDER BY id', (err, recipes) => {
    if (err) {
      console.error('Error fetching recipes:', err.message);
      db.close();
      return;
    }
    
    console.log(`Checking image URLs for ${recipes.length} recipes...`);
    
    const urlIssues = [];
    const urlFixes = [];
    
    // Check each recipe's image URL
    recipes.forEach(recipe => {
      let needsFix = false;
      let fixedUrl = recipe.image_url;
      
      // Check if URL is missing or truncated
      if (!recipe.image_url) {
        needsFix = true;
        fixedUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        urlIssues.push(`Recipe ID ${recipe.id} (${recipe.title}): Missing image URL`);
      } 
      // Check if URL is missing necessary parameters
      else if (!recipe.image_url.includes('&auto=format') || !recipe.image_url.includes('&w=')) {
        needsFix = true;
        // Fix the URL by adding necessary parameters
        if (recipe.image_url.includes('?')) {
          fixedUrl = `${recipe.image_url}&auto=format&fit=crop&w=800&q=80`;
        } else {
          fixedUrl = `${recipe.image_url}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`;
        }
        urlIssues.push(`Recipe ID ${recipe.id} (${recipe.title}): Incomplete image URL parameters`);
      }
      
      // Add to fixes if needed
      if (needsFix) {
        urlFixes.push({
          id: recipe.id,
          title: recipe.title,
          originalUrl: recipe.image_url,
          fixedUrl: fixedUrl
        });
      }
    });
    
    // Report issues
    if (urlIssues.length > 0) {
      console.log('\nFound issues with the following image URLs:');
      urlIssues.forEach(issue => console.log(`- ${issue}`));
      
      // Fix the URLs
      fixImageUrls(urlFixes);
    } else {
      console.log('All image URLs appear to be properly formatted.');
      db.close();
    }
  });
}

function fixImageUrls(urlFixes) {
  console.log(`\nFixing ${urlFixes.length} image URLs...`);
  
  let fixedCount = 0;
  
  // Update each URL that needs fixing
  function updateNextUrl(index) {
    if (index >= urlFixes.length) {
      console.log(`\nSuccessfully fixed ${fixedCount} image URLs.`);
      db.close();
      return;
    }
    
    const fix = urlFixes[index];
    
    db.run(
      'UPDATE recipes SET image_url = ? WHERE id = ?',
      [fix.fixedUrl, fix.id],
      function(err) {
        if (err) {
          console.error(`Error updating image URL for recipe ID ${fix.id}:`, err.message);
        } else {
          console.log(`✓ Fixed image URL for recipe ID ${fix.id} (${fix.title})`);
          console.log(`  From: ${fix.originalUrl || 'NULL'}`);
          console.log(`  To:   ${fix.fixedUrl}`);
          fixedCount++;
        }
        
        // Process next URL
        updateNextUrl(index + 1);
      }
    );
  }
  
  // Start updating URLs
  updateNextUrl(0);
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