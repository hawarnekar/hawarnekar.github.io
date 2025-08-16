/**
 * Enhanced Conditional Statements Question Generator
 * 
 * Generates questions for conditional statements with:
 * - Unique ICAO phonetic alphabet responses for each branch
 * - Arithmetic operations with variables and constants
 * - Variable assignment before comparison
 * - Inline arithmetic expressions in conditions
 * - Double arithmetic operations with realistic scenarios
 */

window.ConditionalsGenerator = {
    icaoAlphabet: [
        'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot',
        'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Lima',
        'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo',
        'Sierra', 'Tango', 'Uniform', 'Victor', 'X-ray',
        'Yankee', 'Zulu'
    ],

    // Generate conditional questions for the specified difficulty
    generateQuestions(difficulty, count) {
        const questions = [];

        for (let i = 0; i < count; i++) {
            let question;
            
            if (difficulty === 'easy') {
                question = this.generateSimpleArithmeticConditional();
            } else if (difficulty === 'medium') {
                question = this.generateIfElifElseWithArithmetic();
            } else { // hard
                question = this.generateNestedArithmeticConditional();
            }
            
            questions.push({
                topic: 'python',
                subtopic: 'conditionals',
                difficulty: difficulty,
                type: 'fill',
                question: question.question,
                answer: question.answer
            });
        }

        return questions;
    },

    // Get unique ICAO words ensuring they're all different
    getUniqueWords(count) {
        const shuffled = [...this.icaoAlphabet].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    // Generate numbers avoiding problematic ranges
    generateNumber() {
        let num;
        do {
            num = Math.floor(Math.random() * 19) - 9; // -9 to 9
        } while (num >= -3 && num <= 3 && num !== 0);
        return num;
    },

    // Generate simple arithmetic conditional (Easy)
    generateSimpleArithmeticConditional() {
        const questionTypes = [
            'variable_assignment_comparison',
            'inline_double_arithmetic',
            'mixed_variable_constant'
        ];
        
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        if (type === 'variable_assignment_comparison') {
            return this.generateVariableAssignmentComparison();
        } else if (type === 'inline_double_arithmetic') {
            return this.generateInlineDoubleArithmetic();
        } else {
            return this.generateMixedVariableConstant();
        }
    },

    generateVariableAssignmentComparison() {
        const a = this.generateNumber();
        const b = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op = operators[Math.floor(Math.random() * operators.length)];
        const comparisonOps = ['<', '>', '<=', '>=', '==', '!='];
        const compOp = comparisonOps[Math.floor(Math.random() * comparisonOps.length)];
        
        let result;
        switch (op) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
        }
        
        const threshold = this.generateNumber();
        const [word1, word2] = this.getUniqueWords(2);
        
        let conditionResult;
        switch (compOp) {
            case '<': conditionResult = result < threshold; break;
            case '>': conditionResult = result > threshold; break;
            case '<=': conditionResult = result <= threshold; break;
            case '>=': conditionResult = result >= threshold; break;
            case '==': conditionResult = result == threshold; break;
            case '!=': conditionResult = result != threshold; break;
        }
        
        return {
            question: `What will this print?\n\n\`\`\`python\na = ${a}\nb = ${b}\nres = a ${op} b\nif res ${compOp} ${threshold}:\n    print("${word1}")\nelse:\n    print("${word2}")\n\`\`\``,
            answer: conditionResult ? word1 : word2
        };
    },

    generateInlineDoubleArithmetic() {
        const x = this.generateNumber();
        const y = this.generateNumber();
        const z = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op1 = operators[Math.floor(Math.random() * operators.length)];
        const op2 = operators[Math.floor(Math.random() * operators.length)];
        const comparisonOps = ['<', '>', '<=', '>=', '==', '!='];
        const compOp = comparisonOps[Math.floor(Math.random() * comparisonOps.length)];
        
        let leftSide, rightSide;
        switch (op1) {
            case '+': leftSide = x + y; break;
            case '-': leftSide = x - y; break;
            case '*': leftSide = x * y; break;
        }
        switch (op2) {
            case '+': rightSide = y + z; break;
            case '-': rightSide = y - z; break;
            case '*': rightSide = y * z; break;
        }
        
        const [word1, word2] = this.getUniqueWords(2);
        
        let conditionResult;
        switch (compOp) {
            case '<': conditionResult = leftSide < rightSide; break;
            case '>': conditionResult = leftSide > rightSide; break;
            case '<=': conditionResult = leftSide <= rightSide; break;
            case '>=': conditionResult = leftSide >= rightSide; break;
            case '==': conditionResult = leftSide == rightSide; break;
            case '!=': conditionResult = leftSide != rightSide; break;
        }
        
        return {
            question: `What will this print?\n\n\`\`\`python\nx = ${x}\ny = ${y}\nz = ${z}\nif x ${op1} y ${compOp} y ${op2} z:\n    print("${word1}")\nelse:\n    print("${word2}")\n\`\`\``,
            answer: conditionResult ? word1 : word2
        };
    },

    generateMixedVariableConstant() {
        const a = this.generateNumber();
        const constant = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op = operators[Math.floor(Math.random() * operators.length)];
        const comparisonOps = ['<', '>', '<=', '>=', '==', '!='];
        const compOp = comparisonOps[Math.floor(Math.random() * comparisonOps.length)];
        
        let result;
        switch (op) {
            case '+': result = a + constant; break;
            case '-': result = a - constant; break;
            case '*': result = a * constant; break;
        }
        
        const threshold = this.generateNumber();
        const [word1, word2] = this.getUniqueWords(2);
        
        let conditionResult;
        switch (compOp) {
            case '<': conditionResult = result < threshold; break;
            case '>': conditionResult = result > threshold; break;
            case '<=': conditionResult = result <= threshold; break;
            case '>=': conditionResult = result >= threshold; break;
            case '==': conditionResult = result == threshold; break;
            case '!=': conditionResult = result != threshold; break;
        }
        
        return {
            question: `What will this print?\n\n\`\`\`python\na = ${a}\nif a ${op} ${constant} ${compOp} ${threshold}:\n    print("${word1}")\nelse:\n    print("${word2}")\n\`\`\``,
            answer: conditionResult ? word1 : word2
        };
    },

    // Generate if-elif-else with arithmetic (Medium)
    generateIfElifElseWithArithmetic() {
        const questionTypes = [
            'sequential_assignment',
            'complex_arithmetic_chain',
            'mixed_operations'
        ];
        
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        if (type === 'sequential_assignment') {
            return this.generateSequentialAssignment();
        } else if (type === 'complex_arithmetic_chain') {
            return this.generateComplexArithmeticChain();
        } else {
            return this.generateMixedOperations();
        }
    },

    generateSequentialAssignment() {
        const x = this.generateNumber();
        const y = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op1 = operators[Math.floor(Math.random() * operators.length)];
        const op2 = operators[Math.floor(Math.random() * operators.length)];
        
        let first_calc, second_calc;
        switch (op1) {
            case '+': first_calc = x + y; break;
            case '-': first_calc = x - y; break;
            case '*': first_calc = x * y; break;
        }
        switch (op2) {
            case '+': second_calc = x + first_calc; break;
            case '-': second_calc = x - first_calc; break;
            case '*': second_calc = x * first_calc; break;
        }
        
        const threshold1 = this.generateNumber();
        const threshold2 = this.generateNumber();
        const [word1, word2, word3] = this.getUniqueWords(3);
        
        let result;
        if (second_calc > threshold1) result = word1;
        else if (first_calc < threshold2) result = word2;
        else result = word3;
        
        return {
            question: `What will this print?\n\n\`\`\`python\nx = ${x}\ny = ${y}\nf = x ${op1} y\ns = x ${op2} f\nif s > ${threshold1}:\n    print("${word1}")\nelif f < ${threshold2}:\n    print("${word2}")\nelse:\n    print("${word3}")\n\`\`\``,
            answer: result
        };
    },

    generateComplexArithmeticChain() {
        const a = this.generateNumber();
        const b = this.generateNumber();
        const c = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op1 = operators[Math.floor(Math.random() * operators.length)];
        const op2 = operators[Math.floor(Math.random() * operators.length)];
        
        let expr1, expr2;
        switch (op1) {
            case '+': expr1 = a + b; break;
            case '-': expr1 = a - b; break;
            case '*': expr1 = a * b; break;
        }
        switch (op2) {
            case '+': expr2 = b + c; break;
            case '-': expr2 = b - c; break;
            case '*': expr2 = b * c; break;
        }
        
        const [word1, word2, word3] = this.getUniqueWords(3);
        
        let result;
        if (expr1 > expr2) result = word1;
        else if (expr1 == expr2) result = word2;
        else result = word3;
        
        return {
            question: `What will this print?\n\n\`\`\`python\na = ${a}\nb = ${b}\nc = ${c}\nif a ${op1} b > b ${op2} c:\n    print("${word1}")\nelif a ${op1} b == b ${op2} c:\n    print("${word2}")\nelse:\n    print("${word3}")\n\`\`\``,
            answer: result
        };
    },

    generateMixedOperations() {
        const p = this.generateNumber();
        const q = this.generateNumber();
        const r = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op = operators[Math.floor(Math.random() * operators.length)];
        
        let calculation;
        switch (op) {
            case '+': calculation = p + q; break;
            case '-': calculation = p - q; break;
            case '*': calculation = p * q; break;
        }
        
        const [word1, word2, word3] = this.getUniqueWords(3);
        
        let result;
        if (calculation > r * 2) result = word1;
        else if (p > q) result = word2;
        else result = word3;
        
        return {
            question: `What will this print?\n\n\`\`\`python\np = ${p}\nq = ${q}\nr = ${r}\nif p ${op} q > r * 2:\n    print("${word1}")\nelif p > q:\n    print("${word2}")\nelse:\n    print("${word3}")\n\`\`\``,
            answer: result
        };
    },

    // Generate nested arithmetic conditional (Hard)
    generateNestedArithmeticConditional() {
        const questionTypes = [
            'nested_with_calculations',
            'complex_nested_arithmetic',
            'multi_level_variables'
        ];
        
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        if (type === 'nested_with_calculations') {
            return this.generateNestedWithCalculations();
        } else if (type === 'complex_nested_arithmetic') {
            return this.generateComplexNestedArithmetic();
        } else {
            return this.generateMultiLevelVariables();
        }
    },

    generateNestedWithCalculations() {
        const m = this.generateNumber();
        const n = this.generateNumber();
        const k = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op1 = operators[Math.floor(Math.random() * operators.length)];
        const op2 = operators[Math.floor(Math.random() * operators.length)];
        
        let calc1, calc2;
        switch (op1) {
            case '+': calc1 = m + n; break;
            case '-': calc1 = m - n; break;
            case '*': calc1 = m * n; break;
        }
        switch (op2) {
            case '+': calc2 = n + k; break;
            case '-': calc2 = n - k; break;
            case '*': calc2 = n * k; break;
        }
        
        const [word1, word2, word3, word4] = this.getUniqueWords(4);
        
        let result;
        if (calc1 > 0) {
            if (calc2 > calc1) {
                result = word1;
            } else {
                result = word2;
            }
        } else {
            if (calc2 < 0) {
                result = word3;
            } else {
                result = word4;
            }
        }
        
        return {
            question: `What will this print?\n\n\`\`\`python\nm = ${m}\nn = ${n}\nk = ${k}\nif m ${op1} n > 0:\n    if n ${op2} k > m ${op1} n:\n        print("${word1}")\n    else:\n        print("${word2}")\nelse:\n    if n ${op2} k < 0:\n        print("${word3}")\n    else:\n        print("${word4}")\n\`\`\``,
            answer: result
        };
    },

    generateComplexNestedArithmetic() {
        const u = this.generateNumber();
        const v = this.generateNumber();
        const w = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op1 = operators[Math.floor(Math.random() * operators.length)];
        const op2 = operators[Math.floor(Math.random() * operators.length)];
        
        let outerCalc, innerCalc1, innerCalc2;
        switch (op1) {
            case '+': outerCalc = u + v; break;
            case '-': outerCalc = u - v; break;
            case '*': outerCalc = u * v; break;
        }
        switch (op2) {
            case '+': 
                innerCalc1 = v + w;
                innerCalc2 = u + w;
                break;
            case '-': 
                innerCalc1 = v - w;
                innerCalc2 = u - w;
                break;
            case '*': 
                innerCalc1 = v * w;
                innerCalc2 = u * w;
                break;
        }
        
        const [word1, word2, word3, word4] = this.getUniqueWords(4);
        
        let result;
        if (outerCalc > w) {
            if (innerCalc1 > innerCalc2) {
                result = word1;
            } else {
                result = word2;
            }
        } else {
            if (u > v) {
                result = word3;
            } else {
                result = word4;
            }
        }
        
        return {
            question: `What will this print?\n\n\`\`\`python\nu = ${u}\nv = ${v}\nw = ${w}\nif u ${op1} v > w:\n    if v ${op2} w > u ${op2} w:\n        print("${word1}")\n    else:\n        print("${word2}")\nelse:\n    if u > v:\n        print("${word3}")\n    else:\n        print("${word4}")\n\`\`\``,
            answer: result
        };
    },

    generateMultiLevelVariables() {
        const s = this.generateNumber();
        const t = this.generateNumber();
        const operators = ['+', '-', '*'];
        const op1 = operators[Math.floor(Math.random() * operators.length)];
        const op2 = operators[Math.floor(Math.random() * operators.length)];
        
        let t1, t2, f;
        switch (op1) {
            case '+': t1 = s + t; break;
            case '-': t1 = s - t; break;
            case '*': t1 = s * t; break;
        }
        switch (op2) {
            case '+': t2 = s + t1; break;
            case '-': t2 = s - t1; break;
            case '*': t2 = s * t1; break;
        }
        f = t1 + t2;
        
        const [word1, word2, word3, word4] = this.getUniqueWords(4);
        
        let result;
        if (f > 0) {
            if (t2 > t1) {
                result = word1;
            } else {
                result = word2;
            }
        } else {
            if (t1 > s) {
                result = word3;
            } else {
                result = word4;
            }
        }
        
        return {
            question: `What will this print?\n\n\`\`\`python\ns = ${s}\nt = ${t}\nt1 = s ${op1} t\nt2 = s ${op2} t1\nf = t1 + t2\nif f > 0:\n    if t2 > t1:\n        print("${word1}")\n    else:\n        print("${word2}")\nelse:\n    if t1 > s:\n        print("${word3}")\n    else:\n        print("${word4}")\n\`\`\``,
            answer: result
        };
    }
};
