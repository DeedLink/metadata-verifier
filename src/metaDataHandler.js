import { S3 } from "@aws-sdk/client-s3";
import {getChainRecords} from "./Blockchain";


const s3 = new S3({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },  
});

const provider = new ethers.providersJsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, DeedABI, provider);

const metaDataHandler = async (event) => {
    try{

        const tokenId = event.queryStringParameters.tokenId;
        

        if(!tokenId){
            return{
                statusCode: 400,
                body: JSON.stringify({
                    message: "token id required!"
                })
            };
        };



    }catch(error){
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