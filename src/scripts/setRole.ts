import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const setRole = async () => {
  const email = process.argv[2];
  const role = process.argv[3];

  if (!email || !role) {
    console.error('Usage: npx ts-node src/scripts/setRole.ts <email> <admin|user>');
    process.exit(1);
  }

  if (role !== 'admin' && role !== 'user') {
    console.error('Role must be either "admin" or "user"');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const result = await mongoose.connection.collection('users').updateOne(
    { email },
    { $set: { role } }
  );

  if (result.matchedCount === 0) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  const user = await mongoose.connection.collection('users').findOne({ email });
  console.log(`✓ ${email} is now role: ${user?.role}`);

  await mongoose.disconnect();
  process.exit(0);
};

setRole().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
