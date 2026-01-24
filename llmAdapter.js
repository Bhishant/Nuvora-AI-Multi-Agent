const Groq = require("groq-sdk");

// Load environment variables for Vercel
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

console.log('\n📋 LLM Configuration:');
console.log(`   Model: ${GROQ_MODEL}`);
console.log(`   API Key: ${GROQ_API_KEY ? 'Set ✓' : 'NOT SET ✗'}`);

let groqClient = null;
let isClientValid = false;

// Initialize Groq client
if (GROQ_API_KEY && !GROQ_API_KEY.includes('your-') && !GROQ_API_KEY.includes('example')) {
    try {
        console.log('🔄 Initializing Groq client...');
        groqClient = new Groq({ apiKey: GROQ_API_KEY });
        console.log('✅ Groq client initialized');
        isClientValid = true;
    } catch (error) {
        console.log('❌ Failed to initialize Groq:', error.message);
    }
} else {
    console.log('\n⚠️  WARNING: No valid Groq API key found!');
    console.log('\n   To fix this:');
    console.log('   1. Get a FREE API key from: https://console.groq.com');
    console.log('   2. Add GROQ_API_KEY environment variable in Vercel');
    console.log('   3. Add GROQ_MODEL environment variable in Vercel');
}

async function testConnection() {
    if (!groqClient) {
        console.log('❌ Cannot test connection - no Groq client');
        return false;
    }
    
    try {
        console.log('🔄 Testing Groq API connection...');
        const completion = await groqClient.chat.completions.create({
            messages: [{ role: 'user', content: 'Reply only with "Ready"' }],
            model: GROQ_MODEL,
            max_tokens: 5,
            temperature: 0
        });
        
        const response = completion.choices[0]?.message?.content || '';
        console.log(`✅ Groq connection: "${response.trim()}"`);
        return true;
    } catch (error) {
        console.log('❌ Groq connection failed:', error.message);
        return false;
    }
}

async function callLLM(prompt) {
    console.log(`\n🤖 LLM Request: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`);
    
    if (!isClientValid || !groqClient) {
        console.log('❌ ERROR: Groq client not initialized');
        
        const errorMsg = `# 🚨 AI Service Configuration Required

## What's Wrong?
The Groq AI service is not properly configured.

## Solution:

### Step 1: Get an API Key (FREE)
1. Visit https://console.groq.com
2. Sign up (free, no credit card required)
3. Copy your API key

### Step 2: Configure Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add these variables:
   - GROQ_API_KEY: your_actual_key_here
   - GROQ_MODEL: llama-3.1-8b-instant

### Step 3: Redeploy
Redeploy your application after adding environment variables.

---

**Need help?** Check the server logs for more details.`;

        return errorMsg;
    }

    try {
        console.log('🔄 Calling Groq API...');
        const startTime = Date.now();
        
        const completion = await groqClient.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: GROQ_MODEL,
            temperature: 0.3,
            max_tokens: 4000,
            top_p: 0.9
        });
        
        const response = completion.choices[0]?.message?.content || '';
        const endTime = Date.now();
        
        console.log(`✅ API Response in ${endTime - startTime}ms`);
        console.log(`📏 Response length: ${response.length} characters`);
        
        return response;
        
    } catch (error) {
        console.error('❌ API Error:', error.message);
        
        let errorType = 'Unknown error';
        let solution = 'Check server logs for details';
        
        if (error.message.includes('API key') || error.message.includes('authentication')) {
            errorType = 'Invalid API Key';
            solution = 'Get a new API key from https://console.groq.com';
        } else if (error.message.includes('rate limit')) {
            errorType = 'Rate Limit Exceeded';
            solution = 'Wait a few minutes and try again';
        } else if (error.message.includes('model')) {
            errorType = 'Invalid Model';
            solution = `Change GROQ_MODEL to one of: llama-3.1-8b-instant, llama-3.1-70b-versatile, mixtral-8x7b-32768`;
        }
        
        return `# 🚨 API Error

## Error Type: ${errorType}
## Message: ${error.message}

## Solution:
${solution}

## Quick Fixes:
1. Check internet connection
2. Verify API key at https://console.groq.com
3. Check service status at https://status.groq.com
4. Wait 1-2 minutes and retry`;
    }
}

// Export
function checkAPIStatus() {
    return {
        apiKey: GROQ_API_KEY ? 'Set' : 'Not set',
        client: isClientValid ? 'Ready' : 'Not ready',
        model: GROQ_MODEL,
        environment: process.env.NODE_ENV || 'unknown'
    };
}

module.exports = { callLLM, checkAPIStatus };
