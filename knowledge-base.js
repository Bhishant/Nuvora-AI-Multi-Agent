class KnowledgeBase {
    constructor() {
        this.knowledge = {
            // PROGRAMMING & ALGORITHMS
            'Merge Sort': {
                definition: 'Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, sorts them recursively, and then merges the sorted halves.',
                keyPoints: [
                    'Divide-and-conquer approach',
                    'Stable sorting algorithm',
                    'Time complexity: O(n log n) in all cases',
                    'Space complexity: O(n)',
                    'Well-suited for linked lists',
                    'Not an in-place algorithm'
                ],
                characteristics: ['stable', 'not in-place', 'recursive', 'divide-and-conquer'],
                features: ['Time Complexity: O(n log n)', 'Space Complexity: O(n)', 'Stable: Yes', 'In-place: No'],
                advantages: [
                    'Predictable O(n log n) performance',
                    'Stable sort',
                    'Good for large datasets',
                    'Works well with sequential access data'
                ],
                disadvantages: [
                    'Requires O(n) additional space',
                    'Slower than QuickSort for small arrays',
                    'Not cache-friendly'
                ],
                complexity: {
                    time: 'O(n log n)',
                    space: 'O(n)',
                    bestCase: 'O(n log n)',
                    worstCase: 'O(n log n)'
                },
                applications: ['External sorting', 'Large datasets', 'Stable sort requirements']
            },

            'Quick Sort': {
                definition: 'Quick Sort is a divide-and-conquer algorithm that picks an element as pivot and partitions the array around the pivot, then recursively sorts the sub-arrays.',
                keyPoints: [
                    'Divide-and-conquer approach',
                    'Unstable sorting algorithm',
                    'Average time complexity: O(n log n)',
                    'Worst-case time complexity: O(n²)',
                    'In-place sorting',
                    'Cache-friendly'
                ],
                characteristics: ['unstable', 'in-place', 'recursive', 'divide-and-conquer'],
                features: ['Time Complexity: O(n log n) average', 'Space Complexity: O(log n)', 'Stable: No', 'In-place: Yes'],
                advantages: [
                    'Fastest in practice for most cases',
                    'In-place sorting',
                    'Cache-friendly',
                    'Good locality of reference'
                ],
                disadvantages: [
                    'Worst-case O(n²) performance',
                    'Unstable sort',
                    'Poor choice for already sorted data'
                ],
                complexity: {
                    time: 'O(n log n) average',
                    space: 'O(log n)',
                    bestCase: 'O(n log n)',
                    worstCase: 'O(n²)'
                },
                applications: ['General-purpose sorting', 'Internal sorting', 'Average-case performance critical']
            },

            // GAMES & ENTERTAINMENT
            'Games': {
                definition: 'Games are structured forms of play, usually undertaken for entertainment or fun, and sometimes used as an educational tool. They can involve physical activity, mental challenges, or a combination of both.',
                keyPoints: [
                    'Interactive entertainment experiences',
                    'Can be digital (video games) or physical (board games)',
                    'Often involve rules, goals, and challenges',
                    'Used for entertainment, education, and social interaction',
                    'Multi-billion dollar global industry'
                ],
                categories: ['Video Games', 'Board Games', 'Card Games', 'Sports', 'Puzzle Games'],
                characteristics: ['interactive', 'rule-based', 'goal-oriented', 'entertaining'],
                genres: ['Action', 'Adventure', 'Strategy', 'Role-playing', 'Simulation', 'Sports'],
                platforms: ['PC', 'Console', 'Mobile', 'Web', 'VR']
            },

            'Video Games': {
                definition: 'Video games are electronic games that involve interaction with a user interface or input device to generate visual feedback on a display device.',
                keyPoints: [
                    'Interactive digital entertainment',
                    'Range from simple mobile games to complex AAA titles',
                    'Multi-platform availability',
                    'Growing esports industry',
                    'Significant cultural and economic impact'
                ],
                genres: {
                    'Action': 'Fast-paced games requiring quick reflexes',
                    'RPG': 'Role-playing games with character development',
                    'Strategy': 'Games requiring planning and decision-making',
                    'Sports': 'Simulations of physical sports',
                    'Adventure': 'Story-driven exploration games'
                },
                platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
                industry: 'Global market worth over $200 billion'
            },

            // COMPUTER SCIENCE FUNDAMENTALS
            'Data Structures and Algorithms': {
                definition: 'Data Structures and Algorithms (DSA) is a fundamental computer science topic dealing with efficient data organization and manipulation methods. It forms the foundation for writing efficient and optimized computer programs.',
                keyPoints: [
                    'Foundation of computer science',
                    'Essential for efficient programming',
                    'Includes arrays, linked lists, trees, graphs',
                    'Algorithms for searching, sorting, optimization',
                    'Time and space complexity analysis',
                    'Problem-solving methodology'
                ],
                categories: ['Sorting Algorithms', 'Searching Algorithms', 'Graph Algorithms', 'Dynamic Programming', 'Greedy Algorithms'],
                importance: 'Critical for technical interviews and real-world software development',
                applications: ['Software development', 'System design', 'Competitive programming', 'Research']
            },

            'Programming': {
                definition: 'Programming is the process of designing and building an executable computer program to accomplish a specific computing result or to perform a particular task.',
                keyPoints: [
                    'Process of creating software applications',
                    'Involves writing code in programming languages',
                    'Requires problem-solving skills',
                    'Includes debugging and testing',
                    'Continuous learning and adaptation'
                ],
                languages: {
                    'Python': 'High-level, general-purpose programming language',
                    'JavaScript': 'Scripting language for web development',
                    'Java': 'Object-oriented, platform-independent language',
                    'C++': 'High-performance systems programming',
                    'Go': 'Modern language for concurrent programming'
                },
                paradigms: ['Object-Oriented', 'Functional', 'Procedural', 'Event-Driven'],
                applications: ['Web Development', 'Mobile Apps', 'Data Science', 'AI/ML', 'Systems Programming']
            },

            // TECHNOLOGY & AI
            'Artificial Intelligence': {
                definition: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.',
                keyPoints: [
                    'Simulation of human intelligence',
                    'Machine learning and deep learning',
                    'Natural language processing',
                    'Computer vision',
                    'Robotics and automation'
                ],
                subfields: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Robotics', 'Expert Systems'],
                applications: ['Virtual Assistants', 'Recommendation Systems', 'Autonomous Vehicles', 'Healthcare Diagnostics', 'Fraud Detection'],
                impact: 'Transforming industries and creating new possibilities'
            },

            'Machine Learning': {
                definition: 'Machine Learning is a subset of artificial intelligence that focuses on building systems that learn from data, identify patterns, and make decisions with minimal human intervention.',
                keyPoints: [
                    'Learning from data patterns',
                    'Three main types: supervised, unsupervised, reinforcement',
                    'Feature engineering and model training',
                    'Evaluation metrics and validation',
                    'Deployment and monitoring'
                ],
                types: {
                    'Supervised': 'Learning with labeled data',
                    'Unsupervised': 'Finding patterns in unlabeled data',
                    'Reinforcement': 'Learning through rewards and penalties'
                },
                algorithms: ['Linear Regression', 'Decision Trees', 'Neural Networks', 'K-Means', 'SVMs'],
                applications: ['Predictive Analytics', 'Image Recognition', 'Natural Language Processing', 'Anomaly Detection']
            },

            // MATHEMATICS
            'Mathematics': {
                definition: 'Mathematics is the abstract science of number, quantity, and space, either as abstract concepts or as applied to other disciplines such as physics and engineering.',
                keyPoints: [
                    'Study of numbers, patterns, and structures',
                    'Foundation for scientific and engineering disciplines',
                    'Logical reasoning and proof',
                    'Abstract thinking and problem-solving',
                    'Continuous development over centuries'
                ],
                branches: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Number Theory'],
                applications: ['Physics', 'Engineering', 'Economics', 'Computer Science', 'Cryptography'],
                importance: 'Essential tool for understanding the world and solving practical problems'
            },

            'Calculus': {
                definition: 'Calculus is a branch of mathematics focused on limits, functions, derivatives, integrals, and infinite series. It has two major branches: differential calculus and integral calculus.',
                keyPoints: [
                    'Study of continuous change',
                    'Differential calculus: rates of change',
                    'Integral calculus: accumulation of quantities',
                    'Fundamental theorem of calculus',
                    'Applications in physics and engineering'
                ],
                concepts: ['Limits', 'Derivatives', 'Integrals', 'Series', 'Multivariable Calculus'],
                applications: ['Physics', 'Engineering', 'Economics', 'Computer Graphics', 'Optimization'],
                inventors: 'Independently developed by Newton and Leibniz'
            },

            // SCIENCE
            'Physics': {
                definition: 'Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force.',
                keyPoints: [
                    'Study of matter and energy',
                    'Fundamental laws of nature',
                    'Experimental and theoretical approaches',
                    'Mathematical modeling',
                    'Basis for other sciences'
                ],
                branches: ['Classical Mechanics', 'Quantum Mechanics', 'Thermodynamics', 'Electromagnetism', 'Relativity'],
                applications: ['Engineering', 'Technology', 'Medicine', 'Space Exploration', 'Energy Production'],
                importance: 'Foundation for understanding the physical universe'
            },

            'Chemistry': {
                definition: 'Chemistry is the scientific study of the properties and behavior of matter. It covers the elements that make up matter, the compounds made from atoms, molecules, and ions, and their composition, structure, properties, and behavior.',
                keyPoints: [
                    'Study of matter and its transformations',
                    'Atomic and molecular structure',
                    'Chemical reactions and bonding',
                    'Periodic table organization',
                    'Laboratory experimentation'
                ],
                branches: ['Organic', 'Inorganic', 'Physical', 'Analytical', 'Biochemistry'],
                applications: ['Medicine', 'Materials Science', 'Environmental Science', 'Food Science', 'Energy'],
                elements: '118 known elements with unique properties'
            },

            // BUSINESS & ECONOMICS
            'Business': {
                definition: 'Business refers to an organization or enterprising entity engaged in commercial, industrial, or professional activities. Businesses can be for-profit entities or non-profit organizations.',
                keyPoints: [
                    'Organization providing goods or services',
                    'Profit-oriented or non-profit',
                    'Various legal structures',
                    'Market competition and strategy',
                    'Financial management and operations'
                ],
                types: ['Sole Proprietorship', 'Partnership', 'Corporation', 'LLC', 'Non-profit'],
                functions: ['Marketing', 'Finance', 'Operations', 'Human Resources', 'Strategy'],
                importance: 'Driver of economic growth and innovation'
            },

            'Economics': {
                definition: 'Economics is the social science that studies how individuals, businesses, governments, and nations make choices about allocating resources to satisfy their wants and needs.',
                keyPoints: [
                    'Study of resource allocation',
                    'Microeconomics and macroeconomics',
                    'Supply and demand principles',
                    'Market structures and competition',
                    'Economic indicators and policies'
                ],
                branches: ['Microeconomics', 'Macroeconomics', 'International', 'Development', 'Behavioral'],
                concepts: ['Supply and Demand', 'Market Equilibrium', 'GDP', 'Inflation', 'Opportunity Cost'],
                applications: ['Policy Making', 'Business Strategy', 'Investment', 'International Trade']
            },

            // HEALTH & MEDICINE
            'Medicine': {
                definition: 'Medicine is the science and practice of establishing the diagnosis, prognosis, treatment, and prevention of disease. It encompasses a variety of health care practices to maintain and restore health.',
                keyPoints: [
                    'Diagnosis and treatment of disease',
                    'Preventive care and health maintenance',
                    'Evidence-based practice',
                    'Medical ethics and patient care',
                    'Continuous research and advancement'
                ],
                specialties: ['Cardiology', 'Neurology', 'Pediatrics', 'Surgery', 'Psychiatry'],
                approaches: ['Allopathic', 'Osteopathic', 'Alternative', 'Integrative'],
                importance: 'Essential for human health and longevity'
            },

            'Biology': {
                definition: 'Biology is the natural science that studies life and living organisms, including their physical structure, chemical processes, molecular interactions, physiological mechanisms, development, and evolution.',
                keyPoints: [
                    'Study of living organisms',
                    'Cellular and molecular basis of life',
                    'Genetics and heredity',
                    'Evolution and biodiversity',
                    'Ecology and environmental interactions'
                ],
                branches: ['Molecular Biology', 'Genetics', 'Ecology', 'Evolutionary Biology', 'Microbiology'],
                applications: ['Medicine', 'Agriculture', 'Conservation', 'Biotechnology', 'Forensics'],
                significance: 'Understanding life processes and biodiversity'
            }
        };
    }

    getDefinition(topic) {
        const normalizedTopic = this.normalizeTopic(topic);
        return this.knowledge[normalizedTopic]?.definition || this.generateSmartDefinition(topic);
    }

    getTopicKnowledge(topic) {
        const normalizedTopic = this.normalizeTopic(topic);
        
        if (this.knowledge[normalizedTopic]) {
            return this.knowledge[normalizedTopic];
        }

        // Generate smart knowledge for unknown topics
        return this.generateSmartKnowledge(topic);
    }

    normalizeTopic(topic) {
        const topicMap = {
            // Common variations and misspellings
            'mergesort': 'Merge Sort',
            'quicksort': 'Quick Sort',
            'bubblesort': 'Bubble Sort',
            'dsa': 'Data Structures and Algorithms',
            'ai': 'Artificial Intelligence',
            'ml': 'Machine Learning',
            'programming language': 'Programming',
            'video game': 'Video Games',
            'computer science': 'Data Structures and Algorithms',
            'math': 'Mathematics',
            'business management': 'Business',
            'medical': 'Medicine',
            'biological': 'Biology'
        };

        return topicMap[topic.toLowerCase()] || 
               Object.keys(this.knowledge).find(key => 
                   key.toLowerCase().includes(topic.toLowerCase()) || 
                   topic.toLowerCase().includes(key.toLowerCase())
               ) || topic;
    }

    generateSmartDefinition(topic) {
        const category = this.categorizeTopic(topic);
        
        const definitions = {
            'technology': `${topic} is a technological concept or system that involves the application of scientific knowledge for practical purposes, particularly in industry and engineering.`,
            'science': `${topic} is a scientific field that involves the systematic study of the structure and behavior of the physical and natural world through observation and experiment.`,
            'mathematics': `${topic} is a mathematical concept that deals with the study of numbers, quantities, shapes, and patterns using logical reasoning and abstract thinking.`,
            'business': `${topic} is a business-related concept that involves the organization, management, and operation of commercial enterprises and economic activities.`,
            'health': `${topic} is a health-related field that focuses on the maintenance and improvement of physical and mental well-being through medical science and healthcare practices.`,
            'education': `${topic} is an educational subject that involves the acquisition of knowledge, skills, values, and habits through teaching, training, or research.`,
            'arts': `${topic} is an art form or creative discipline that involves expression or application of human creative skill and imagination.`,
            'general': `${topic} is a broad field of study or practice that encompasses various aspects and applications across multiple disciplines.`
        };

        return definitions[category] || definitions['general'];
    }

    generateSmartKnowledge(topic) {
        const category = this.categorizeTopic(topic);
        
        const knowledgeTemplates = {
            'technology': {
                definition: this.generateSmartDefinition(topic),
                keyPoints: [
                    `Understanding ${topic} requires knowledge of underlying principles`,
                    `Applications span multiple industries and domains`,
                    `Continuous evolution and technological advancement`,
                    `Integration with other technological systems`,
                    `Impact on society and daily life`
                ],
                characteristics: ['innovative', 'technical', 'evolving', 'impactful'],
                applications: ['Various technological implementations', 'Industry solutions', 'Consumer products'],
                importance: 'Contributes to technological progress and innovation'
            },
            'science': {
                definition: this.generateSmartDefinition(topic),
                keyPoints: [
                    `Scientific study and research methodology`,
                    `Theoretical foundations and practical applications`,
                    `Interdisciplinary connections`,
                    `Experimental verification and evidence-based approach`,
                    `Contributions to human knowledge`
                ],
                characteristics: ['empirical', 'systematic', 'evidence-based', 'progressive'],
                applications: ['Research and development', 'Practical implementations', 'Educational purposes'],
                importance: 'Advances human understanding of natural phenomena'
            },
            'mathematics': {
                definition: this.generateSmartDefinition(topic),
                keyPoints: [
                    `Abstract concepts and logical reasoning`,
                    `Theoretical foundations and proofs`,
                    `Computational methods and algorithms`,
                    `Applications in science and engineering`,
                    `Problem-solving approaches`
                ],
                characteristics: ['abstract', 'logical', 'precise', 'universal'],
                applications: ['Scientific research', 'Engineering design', 'Data analysis', 'Financial modeling'],
                importance: 'Provides tools for quantitative analysis and modeling'
            }
        };

        return knowledgeTemplates[category] || {
            definition: this.generateSmartDefinition(topic),
            keyPoints: [
                `Fundamental principles and core concepts`,
                `Practical applications and real-world usage`,
                `Historical development and evolution`,
                `Current trends and future directions`,
                `Learning resources and methodologies`
            ],
            characteristics: ['important', 'multifaceted', 'evolving', 'applicable'],
            applications: ['Various practical implementations', 'Educational contexts', 'Professional use'],
            importance: 'Significant field with broad relevance and applications'
        };
    }

    categorizeTopic(topic) {
        const lowerTopic = topic.toLowerCase();
        
        const categories = {
            'technology': ['programming', 'software', 'hardware', 'computer', 'algorithm', 'data', 'network', 'digital', 'tech'],
            'science': ['physics', 'chemistry', 'biology', 'astronomy', 'geology', 'scientific', 'research', 'experiment'],
            'mathematics': ['math', 'calculus', 'algebra', 'geometry', 'statistics', 'equation', 'formula', 'number'],
            'business': ['business', 'commerce', 'market', 'finance', 'economic', 'management', 'enterprise', 'corporate'],
            'health': ['medicine', 'health', 'medical', 'biology', 'anatomy', 'physiology', 'treatment', 'therapy'],
            'education': ['education', 'learning', 'teaching', 'academic', 'school', 'university', 'study'],
            'arts': ['art', 'music', 'literature', 'drama', 'creative', 'design', 'painting', 'sculpture']
        };

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lowerTopic.includes(keyword))) {
                return category;
            }
        }

        return 'general';
    }

    getRelatedConcepts(topic) {
        const relatedMap = {
            'Merge Sort': ['Quick Sort', 'Heap Sort', 'Insertion Sort', 'Sorting Algorithms', 'Divide and Conquer'],
            'Quick Sort': ['Merge Sort', 'Heap Sort', 'Selection Sort', 'Sorting Algorithms', 'Divide and Conquer'],
            'Data Structures and Algorithms': ['Big O Notation', 'Time Complexity', 'Space Complexity', 'Algorithm Analysis'],
            'Games': ['Video Games', 'Board Games', 'Game Theory', 'Entertainment', 'Recreation'],
            'Video Games': ['Game Development', 'Gaming Industry', 'Esports', 'Virtual Reality', 'Game Design'],
            'Artificial Intelligence': ['Machine Learning', 'Neural Networks', 'Robotics', 'Computer Vision', 'NLP'],
            'Programming': ['Software Development', 'Coding', 'Debugging', 'Algorithms', 'Data Structures']
        };

        return relatedMap[topic] || ['Fundamental Concepts', 'Advanced Topics', 'Practical Applications', 'Related Fields'];
    }

    getCommonQuestions(topic) {
        return [
            `What are the main principles of ${topic}?`,
            `How is ${topic} applied in real-world scenarios?`,
            `What are the key benefits and challenges of ${topic}?`,
            `How does ${topic} relate to other similar fields?`,
            `What are the current trends in ${topic}?`
        ];
    }

    getBestPractices(topic) {
        return [
            `Start with fundamental concepts before advancing to complex topics`,
            `Practice regularly to build proficiency and understanding`,
            `Stay updated with current developments and research`,
            `Apply theoretical knowledge to practical problems`,
            `Collaborate with others to gain different perspectives`
        ];
    }

    // Search functionality
    searchTopics(query) {
        const lowerQuery = query.toLowerCase();
        return Object.keys(this.knowledge).filter(topic => 
            topic.toLowerCase().includes(lowerQuery) ||
            this.knowledge[topic].definition.toLowerCase().includes(lowerQuery) ||
            this.knowledge[topic].keyPoints.some(point => point.toLowerCase().includes(lowerQuery))
        );
    }

    // Get all available topics
    getAllTopics() {
        return Object.keys(this.knowledge);
    }

    // Add new knowledge dynamically
    addKnowledge(topic, knowledge) {
        this.knowledge[topic] = knowledge;
    }
}

module.exports = KnowledgeBase;