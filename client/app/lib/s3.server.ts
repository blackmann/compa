import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import aws from "aws-sdk";
import { Readable } from "stream";

const endpoint = new aws.Endpoint("eu-central-1.linodeobjects.com");

// @ts-ignore
const s3 = new S3Client({
	endpoint,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
	},
	region: "eu-central-1",
});

async function upload(
	stream: AsyncIterable<Uint8Array> | Buffer,
	filename: string,
	contentType?: string,
) {
	return new Upload({
		client: s3,
		leavePartsOnError: false,
		params: {
			ACL: "public-read",
			Bucket: "compa",
			Key: filename,
			ContentType: contentType,
			Body: Readable.from(stream),
		},
	}).done();
}

export { upload };
