/**
 * Main Question Generator - Modular Structure
 * 
 * This is the main entry point for question generation.
 * Individual subtopic generators are loaded from separate files.
 * 
 * Required modules:
 * - generators/arithmetic.js
 * - generators/conditionals.js  
 * - generators/loops.js
 * - generators/lists.js
 * - generators/conversion.js
 * - generators/basic_algorithms.js
 */

window.QuestionGenerator = {
    generateQuestions(topic, subtopic, difficulty, count) {
        const generators = {
            arithmetic: () => window.ArithmeticGenerator?.generateQuestions(difficulty, count),
            conditionals: () => window.ConditionalsGenerator?.generateQuestions(difficulty, count),
            loops: () => window.LoopsGenerator?.generateQuestions(difficulty, count),
            lists: () => window.ListsGenerator?.generateQuestions(difficulty, count),
            conversion: () => window.ConversionGenerator?.generateQuestions(difficulty, count),
            'basic-algorithms': () => window.BasicAlgorithmsGenerator?.generateQuestions(difficulty, count)
        };

        if (generators[subtopic]) {
            const result = generators[subtopic]();
            return result || [];
        }
        
        return [];
    },

    // Utility method to check if all generators are loaded
    checkGeneratorAvailability() {
        const requiredGenerators = ['ArithmeticGenerator', 'ConditionalsGenerator', 'LoopsGenerator', 'ListsGenerator', 'ConversionGenerator', 'BasicAlgorithmsGenerator'];
        const missing = requiredGenerators.filter(gen => !window[gen]);
        
        if (missing.length > 0) {
            console.warn('Missing question generators:', missing);
            return false;
        }
        
        return true;
    },

    // Get available subtopics based on loaded generators
    getAvailableSubtopics() {
        const allSubtopics = [
            { value: 'arithmetic', label: 'Arithmetic Operations', generator: 'ArithmeticGenerator' },
            { value: 'conditionals', label: 'Conditional Statements', generator: 'ConditionalsGenerator' },
            { value: 'loops', label: 'Loop Constructs', generator: 'LoopsGenerator' },
            { value: 'lists', label: 'List Operations', generator: 'ListsGenerator' },
            { value: 'conversion', label: 'Number Conversion', generator: 'ConversionGenerator' },
            { value: 'basic-algorithms', label: 'Basic Algorithms', generator: 'BasicAlgorithmsGenerator' }
        ];
        
        return allSubtopics.filter(subtopic => window[subtopic.generator]);
    }
};