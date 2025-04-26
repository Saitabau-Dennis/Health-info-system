// Script to create a user manually in the database
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

async function createUser() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // User details
    const username = 'saitabau';
    const email = 'dennissaitabauntete28@gmail.com';
    const role = 'doctor';
    const password = 'password123'; // You should change this to a secure password
    const fullName = 'Saita Bau'; // You should update this to the correct full name

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.log('User already exists with this username.');
      process.exit(1);
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create the user
    const user = await User.create({
      username,
      password: hashedPassword,
      fullName,
      email,
      role,
      active: true
    });
    
    console.log('User created successfully:');
    console.log({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:');
    console.error(error);
    process.exit(1);
  }
}

createUser().catch(error => {
  console.error('Unhandled error:');
  console.error(error);
  process.exit(1);
});