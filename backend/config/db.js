import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      //"mongodb+srv://hrishiudawant7_db_user:Lexicon%401234@inventorymanagementsyst.o7d0dzd.mongodb.net/",
      //"mongodb+srv://hrishiudawant7_db_user:Lexicon%401234@inventorymanagementsyst.o7d0dzd.mongodb.net/?appName=InventoryManagementSystem",
      "mongodb+srv:hrishiudawant7_db_user:Lexicon%401234@inventorymanagementsyst.o7d0dzd.mongodb.net/?appName=InventoryManagementSystem",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ MongoDB Atlas Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
