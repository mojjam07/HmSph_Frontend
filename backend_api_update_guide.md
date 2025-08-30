# Backend API Update Guide for Role-Based Registration

This guide explains how to update the backend API to handle role-based registration from the frontend RegistrationForm component.

## Data Structure from Frontend

The frontend RegistrationForm component sends the following data structure to the backend:

```json
{
  "role": "user|agent|admin",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "password": "string",
  "phone": "string (for user and agent roles)",
  "businessName": "string (for agent role)",
  "licenseNumber": "string (for agent role)",
  "yearsOfExperience": "number (for agent role)",
  "department": "string (for admin role)",
  "employeeId": "string (for admin role)"
}
```

## Backend Implementation Requirements

### 1. Unified Registration Endpoint
The current API has a unified registration endpoint at `/api/auth/register`. This endpoint should be updated to handle the role-based registration.

### 2. Role-Based Data Validation
The backend should validate the data based on the role:
- **User Role**: Validate email, firstName, lastName, password, and phone
- **Agent Role**: Validate email, firstName, lastName, password, phone, businessName, and licenseNumber
- **Admin Role**: Validate email, firstName, lastName, password, department, and employeeId

### 3. Database Changes
The database should be updated to store role-specific information:
- For agents, store businessName, licenseNumber, and yearsOfExperience
- For admins, store department and employeeId
- For users, store basic information

### 4. User Role Assignment
The backend should assign the appropriate role to the user based on the role field in the request data.

## Implementation Steps

### Step 1: Update Registration Endpoint
Update the `/api/auth/register` endpoint to handle role-based registration:

```javascript
// Example implementation in Node.js/Express
app.post('/api/auth/register', async (req, res) => {
  try {
    const { role, email, firstName, lastName, password, phone, businessName, licenseNumber, yearsOfExperience, department, employeeId } = req.body;
    
    // Validate required fields based on role
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Role-specific validation
    if (role === 'agent') {
      if (!phone || !businessName || !licenseNumber) {
        return res.status(400).json({ error: 'Missing required fields for agent' });
      }
    } else if (role === 'admin') {
      if (!department || !employeeId) {
        return res.status(400).json({ error: 'Missing required fields for admin' });
      }
    } else {
      // Regular user
      if (!phone) {
        return res.status(400).json({ error: 'Missing required fields for user' });
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user based on role
    let newUser;
    if (role === 'agent') {
      newUser = await db.createAgent({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        phone,
        businessName,
        licenseNumber,
        yearsOfExperience
      });
    } else if (role === 'admin') {
      newUser = await db.createAdmin({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        department,
        employeeId
      });
    } else {
      // Regular user
      newUser = await db.createUser({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        phone
      });
    }
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});
```

### Step 2: Database Schema Updates
Update the database schema to accommodate role-specific information:

```sql
-- Example SQL schema updates
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
ALTER TABLE users ADD COLUMN business_name VARCHAR(255);
ALTER TABLE users ADD COLUMN license_number VARCHAR(255);
ALTER TABLE users ADD COLUMN years_of_experience INTEGER;
ALTER TABLE users ADD COLUMN department VARCHAR(255);
ALTER TABLE users ADD COLUMN employee_id VARCHAR(255);
```

Or, if using separate tables for each role:

```sql
-- Agents table
CREATE TABLE agents (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  password VARCHAR(255),
  phone VARCHAR(20),
  business_name VARCHAR(255),
  license_number VARCHAR(255),
  years_of_experience INTEGER
);

-- Admins table
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  password VARCHAR(255),
  department VARCHAR(255),
  employee_id VARCHAR(255)
);
```

## Testing the Implementation

1. Test registration for each role (user, agent, admin)
2. Verify that role-specific fields are properly validated
3. Ensure that users are assigned the correct role
4. Test error cases (missing required fields, invalid data, etc.)

## Security Considerations

1. Ensure proper input validation and sanitization
2. Use strong password hashing (bcrypt or similar)
3. Implement rate limiting to prevent abuse
4. Use HTTPS in production
5. Validate user roles on all protected endpoints

## Error Handling

The API should return appropriate error responses:
- 400 Bad Request: Missing or invalid required fields
- 409 Conflict: Email already exists
- 500 Internal Server Error: Server-side errors

Example error response:
```json
{
  "error": "Missing required fields for agent"
}
```

Success response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "agent"
  }
}
