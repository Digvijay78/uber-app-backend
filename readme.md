# Registration Endpoint

## POST /auth/registration

### Description
Use this endpoint to register a new user.

### Request Body
- **firstName**: string (required, minimum length 3)  
- **lastName**: string (optional, minimum length 3)  
- **email**: valid email address (required)  
- **password**: string (required, minimum length 3)  

### Response
- **201**: Returns a JSON object containing the generated token.  
- **422**: Validation error with details if inputs are invalid.  
- **404**: Email is already in use.  
- **500**: Internal server error.

## Examples

### Request
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}

