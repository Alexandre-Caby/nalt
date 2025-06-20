# Banking API - README

## Project Overview

**Banking API** is a REST API built with Node.js and Express.js for managing personal banking operations. The API allows users to manage their accounts, transactions, categories, and perform various banking operations securely.

**Team:** NALT  
**Version:** 1.0.0  
**Port:** 3000

## Architecture

### Project Structure

```
NALT/
├── api-management/
│   ├── api-documentation.yaml    # OpenAPI/Swagger documentation
│   ├── bdd_config.js            # Database configuration
│   └── utils.js                 # Utility functions (auth, hashing)
│    
├── controllers/
│   ├── utilisateurs.js          # User operations controller
│   ├── categories.js            # Categories operations controller
|   ├── sousCategories.js       # Subcategories operations controller
│   ├── mouvements.js            # Movements operations controller
│   ├── comptes.js               # Accounts operations controller
│   ├── tiers.js                 # Third parties operations controller
│   └── virements.js             # Transfers operations controller
├── routes/
│   ├── index.js                 # Main router configuration
│   ├── auth.js                  # Authentication routes
│   ├── utilisateurs.js          # User management routes
│   ├── categories.js            # Categories and subcategories routes
│   ├── mouvements.js            # Movements routes
│   ├── comptes.js               # Accounts routes
│   ├── tiers.js                 # Third parties routes
│   └── virements.js             # Transfers routes
├── app.js                       # Express application setup
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

### API Architecture

#### Authentication Flow
1. **Token-Based Authentication**: Uses JWT tokens for secure API access
2. **Password Hashing**: Passwords are hashed using bcrypt before storage
3. **Middleware Protection**: Routes are protected by authentication middleware

#### Route Structure
```
/api/
├── authenticate           # POST - User login
├── utilisateurs           # Users management
├── categories             # Categories
├── sousCategories         # Subcategories
├── mouvements            # Financial movements
├── comptes               # Bank accounts
├── tiers                 # Third parties
├── virements             # Money transfers
└── api-docs              # API documentation: Swagger UI
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alexandre-Caby/nalt
   cd nalt
   ```

2. **Install dependencies**
   ```bash
    npm install
   ```

3. **Database Setup**
   - Create a MySQL database named `money_api`
   - Import your database schema

4. **Start the server**
   ```bash
   cd nalt
   node app.js
   ```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```
The token can be obtained by logging in via the `/authenticate` endpoint. For the first login, use the default credentials provided in the database, eg:
```json
{
  "name": "test",
  "password": "password"
}
```
Once connedted, the token is set to expire in 24 hours. You can use the `/authenticate` endpoint to refresh it.

### Main Endpoints

#### Authentication
- `POST /authenticate` - User login

#### Users
- `GET /utilisateurs` - Get all users
- `POST /utilisateurs` - Create a new user
- `GET /utilisateurs/:id` - Get user by ID
- `PUT /utilisateurs/:id` - Update user
- `PATCH /utilisateurs/:id` - Partially update user
- `DELETE /utilisateurs/:id` - Delete user

#### Categories
- `GET /categories` - Get all categories
- `POST /categories` - Create a category
- `GET /categories/:id` - Get category by ID
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

#### Subcategories
- `GET /categories/:id/sous-categories` - Get subcategories
- `POST /categories/:id/sous-categories` - Create subcategory
- `GET /categories/:id/sous-categories/:subId` - Get subcategory by ID
- `PUT /categories/:id/sous-categories/:subId` - Update subcategory
- `DELETE /categories/:id/sous-categories/:subId` - Delete subcategory

#### Mouvements
- `GET /mouvements` - Get all movements
- `POST /mouvements` - Create a movement
- `GET /mouvements/:id` - Get movement by ID
- `PATCH /mouvements/:id` - Partially update movement
- `DELETE /mouvements/:id` - Delete movement

#### Comptes
- `GET /comptes` - Get all accounts
- `POST /comptes` - Create a new account
- `GET /comptes/:id` - Get account by ID
- `PUT /comptes/:id` - Update account
- `PATCH /comptes/:id` - Partially update account
- `DELETE /comptes/:id` - Delete account

#### Tiers
- `GET /tiers` - Get all third parties
- `POST /tiers` - Create a third party
- `GET /tiers/:id` - Get third party by ID
- `PUT /tiers/:id` - Update third party
- `DELETE /tiers/:id` - Delete third party

#### Virements
- `GET /virements` - Get all transfers
- `POST /virements` - Create a transfer
- `GET /virements/:id` - Get transfer by ID
- `PATCH /virements/:id` - Partially update transfer
- `DELETE /virements/:id` - Delete transfer

### Movement of an account
- `GET /comptes/:id/mouvements` - Get movements for a specific account
- `POST /comptes/:id/mouvements` - Create a movement for a specific account

### Interactive Documentation
Visit `/api-docs` for complete Swagger/OpenAPI documentation:
```
http://localhost:3000/api/api-docs
```

## Usage Examples

### Login
```bash
curl -X POST http://localhost:3000/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{"name": "username", "password": "password"}'
```

### Create Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"nomCategorie": "Alimentation"}'
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt hashing for password security
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS Support**: Configurable Cross-Origin Resource Sharing
- **Error Handling**: Proper error responses and logging

## Technologies Used

- **Backend Framework**: Express.js / Node.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Documentation**: Swagger UI Express
- **Database Connection**: mysql2

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team NALT.

## Authors
- Alexandre Caby
- Théo Colin
- Nawel Merabet
- Lara Viseur

---

**Note**: Make sure to configure your database connection and environment variables before running the application. Refer to the `bdd_config.js` file for database connection settings.