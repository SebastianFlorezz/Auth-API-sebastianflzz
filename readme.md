
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
  "username": "username",
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

* **Successful Response** (`201 Created`):
```json
{
    "data": {
        "type": "users",
        "id": "68d58ae1309b6ef5b8c57c3c",
        "attributes": {
            "username": "username",
            "email": "user@example.com",
            "createdAt": "2025-09-25T18:33:05.647Z"
        },
        "meta": {
            "timestamp": "2025-09-25T18:33:05.653Z",
            "requestId": "65321c8d-05af-4913-a48d-b8d92092abf9"
        }
    }
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
    "data": {
        "type": "users",
        "id": "68d58ae1309b6ef5b8c57c3c",
        "attributes": {
            "username": "username",
            "email": "user@example.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDU4YWUxMzA5YjZlZjViOGM1N2MzYyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoidXNlcm5hbWUiLCJpYXQiOjE3NTg4MjUyNDcsImV4cCI6MTc1ODgyODg0N30.KBtowSloC0d_Yy0xBVl1Af0FeLQcX1ZXxERA_LiJTnQ"
        },
        "meta": {
            "timestamp": "2025-09-25T18:34:07.825Z",
            "requestId": "e7dc8cca-ba38-456b-844b-12725f7fc17e"
        }
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
