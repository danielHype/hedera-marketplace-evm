const fs = require('fs');
const solc = require('solc');
const path = require('path');

function findImports(importPath) {
    try {
        const prefix = '@openzeppelin/';
        if (importPath.startsWith(prefix)) {
            const npmPath = path.join('node_modules', importPath);
            return {
                contents: fs.readFileSync(npmPath, 'utf8')
            };
        }
        return { error: 'File not found' };
    } catch (error) {
        return { error: 'File not found' };
    }
}

// Read the contract sources
const nftSource = fs.readFileSync('./src/contracts/HederaNFT.sol', 'utf8');
const factorySource = fs.readFileSync('./src/contracts/NFTFactory.sol', 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'HederaNFT.sol': {
            content: nftSource
        },
        'NFTFactory.sol': {
            content: factorySource
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        },
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};

// Compile the contracts
const output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: findImports })
);

// Extract bytecode and ABI for both contracts
const nftContract = output.contracts['NFTFactory.sol'].NFTFactory;
const factoryBytecode = nftContract.evm.bytecode.object;
const factoryAbi = nftContract.abi;

// Write the bytecode and ABI to separate files
fs.writeFileSync(
    './src/contracts/bytecode.ts',
    `export const FACTORY_BYTECODE = "0x${factoryBytecode}";\n` +
    `export const FACTORY_ABI = ${JSON.stringify(factoryAbi, null, 2)} as const;\n`
);

console.log('Contract compiled successfully!'); 