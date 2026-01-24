const fs = require('fs');
const path = require('path');

// Load environment
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && key.trim() && !key.startsWith('#')) {
            const value = valueParts.join('=').trim();
            if (value) {
                process.env[key.trim()] = value.replace(/['"]/g, '');
            }
        }
    });
}

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

console.log('🔍 Testing Groq Setup...');
console.log('API Key present:', GROQ_API_KEY ? 'Yes' : 'No');
console.log('Model:', GROQ_MODEL);

// Current available models (as of Jan 2025)
const CURRENT_MODELS = [
    'llama-3.1-8b-instant',
    'llama-3.1-70b-versatile', 
    'mixtral-8x7b-32768',
    'gemma2-9b-it'
];

console.log('📋 Current available models:', CURRENT_MODELS.join(', '));

if (GROQ_API_KEY && GROQ_API_KEY !== 'your-groq-api-key-here') {
    try {
        const Groq = require('groq-sdk');
        const groq = new Groq({ apiKey: GROQ_API_KEY });
        
        async function test() {
            console.log('🤖 Testing Groq API...');
            
            // Test with current model
            try {
                const chatCompletion = await groq.chat.completions.create({
                    messages: [{ role: 'user', content: 'Hello, say something short' }],
                    model: GROQ_MODEL,
                    max_tokens: 10,
                    temperature: 0
                });
                
                console.log(`✅ ${GROQ_MODEL} - Working!`);
                console.log('Response:', chatCompletion.choices[0]?.message?.content);
                
            } catch (modelError) {
                console.log(`❌ ${GROQ_MODEL} failed: ${modelError.message}`);
                
                // Test with alternative models
                for (const model of CURRENT_MODELS) {
                    if (model !== GROQ_MODEL) {
                        try {
                            const altCompletion = await groq.chat.completions.create({
                                messages: [{ role: 'user', content: 'Hello' }],
                                model: model,
                                max_tokens: 5,
                                temperature: 0
                            });
                            console.log(`✅ ${model} - Working!`);
                            console.log('Response:', altCompletion.choices[0]?.message?.content);
                            console.log(`\n💡 Suggestion: Update GROQ_MODEL in .env to: ${model}`);
                            break;
                        } catch (altError) {
                            console.log(`❌ ${model} also failed`);
                        }
                    }
                }
            }
        }
        
        test().catch(err => {
            console.error('❌ Groq API Error:', err.message);
            console.log('\n💡 Troubleshooting:');
            console.log('1. Check your API key at: https://console.groq.com');
            console.log('2. Check available models: https://console.groq.com/docs/models');
            console.log('3. Update GROQ_MODEL in .env file');
        });
        
    } catch (error) {
        console.error('❌ Failed to load Groq SDK:', error.message);
        console.log('Run: npm install groq-sdk');
    }
} else {
    console.log('⚠️  No valid Groq API key found');
    console.log('Get a free key from: https://console.groq.com');
    console.log('Then update .env file with your key');
}