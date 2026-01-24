const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for mock responses in files...\n');

const filesToCheck = [
    'researcher.js',
    'writer.js',
    'llmAdapter.js',
    'orchestrator.js'
];

filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const mockCount = (content.match(/mockResponse/g) || []).length;
        const mockCount2 = (content.match(/\[MOCK\]/g) || []).length;
        const mockCount3 = (content.match(/fallback to mock/g) || []).length;
        
        console.log(`${file}:`);
        console.log(`  Total "mockResponse" occurrences: ${mockCount}`);
        console.log(`  Total "[MOCK]" occurrences: ${mockCount2}`);
        console.log(`  Total "fallback to mock" occurrences: ${mockCount3}`);
        
        if (mockCount + mockCount2 + mockCount3 > 0) {
            console.log(`  ⚠️  Contains mock code!`);
        } else {
            console.log(`  ✅ No mock code found`);
        }
        console.log('');
    } else {
        console.log(`${file}: ❌ File not found\n`);
    }
});