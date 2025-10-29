import { GetObjectAclCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
        const tokenId = event.queryStringParameters.tokenId;

        if (!tokenId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "tokenId required!"
                }),
            };
        }

        //fetch metadata from s3
        const signKey = `signature/${tokenId}.json`;
        const signCmd = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: signKey
        });

        const signObj = await s3.send(signCmd);
        let signRaw = "";

        for await (const chunk of signObj.Body){
            signRaw += chunk;
        }

        //get off-chain signature
        const offChainSignature = JSON.parse(signRaw);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Signature fetched successfully",
                data: offChainSignature
            }),
        };

        //get on-chain signature

    } catch (error) {

    }
}

export default hander;