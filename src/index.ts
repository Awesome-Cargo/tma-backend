import dotenv from "dotenv";
import app from "./app.js";
import { connectToDatabase } from "./utils/db-connection.js";

dotenv.config();

async function run() {
  try {
    await connectToDatabase();
    app.listen(app.get("port"), () => {
      console.log(`Listening on port ${app.get("port")}`);
    });
  } catch (error) {
    throw error;
  }
}

run().catch((e) => console.log("Something went wrong: ", e));
