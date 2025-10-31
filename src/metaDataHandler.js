import { ethers } from "ethers";
import axios from "axios";

const DeedABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "ownerOf",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "tokenURI",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, DeedABI, provider);

export const handler = async (event) => {
  try {
    const tokenId =
      event.queryStringParameters?.tokenId ||
      event.pathParameters?.tokenId ||
      event.tokenId;

    if (!tokenId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "token id required!",
        }),
      };
    }

    // ✅ Fetch off-chain data from your backend API
    const dbResponse = await axios.get(`${process.env.MONGO_URI}/api/transactions/${tokenId}`);
    const offChainData = dbResponse.data;

    // ✅ Fetch on-chain data from blockchain
    const owner = await contract.ownerOf(tokenId);
    const tokenURI = await contract.tokenURI(tokenId);

    const onChainData = {
      tokenId: Number(tokenId),
      owner: owner.toLowerCase(),
      tokenURI: tokenURI,
    };

    // ✅ Verify off-chain and on-chain data consistency
    const verifiedMetadata =
      Number(offChainData.tokenId) === onChainData.tokenId &&
      offChainData.owner?.toLowerCase() === onChainData.owner &&
      offChainData.tokenURI === onChainData.tokenURI;

    return {
      statusCode: 200,
      body: JSON.stringify({
        verifiedMetadata,
        message: verifiedMetadata
          ? "Title verified successfully — matches blockchain record."
          : "Title verification failed — does not match blockchain record.",
        offChainData,
        onChainData,
      }),
    };
  } catch (error) {
    console.error("Error verifying metadata:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
