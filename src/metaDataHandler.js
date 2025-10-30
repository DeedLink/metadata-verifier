import { S3 } from "@aws-sdk/client-s3";
import { getChainRecords } from "./Blockchain";


const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});


const metaDataHandler = async (event) => {
    try {

        const tokenId = event.queryStringParameters?.tokenId || event.tokenId;


        if (!tokenId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "token id required!"
                })
            };
        };

        //Fetch off-chain data
        const dbResponse = await axios.get(`{process.env.MONGO_URI}/api/transactions/${tokenId}`);
        const offChainData = dbResponse.data;

        //Fetch on-chain data
        const onChainData = await getChainRecords(tokenId);

        const verifiedMetadata = (offChainData.tokenId == onChainData.tokenId) &&
            (offChainData.owner.toLowerCase() === onChainData.owner.toLowerCase()) &&
            (offChainData.tokenURI === onChainData.tokenURI);


        return {
            statusCode: 200,
            body: JSON.stringify({
                verifiedMetadata,
                message: verifiedMetadata ? "Title verified successfully — matches blockchain record."
                    : "Title verification failed — does not match blockchain record.",
                offChainData,
                onChainData,

            })
        };



    } catch (error) {
        console.error("Error fetching metadata:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error"
            }),
        };
    }
}

export default metaDataHandler;