const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Use absolute path relative to this script
const dbPath = path.join(
  __dirname,
  "/workspaces/Chris-Kofiotis-PWA-/myPWA/.database/datasource.db"
);

let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("Cannot open database:", err.message);
    process.exit(1); // Stop if database cannot open
  } else {
    console.log("Database opened successfully!");
  }
});

db.all("SELECT * FROM extension", [], (err, rows) => {
  if (err) throw err;

  const jsonPath = path.join(__dirname, "products.json");
  fs.writeFileSync(jsonPath, JSON.stringify(rows, null, 2));
  console.log("JSON file created at", jsonPath);
});

db.close();
