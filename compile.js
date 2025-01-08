const fs = require('fs');
const solc = require('solc');

function findImports(path) {
    try {
        const contents = fs.readFileSync(`node_modules/${path}`, 'utf8');
        return { contents };
    } catch (error) {
        return { error: 'File not found' };
    }
}

// Read the contract source
const source = fs.readFileSync('./src/contracts/GameItems.sol', 'utf8');

// Create input object for compiler
const input = {
    language: 'Solidity',
    sources: {
        'GameItems.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
};

// Compile the contract
const output = JSON.parse(
    solc.compile(JSON.stringify(input), { import: findImports })
);

// Extract bytecode and ABI
const contract = output.contracts['GameItems.sol'].GameItems;
const bytecode = contract.evm.bytecode.object;

// Write the bytecode to a separate file
fs.writeFileSync(
    './src/contracts/bytecode.ts',
    `export const GAME_ITEMS_BYTECODE = "0x${bytecode}";`
);

console.log('Contract compiled successfully!'); 