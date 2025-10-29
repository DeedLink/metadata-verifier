import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

// ES modules __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABI JSON manually (no 'assert')
const abiPath = path.join(__dirname, "PropertyNFTABI.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// RPC and contract
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;;
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

async function getSignatures(tokenId) {
  try {
    const sigs = await contract.getSignatures(tokenId);
    console.log("Surveyor:", sigs.surveyor);
    console.log("Notary:", sigs.notary);
    console.log("IVSL:", sigs.ivsl);
  } catch (err) {
    console.error("Error fetching signatures:", err);
  }
}

// Test call
getSignatures(1);
