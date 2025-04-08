document.addEventListener('DOMContentLoaded', async () => {
  const moodButtonsContainer = document.getElementById('mood-buttons');
  const recipeContainer = document.getElementById('recipe-container');
  const recipeTitle = document.getElementById('recipe-title');
  const recipeDescription = document.getElementById('recipe-description');
  const recipeImage = document.getElementById('recipe-image');
  const recipePrepTime = document.getElementById('recipe-prep-time');
  const recipeCookTime = document.getElementById('recipe-cook-time');
  const recipeIngredients = document.getElementById('recipe-ingredients');
  const recipeInstructions = document.getElementById('recipe-instructions');
  const newRecipeBtn = document.getElementById('new-recipe-btn');
  
  let currentMood = null;
  let currentRecipes = [];
  let currentRecipeIndex = 0;
  
  // Load all moods
  try {
    const response = await fetch('/api/moods');
    const moods = await response.json();
    
    // Create buttons for each mood
    moods.forEach(mood => {
      const button = document.createElement('button');
      button.className = 'mood-button bg-white border-2 border-gray-200 rounded-lg p-4 text-center hover:shadow-md';
      button.dataset.mood = mood.name;
      
      // Create emoji based on mood
      let emoji = '😊'; // Default
      switch (mood.name) {
        case 'Happy': emoji = '😊'; break;
        case 'Sad': emoji = '😢'; break;
        case 'Energetic': emoji = '⚡'; break;
        case 'Tired': emoji = '😴'; break;
        case 'Nostalgic': emoji = '🕰️'; break;
        case 'Adventurous': emoji = '🧭'; break;
        case 'Romantic': emoji = '❤️'; break;
        case 'Stressed': emoji = '😰'; break;
        case 'Cozy': emoji = '🧸'; break;
      }
      
      button.innerHTML = `
        <div class="text-3xl mb-2">${emoji}</div>
        <div class="font-medium">${mood.name}</div>
      `;
      
      button.addEventListener('click', () => selectMood(mood.name));
      moodButtonsContainer.appendChild(button);
    });
  } catch (error) {
    console.error('Error loading moods:', error);
  }
  
  // Function to handle mood selection
  async function selectMood(mood) {
    // Update active button
    document.querySelectorAll('.mood-button').forEach(btn => {
      if (btn.dataset.mood === mood) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    currentMood = mood;
    
    try {
      const response = await fetch(`/api/recipes/${mood}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      currentRecipes = await response.json();
      currentRecipeIndex = 0;
      
      displayRecipe();
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  }
  
  // Function to display current recipe
  function displayRecipe() {
    if (currentRecipes.length === 0) {
      recipeContainer.classList.add('hidden');
      return;
    }
    
    const recipe = currentRecipes[currentRecipeIndex];
    
    // Display recipe details
    recipeTitle.textContent = recipe.title;
    recipeDescription.textContent = recipe.description;
    recipeImage.style.backgroundImage = `url(${recipe.image_url})`;
    recipePrepTime.textContent = `${recipe.prep_time} min`;
    recipeCookTime.textContent = `${recipe.cook_time} min`;
    
    // Clear and populate ingredients
    recipeIngredients.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
      const li = document.createElement('li');
      li.textContent = ingredient;
      recipeIngredients.appendChild(li);
    });
    
    // Format and display instructions
    recipeInstructions.innerHTML = '';
    const steps = recipe.instructions.split('\n');
    steps.forEach(step => {
      const p = document.createElement('p');
      p.textContent = step.substring(step.indexOf('.') + 1).trim();
      recipeInstructions.appendChild(p);
    });
    
    // Show recipe container
    recipeContainer.classList.remove('hidden');
    
    // Smooth scroll to recipe
    recipeContainer.scrollIntoView({ behavior: 'smooth' });
  }
  
  // New recipe button handler
  newRecipeBtn.addEventListener('click', () => {
    if (currentRecipes.length <= 1) return;
    
    // Get a new random recipe that's not the current one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * currentRecipes.length);
    } while (newIndex === currentRecipeIndex && currentRecipes.length > 1);
    
    currentRecipeIndex = newIndex;
    displayRecipe();
  });
}); 