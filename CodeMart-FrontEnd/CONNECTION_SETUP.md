# CodeMart-Frontend to CodeMart.Server Connection Guide

## ✅ Connection Setup Complete!

The frontend is now connected to the backend API. Here's what's been configured:

### 1. **Vite Proxy Configuration** (`vite.config.ts`)

- All requests to `/api/*` are automatically proxied to the backend
- Backend URL: `https://localhost:7198` (or from environment variables)
- This allows you to use relative URLs like `/api/auth/login` in your frontend

### 2. **API Service** (`src/services/api.ts`)

- Complete TypeScript API service with all endpoints
- Automatic JWT token management
- User authentication state handling
- Error handling

### 3. **CORS Configuration** (Server-side)

- Server already configured to allow requests from `http://localhost:5173` (Vite default port)
- Also allows: `http://localhost:3000`, `http://localhost:4200`, `http://localhost:5174`

## 🚀 How to Run

### Step 1: Start the Backend Server

```bash
cd CodeMart.Server
dotnet run
```

The server will start on:

- **HTTPS**: `https://localhost:7198`
- **HTTP**: `http://localhost:5037`

### Step 2: Start the Frontend

```bash
cd CodeMart-Frontend
npm install  # if not already done
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📝 Usage Examples

### Authentication

```typescript
import api from "../services/api";

// Login
try {
  const response = await api.auth.login(email, password);
  // Token and user are automatically stored
  console.log("Logged in:", response.user);
} catch (error) {
  console.error("Login failed:", error);
}

// Get current user
const user = await api.auth.getMe();

// Logout
api.auth.logout();
```

### Projects

```typescript
// Get all projects
const projects = await api.projects.getAll();

// Get project by ID
const project = await api.projects.getById(1);

// Search projects
const results = await api.projects.search("e-commerce");

// Create project
const newProject = await api.projects.create({
  title: "My Project",
  description: "...",
  price: 99,
});
```

### Users, Orders, Transactions, Reviews

Similar patterns apply. See `src/services/api.ts` for all available methods.

## 🔧 Available API Endpoints

### Auth

- `POST /api/auth/login` - Login with email and password
- `GET /api/auth/me` - Get current authenticated user

### Users

- `GET /api/user/users` - Get all users
- `GET /api/user/{id}` - Get user by ID
- `POST /api/user/add` - Create new user
- `GET /api/user/{id}/selling` - Get user's selling projects
- `GET /api/user/{id}/wishlist` - Get user's wishlist
- `GET /api/user/{id}/boughtprojects` - Get user's bought projects

### Projects

- `GET /api/project/projects` - Get all projects
- `GET /api/project/{id}` - Get project by ID
- `POST /api/project/createproject` - Create new project
- `GET /api/project/filter/rating?minRating={rating}` - Filter by rating
- `GET /api/project/filter/category?category={category}` - Filter by category
- `GET /api/project/filter/price?minPrice={min}&maxPrice={max}` - Filter by price
- `GET /api/project/searchprojects?searchTerm={term}` - Search projects
- `GET /api/project/owned` - Get owned projects
- `GET /api/project/sortedbyprice` - Get projects sorted by price

### Orders, Transactions, Reviews

See `src/services/api.ts` for complete list.

## 🔐 Authentication Flow

1. User logs in via `api.auth.login(email, password)`
2. Token is stored in `localStorage` as `authToken`
3. User data is fetched and stored in `localStorage` as `currentUser`
4. All subsequent API requests automatically include the token in the `Authorization` header
5. On 401 (unauthorized), token is cleared and user is logged out

## 🐛 Troubleshooting

### CORS Errors

- Ensure backend is running
- Check that frontend port (5173) is in CORS allowed origins
- Verify proxy configuration in `vite.config.ts`

### 401 Unauthorized

- Check that JWT token is being sent (check localStorage)
- Verify token hasn't expired
- Ensure backend JWT configuration is correct

### Connection Refused

- Verify backend server is running
- Check port numbers match (7198 for HTTPS)
- Ensure no firewall is blocking the connection

## 📚 Next Steps

1. Update your pages (SignIn, SignUp, AllProjects, etc.) to use the API service
2. Add proper TypeScript interfaces for API responses
3. Implement error boundaries for better error handling
4. Add loading states and optimistic updates
