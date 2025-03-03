import "dotenv/config";

const config = {
  DOMAIN: process.env.DOMAIN || "localhost",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  PORT: process.env.PORT || 3000,
  POSTGRES_URI:
    process.env.POSTGRES_URI || "postgres://user:pass@localhost:5432/contacts",
};

export default config;
