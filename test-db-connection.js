const mysql = require("mysql2/promise");

async function testConnection() {
  console.log("Testing MySQL connection...");
  console.log("Host: 127.0.0.1:3306");
  console.log("User: treeheal");
  console.log("Database: treeheal_db\n");

  try {
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3306,
      user: "treeheal",
      password: "StrongPass123",
      database: "treeheal_db",
    });

    console.log("✓ Successfully connected to MySQL database!");

    // Test query
    const [rows] = await connection.execute("SELECT 1 + 1 AS result");
    console.log("✓ Test query successful:", rows);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("✗ Connection failed:", error.message);
    console.error("\nPossible solutions:");
    console.error("1. Make sure MySQL server is running");
    console.error("2. Check if MySQL is running on port 3306");
    console.error(
      "3. Verify database credentials (user: treeheal, password: StrongPass123!)"
    );
    console.error('4. Make sure database "treeheal_db" exists');
    console.error("\nTo start MySQL on Windows:");
    console.error('  - Open Services (Win + R, type "services.msc")');
    console.error('  - Find "MySQL" or "MySQL80" service');
    console.error('  - Click "Start" if it\'s not running');
    console.error("\nOr use command line:");
    console.error("  net start MySQL80");
    process.exit(1);
  }
}

testConnection();
