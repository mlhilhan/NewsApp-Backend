# News Application - Backend

This project is the backend part of a modern news portal application. It is developed using Express.js, TypeScript, PostgreSQL, and Sequelize ORM.

## Features

- 🔐 JWT-based authentication and authorization
- 📰 News CRUD operations
- 🗂️ Category management
- 💬 Comment system
- 👍 Like and reaction system
- 📊 API documentation (Swagger UI)
- 🔄 External news API integration

## Technologies

- **Express.js**: Web framework
- **TypeScript**: For type safety
- **PostgreSQL**: Database
- **Sequelize ORM**: For database operations
- **Sequelize-TypeScript**: For TypeScript support
- **JWT**: For authentication
- **bcrypt**: For password hashing
- **Swagger UI**: For API documentation
- **dotenv**: For environment variables
- **cors**: For CORS operations
- **helmet**: For security

## Installation

### Requirements

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/news-backend.git
cd news-backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create PostgreSQL database:
```sql
CREATE DATABASE news_db;
```

4. Set environment variables. Create a `.env` file in the root directory:
```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=news_db
DB_USER=postgres
DB_PASSWORD=yourpassword

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# External News API
NEWS_API_KEY=your_news_api_key
```

5. Compile TypeScript code:
```bash
npm run build
# or
yarn build
```

6. Create database tables:
```bash
npm run db:sync
# or
yarn db:sync
```

7. Start the application:
```bash
npm run start
# or
yarn start
```

8. Run in development mode:
```bash
npm run dev
# or
yarn dev
```

## API Documentation

You can access the API documentation via browser:

```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication (Auth)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - View user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change user password

### News

- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get specific news
- `POST /api/news` - Create new news (admin)
- `PUT /api/news/:id` - Update news (admin)
- `DELETE /api/news/:id` - Delete news (admin)
- `GET /api/news/fetch/external` - Fetch news from external API (admin)

### Categories

- `GET /api/news/categories` - Get all categories
- `GET /api/news/categories/:id` - Get specific category
- `POST /api/news/categories` - Create new category (admin)
- `PUT /api/news/categories/:id` - Update category (admin)
- `DELETE /api/news/categories/:id` - Delete category (admin)

### Comments

- `GET /api/comments/news/:newsId` - Get comments for a news article
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Reactions

- `GET /api/reactions/news/:newsId` - Get reactions for a news article
- `GET /api/reactions/user/news/:newsId` - Get user's reaction to a news article
- `POST /api/reactions` - Add/update reaction
- `DELETE /api/reactions/news/:newsId` - Remove reaction

## Project Structure

```
/src
  /config             # Configuration files
  /interfaces         # TypeScript interfaces
  /middlewares        # Express middlewares
  /services           # Services
    /auth             # Authentication service
      /controllers    # Controllers
      /models         # Sequelize models
      /routes         # Express routes
    /news             # News service
    /comment          # Comment service
  /utils              # Helper functions
  index.ts            # Main entry file
```

## Database Schema

```
┌─────────────┐       ┌─────────────┐
│    Users    │       │    News     │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ username    │       │ title       │
│ email       │       │ content     │
│ password    │       │ imageUrl    │
│ role        │       │ author      │
│ createdAt   │       │ source      │
│ updatedAt   │       │ publishedAt │
└─────────────┘       │ createdAt   │
       │              │ updatedAt   │
       │              └─────────────┘
       │                     │
       │              ┌─────────────┐
       │              │NewsCategories│
       │              ├─────────────┤
       │              │ newsId      │
       │              │ categoryId  │
       │              └─────────────┘
       │                     │
┌─────────────┐       ┌─────────────┐
│  Comments   │       │  Categories │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ content     │       │ name        │
│ userId      │       │ slug        │
│ newsId      │       │ description │
│ createdAt   │       │ createdAt   │
│ updatedAt   │       │ updatedAt   │
└─────────────┘       └─────────────┘
       │
┌─────────────┐
│  Reactions  │
├─────────────┤
│ id          │
│ userId      │
│ newsId      │
│ type        │
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

## Troubleshooting

**Model not initialized error**

If you get a "Model not initialized: Member cannot be called" error, make sure that models are properly added to the Sequelize instance in your database.ts file:

```typescript
// config/database.ts
import { Sequelize } from 'sequelize-typescript';
import User from '../services/auth/models/user.model';
import News from '../services/news/models/news.model';
// Import other models

const sequelize = new Sequelize({
  // database configuration...
  models: [User, News, /* other models... */],
});
```

## License

This project is licensed under the MIT License.
