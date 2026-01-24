class Planner {
    constructor() {
        this.templates = {
            'comparison': {
                steps: ['define_topics', 'research_topic1', 'research_topic2', 'compare_features', 'analyze_differences', 'generate_conclusion'],
                outputStructure: ['introduction', 'definitions', 'comparison_table', 'differences', 'similarities', 'use_cases', 'conclusion']
            },
            'explanation': {
                steps: ['define_concept', 'research_details', 'breakdown_components', 'provide_examples', 'summarize_key_points'],
                outputStructure: ['definition', 'overview', 'key_concepts', 'how_it_works', 'examples', 'applications']
            },
            'definition': {
                steps: ['research_definition', 'find_context', 'identify_characteristics', 'provide_examples'],
                outputStructure: ['formal_definition', 'simple_explanation', 'characteristics', 'examples', 'related_concepts']
            },
            'tutorial': {
                steps: ['outline_steps', 'research_best_practices', 'create_examples', 'add_tips'],
                outputStructure: ['introduction', 'prerequisites', 'step_by_step_guide', 'examples', 'best_practices', 'common_mistakes']
            },
            'analysis': {
                steps: ['define_scope', 'gather_data', 'analyze_patterns', 'draw_conclusions', 'make_recommendations'],
                outputStructure: ['overview', 'methodology', 'findings', 'analysis', 'conclusions', 'recommendations']
            }
        };
    }

    createPlan(taskDescription, taskType) {
        let template = this.templates[taskType] || this.templates['explanation'];
        
        let plan = {
            task: taskDescription,
            type: taskType,
            steps: [...template.steps],
            outputStructure: [...template.outputStructure],
            status: 'planned',
            agents: ['researcher', 'writer'],
            timestamp: new Date()
        };

        // Add specific steps based on task content
        this.customizePlan(plan, taskDescription);
        
        return plan;
    }

    customizePlan(plan, taskDescription) {
        // Customize plan based on specific keywords
        if (taskDescription.toLowerCase().includes('algorithm') || 
            taskDescription.toLowerCase().includes('sort') ||
            taskDescription.toLowerCase().includes('data structure')) {
            plan.steps.push('analyze_complexity');
            plan.steps.push('evaluate_performance');
            plan.outputStructure.push('time_complexity');
            plan.outputStructure.push('space_complexity');
        }

        if (taskDescription.toLowerCase().includes('code') || 
            taskDescription.toLowerCase().includes('programming')) {
            plan.steps.push('generate_code_examples');
            plan.outputStructure.push('code_examples');
        }

        return plan;
    }
}

module.exports = Planner;