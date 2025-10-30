import { ethers } from "ethers";
import DeedABI from "./deedABI.json" assert { type: "json" };

const provider = new ethers.providersJsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, DeedABI, provider);