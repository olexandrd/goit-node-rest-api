import "dotenv/config";

const config = {
  DOMAIN: process.env.DOMAIN || "localhost",
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.POSTGRES_URI,
  nodemailer: {
    host: process.env.NODEMAILER_HOST || "smtp.ukr.net",
    port: process.env.NODEMAILER_PORT || 465,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  },
};

if (process.env.NODE_ENV === "test") {
  config.DB_URI = "sqlite://:memory:";
}

export default config;
