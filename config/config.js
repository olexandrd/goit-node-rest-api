import "dotenv/config";

const config = {
  DOMAIN: process.env.DOMAIN || "localhost",
  AVATARS_LOCATION: process.env.AVATARS_LOCATION || "local",
  S3_BUCKET: process.env.S3_BUCKET || "bucket",
  S3_REGION: process.env.S3_REGION || "region",
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY ? process.env.S3_ACCESS_KEY : "",
  S3_SECRET_KEY: process.env.S3_SECRET_KEY ? process.env.S3_SECRET_KEY : "",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  PORT: process.env.PORT || 3000,
  POSTGRES_URI:
    process.env.NODE_ENV === "test"
      ? "sqlite://:memory:"
      : process.env.POSTGRES_URI || "sqlite://:memory:",
};

export default config;
