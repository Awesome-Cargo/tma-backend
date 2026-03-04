import { getFsuReportData } from "../utils/csv-to-db-service.js";
import { connectToDatabase } from "../utils/db-connection.js";
import mongoose from "mongoose";

async function main() {
  const fileName = process.env.FSU_FILE_NAME || "9825658.csv";
  try {
    await connectToDatabase();
    console.log("Database connected");
    await getFsuReportData({ fileName });
  } catch (error) {
    console.error("FSU import failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Unexpected FSU import error:", error);
  process.exit(1);
});
