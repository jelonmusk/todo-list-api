
```markdown
# Todo List API [https://github.com/jelonmusk/todo-list-api]

A simple RESTful API for managing a todo list, built with Node.js, Express, and MongoDB. This API allows users to create, update, delete, and retrieve todos while maintaining user authentication.

## Features

- User registration and login
- Create, read, update, and delete todos
- User authentication using JWT
- Pagination for retrieving todos

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/todo-list-api.git
   cd todo-list-api


### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add the following environment variables:
   ```plaintext
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

3. Start the server:
   ```bash
   npm run start
   ```

The server will run on `http://localhost:5000`.

### API Endpoints

#### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in an existing user

#### Todos
- `POST /api/todos`: Create a new todo
- `GET /api/todos`: Get all todos (with pagination)
- `PUT /api/todos/:id`: Update a todo
```

# Code Flow Explanation for a Todo List API

## 1. Starting the Server (`server.js`)

When you run `npm run start`, the command specified in your `package.json` is executed:

```json
"scripts": {
  "start": "node server.js"
}
```

This runs the file `server.js`, which initializes the server, sets up routes, and connects to the database.

### Flow:
- `server.js` imports Express, Mongoose, and the route files (`auth` and `todos`).
- It sets up the middleware `express.json()` to parse incoming JSON request bodies.
- It connects to MongoDB using the connection string from `process.env.MONGO_URI`.
- It defines the route handlers:
  - `/api/auth` (handles authentication routes, such as login and register)
  - `/api/todos` (handles CRUD operations for the todo list)
- The server starts listening on the specified `PORT`.

## 2. Handling Requests (Routes)

Now the server is running and waiting for HTTP requests. Let’s assume the user sends a `POST` request to `/api/auth/register` to register a new account.

### Flow:
- **Server.js** routes the request to the `auth` router (defined in `app.use('/api/auth', require('./routes/auth'));`).
- The router file `routes/auth.js` handles requests to `/api/auth`.

Inside `routes/auth.js`:
- **POST /register**: When a user submits the registration form:
  - It extracts the user data from the request (`req.body`).
  - It uses a **model** (such as `User`) to create and save a new user in the database.
  - The password is hashed using middleware (e.g., bcrypt).
  - It responds to the client with a success message or a token.

## 3. Interacting with the Database (Models)

Inside `auth.js` or `todos.js`, the models (`User` or `Todo`) come into play.

### Example:
When registering a user:
- **User Model (`models/User.js`)**:
  - Defines the structure of the User document in MongoDB.
  - Uses **Mongoose** to define the schema and interact with the database.
  - When a user registers, `User.create()` is called to save the new user.

Similarly, for todos:
- **Todo Model (`models/Todo.js`)** defines the structure for todo items (e.g., title, description, userId).

## 4. Using Middleware (`middleware/auth.js`)

Middleware functions have access to the `req` and `res` objects, allowing them to pass control to the next middleware or terminate the request.

### Example:
- The `auth` middleware checks if the user is authenticated before allowing access to certain routes (like `/todos`).
- For a protected route:
  - The middleware checks for a valid **JWT (JSON Web Token)**.
  - If valid, it attaches user info to `req` and passes control to the next function.

## 5. Handling Todos (CRUD Operations in `routes/todos.js`)

Once authenticated, the request flows into the route handler in `todos.js`.

### Example:
When a user sends a `POST` request to `/api/todos` to create a new todo:
- The `auth` middleware has verified the user.
- Inside `todos.js`, the route handler extracts todo details from `req.body`.
- It uses the **Todo Model** to create a new todo item with the userId set to `req.user`.
- The new todo is saved to MongoDB using Mongoose, and a success response is sent back.

### Summary of CRUD Operations:
- Other routes (GET, PUT, DELETE) follow the same pattern:
  - Check for authentication.
  - Perform the necessary database operation using the **Todo Model**.

## Complete Flow for Registering a User and Creating a Todo

1. **Start the Server:**
   - `npm run start` runs `server.js`, which connects to MongoDB, sets up routes, and starts listening for requests.

2. **User Registers:**
   - User sends a POST request to `/api/auth/register`.
   - `server.js` directs this to the `auth` router.
   - In `routes/auth.js`, the register route handler creates a new user and saves it to MongoDB.
   - A success message or token is sent back to the client.

3. **User Logs In (if applicable):**
   - User sends a POST request to `/api/auth/login`.
   - The login route verifies credentials, generates a JWT, and sends it back to the client.

4. **User Creates a Todo:**
   - User sends a POST request to `/api/todos` with the token in the headers.
   - `server.js` directs this to the `todos` router.
   - The `auth` middleware verifies the token.
   - In `routes/todos.js`, the todo creation handler creates a new todo using the `Todo` model and saves it to MongoDB.
   - A success response is sent back to the client.

## Key Components

1. **Server (`server.js`)**:
   - Initializes Express, connects to the database, sets up routes, and starts the server.

2. **Routes (`routes/auth.js`, `routes/todos.js`)**:
   - Define the various API endpoints for user registration, login, and todo operations.
   - Handle incoming HTTP requests and delegate work to the models.

3. **Models (`models/User.js`, `models/Todo.js`)**:
   - Define the structure of the MongoDB documents and interact with the database to perform CRUD operations.

4. **Middleware (`middleware/auth.js`)**:
   - Used to check for authentication and perform tasks like logging and validation.

---
