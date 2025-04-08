const express = require('express');
const router = express.Router();
const { getRecipesByMood, getAllMoods } = require('../db/database');

// Get all moods
router.get('/moods', async (req, res) => {
  try {
    const moods = await getAllMoods();
    res.json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
});

// Get recipes by mood
router.get('/recipes/:mood', async (req, res) => {
  try {
    const mood = req.params.mood;
    const recipes = await getRecipesByMood(mood);
    
    if (recipes.length === 0) {
      return res.status(404).json({ error: 'No recipes found for this mood' });
    }
    
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

module.exports = router; 