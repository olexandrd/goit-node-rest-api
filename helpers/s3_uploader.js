import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import config from "../config/config.js";

const s3_config = {
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_KEY,
  },
  region: config.S3_REGION,
};
const client = new S3Client(s3_config);

export const s3_upload = async ({ file }, tempPath, filename) => {
  const fb = await fs.readFile(tempPath);
  const s3_input = {
    ACL: "public-read",
    Bucket: config.S3_BUCKET,
    ContentType: file.mimetype,
    Key: filename,
    Body: await fb,
  };
  try {
    const put_object = new PutObjectCommand(s3_input);
    await client.send(put_object);
    return `https://${config.S3_BUCKET}.s3.${config.S3_REGION}.amazonaws.com/${filename}`;
  } catch (error) {
    console.error(error);
  }

  return s3_put_object;
};

export default s3_upload;
