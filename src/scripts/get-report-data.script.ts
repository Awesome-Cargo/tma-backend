import { getAwbReportData } from "../utils/csv-to-db-service.js";
import { connectToDatabase } from "../utils/db-connection.js";
function main() {
  connectToDatabase().then(async () => {
    console.log("Database connected");
    await getAwbReportData({ fileName: "3573661" });
  });
}

main();
