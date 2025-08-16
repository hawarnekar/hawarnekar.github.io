/**
 * Arithmetic Operations Question Generator
 * 
 * Generates questions for arithmetic operations with:
 * - Double (easy), triple (medium) and four (hard) operation expressions
 * - Support operators: +, -, *, /, **, //, %
 * - Both direct expressions and variable assignments
 * - Python-compatible operator precedence and division behaviour
 */

window.ArithmeticGenerator = {
    // Generate arithmetic questions for the specified difficulty
    generateQuestions(difficulty, count) {
        const questions = [];
        const operatorCounts = {
            easy: 2,
            medium: 3,
            hard: 4
        };

        const opCount = operatorCounts[difficulty];

        for (let i = 0; i < count; i++) {
            const question = this.generateArithmeticQuestion(opCount);
            questions.push({
                topic: 'python',
                subtopic: 'arithmetic',
                difficulty: difficulty,
                type: 'fill',
                question: question.question,
                answer: question.answer
            });
        }

        return questions;
    },

    generateArithmeticQuestion(opCount) {
        let expression = '';
        let numbers = [];
        let operators = [];
        
        // Generate numbers (avoiding problematic ranges)
        for (let i = 0; i < opCount + 1; i++) {
            let num;
            do {
                num = Math.floor(Math.random() * 11) - 5; // -5 to 5
            } while (num >= -3 && num <= 3 && num !== 0);
            numbers.push(num);
        }
        
        // Generate operators with constraints:
        // - At most one '**' in the expression
        // - At most one of '/', '//' or '%' across the expression
        let exponentCount = 0;
        let divOpCount = 0; // counts '/', '//' and '%'
        for (let i = 0; i < opCount; i++) {
            let op;
            do {
                op = ['+', '-', '*', '/', '**', '//', '%'][Math.floor(Math.random() * 7)];
                const isDivLike = (op === '/' || op === '//' || op === '%');
                // Enforce operator count constraints
                if (op === '**' && exponentCount >= 1) continue;
                if (isDivLike && divOpCount >= 1) continue;
                // New rule: for '//', '%', '**' both operands must be >= 1
                if ((op === '//' || op === '%' || op === '**') && (numbers[i] < 1 || numbers[i + 1] < 1)) continue;
                // Skip floor division and modulo with negative numbers or zero
                if ((op === '//' || op === '%') && (numbers[i] < 0 || numbers[i + 1] <= 0)) continue;
                // Skip division by zero
                if (isDivLike && numbers[i + 1] === 0) continue;
                // Skip very large exponents
                if (op === '**' && Math.abs(numbers[i + 1]) > 3) continue;
                break;
            } while (true);
            operators.push(op);
            if (op === '**') exponentCount++;
            if (op === '/' || op === '//' || op === '%') divOpCount++;
        }
        
        // Build expression tokens so we can parenthesize negative bases for '**'
        const tokens = [numbers[0].toString()];
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '**' && numbers[i] < 0) {
                // Parenthesize the base to ensure Python evaluates (-x) ** y
                tokens[tokens.length - 1] = `(${tokens[tokens.length - 1]})`;
            }
            tokens.push(operators[i]);
            tokens.push(numbers[i + 1].toString());
        }
        expression = tokens.join(' ');
        
        // Add outer parentheses for complex expressions
        if (opCount >= 3) {
            expression = `(${expression})`;
        }
        
        // Calculate the result
        try {
            let result = this.evaluatePythonStyle(numbers, operators);

            // Check for invalid results
            if (!isFinite(result) || isNaN(result)) {
                return this.generateArithmeticQuestion(Math.max(1, opCount - 1));
            }

            const hasDivision = operators.includes('/');
            
            // Prepare answer string with constraints:
            // - If division present: allow only integer or exactly 1 decimal place; otherwise skip
            // - Normalize -0.0 to 0.0
            const normalizeForCheck = (n) => {
                if (Object.is(n, -0)) n = 0;
                let s = n.toFixed(10);
                s = s.replace(/\.0+$/, '.0').replace(/(\.[0-9]*?)0+$/, '$1');
                if (s.endsWith('.')) s = s.slice(0, -1);
                return s;
            };

            let answerStr = '';
            if (hasDivision) {
                const s = normalizeForCheck(result);
                const dotIdx = s.indexOf('.');
                const decPlaces = dotIdx === -1 ? 0 : (s.length - dotIdx - 1);
                if (decPlaces > 1) {
                    // Skip questions with >1 decimal place
                    return this.generateArithmeticQuestion(opCount);
                }
                if (decPlaces === 0) {
                    // Division that yields integer should display x.0 in Python
                    const intVal = Math.round(result);
                    answerStr = `${intVal}.0`;
                } else {
                    const oneDec = (Math.round(result * 10) / 10).toFixed(1);
                    answerStr = (oneDec === '-0.0') ? '0.0' : oneDec;
                }
            } else {
                if (Number.isInteger(result)) {
                    answerStr = Math.round(result).toString();
                } else {
                    // Non-division decimal: only accept if it has <= 1 decimal place
                    const s = normalizeForCheck(result);
                    const decPlaces = s.includes('.') ? s.split('.')[1].length : 0;
                    if (decPlaces > 1) {
                        return this.generateArithmeticQuestion(opCount);
                    }
                    const oneDec = (Math.round(result * 10) / 10).toFixed(1);
                    answerStr = (oneDec === '-0.0') ? '0.0' : oneDec;
                }
            }

            // Final validation - ensure result is within acceptable range
            const numResult = parseFloat(answerStr);
            if (Math.abs(numResult) > 99 || (Math.abs(numResult) < 3 && numResult !== 0)) {
                return this.generateArithmeticQuestion(Math.max(1, opCount - 1));
            }

            const outputFormat = Math.random() < 0.5 ? 'print' : 'variable';

            if (outputFormat === 'print') {
                return {
                    question: `What will this print?\n\n\`\`\`python\nprint(${expression})\n\`\`\``,
                    answer: answerStr
                };
            } else {
                return {
                    question: `What will this print?\n\n\`\`\`python\nans = ${expression}\nprint(ans)\n\`\`\``,
                    answer: answerStr
                };
            }
        } catch (error) {
            // If evaluation fails, generate a simpler question
            return this.generateArithmeticQuestion(Math.max(1, opCount - 1));
        }
    }
};

