/**
 * Loop Constructs Question Generator
 * 
 * Generates questions for loop constructs with:
 * - While loops: iteration logic, loop conditions, counters
 * - For loops: range(), iteration patterns, nested loops
 * - Break/Continue statements for hard difficulty
 * - Sum calculations with various conditions
 */

window.LoopsGenerator = {
    // Generate loop questions for the specified difficulty
    generateQuestions(difficulty, count) {
        const questions = [];
        
        for (let i = 0; i < count; i++) {
            const loopType = Math.random() < 0.5 ? 'while' : 'for';
            let question;
            
            if (difficulty === 'easy') {
                question = this.generateSimpleLoopSum(loopType);
            } else if (difficulty === 'medium') {
                question = Math.random() < 0.5 ? 
                    this.generateLoopSumExcluding(loopType) : 
                    this.generateLoopSumWithModification(loopType);
            } else { // hard
                question = this.generateLoopWithBreakContinue(loopType);
            }
            
            questions.push({
                topic: 'python',
                subtopic: 'loops',
                difficulty: difficulty,
                type: 'fill',
                question: question.question,
                answer: question.answer
            });
        }

        return questions;
    },

    generateSimpleLoopSum(loopType) {
        const m = Math.floor(Math.random() * 19) - 9;
        const n = Math.floor(Math.random() * 19) - 9;
        
        const start = Math.min(m, n);
        const end = Math.max(m, n);
        
        let sum = 0;
        for (let i = start; i <= end; i++) {
            sum += i;
        }
        
        if (loopType === 'while') {
            return {
                question: `What will this print?\n\n\`\`\`python\nsum = 0\ni = ${start}\nwhile i <= ${end}:\n    sum += i\n    i += 1\nprint(sum)\n\`\`\``,
                answer: sum.toString()
            };
        } else {
            return {
                question: `What will this print?\n\n\`\`\`python\nsum = 0\nfor i in range(${start}, ${end + 1}):\n    sum += i\nprint(sum)\n\`\`\``,
                answer: sum.toString()
            };
        }
    },

    generateLoopSumExcluding(loopType) {
        const m = Math.floor(Math.random() * 19) - 9;
        const n = Math.floor(Math.random() * 19) - 9;
        const k = Math.floor(Math.random() * 4) + 2; // 2 to 5
        
        const start = Math.min(m, n);
        const end = Math.max(m, n);
        
        let sum = 0;
        for (let i = start; i <= end; i++) {
            if (i % k !== 0) {
                sum += i;
            }
        }
        
        if (loopType === 'while') {
            return {
                question: `What will this print?\n\n\`\`\`python\nsum = 0\ni = ${start}\nwhile i <= ${end}:\n    if i % ${k} != 0:\n        sum += i\n    i += 1\nprint(sum)\n\`\`\``,
                answer: sum.toString()
            };
        } else {
            return {
                question: `What will this print?\n\n\`\`\`python\nsum = 0\nfor i in range(${start}, ${end + 1}):\n    if i % ${k} != 0:\n        sum += i\nprint(sum)\n\`\`\``,
                answer: sum.toString()
            };
        }
    },

    generateLoopSumWithModification(loopType) {
        const m = Math.floor(Math.random() * 19) - 9;
        const n = Math.floor(Math.random() * 19) - 9;
        let k = Math.floor(Math.random() * 4) + 2; // 2 to 5
        let p = Math.floor(Math.random() * 4) + 2; // 2 to 5
        
        while (k === p) {
            p = Math.floor(Math.random() * 4) + 2;
        }
        
        const start = Math.min(m, n);
        const end = Math.max(m, n);
        
        let sum = 0;
        for (let i = start; i <= end; i++) {
            if (i % k === 0) {
                sum -= p;
            } else {
                sum += i;
            }
        }
        
        if (loopType === 'while') {
            return {
                question: `What will this print?\n\n\`\`\`python\nsum = 0\ni = ${start}\nwhile i <= ${end}:\n    if i % ${k} == 0:\n        sum -= ${p}\n    else:\n        sum += i\n    i += 1\nprint(sum)\n\`\`\``,
                answer: sum.toString()
            };
        } else {
            return {
                question: `What will this print?\n\n\`\`\`python\nsum = 0\nfor i in range(${start}, ${end + 1}):\n    if i % ${k} == 0:\n        sum -= ${p}\n    else:\n        sum += i\nprint(sum)\n\`\`\``,
                answer: sum.toString()
            };
        }
    },

    generateLoopWithBreakContinue(loopType) {
        const m = Math.floor(Math.random() * 19) - 9;
        const n = Math.floor(Math.random() * 19) - 9;
        const k = Math.floor(Math.random() * 4) + 2; // 2 to 5
        const breakContinue = Math.random() < 0.5 ? 'break' : 'continue';
        
        const start = Math.min(m, n);
        const end = Math.max(m, n);
        
        let sum = 0;
        for (let i = start; i <= end; i++) {
            if (i % k === 0) {
                if (breakContinue === 'break') {
                    break;
                } else { // continue
                    continue;
                }
            }
            sum += i;
        }
        
        if (loopType === 'while') {
            return {
                question: `What will this print?\n\n\`\`\`python\nsum = 0\ni = ${start}\nwhile i <= ${end}:\n    if i % ${k} == 0:\n        i += 1\n        ${breakContinue}\n    sum += i\n    i += 1\nprint(sum)\n\`\`\``,
                answer: sum.toString()
            };
        } else {
            return {
                question: `What will this print?\n\n\`\`\`python\nsum = 0\nfor i in range(${start}, ${end + 1}):\n    if i % ${k} == 0:\n        ${breakContinue}\n    sum += i\nprint(sum)\n\`\`\``,
                answer: sum.toString()
            };
        }
    }
};