import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import aws from "aws-sdk";
import { Readable } from "stream";

const endpoint = new aws.Endpoint(process.env.AWS_UPLOAD_ENDPOINT ?? "");

// @ts-ignore
const s3 = new S3Client({
  endpoint,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
  region: process.env.AWS_REGION as string,
});

async function upload(
  stream: AsyncIterable<Uint8Array> | Buffer,
  filename: string,
  contentType?: string
) {
  return new Upload({
    client: s3,
    leavePartsOnError: false,
    params: {
      ACL: "public-read",
      Bucket: process.env.AWS_BUCKET as string,
      Key: filename,
      ContentType: contentType,
      CacheControl: "max-age=31536000",
      Body: Readable.from(stream),
    },
  }).done();
}

export { upload };
