const { ethers } = require('ethers');

const wallet = ethers.Wallet.createRandom();console.log('Address:', wallet.address);
console.log('Private key:', wallet.privateKey); // starts with 0x...
console.log('Mnemonic:', wallet.mnemonic.phrase);