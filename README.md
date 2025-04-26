# Health Information System

A comprehensive system for managing clients and health programs, designed for healthcare providers to efficiently track patient enrollment in various health initiatives.

## Overview

This Health Information System allows doctors and healthcare providers to:
- Create and manage health programs (TB, Malaria, HIV, etc.)
- Register new clients in the system
- Enroll clients in one or more health programs
- Search for clients and view their profiles
- Access client information via a secure API

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Client Management**: Comprehensive client registration and profile management
- **Program Management**: Create and manage health programs with detailed information
- **Enrollment System**: Track client participation in multiple health programs
- **RESTful API**: Well-documented API endpoints for integration with other systems
- **Data Security**: Authentication middleware and input validation to protect sensitive health information

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT with bcrypt password hashing
- **API Design**: RESTful API architecture
- **Security**: Environment variable protection, authorization middleware

## Installation

1. Clone the repository:
git clone https://github.com/Saitabau-Dennis/Health-info-system.git

2. Install dependencies:
cd Health-info-system
npm install

3. Configure environment variables:
Create a `.env` file with:
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=health_info_system
DB_HOST=127.0.0.1
JWT_SECRET=your_secure_secret
PORT=3000

4. Create the database:
createdb health_info_system

5. Start the server:
npm start

6. Create admin user:
node create-user.js

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current user information

### Client Endpoints
- `POST /api/clients` - Create a new client
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `PUT /api/clients/:id` - Update client information
- `DELETE /api/clients/:id` - Delete a client
- `GET /api/clients/:id/programs` - Get client's enrolled programs

### Program Endpoints
- `POST /api/programs` - Create a new health program
- `GET /api/programs` - Get all health programs
- `GET /api/programs/:id` - Get program by ID
- `PUT /api/programs/:id` - Update program information
- `DELETE /api/programs/:id` - Delete a program

### Enrollment Endpoints
- `POST /api/enrollments` - Enroll a client in a program
- `GET /api/enrollments` - Get all enrollments
- `GET /api/enrollments/:id` - Get enrollment by ID
- `PUT /api/enrollments/:id` - Update enrollment information
- `DELETE /api/enrollments/:id` - Remove enrollment

## Security Considerations

- JWT authentication for all protected routes
- Password hashing using bcrypt
- Role-based access control
- CORS protection
- Environment variable protection for sensitive credentials
- Input validation and sanitization

## Screenshots

### Login Screen
![Screenshot 2025-04-26 211907](https://github.com/user-attachments/assets/885c900d-4b45-4777-9ebd-15c0b7f101d3)

### Dashboard
![Screenshot 2025-04-26 212036](https://github.com/user-attachments/assets/8bc64fb1-5960-4fc3-9689-191f1a289a8f)

### Programs Management
![Screenshot 2025-04-26 213819](https://github.com/user-attachments/assets/f0c28ee0-71fe-42fa-b153-dd227b37eede)


### Add New Program
![Screenshot 2025-04-26 213845](https://github.com/user-attachments/assets/68f592fc-e1c0-4b5a-94f5-9e635f2eaa2e)


### Clients Management
![Screenshot 2025-04-26 212111](https://github.com/user-attachments/assets/40379bdb-c9b4-4554-ae12-b8e61143cd08)


### Add New Client
![Screenshot 2025-04-26 213629](https://github.com/user-attachments/assets/4b7f75fe-1ba5-45cd-98dc-a2fda0393d9c)


### Client Profile
![Screenshot 2025-04-26 213744](https://github.com/user-attachments/assets/154f413e-a13a-4ac2-bbd6-360687aa7a26)


### Program Enrollment
![Screenshot 2025-04-26 213711](https://github.com/user-attachments/assets/e56c7abd-6157-4a26-b372-4a684a7de7c5)

