const { Wallet } = require("ethers");
require("dotenv").config();

const wallet = new Wallet(process.env.PRIVATE_KEY_RELAYER);
console.log("Relayer address:", wallet.address);