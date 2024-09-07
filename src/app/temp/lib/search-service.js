const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function searchFileForFunctions(filename, directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // If it's a directory, recursively search within it
            searchFileForFunctions(filename, filePath);
        } else if (file === filename) {
            if (filePath.endsWith('.ts')) {
                // If it's a TypeScript file, transpile it to JavaScript
                const jsFilePath = filePath.replace(/\.ts$/, '.js');
                transpileTypeScript(filePath, jsFilePath);
                searchFileForFunctions(path.basename(jsFilePath), path.dirname(jsFilePath));
            } else {
                // If it's a JavaScript file, read its content and search for functions
                const content = fs.readFileSync(filePath, 'utf8');
                const functions = extractFunctions(content);
                
                if (functions.length > 0) {
                    
                    console.log(`Functions in ${filePath}:`, functions);
                }
            }
        }
    }
}

function transpileTypeScript(tsFilePath, jsFilePath) {
    execSync(`tsc ${tsFilePath} --outFile ${jsFilePath}`);
}

function extractFunctions(content) {
    const functionRegex = /function\s+([^\(]+)/g;
    const matches = content.match(functionRegex) || [];
    return matches.map(match => match.replace(/function\s+/g, '').trim());
}
export  default searchFileForFunctions;
// Call the function with the starting directory
// searchFileForFunctions('service.ts', '/path/to/your/directory');
