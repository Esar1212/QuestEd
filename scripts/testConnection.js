require('dotenv').config({ path: '.env.local' }); // Explicitly load .env.local
const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  console.log('Current environment variables:', process.env);
  process.exit(1);
}

const redactedUri = process.env.MONGODB_URI
  .replace(/\/\/([^:]+):([^@]+)@/, '//REDACTED_USER:REDACTED_PASSWORD@');

console.log('Connecting to:', redactedUri);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 30000,
})
.then(() => {
  console.log('✅ Connected successfully!');
  console.log('Database:', mongoose.connection.db.databaseName);
  process.exit(0);
})
.catch(err => {
  console.error('❌ Connection failed:');
  console.error('- Error name:', err.name);
  console.error('- Error code:', err.code);
  console.error('- Error message:', err.message);
  
  // Specific error checks
  if (err.code === 'ENOTFOUND') {
    console.error('⚠️ DNS lookup failed - check hostname');
  } else if (err.code === 'MONGODB_DNS_ERROR') {
    console.error('⚠️ MongoDB Atlas DNS error - check project cluster name');
  } else if (err.code === 8000) {
    console.error('⚠️ Authentication failed - check username/password');
  }
  
  process.exit(1);
});
