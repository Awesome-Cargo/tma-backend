import { getAwbReportData } from "../utils/csv-to-db-service.js";
import { connectToDatabase } from "../utils/db-connection.js";
import mongoose from "mongoose";

async function main() {
  const fileName = process.env.AWB_FILE_NAME || "9825657.csv";
  try {
    await connectToDatabase();
    console.log("Database connected");
    await getAwbReportData({ fileName });
  } catch (error) {
    console.error("AWB import failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Unexpected AWB import error:", error);
  process.exit(1);
});
