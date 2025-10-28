# Database Setup Guide

## Problem
The application cannot connect to MySQL because MySQL is not running on your system.

Error: `ECONNREFUSED 127.0.0.1:3306`

## Solutions

### Option 1: Use Docker (Easiest)

If you have Docker Desktop installed:

```bash
# Start MySQL container
docker-compose up -d

# Check if container is running
docker ps

# Test connection
node test-db-connection.js
```

The database schema will be automatically created when the container starts.

### Option 2: Install MySQL Locally

1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/mysql/
   - Download MySQL Community Server for Windows
   - Install with default settings

2. **Configure MySQL:**
   ```bash
   # After installation, open MySQL Command Line Client
   # Or use MySQL Workbench

   # Create database
   CREATE DATABASE treeheal_db;

   # Create user
   CREATE USER 'treeheal'@'localhost' IDENTIFIED BY 'StrongPass123!';

   # Grant permissions
   GRANT ALL PRIVILEGES ON treeheal_db.* TO 'treeheal'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Run the schema:**
   ```bash
   mysql -u treeheal -p treeheal_db < database/schema.sql
   ```

### Option 3: Use XAMPP

1. **Download XAMPP:**
   - Go to: https://www.apachefriends.org/download.html
   - Download for Windows
   - Install XAMPP

2. **Start MySQL:**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Click "Admin" to open phpMyAdmin

3. **Create Database:**
   - In phpMyAdmin, click "New" to create database
   - Name it: `treeheal_db`
   - Click "SQL" tab and paste contents of `database/schema.sql`
   - Click "Go"

4. **Create User:**
   ```sql
   CREATE USER 'treeheal'@'localhost' IDENTIFIED BY 'StrongPass123!';
   GRANT ALL PRIVILEGES ON treeheal_db.* TO 'treeheal'@'localhost';
   FLUSH PRIVILEGES;
   ```

## Verify Connection

After starting MySQL, test the connection:

```bash
node test-db-connection.js
```

If successful, you should see:
```
✓ Successfully connected to MySQL database!
✓ Test query successful
```

## Troubleshooting

### MySQL running on different port
If MySQL is running on a different port (e.g., 3307), update `.env`:
```
DATABASE_URL="mysql://treeheal:StrongPass123!@127.0.0.1:3307/treeheal_db"
```

### Connection still fails
1. Check if MySQL service is running
2. Verify credentials (username: treeheal, password: StrongPass123!)
3. Make sure database `treeheal_db` exists
4. Check firewall settings

## Current Status

- ❌ MySQL not running
- ❌ Cannot connect to database
- ✓ API routes created
- ✓ Frontend updated
- ✓ Database schema ready

**Next Step:** Choose one of the options above to start MySQL, then test with `node test-db-connection.js`
