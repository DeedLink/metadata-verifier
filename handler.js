import { S3Client } from "@aws-sdk/client-s3";

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const hander = async (event) => {
    try {

    } catch (error) {
        const tokenId = event.queryStringParameters.tokenId;

        if (!tokenId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "tokenId required!"
                }),
            };
        }
    }
}

export default hander;