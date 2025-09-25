
# Auth API

````markdown
Authentication API built with Node.js, Express, and MongoDB.  
Implements user registration and login using JWT for session management.


````
## Quick Start

1. **Clone the repository**  
   ```bash
   git clone https://github.com/SebastianFlorezz/Auth-API-sebastianflzz.git
   cd Auth-API-sebastianflzz
  ``` 

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/your_database
   JWT_SECRET=your_secret_key
   ```

4. **Run the server**

   ```bash
   npm run dev
   ```

---

## Authentication

* **Type**: JWT
* **Required Header**:

  ```
  Authorization: Bearer <token>
  ```
* No refresh token implemented.
* The token must be included in every request to protected endpoints.

---

## Endpoints

### 1. User Registration

* **Method**: `POST`
* **Route**: `http://localhost:PORT/api/register`
* **Description**: Creates a new user in the database.
* **Request Body (JSON)**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

* **Responses**:

  * `201 Created`: user successfully created
  * `400 Bad Request`: invalid data
  * `409 Conflict`: email already exists

---

### 2. User Login

* **Method**: `POST`
* **Route**: `http://localhost:PORT/api/login`
* **Description**: Authenticates the user and returns a JWT token.
* **Request Body (JSON)**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

* **Successful Response** (`200 OK`):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "id": "64f1b...",
    "email": "user@example.com",
    "createdAt": "2025-09-24T12:34:56Z"
  }
}
```

* **Common Errors**:

  * `400 Bad Request`: invalid input
  * `401 Unauthorized`: wrong credentials

---

## Data Model: User

```js
const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill with a valid email address"
    ]
  },
  password: {
    type: String, 
    required: [true, "Password is required"],
    minLength: [8, "Password must be at least 8 characters long"],
    match: [
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      "Password must contain at least one uppercase letter and one number"
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });
```

---

## Common Error Codes

| Code | Description                          |
| ---- | ------------------------------------ |
| 200  | OK – Successful operation            |
| 201  | Created – User created successfully  |
| 400  | Bad Request – Invalid input          |
| 401  | Unauthorized – Invalid credentials   |
| 409  | Conflict – User already exists       |
| 500  | Internal Server Error – Server error |

---

## Usage Examples (cURL)

### Register

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'
```
