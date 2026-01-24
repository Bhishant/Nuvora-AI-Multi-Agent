class TaskClassifier {
    constructor() {
        this.patterns = {
            'comparison': [
                /compare/i,
                /vs\.?/i,
                /versus/i,
                /difference between/i,
                /similarities and differences/i,
                /which is better/i,
                /pros and cons/i
            ],
            'explanation': [
                /what is/i,
                /explain/i,
                /how does/i,
                /tell me about/i,
                /describe/i,
                /can you explain/i
            ],
            'definition': [
                /define/i,
                /meaning of/i,
                /what does .* mean/i,
                /explain the concept of/i
            ],
            'tutorial': [
                /how to/i,
                /tutorial/i,
                /guide to/i,
                /steps to/i,
                /learn how/i,
                /walkthrough/i,
                /step by step/i
            ],
            'analysis': [
                /analyze/i,
                /analysis of/i,
                /evaluate/i,
                /review of/i,
                /break down/i,
                /examine/i,
                /study of/i
            ]
        };

        // Common topics for better understanding
        this.commonTopics = [
            'games', 'programming', 'algorithms', 'mathematics', 'science',
            'technology', 'business', 'education', 'health', 'sports',
            'entertainment', 'art', 'music', 'literature', 'history'
        ];
    }

    classifyTask(taskDescription) {
        let lowerTask = taskDescription.toLowerCase();

        // First, check for explicit patterns
        for (let [type, patterns] of Object.entries(this.patterns)) {
            for (let pattern of patterns) {
                if (pattern.test(lowerTask)) {
                    return type;
                }
            }
        }

        // If no pattern matches, use content-based classification
        return this.classifyByContent(taskDescription);
    }

    classifyByContent(taskDescription) {
        const lowerTask = taskDescription.toLowerCase();
        const words = lowerTask.split(' ');
        
        // Check for question words
        if (this.isQuestion(lowerTask)) {
            if (lowerTask.includes('how to') || lowerTask.includes('steps to')) {
                return 'tutorial';
            }
            if (lowerTask.includes('what is') || lowerTask.includes('define')) {
                return 'definition';
            }
            return 'explanation';
        }

        // Check for comparison indicators
        if (words.some(word => ['vs', 'versus', 'compare', 'difference'].includes(word))) {
            return 'comparison';
        }

        // Default based on complexity and content
        if (words.length <= 4) {
            return 'definition';
        }

        return 'analysis';
    }

    isQuestion(text) {
        return /^(what|how|why|when|where|who|can you|explain|describe)/i.test(text) || 
               text.includes('?');
    }

    extractTopics(taskDescription) {
        const lowerTask = taskDescription.toLowerCase();
        const foundTopics = [];

        // Check for common topics
        for (const topic of this.commonTopics) {
            if (lowerTask.includes(topic)) {
                foundTopics.push(this.capitalize(topic));
            }
        }

        // Extract potential topics from the query
        const words = taskDescription.split(' ');
        const stopWords = new Set(['what', 'is', 'are', 'the', 'a', 'an', 'how', 'does', 'do', 'explain', 'describe']);

        const contentWords = words.filter(word => 
            !stopWords.has(word.toLowerCase()) && 
            word.length > 2 &&
            !word.includes('?')
        );

        if (contentWords.length > 0 && foundTopics.length === 0) {
            foundTopics.push(contentWords.slice(0, 2).join(' '));
        }

        return foundTopics;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getConfidence(taskDescription, classifiedType) {
        let score = 0;
        let lowerTask = taskDescription.toLowerCase();
        let patterns = this.patterns[classifiedType] || [];

        patterns.forEach(pattern => {
            if (pattern.test(lowerTask)) {
                score += 1;
            }
        });

        // Boost confidence for clear questions
        if (this.isQuestion(lowerTask) && classifiedType === 'explanation') {
            score += 0.5;
        }

        return Math.min(score / Math.max(patterns.length, 1), 1);
    }
}

module.exports = TaskClassifier;