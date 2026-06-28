/**
 * Admin Seed Script
 *
 * Seeds the first admin user into the database.
 * Run with: npx ts-node src/scripts/seed-admin.ts
 *
 * Make sure your .env file is configured with a valid MONGODB_URI.
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    provider: { type: String, required: true, enum: ['google', 'github'] },
    role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
    accessStatus: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    telegramChatId: { type: String, default: null },
    avatar: { type: String, default: null },
  },
  { timestamps: true },
);

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/weatherguard';

  console.log(`Connecting to MongoDB: ${uri}`);
  await mongoose.connect(uri);

  const User = mongoose.model('User', UserSchema);

  const adminEmail = process.argv[2] || 'admin@weatherguard.com';
  const adminName = process.argv[3] || 'WeatherGuard Admin';

  const existing = await User.findOne({ email: adminEmail });

  if (existing) {
    // Promote existing user to admin
    existing.role = 'admin';
    existing.accessStatus = 'approved';
    await existing.save();
    console.log(`✅ Existing user promoted to admin: ${adminEmail}`);
  } else {
    // Create new admin user
    await User.create({
      name: adminName,
      email: adminEmail,
      provider: 'google',
      role: 'admin',
      accessStatus: 'approved',
    });
    console.log(`✅ Admin user created: ${adminEmail}`);
  }

  await mongoose.disconnect();
  console.log('Done. Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
