# Admin API Documentation

Complete API documentation for the Micro Marketplace Admin System.

## Base URL

```
http://localhost:4000
```

## Authentication

All admin API endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token

**Endpoint**: `POST /auth/login`

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gauravwaghmare17384@gmail.com",
    "password": "123456789"
  }'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Gaurav Waghmare",
    "email": "gauravwaghmare17384@gmail.com",
    "role": "admin"
  }
}
```

---

## User Management APIs

### List Users

Get a paginated list of all users with optional search.

**Endpoint**: `GET /api/admin/users`

**Parameters**:
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Items per page (default: 20, max: 100)
- `q` (query, optional): Search query (searches name and email)

**Example**:
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=20&q=john" \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user",
      "createdAt": "2024-01-14T15:45:00.000Z",
      "updatedAt": "2024-01-14T15:45:00.000Z"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin

---

### Get User Details

Get detailed information about a specific user.

**Endpoint**: `GET /api/admin/users/:id`

**Parameters**:
- `id` (path, required): MongoDB user ID

**Example**:
```bash
curl -X GET "http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "favorites": [
    "507f1f77bcf86cd799439050",
    "507f1f77bcf86cd799439051"
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid user ID format
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: User not found

---

### Delete User

Permanently delete a user account.

**Endpoint**: `DELETE /api/admin/users/:id`

**Parameters**:
- `id` (path, required): MongoDB user ID

**Example**:
```bash
curl -X DELETE "http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer <token>"
```

**Response** (204 No Content):
```
(Empty body)
```

**Error Responses**:
- `400 Bad Request`: 
  - Invalid user ID format
  - Cannot delete last admin user
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: User not found

**Notes**:
- Deleting a user removes all their data
- Cannot delete the last remaining admin
- Use with caution!

---

## Product Management APIs

### List Products

Get a paginated list of all products with optional search.

**Endpoint**: `GET /api/admin/products`

**Parameters**:
- `page` (query, optional): Page number (default: 1)
- `limit` (query, optional): Items per page (default: 20, max: 100)
- `q` (query, optional): Search query (searches title and description)

**Example**:
```bash
curl -X GET "http://localhost:5000/api/admin/products?page=1&limit=20&q=laptop" \
  -H "Authorization: Bearer <token>"
```

**Response** (200 OK):
```json
{
  "total": 1000,
  "page": 1,
  "limit": 20,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439050",
      "title": "Sample Product 1",
      "price": 99.99,
      "description": "This is sample product number 1",
      "image": "https://picsum.photos/seed/micro1/400/300",
      "createdBy": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439051",
      "title": "Sample Product 2",
      "price": 149.99,
      "description": "This is sample product number 2",
      "image": "https://picsum.photos/seed/micro2/400/300",
      "createdBy": "507f1f77bcf86cd799439011",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin

---

### Update Product

Update product details.

**Endpoint**: `PUT /api/admin/products/:id`

**Parameters**:
- `id` (path, required): MongoDB product ID

**Request Body** (all fields optional):
```json
{
  "title": "Updated Product Title",
  "price": 199.99,
  "description": "Updated product description",
  "image": "https://example.com/new-image.jpg"
}
```

**Example**:
```bash
curl -X PUT "http://localhost:5000/api/admin/products/507f1f77bcf86cd799439050" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Laptop",
    "price": 1299.99
  }'
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439050",
  "title": "Updated Laptop",
  "price": 1299.99,
  "description": "This is sample product number 1",
  "image": "https://picsum.photos/seed/micro1/400/300",
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-16T14:20:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`:
  - Invalid product ID format
  - Invalid field values (e.g., negative price)
  - Invalid image URL
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: Product not found

---

### Delete Product

Permanently delete a product.

**Endpoint**: `DELETE /api/admin/products/:id`

**Parameters**:
- `id` (path, required): MongoDB product ID

**Example**:
```bash
curl -X DELETE "http://localhost:5000/api/admin/products/507f1f77bcf86cd799439050" \
  -H "Authorization: Bearer <token>"
```

**Response** (204 No Content):
```
(Empty body)
```

**Error Responses**:
- `400 Bad Request`: Invalid product ID format
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: Product not found

---

## HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful (delete) |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions (not admin) |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Request/Response Examples

### Complete User Deletion Workflow

```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gauravwaghmare17384@gmail.com",
    "password": "123456789"
  }' | jq -r '.token')

# 2. List users
curl -X GET "http://localhost:5000/api/admin/users?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Delete a user
curl -X DELETE "http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer $TOKEN"
```

### Complete Product Update Workflow

```bash
# 1. Get token (see above)

# 2. Search products
curl -X GET "http://localhost:5000/api/admin/products?q=laptop" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 3. Update a product
curl -X PUT "http://localhost:5000/api/admin/products/507f1f77bcf86cd799439050" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Gaming Laptop",
    "price": 1999.99,
    "description": "High performance gaming laptop"
  }' | jq .
```

---

## Rate Limiting (Production)

In production, implement rate limiting:

```javascript
const rateLimit = require("express-rate-limit");

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

app.use('/api/admin', adminLimiter);
```

---

## Error Handling Examples

### Invalid Token

```json
{
  "message": "Invalid token"
}
```

### Not an Admin

```json
{
  "message": "Admin access required"
}
```

### User Not Found

```json
{
  "message": "User not found"
}
```

### Validation Error

```json
{
  "errors": [
    {
      "value": "-10",
      "msg": "Invalid value",
      "param": "price",
      "location": "body"
    }
  ]
}
```

---

## Testing with Postman

1. **Create a new request collection**: "Micro Marketplace Admin"

2. **Add to Pre-request Script**:
```javascript
// For operations that need a token
// First create a login request and set the token
const loginRequest = {
  url: pm.globals.get("base_url") + "/auth/login",
  method: 'POST',
  header: {'Content-Type': 'application/json'},
  body: {
    mode: 'raw',
    raw: JSON.stringify({
      email: "gauravwaghmare17384@gmail.com",
      password: "123456789"
    })
  }
};
```

3. **Import as cURL**: Use the examples above with Postman's Import feature

---

## Pagination Best Practices

- Default limit is 20 items per page
- Maximum limit is 100 items per page
- Use `page` and `limit` together for efficient navigation
- Cache results if making the same request multiple times
- For large datasets, use filtering with `q` parameter

## Security Notes

- **Never** share your JWT token
- Tokens expire after 7 days
- Always use HTTPS in production
- Validate all input on the server side (already implemented)
- Sanitize search queries (already implemented via express-validator)
- Never delete the last admin user

---

For more details, see the main README.md and ADMIN_SETUP.md files.
