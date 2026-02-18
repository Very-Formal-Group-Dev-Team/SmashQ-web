# Join & Lobby User Endpoints

## Get Join Link
**GET** `/api/join/:lobby_id`

Returns a shareable join link for a lobby.

**Response:**
```json
{
	"join_link": "/join/123"
}
```

**Example (curl):**
```sh
curl http://localhost:5000/api/join/123
```

---

## Join a Lobby
**POST** `/api/join/:lobby_id`

Adds the authenticated user to the lobby. Requires Bearer token.

**Headers:**
`Authorization: Bearer <accessToken>`

**Response (201):**
```json
{
	"success": true,
	"message": "Joined lobby"
}
```

**Errors:**
- 404: Lobby not found
- 409: User already in lobby
- 401: Missing/invalid token

**Example (curl):**
```sh
curl -X POST http://localhost:5000/api/join/123 -H "Authorization: Bearer <accessToken>"
```

---

## List Users in Lobby
**GET** `/api/lobby/:lobby_id/users`

Returns all users in a specific lobby. Requires Bearer token.

**Headers:**
`Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
	"users": [
		{ "id": 1, "name": "John Doe", "joined_at": "2024-06-01T12:00:00Z" },
		{ "id": 2, "name": "Jane Smith", "joined_at": "2024-06-01T12:01:00Z" }
	]
}
```

**Errors:**
- 404: Lobby not found
- 401: Missing/invalid token

**Example (curl):**
```sh
curl http://localhost:5000/api/lobby/123/users -H "Authorization: Bearer <accessToken>"
```

# SmashQ API Documentation

Base URL: `http://localhost:5000/api/`

---

## Authentication Endpoints

### Register
**POST** `/auth/register`
- Register a new user.
#### Request Body
```json
{
	"email": "user1@example.com",
	"password": "Password123!",
	"firstName": "John",
	"lastName": "Doe",
	"role": "Player"
}
```
#### Response (201)
```json
{
	"success": true,
	"message": "User registered successfully. Please check your email to verify your account.",
	"data": {
		"user": { /* user object */ },
		"accessToken": "...",
		"refreshToken": "...",
		"expiresIn": 3600
	}
}
```

### Verify Email
**GET** `/auth/verify-email?token=...`
- Verify a user's email address. (Returns HTML page)

### Resend Verification Email
**POST** `/auth/resend-verification`
- Resend the verification email.
#### Request Body
```json
{
	"email": "user1@example.com"
}
```
#### Response
```json
{
	"success": true,
	"message": "Verification email sent successfully"
}
```

### Login
**POST** `/auth/login`
- Login and receive access token.
#### Request Body
```json
{
	"email": "user1@example.com",
	"password": "Password123!"
}
```
#### Response
```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"user": { /* user object */ },
		"accessToken": "...",
		"refreshToken": "...",
		"expiresIn": 3600
	}
}
```

### Refresh Token
**POST** `/auth/refresh-token`
- Refresh the access token.
#### Request Body
```json
{
	"refreshToken": "..."
}
```
#### Response
```json
{
	"success": true,
	"accessToken": "...",
	"expiresIn": 3600
}
```

### Forgot Password
**POST** `/auth/forgot-password`
- Request a password reset email.
#### Request Body
```json
{
	"email": "user1@example.com"
}
```
#### Response
```json
{
	"success": true,
	"message": "If an account with that email exists, a password reset email has been sent."
}
```

### Reset Password
**POST** `/auth/reset-password`
- Reset the user's password.
#### Request Body
```json
{
	"token": "...",
	"newPassword": "NewPassword123!"
}
```
#### Response
```json
{
	"success": true,
	"message": "Password reset successful"
}
```

### Get Current User
**GET** `/auth/me`
- Get details of the authenticated user. (Requires authentication)
#### Response
```json
{
	"success": true,
	"data": {
		"user": { /* user object */ }
	}
}
```

### Logout
**POST** `/auth/logout`
- Logout the current user. (Requires authentication)
#### Response
```json
{
	"success": true,
	"message": "Logout successful"
}
```

### Logout All Devices
**POST** `/auth/logout-all`
- Logout from all devices. (Requires authentication)
#### Response
```json
{
	"success": true,
	"message": "Logged out from all devices"
}
```

---

## Lobby Endpoints

### Create Lobby
**POST** `/lobby`
- Create a new lobby. (Requires authentication)
#### Request Body
```json
{
	"lobby_name": "Friday Night Games",
	"owner": 1
}
```
#### Response (201)
```json
{
	"success": true,
	"message": "Lobby created successfully",
	"data": {
		"lobby_id": 1,
		"lobby_name": "Friday Night Games",
		"owner": 1,
		"number_of_players": 0,
		"created_at": "2026-02-18T12:00:00.000Z"
	}
}
```

### Get My Lobbies
**GET** `/lobby`
- Get all lobbies owned by the authenticated user. (Requires authentication)
#### Response
```json
{
	"success": true,
	"message": "Lobbies retrieved successfully",
	"data": [
		{
			"lobby_id": 1,
			"lobby_name": "Friday Night Games",
			"owner": 1,
			"number_of_players": 0,
			"created_at": "2026-02-18T12:00:00.000Z"
		}
	]
}
```

---

> All endpoints that require authentication expect a valid `Authorization: Bearer <token>` header.