// Helper: Evaluate numbers/operators with Python-like precedence and associativity
// Supports operators: +, -, *, /, //, %, **
window.ArithmeticGenerator.evaluatePythonStyle = function(numsIn, opsIn) {
    const nums = numsIn.slice();
    const ops = opsIn.slice();

    // 1) Exponentiation (**) - right-associative
    for (let i = ops.length - 1; i >= 0; i--) {
        if (ops[i] === '**') {
            const a = nums[i];
            const b = nums[i + 1];
            const v = Math.pow(a, b);
            nums.splice(i, 2, v);
            ops.splice(i, 1);
        }
    }

    // 2) Multiplicative (*, /, //, %) - left-to-right
    const isMulOp = (op) => op === '*' || op === '/' || op === '//' || op === '%';
    let idx = 0;
    while (idx < ops.length) {
        if (isMulOp(ops[idx])) {
            const a = nums[idx];
            const b = nums[idx + 1];
            let v;
            switch (ops[idx]) {
                case '*': v = a * b; break;
                case '/': v = a / b; break;
                case '//': {
                    // Python floor division; operands here are non-negative by generation constraints
                    v = Math.floor(a / b);
                    break;
                }
                case '%': {
                    // Python modulo: r = a - b * floor(a/b)
                    v = a - b * Math.floor(a / b);
                    break;
                }
            }
            nums.splice(idx, 2, v);
            ops.splice(idx, 1);
        } else {
            idx++;
        }
    }

    // 3) Additive (+, -) - left-to-right
    idx = 0;
    while (idx < ops.length) {
        const a = nums[idx];
        const b = nums[idx + 1];
        let v;
        switch (ops[idx]) {
            case '+': v = a + b; break;
            case '-': v = a - b; break;
            default: v = NaN; // should not happen
        }
        nums.splice(idx, 2, v);
        ops.splice(idx, 1);
    }
    return nums[0];
};
