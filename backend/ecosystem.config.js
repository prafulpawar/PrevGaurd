// ecosystem.config.js

module.exports = {
    apps : [
      // --- Your API Server ---
      {
        name   : "api-server", // Give it a name to identify in PM2
        script : "server.js",  // The entry point file for your Express app
        // watch: ["src", "routes", "controllers"], // Optional: Restart if files in these folders change (like nodemon) - Use with caution in production
        // ignore_watch : ["node_modules", "*.log"], // Optional: Folders/files to ignore if watch is enabled
        env_production: {         // Environment variables for production mode
           NODE_ENV: "production",
           // --- Add ALL your production environment variables here ---
           // Example: Make sure these match your .env or actual production values
           // PORT: 8000,
           // MONGO_URI: "your_production_mongo_uri",
           // ACCESS_TOKEN: "your_production_access_secret",
           // REFERSH_TOKEN: "your_production_refresh_secret",
           // REDIS_HOST: "your_production_redis_host",
           // REDIS_PORT: your_production_redis_port,
           // REDIS_PASSWORD: "your_production_redis_password",
           // EMAIL_USER: "your_production_email_user",
           // EMAIL_PASS: "your_production_email_pass",
           // RABBITMQ_URL: "amqp://your_production_rabbitmq_host" // Add this if you centralize RabbitMQ URL
        },
        env_development: {        // Environment variables for development mode
           NODE_ENV: "development"
           // You can add development-specific overrides here if needed
           // Often, development uses .env file, which dotenv loads automatically if NODE_ENV isn't 'production'
        }
      },
  
      // --- Your Email Worker ---
      {
        name   : "email-worker",
        script : "runEmailWorker.js", // The script that starts the email worker
        // watch: ["worker", "services"], // Optional: Watch relevant worker files
        env_production: {
           NODE_ENV: "production",
           // Add specific env vars for this worker if needed, inherits otherwise if run in same env scope
           // RABBITMQ_URL: "amqp://your_production_rabbitmq_host"
        },
        env_development: {
           NODE_ENV: "development"
        }
      },
  
      // --- Your OTP Verification Worker ---
      {
        name   : "otp-worker",
        script : "runOtpWorker.js", // The script that starts the OTP worker
        // watch: ["worker", "models", "utils", "ws.js"], // Optional: Watch relevant worker files
        env_production: {
           NODE_ENV: "production",
           // Add specific env vars for this worker if needed
           // RABBITMQ_URL: "amqp://your_production_rabbitmq_host"
        },
        env_development: {
           NODE_ENV: "development"
        }
      }
    ]
  };