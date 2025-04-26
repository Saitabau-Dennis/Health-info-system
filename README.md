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
![Login Screen](Screenshot%202025-04-26%20213845.png)

### Dashboard
![Dashboard Overview](Screenshot%202025-04-26%20213819.png)

### Programs Management
![Programs Management](Screenshot%202025-04-26%20211907.png)

### Add New Program
![Add New Program](Screenshot%202025-04-26%20212036.png)

### Clients Management
![Clients List](Screenshot%202025-04-26%20213744.png)

### Add New Client
![Add New Client](Screenshot%202025-04-26%20213711.png)

### Client Profile
![Client Profile](Screenshot%202025-04-26%20212111.png)

### Program Enrollment
![Enroll in Program](Screenshot%202025-04-26%20213629.png)
