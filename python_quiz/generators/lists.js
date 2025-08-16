/**
 * List Operations Question Generator
 * 
 * Generates questions for list operations with:
 * - List manipulation, indexing, slicing
 * - Iteration over lists
 * - Numeric list operations
 * - Similar patterns to loop questions but using lists
 */

window.ListsGenerator = {
    // Generate list questions for the specified difficulty
    generateQuestions(difficulty, count) {
        const questions = [];
        
        for (let i = 0; i < count; i++) {
            let question;
            
            if (difficulty === 'easy') {
                question = this.generateSimpleListSum();
            } else if (difficulty === 'medium') {
                question = Math.random() < 0.5 ? 
                    this.generateListSumExcluding() : 
                    this.generateListSumWithModification();
            } else { // hard
                question = this.generateListWithSlicing();
            }
            
            questions.push({
                topic: 'python',
                subtopic: 'lists',
                difficulty: difficulty,
                type: 'fill',
                question: question.question,
                answer: question.answer
            });
        }

        return questions;
    },

    generateSimpleListSum() {
        const listSize = Math.floor(Math.random() * 6) + 5; // 5 to 10 elements
        const nums = [];
        
        for (let i = 0; i < listSize; i++) {
            let num;
            do {
                num = Math.floor(Math.random() * 19) - 9;
            } while (num >= -3 && num <= 3 && num !== 0);
            nums.push(num);
        }
        
        const sum = nums.reduce((acc, val) => acc + val, 0);
        
        return {
            question: `What will this print?\n\n\`\`\`python\nn = ${JSON.stringify(nums)}\nsum = 0\nfor num in n:\n    sum += num\nprint(sum)\n\`\`\``,
            answer: sum.toString()
        };
    },

    generateListSumExcluding() {
        const listSize = Math.floor(Math.random() * 6) + 5;
        const nums = [];
        const k = Math.floor(Math.random() * 4) + 2;
        
        for (let i = 0; i < listSize; i++) {
            let num;
            do {
                num = Math.floor(Math.random() * 19) - 9;
            } while (num >= -3 && num <= 3 && num !== 0);
            nums.push(num);
        }
        
        let sum = 0;
        for (const num of nums) {
            if (num % k !== 0) {
                sum += num;
            }
        }
        
        return {
            question: `What will this print?\n\n\`\`\`python\nn = ${JSON.stringify(nums)}\nsum = 0\nfor num in n:\n    if num % ${k} != 0:\n        sum += num\nprint(sum)\n\`\`\``,
            answer: sum.toString()
        };
    },

    generateListSumWithModification() {
        const listSize = Math.floor(Math.random() * 6) + 5;
        const nums = [];
        let k = Math.floor(Math.random() * 4) + 2;
        let p = Math.floor(Math.random() * 4) + 2;
        
        while (k === p) {
            p = Math.floor(Math.random() * 4) + 2;
        }
        
        for (let i = 0; i < listSize; i++) {
            let num;
            do {
                num = Math.floor(Math.random() * 19) - 9;
            } while (num >= -3 && num <= 3 && num !== 0);
            nums.push(num);
        }
        
        let sum = 0;
        for (const num of nums) {
            if (num % k === 0) {
                sum -= p;
            } else {
                sum += num;
            }
        }
        
        return {
            question: `What will this print?\n\n\`\`\`python\nn = ${JSON.stringify(nums)}\nsum = 0\nfor num in n:\n    if num % ${k} == 0:\n        sum -= ${p}\n    else:\n        sum += num\nprint(sum)\n\`\`\``,
            answer: sum.toString()
        };
    },

    generateListWithSlicing() {
        const listSize = Math.floor(Math.random() * 6) + 6;
        const nums = [];
        
        for (let i = 0; i < listSize; i++) {
            let num;
            do {
                num = Math.floor(Math.random() * 19) - 9;
            } while (num >= -3 && num <= 3 && num !== 0);
            nums.push(num);
        }
        
        const start = Math.floor(Math.random() * 3) + 1;
        const end = Math.max(start + 2, listSize - 1);
        
        const slicedNums = nums.slice(start, end);
        const sum = slicedNums.reduce((acc, val) => acc + val, 0);
        
        return {
            question: `What will this print?\n\n\`\`\`python\nn = ${JSON.stringify(nums)}\ns = n[${start}:${end}]\nsum = 0\nfor num in s:\n    sum += num\nprint(sum)\n\`\`\``,
            answer: sum.toString()
        };
    }
};