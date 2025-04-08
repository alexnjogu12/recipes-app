# Mood Recipe Finder

A simple web application that recommends recipes based on your current mood. Select how you're feeling, and the app will suggest a recipe that matches your emotional state. Don't like the suggestion? Just click "New Recipe" to get another recommendation!

## Features

- Mood-based recipe recommendations
- Clean, responsive UI with Tailwind CSS
- SQLite database for recipe storage
- Express.js backend
- Simple and intuitive user interface

## Technologies Used

- **Backend**: Express.js
- **Database**: SQLite3
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **View Engine**: EJS

## Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)

## Installation

1. Navigate to the project directory:
   ```
   cd demoapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How It Works

1. The application displays a set of mood options on the home page.
2. When a user selects a mood, the backend fetches a random recipe associated with that mood from the database.
3. The recipe is displayed with its title, ingredients, instructions, and an image.
4. If the user doesn't like the suggested recipe, they can click "New Recipe" to get another recommendation for the same mood.

## Database Schema

The application uses a simple SQLite database with two tables:

1. **moods** - Stores the available mood options
   - id (PRIMARY KEY)
   - name (TEXT)

2. **recipes** - Stores recipe information
   - id (PRIMARY KEY)
   - title (TEXT)
   - ingredients (TEXT)
   - instructions (TEXT)
   - mood_id (INTEGER) - Foreign key to moods table
   - image_url (TEXT)

## Project Structure

```
demoapp/
├── app.js           # Main Express application
├── start.js         # Startup script
├── package.json     # Project dependencies
├── database/        # SQLite database directory
├── public/          # Static assets
│   └── styles.css   # Custom CSS
└── views/           # EJS templates
    └── index.ejs    # Main view template
```

## License

ISC

## Acknowledgements

- Recipe images from Unsplash
- UI components styled with Tailwind CSS 