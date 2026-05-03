// scripts/setup-db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function setupDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected successfully");

    // Create indexes
    const db = mongoose.connection.db;

    console.log("📊 Creating indexes...");

    // Appointments collection indexes
    await db
      .collection("appointments")
      .createIndexes([
        { key: { email: 1 } },
        { key: { preferredDate: 1 } },
        { key: { status: 1 } },
        { key: { createdAt: -1 } },
        { key: { email: 1, preferredDate: 1 } },
      ]);

    console.log("✅ Indexes created successfully");
    console.log("🎉 Database setup complete!");
  } catch (error) {
    console.error("❌ Setup failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

setupDatabase();
