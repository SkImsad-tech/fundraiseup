import dotenv from "dotenv";
dotenv.config();

import realtimeSync from "./src/realtime-sync";
import fullReindex from "./src/full-reindex";

if (process.argv.find((arg) => arg === "--full-reindex")) {
  console.log("--full-reindex");
  fullReindex();
} else {
  console.log("--realtime-sync");
  realtimeSync();
}
