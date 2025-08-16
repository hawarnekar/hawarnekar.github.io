/**
 * Number Conversion Question Generator
 *
 * New requirements:
 * - Only binary and hexadecimal bases
 * - Conversions are only to/from decimal
 * - No Python code blocks in questions
 * - Answers must NOT include '0b' or '0x' prefixes
 */

window.ConversionGenerator = {
    // Generate conversion questions for the specified difficulty
    generateQuestions(difficulty, count) {
        const questions = [];
        const seen = new Set();
        let attempts = 0;
        const maxAttempts = count * 20; // plenty to ensure uniqueness

        while (questions.length < count && attempts < maxAttempts) {
            const q = this.generateDecimalConversion(difficulty);
            const key = q.question;
            if (!seen.has(key)) {
                seen.add(key);
                questions.push({
                    topic: 'python',
                    subtopic: 'conversion',
                    difficulty,
                    type: 'fill',
                    question: q.question,
                    answer: q.answer
                });
            }
            attempts++;
        }

        return questions;
    },

    // Generate a conversion question to/from decimal with binary or hex
    generateDecimalConversion(difficulty) {
        // Decide direction and base
        const directions = ['dec_to_base', 'base_to_dec'];
        const bases = [2, 16];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const base = bases[Math.floor(Math.random() * bases.length)];

        // Control value size by difficulty
        const ranges = {
            // Control by decimal range only; do not rely on digit length
            easy: { decMax: 31 },
            medium: { decMax: 127 },
            hard: { decMax: 255 }
        };
        const cfg = ranges[difficulty] || ranges.medium;

        if (direction === 'dec_to_base') {
            const value = this.randInt(1, cfg.decMax);
            const answer = base === 2 ? value.toString(2) : value.toString(16);
            const baseName = base === 2 ? 'binary' : 'hexadecimal';
            return {
                question: `What is ${baseName} of decimal number ${value}?`,
                answer
            };
        } else { // base_to_dec
            // Generate a value within the decimal range, then present it in the chosen base
            const value = this.randInt(1, cfg.decMax);
            const answer = value.toString(10);
            if (base === 2) {
                const bits = value.toString(2);
                return {
                    question: `What is decimal number of binary number ${bits}?`,
                    answer
                };
            } else { // hex
                const hex = value.toString(16);
                return {
                    question: `What is decimal number of hexadecimal number ${hex}?`,
                    answer
                };
            }
        }
    },

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};
