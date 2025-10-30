import { ethers } from "ethers";
import DeedABI from "./deedABI.json" assert { type: "json" };

const provider = new ethers.providersJsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, DeedABI, provider);

export default async function getChainRecords(tokenId){
    try{

        const owner = await contract.ownerOf(tokenId);
        const tokenURI = await contract.tokenURI(tokenId);

        return{
            tokenId: Number(tokenId),
            owner: owner.lowerCase(),
            tokenURI: tokenURI,
        };

    }catch(error){
        console.error("Error fetching metadata:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Unable to fetch on-chain data"
            }),
        };
    }
}