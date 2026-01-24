const KnowledgeBase = require('./knowledge-base');
const { callLLM } = require('./llmAdapter');

class Researcher {
    constructor() {
        this.knowledgeBase = new KnowledgeBase();
    }

    async conductResearch(taskDescription, taskType, plan) {
        try {
            console.log('🔍 Researching:', taskDescription);
            
            let researchData = {
                task: taskDescription,
                type: taskType,
                timestamp: new Date(),
                aiContent: null
            };

            const topics = this.extractTopics(taskDescription);
            researchData.topics = topics;
            
            console.log('🤖 Requesting detailed AI analysis...');
            researchData.aiContent = await this.getAIResponse(taskDescription, topics, taskType);
            
            researchData.queryAnalysis = this.analyzeQuery(taskDescription);
            
            if (researchData.aiContent && researchData.aiContent.length > 0) {
                console.log(`✅ Research completed: ${researchData.aiContent.length} chars`);
            } else {
                console.log('⚠️  Research completed but AI returned empty content');
            }
            
            return researchData;
            
        } catch (error) {
            console.error('❌ Research error:', error);
            return {
                task: taskDescription,
                type: taskType,
                timestamp: new Date(),
                aiContent: `# 🚨 Research Error\n\nUnable to complete research: **${error.message}**\n\nPlease check server logs for details.`,
                queryAnalysis: { isQuestion: true, isDefinition: true },
                error: error.message
            };
        }
    }

    async getAIResponse(taskDescription, topics, taskType) {
        try {
            let prompt = '';
            
            // Enhanced prompts for longer, detailed responses
            if (taskType === 'comparison' && topics.length >= 2) {
                prompt = `Provide a comprehensive comparison between ${topics[0]} and ${topics[1]}. 
                Include:
                1. Detailed definitions of each
                2. Key features and characteristics
                3. Pros and cons of each
                4. Use cases and applications
                5. Performance comparisons (if applicable)
                6. Learning curves
                7. Community and ecosystem
                8. Future outlook
                9. Recommendations based on different scenarios
                
                Format in markdown with clear headings and subheadings. Be thorough and detailed, aiming for at least 1000 words.`;
            } else if (taskType === 'definition') {
                prompt = `Provide a comprehensive, in-depth definition and analysis of "${taskDescription}". 
                Include:
                1. Detailed definition with historical context
                2. Core concepts and principles
                3. Key components and architecture
                4. How it works (step-by-step explanation)
                5. Real-world applications and examples
                6. Benefits and advantages
                7. Limitations and challenges
                8. Related technologies/concepts
                9. Future developments
                10. Learning resources and next steps
                
                Format in markdown with clear structure. Be thorough and aim for at least 800-1000 words.`;
            } else if (taskType === 'tutorial') {
                prompt = `Create a comprehensive tutorial for "${taskDescription}". 
                Include:
                1. Prerequisites and setup
                2. Step-by-step instructions with examples
                3. Code snippets if applicable
                4. Common pitfalls and how to avoid them
                5. Best practices
                6. Testing and validation
                7. Advanced techniques
                8. Resources for further learning
                
                Format in markdown with clear sections. Be detailed enough for beginners to follow.`;
            } else if (taskType === 'analysis') {
                prompt = `Provide a thorough analysis of "${taskDescription}". 
                Include:
                1. Background and context
                2. Key factors and variables
                3. Current state and trends
                4. Strengths and weaknesses
                5. Opportunities and threats
                6. Case studies/examples
                7. Statistical data if available
                8. Expert opinions
                9. Future predictions
                10. Actionable recommendations
                
                Format in markdown with clear analysis sections. Be data-driven and comprehensive.`;
            } else {
                prompt = `Provide a comprehensive explanation of "${taskDescription}". 
                Include:
                1. Detailed overview and background
                2. Core concepts explained simply
                3. How it works (technical if applicable)
                4. Real-world examples and applications
                5. Benefits and advantages
                6. Challenges and limitations
                7. Comparison with alternatives
                8. Future trends
                9. Getting started guide
                10. Resources for deeper learning
                
                Format in markdown with clear headings. Aim for thorough, educational content of at least 800 words.`;
            }
            
            console.log(`📤 Sending detailed prompt to AI (${taskType})...`);
            const response = await callLLM(prompt);
            
            if (response && typeof response === 'string' && response.length > 10) {
                return response;
            } else {
                throw new Error('AI returned empty or invalid response');
            }
            
        } catch (error) {
            console.error('❌ AI response error:', error.message);
            throw error;
        }
    }

    extractTopics(taskDescription) {
        const words = taskDescription.toLowerCase().split(' ');
        const stopWords = new Set([
            'what', 'is', 'are', 'the', 'a', 'an', 'how', 'does', 'do', 
            'explain', 'describe', 'compare', 'vs', 'versus', 'tell', 
            'me', 'about', 'please', 'can', 'you', 'define', 'meaning',
            'of', 'in', 'to', 'for', 'with', 'on', 'at', 'from', 'by'
        ]);
        
        const contentWords = words.filter(word => 
            !stopWords.has(word) && 
            word.length > 2 &&
            !/[.,!?;:]$/.test(word)
        );
        
        if (contentWords.length > 0) {
            // Join with proper spacing
            return [contentWords.join(' ')];
        }
        
        return [taskDescription];
    }

    analyzeQuery(query) {
        return {
            isQuestion: /^(what|how|why|when|where|who|can|is|are|does|do|explain|describe)/i.test(query),
            isComparison: /(compare|vs|versus|difference|similar|contrast|versus)/i.test(query),
            isDefinition: /^(what is|define|definition of|meaning of|explain)/i.test(query),
            isTutorial: /(how to|tutorial|guide|steps to|learn how)/i.test(query),
            isAnalysis: /(analyze|analysis|evaluate|review|break down)/i.test(query)
        };
    }
}

module.exports = Researcher;