# Supabase Database Setup for CodeMart

This guide explains how to configure CodeMart to use Supabase as the database.

## 🔗 Getting Your Supabase Connection String

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one)

### Step 2: Get Connection String

1. Navigate to **Settings** (gear icon) > **Database**
2. Scroll to **Connection string** section
3. You'll see two options:

#### Option A: Connection Pooling (Recommended for Production)

- **Port**: `6543`
- **Use this for**: Production, Docker containers, serverless functions
- **Format**:
  ```
  postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  ```
- **Example**:
  ```
  postgresql://postgres.abcdefghijklmnop:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
  ```

#### Option B: Direct Connection

- **Port**: `5432`
- **Use this for**: Local development, migrations, direct database access
- **Format**:
  ```
  Host=db.[project-ref].supabase.co;Port=5432;Database=postgres;Username=postgres;Password=[password]
  ```
- **Example**:
  ```
  Host=db.abcdefghijklmnop.supabase.co;Port=5432;Database=postgres;Username=postgres;Password=your_password
  ```

### Step 3: Add to Environment Variables

Add the connection string to your `.env` file:

```env
DB_CONNECTION_STRING=postgresql://postgres.xxxxx:your_password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 🔐 Security Best Practices

1. **Never commit connection strings** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate passwords** regularly in Supabase dashboard
4. **Use connection pooling** in production to avoid connection limits
5. **Restrict IP addresses** in Supabase dashboard if possible

## 🚀 Running Migrations

### Option 1: From Local Machine

```bash
cd CodeMart.Server
dotnet ef database update
```

Make sure your `.env` file has the correct `DB_CONNECTION_STRING`.

### Option 2: From Docker Container

```bash
# If running in Docker
docker-compose exec api dotnet ef database update
```

## 🔍 Verifying Connection

### Test from Supabase Dashboard

1. Go to **SQL Editor** in Supabase dashboard
2. Run a test query:
   ```sql
   SELECT version();
   ```

### Test from Application

```bash
# Start the application
docker-compose up -d

# Check logs for connection errors
docker-compose logs api
```

## 📊 Connection Pooling vs Direct Connection

### Connection Pooling (Port 6543)

✅ **Advantages:**

- Better for production
- Handles many concurrent connections
- More efficient resource usage
- Recommended for Docker containers

❌ **Limitations:**

- Some advanced PostgreSQL features may not work
- Transactions are limited

### Direct Connection (Port 5432)

✅ **Advantages:**

- Full PostgreSQL feature support
- Better for migrations
- Direct database access

❌ **Limitations:**

- Connection limits (default: 60)
- Less efficient for high concurrency

## 🐛 Troubleshooting

### Connection Timeout

- Check if your IP is allowed in Supabase dashboard
- Verify the connection string format
- Ensure you're using the correct port (6543 for pooling, 5432 for direct)

### Authentication Failed

- Verify password is correct
- Check if password has special characters that need URL encoding
- Ensure username is `postgres` (default)

### SSL/TLS Errors

- Supabase requires SSL connections
- The connection string should include SSL parameters
- If using standard format, add: `SslMode=Require;TrustServerCertificate=true`

### Connection Limit Reached

- Use connection pooling (port 6543) instead of direct connection
- Close unused connections
- Check Supabase project limits

## 🔄 Switching Between Local and Supabase

If you want to switch between local PostgreSQL and Supabase:

1. **For Supabase**: Use the connection string from Supabase dashboard
2. **For Local**: Use: `Host=localhost;Port=5432;Database=codemart;Username=codemart;Password=your_password`

Update your `.env` file accordingly.

## 📚 Additional Resources

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [Connection Pooling Guide](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase Connection String Guide](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-string)
