import { getFsuReportData } from "../utils/csv-to-db-service.js";
import { connectToDatabase } from "../utils/db-connection.js";
function main() {
  connectToDatabase().then(async () => {
    console.log("Database connected");
    await getFsuReportData({ fileName: "3573657" });
  });
}

main();
