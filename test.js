import { ethers } from "ethers";
import abi from "./PropertyNFTABI.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config();

const main = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

  const tokenId = 1;
  const sigs = await contract.getSignatures(tokenId);

  console.log("Signatures for token", tokenId, ":", sigs);
};

main().catch(console.error);
