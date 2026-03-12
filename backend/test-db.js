const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully!');
    await mongoose.connection.db.stats();
    console.log('Database stats retrieved.');
    mongoose.connection.close();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
};

testConnection();