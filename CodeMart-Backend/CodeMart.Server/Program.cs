using CodeMart.Server.Data;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Services;
using CodeMart.Server.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;
using Supabase;
using Npgsql;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Get Supabase configuration from environment variables
var supabaseUrl = Environment.GetEnvironmentVariable("SUPABASE_PROJECT_URL")
    ?? throw new InvalidOperationException("SUPABASE_PROJECT_URL environment variable is required");
var supabaseApiKey = Environment.GetEnvironmentVariable("SUPABASE_API_KEY")
    ?? throw new InvalidOperationException("SUPABASE_API_KEY environment variable is required");

Stripe.StripeConfiguration.ApiKey =
    Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

var options = new SupabaseOptions
{
    AutoRefreshToken = true,
    AutoConnectRealtime = true,
};

// Add Supabase Client
builder.Services.AddSingleton(provider => new Supabase.Client(supabaseUrl, supabaseApiKey, options));

// Add Entity Framework Core with PostgreSQL
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING")
    ?? throw new InvalidOperationException("DB_CONNECTION_STRING environment variable is required");

// Configure Npgsql to prefer IPv4 (fixes Docker IPv6 connectivity issues)
// Handle both URI format (postgresql://...) and standard connection string format
string? hostname = null;
NpgsqlConnectionStringBuilder? connectionBuilder = null;

try
{
    // Check if connection string is in URI format
    if (connectionString.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase) ||
        connectionString.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase))
    {
        // Parse URI format: postgresql://user:password@host:port/database
        var uri = new Uri(connectionString);
        hostname = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.AbsolutePath.TrimStart('/');
        var userInfo = uri.UserInfo.Split(':');
        var username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "";
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
        
        // Convert to standard Npgsql connection string format
        connectionBuilder = new NpgsqlConnectionStringBuilder
        {
            Host = hostname,
            Port = port,
            Database = database,
            Username = username,
            Password = password,
            SslMode = SslMode.Require,
            TrustServerCertificate = true
        };
        
        // Add any query parameters from URI (if present)
        if (!string.IsNullOrEmpty(uri.Query) && uri.Query.Length > 1)
        {
            var queryString = uri.Query.Substring(1); // Remove leading '?'
            var queryParams = queryString.Split('&');
            foreach (var param in queryParams)
            {
                var keyValue = param.Split('=', 2);
                if (keyValue.Length == 2 && !string.IsNullOrEmpty(keyValue[0]))
                {
                    var key = Uri.UnescapeDataString(keyValue[0]);
                    var value = Uri.UnescapeDataString(keyValue[1]);
                    connectionBuilder[key] = value;
                }
            }
        }
    }
    else
    {
        // Standard connection string format
        connectionBuilder = new NpgsqlConnectionStringBuilder(connectionString);
        hostname = connectionBuilder.Host;
    }
    
    // Resolve hostname to IPv4 address to avoid IPv6 connection issues in Docker
    if (!string.IsNullOrEmpty(hostname) && !System.Net.IPAddress.TryParse(hostname, out _))
    {
        try
        {
            // Resolve hostname to get IPv4 address
            var hostEntry = System.Net.Dns.GetHostEntry(hostname);
            var ipv4Address = hostEntry.AddressList
                .FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
            
            if (ipv4Address != null)
            {
                // Replace hostname with IPv4 address to force IPv4 connection
                connectionBuilder.Host = ipv4Address.ToString();
                connectionString = connectionBuilder.ConnectionString;
                Console.WriteLine($"Resolved {hostname} to IPv4: {ipv4Address}");
            }
            else
            {
                Console.WriteLine($"Warning: No IPv4 address found for {hostname}. Using original hostname.");
                connectionString = connectionBuilder.ConnectionString;
            }
        }
        catch (Exception ex)
        {
            // If DNS resolution fails, use original connection string
            Console.WriteLine($"Warning: Could not resolve {hostname} to IPv4: {ex.Message}. Using original hostname.");
            connectionString = connectionBuilder.ConnectionString;
        }
    }
    else
    {
        // Already an IP address or no hostname, use as-is
        connectionString = connectionBuilder.ConnectionString;
    }
}
catch (Exception ex)
{
    throw new InvalidOperationException(
        $"Invalid DB_CONNECTION_STRING format: {ex.Message}. " +
        "Please check your connection string format. " +
        "Supported formats: 'postgresql://user:pass@host:port/db' or 'Host=host;Port=5432;Database=db;Username=user;Password=pass'",
        ex);
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure JWT Options from environment variables
var jwtOptions = new JwtOptions
{
    Key = Environment.GetEnvironmentVariable("JWT_KEY") 
        ?? throw new InvalidOperationException("JWT_KEY environment variable is required"),
    Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "CodeMart.Server",
    Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "CodeMart.Client",
    AccessTokenExpirationMinutes = int.TryParse(
        Environment.GetEnvironmentVariable("JWT_ACCESS_TOKEN_EXPIRATION_MINUTES"), 
        out int expiration) ? expiration : 60
};

builder.Services.Configure<JwtOptions>(options =>
{
    options.Key = jwtOptions.Key;
    options.Issuer = jwtOptions.Issuer;
    options.Audience = jwtOptions.Audience;
    options.AccessTokenExpirationMinutes = jwtOptions.AccessTokenExpirationMinutes;
});

// Register Services
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAuthenticateService, AuthenticateService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

// Configure JWT Authentication
if (!string.IsNullOrWhiteSpace(jwtOptions.Key))
{
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
            ValidateIssuer = !string.IsNullOrWhiteSpace(jwtOptions.Issuer),
            ValidIssuer = jwtOptions.Issuer,
            ValidateAudience = !string.IsNullOrWhiteSpace(jwtOptions.Audience),
            ValidAudience = jwtOptions.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });
}

// Configure CORS for frontend access
var allowedOrigins = Environment.GetEnvironmentVariable("CORS_ORIGINS")?.Split(',') 
    ?? new[] { "http://localhost:3000", "http://localhost:5173", "http://localhost:4200", "http://localhost:5174" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Serialize enums as strings instead of integers for better API usability
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        // Ignore circular references to prevent serialization errors
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.Migrate();
        Console.WriteLine("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error applying migrations: {ex.Message}");
    }

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS (must be before UseAuthentication and UseAuthorization)
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
