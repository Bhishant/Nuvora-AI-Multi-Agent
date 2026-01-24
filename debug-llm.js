const { callLLM } = require('./llmAdapter');

async function testLLM() {
    console.log('🔍 Testing LLM with various prompts...\n');
    
    const testPrompts = [
        "What is Google? Explain in detail.",
        "Compare Merge Sort and Quick Sort",
        "Explain machine learning in simple terms"
    ];
    
    for (const prompt of testPrompts) {
        console.log(`📝 Prompt: "${prompt}"`);
        console.log('-' .repeat(50));
        
        try {
            const response = await callLLM(prompt);
            console.log('✅ Response received');
            console.log('First 200 chars:', response.substring(0, 200) + '...');
            console.log('Response length:', response.length);
            console.log();
        } catch (error) {
            console.log('❌ Error:', error.message);
            console.log();
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between requests
    }
}

testLLM();