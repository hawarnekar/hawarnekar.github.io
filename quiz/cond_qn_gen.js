/**
 * cond_qn_gen.js
 * Generates quiz questions for Python conditional statements (if, if-else, if-elif-else, nested if-else).
 * @module cond_qn_gen
 */

// --- Configuration ---
const isLoggingEnabled = false; // Set to true for debugging logs

/**
 * Logs messages to the console if logging is enabled.
 * @param {...any} args - Arguments to log.
 */
function log(...args) {
  if (isLoggingEnabled) {
    console.log('[cond_qn_gen]', ...args); // Added prefix for clarity
  }
}

// --- Constants ---
const ARITHMETIC_OPERATORS = Object.freeze(['+', '-', '*', '//', '%']);
const COMPARISON_OPERATORS = Object.freeze(['<', '<=', '>', '>=', '==', '!=']);
const VARIABLE_VALUE_RANGE = Object.freeze({ MIN: 2, MAX: 25 });
const COMPARISON_VALUE_RANGE = Object.freeze({ MIN: 2, MAX: 25 });
const PRINT_VALUES = Object.freeze([
    "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot",
    "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima"
]);
const MAX_GENERATION_ATTEMPTS_MULTIPLIER = 15;

// --- Modules ---

/**
 * Utility functions for number-related operations.
 * @namespace NumberUtils
 */
const NumberUtils = {
  /**
   * Generates a random integer between min and max (inclusive).
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} A random integer.
   */
  getRandomInt: function (min, max) {
    // Simplified implementation
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Evaluates simple arithmetic expressions involving two operands and one operator,
   * attempting to mimic Python 3 behavior for division and modulo.
   * Does not handle operator precedence or parentheses.
   * @param {string} expression - The expression string (e.g., "5 * 3", "10 // 4").
   * @returns {number|NaN} The result of the evaluation or NaN on error/invalid input.
   */
  evaluateSimpleExpression: function (expression) {
    try {
        log(`evaluateSimpleExpression => Input: ${expression}`);
        const exprStr = String(expression).trim(); // Ensure string and trim whitespace

        // Find the operator (longer ones first)
        let operator = '';
        let operatorIndex = -1;
        const operatorsToSearch = ['//', '%', '*', '/', '+', '-']; // Order matters

        for (const op of operatorsToSearch) {
            // Search for operator, ensuring it's not part of a number (e.g., negative sign at start)
            let currentIdx = exprStr.indexOf(op);
            while (currentIdx !== -1) {
                // Check if it's a binary operator (not a unary minus at the start)
                if (currentIdx > 0 || (currentIdx === 0 && op !== '-')) {
                    // Check if the character before is also an operator (e.g., 5 + -3)
                    // This simple parser assumes only one main operator.
                    // If the previous char is an operator, this 'op' might be part of the second operand.
                    const prevChar = exprStr[currentIdx - 1];
                    if (prevChar && operatorsToSearch.includes(prevChar)) {
                         // Continue search if it looks like a negative second operand
                         currentIdx = exprStr.indexOf(op, currentIdx + 1);
                         continue;
                    }
                    operator = op;
                    operatorIndex = currentIdx;
                    break; // Found the main operator
                }
                // If it was a unary minus at the start, continue searching for this operator
                currentIdx = exprStr.indexOf(op, currentIdx + 1);
            }
            if (operator) break; // Exit outer loop once operator is found
        }

        // Handle case where no operator is found (likely just a number)
        if (!operator) {
             const num = parseFloat(exprStr);
             if (isNaN(num)) throw new Error(`Invalid format or single number: ${exprStr}`);
             log(`evaluateSimpleExpression => Single number found: ${num}`);
             return num;
        }

        // Extract operands
        const operand1Str = exprStr.substring(0, operatorIndex).trim();
        const operand2Str = exprStr.substring(operatorIndex + operator.length).trim();

        const operand1 = parseFloat(operand1Str);
        const operand2 = parseFloat(operand2Str);

        // Validate operands
        if (isNaN(operand1) || isNaN(operand2)) {
            throw new Error(`Invalid operands: '${operand1Str}', '${operand2Str}' in expression: ${exprStr}`);
        }

        log(`evaluateSimpleExpression => Evaluating: ${operand1} ${operator} ${operand2}`);

        // Perform calculation
        switch (operator) {
            case '+': return operand1 + operand2;
            case '-': return operand1 - operand2;
            case '*': return operand1 * operand2;
            case '/':
                 if (operand2 === 0) return NaN; // Avoid division by zero
                 const result = operand1 / operand2;
                 // Mimic Python 3's float result for '/'
                 // Return as float even if result is whole number (e.g., 4.0)
                 return Number.isInteger(result) ? parseFloat(result.toFixed(1)) : result;
            case '//':
                 if (operand2 === 0) return NaN; // Avoid division by zero
                 // Mimic Python's floor division (handles negative numbers differently than JS Math.floor sometimes)
                 // Standard formula: a // b = floor(a/b)
                 return Math.floor(operand1 / operand2);
            case '%':
                 if (operand2 === 0) return NaN; // Avoid division by zero
                 // Mimic Python's modulo behavior (result has same sign as divisor)
                 return ((operand1 % operand2) + operand2) % operand2;
            default:
                // Should not happen if operator search is correct
                throw new Error(`Unsupported operator: ${operator}`);
        }
    } catch (error) {
        console.error("Expression evaluation error:", error.message, "Expression:", expression);
        return NaN; // Indicate failure
    }
  },

  /**
   * Evaluates a simple comparison between two values.
   * @param {number|string} val1 - The left-hand side value.
   * @param {string} compOp - The comparison operator (e.g., '<', '==').
   * @param {number|string} val2 - The right-hand side value.
   * @returns {boolean} The result of the comparison.
   */
  evaluateCondition: function(val1, compOp, val2) {
    log(`Evaluating condition: ${val1} ${compOp} ${val2}`);
    // Convert to numbers for reliable comparison
    const num1 = Number(val1);
    const num2 = Number(val2);

    if (isNaN(num1) || isNaN(num2)) {
        log("Warning: Non-numeric value in condition evaluation:", val1, compOp, val2);
        // Defaulting to false for non-numeric comparisons in this context
        return false;
    }

    switch (compOp) {
      case '<': return num1 < num2;
      case '<=': return num1 <= num2;
      case '>': return num1 > num2;
      case '>=': return num1 >= num2;
      // Using == for loose comparison, similar to Python's behavior with numbers
      case '==': return num1 == num2;
      case '!=': return num1 != num2;
      default:
        log("Warning: Unknown comparison operator:", compOp);
        return false;
    }
  }
};

/**
 * Functions for formatting Python code snippets for questions.
 * @namespace QuestionFormatter
 */
const QuestionFormatter = {
  /** Formats a simple if statement. */
  formatIfStatement: (varDefs, condition, printValTrue) => {
    return `${varDefs}\nif ${condition}:\n    print("${printValTrue}")`;
  },
  /** Formats an if-else statement. */
  formatIfElseStatement: (varDefs, condition, printValTrue, printValFalse) => {
    return `${varDefs}\nif ${condition}:\n    print("${printValTrue}")\nelse:\n    print("${printValFalse}")`;
  },
  /** Formats an if-elif-else statement. */
  formatIfElifElseStatement: (varDefs, condition1, printVal1, condition2, printVal2, printValElse) => {
    return `${varDefs}\nif ${condition1}:\n    print("${printVal1}")\nelif ${condition2}:\n    print("${printVal2}")\nelse:\n    print("${printValElse}")`;
  },
  /** Formats a nested if-else statement. */
  formatNestedIfElseStatement: (varDefs, outerCondition, innerCondition, printValOuterTrueInnerTrue, printValOuterTrueInnerFalse, printValOuterFalse) => {
    return `${varDefs}\nif ${outerCondition}:\n    if ${innerCondition}:\n        print("${printValOuterTrueInnerTrue}")\n    else:\n        print("${printValOuterTrueInnerFalse}")\nelse:\n    print("${printValOuterFalse}")`;
  }
};

/**
 * Functions for generating specific types of conditional questions.
 * @namespace QuestionGenerator
 */
const QuestionGenerator = {
  /**
   * Creates the final question object structure.
   * @param {string} questionText - The formatted Python code snippet.
   * @param {string} answer - The expected output string.
   * @param {'easy'|'medium'|'hard'} difficulty - The difficulty level.
   * @returns {object} The question object.
   */
  createQuestionEntry: function(questionText, answer, difficulty) {
    // Ensure the answer is always a string, even if empty
    const finalAnswer = String(answer ?? ""); // Use nullish coalescing
    const entry = {
      topic: 'python',
      subtopic: 'conditional statements',
      difficulty: difficulty,
      type: 'fill', // All conditional questions are fill-in-the-blank for the output
      // Added 'python' tag for markdown code block highlighting
      question: `What will be the output of the following code?\n\n\`\`\`python\n${questionText}\n\`\`\``,
      answer: finalAnswer,
    };
    log(`Generated entry: ${JSON.stringify(entry)}`);
    return entry;
  },

  /** Generates an 'easy' if-else question. */
  genIfElseQuestion: function(params) {
    const { varDefs, conditionExpr, comparisonOp, comparisonVal, conditionValue, printValTrue, printValFalse } = params;
    log(`Generating if-else question with params: ${JSON.stringify(params)}`);

    if (isNaN(conditionValue)) {
        log("Skipping if-else due to invalid pre-calculated condition value.");
        return null;
    }

    const conditionIsTrue = NumberUtils.evaluateCondition(conditionValue, comparisonOp, comparisonVal);
    const conditionString = `${conditionExpr} ${comparisonOp} ${comparisonVal}`;
    const questionText = QuestionFormatter.formatIfElseStatement(varDefs, conditionString, printValTrue, printValFalse);
    const answer = conditionIsTrue ? printValTrue : printValFalse;

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'easy');
  },

  /** Generates a 'medium' if-elif-else question. */
  genIfElifElseQuestion: function(params) {
    const { varDefs, conditionExpr1, comparisonOp1, comparisonVal1, conditionValue1, printVal1,
            conditionExpr2, comparisonOp2, comparisonVal2, conditionValue2, printVal2, printValElse } = params;
    log(`Generating if-elif-else question with params: ${JSON.stringify(params)}`);

    if (isNaN(conditionValue1) || isNaN(conditionValue2)) {
        log("Skipping if-elif-else due to invalid pre-calculated condition value(s).");
        return null;
    }

    const condition1IsTrue = NumberUtils.evaluateCondition(conditionValue1, comparisonOp1, comparisonVal1);
    const condition2IsTrue = NumberUtils.evaluateCondition(conditionValue2, comparisonOp2, comparisonVal2);

    const conditionString1 = `${conditionExpr1} ${comparisonOp1} ${comparisonVal1}`;
    const conditionString2 = `${conditionExpr2} ${comparisonOp2} ${comparisonVal2}`;
    const questionText = QuestionFormatter.formatIfElifElseStatement(varDefs, conditionString1, printVal1, conditionString2, printVal2, printValElse);

    let answer;
    if (condition1IsTrue) {
      answer = printVal1;
    } else if (condition2IsTrue) {
      answer = printVal2;
    } else {
      answer = printValElse;
    }

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'medium');
  },

  /** Generates a 'hard' nested if-else question. */
  genNestedIfElseQuestion: function(params) {
    const { varDefs,
            conditionExprOuter, comparisonOpOuter, comparisonValOuter, conditionValueOuter,
            conditionExprInner, comparisonOpInner, comparisonValInner, conditionValueInner,
            printValOuterTrueInnerTrue, printValOuterTrueInnerFalse, printValOuterFalse } = params;
    log(`Generating nested if-else question with params: ${JSON.stringify(params)}`);

    if (isNaN(conditionValueOuter) || isNaN(conditionValueInner)) {
        log("Skipping nested if-else due to invalid pre-calculated condition value(s).");
        return null;
    }

    const outerConditionIsTrue = NumberUtils.evaluateCondition(conditionValueOuter, comparisonOpOuter, comparisonValOuter);
    const innerConditionIsTrue = NumberUtils.evaluateCondition(conditionValueInner, comparisonOpInner, comparisonValInner);

    const outerConditionString = `${conditionExprOuter} ${comparisonOpOuter} ${comparisonValOuter}`;
    const innerConditionString = `${conditionExprInner} ${comparisonOpInner} ${comparisonValInner}`;

    const questionText = QuestionFormatter.formatNestedIfElseStatement(
        varDefs, outerConditionString, innerConditionString,
        printValOuterTrueInnerTrue, printValOuterTrueInnerFalse, printValOuterFalse
    );

    let answer;
    if (outerConditionIsTrue) {
        if (innerConditionIsTrue) {
            answer = printValOuterTrueInnerTrue;
        } else {
            answer = printValOuterTrueInnerFalse;
        }
    } else {
        answer = printValOuterFalse;
    }

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'hard');
  }
};

/**
 * Selects a random element from an array.
 * @template T
 * @param {T[]} list - The array to choose from.
 * @returns {T} A random element from the array.
 */
function getRandomElement(list) {
    if (!list || list.length === 0) {
        throw new Error("Cannot get random element from empty or invalid list.");
    }
    return list[Math.floor(Math.random() * list.length)];
}

/**
 * Generates parameters for two distinct conditions based on the same initial variables.
 * Used for if-elif-else and nested if-else questions.
 * @returns {object|null} An object containing parameters for two conditions and print values, or null if generation fails.
 */
function getRandomConditionalParams() {
    log(`Entering getRandomConditionalParams`);
    let x, y;
    const existingVars = {};

    // Define variables, ensuring y is not 0 for potential division/modulo
    x = NumberUtils.getRandomInt(VARIABLE_VALUE_RANGE.MIN, VARIABLE_VALUE_RANGE.MAX);
    do {
        y = NumberUtils.getRandomInt(VARIABLE_VALUE_RANGE.MIN, VARIABLE_VALUE_RANGE.MAX);
    } while (y === 0);

    existingVars['x'] = x;
    existingVars['y'] = y;
    const varDefs = `x = ${x}\ny = ${y}`;

    // --- Generate details for a single condition ---
    const generateConditionDetails = (varNames) => {
        const operand1Name = getRandomElement(varNames);
        const operand2Name = getRandomElement(varNames);
        const operand1Value = existingVars[operand1Name];
        const operand2Value = existingVars[operand2Name];

        let arithOp;
        let conditionValue;
        let attempt = 0;
        const maxArithAttempts = 10; // Prevent infinite loops

        // Find a valid arithmetic operation
        do {
            arithOp = getRandomElement(ARITHMETIC_OPERATORS);
            // Avoid division/modulo by zero explicitly (though y!=0 check helps)
            if (['/', '//', '%'].includes(arithOp) && operand2Value === 0) {
                conditionValue = NaN;
            } else {
                const expressionToEvaluate = `${operand1Value} ${arithOp} ${operand2Value}`;
                conditionValue = NumberUtils.evaluateSimpleExpression(expressionToEvaluate);
            }
            attempt++;
        } while (isNaN(conditionValue) && attempt < maxArithAttempts);

        if (isNaN(conditionValue)) {
            log(`Failed to generate valid arithmetic expression after ${maxArithAttempts} attempts.`);
            return null; // Signal failure
        }

        const conditionExpr = `${operand1Name} ${arithOp} ${operand2Name}`;
        const comparisonOp = getRandomElement(COMPARISON_OPERATORS);
        const comparisonVal = NumberUtils.getRandomInt(COMPARISON_VALUE_RANGE.MIN, COMPARISON_VALUE_RANGE.MAX);

        return { conditionExpr, comparisonOp, comparisonVal, conditionValue };
    };

    // --- Generate Condition 1 ---
    const details1 = generateConditionDetails(['x', 'y']);
    if (!details1) return null;

    // --- Generate Condition 2 (ensure it's likely different) ---
    let details2;
    let attempt = 0;
    const maxConditionAttempts = 10;
    do {
        details2 = generateConditionDetails(['x', 'y']);
        attempt++;
        // Try to ensure conditions are somewhat different, not strictly required but good for variety
    } while ((!details2 || (details1.conditionExpr === details2.conditionExpr && details1.comparisonOp === details2.comparisonOp && details1.comparisonVal === details2.comparisonVal)) && attempt < maxConditionAttempts);

    if (!details2) {
        log(`Failed to generate distinct second condition after ${maxConditionAttempts} attempts.`);
        return null; // Signal failure if second condition couldn't be generated
    }

    // Shuffle and pick distinct print values
    const shuffledVals = [...PRINT_VALUES].sort(() => 0.5 - Math.random());

    log(`Exiting getRandomConditionalParams`);

    return {
        varDefs,
        // Condition 1 details
        conditionExpr1: details1.conditionExpr,
        comparisonOp1: details1.comparisonOp,
        comparisonVal1: details1.comparisonVal,
        conditionValue1: details1.conditionValue,
        // Condition 2 details
        conditionExpr2: details2.conditionExpr,
        comparisonOp2: details2.comparisonOp,
        comparisonVal2: details2.comparisonVal,
        conditionValue2: details2.conditionValue,
        // Print values
        printValIfElseTrue: shuffledVals[0],
        printValIfElseFalse: shuffledVals[1],
        printValElif1: shuffledVals[2],
        printValElif2: shuffledVals[3],
        printValElifElse: shuffledVals[4],
        printValNestOuterTrueInnerTrue: shuffledVals[5],
        printValNestOuterTrueInnerFalse: shuffledVals[6],
        printValNestOuterFalse: shuffledVals[7]
    };
}

/**
 * Generates a specified number of random conditional questions covering different structures and difficulties.
 * @param {number} numQuestions - The total number of questions to generate.
 * @returns {Array<object>} An array of generated question objects.
 * @alias module:cond_qn_gen.genCondQns
 */
function genCondQns(numQuestions) {
  log(`Generating ${numQuestions} conditional questions...`);
  const questions = [];
  let attempts = 0;
  const maxAttempts = numQuestions * MAX_GENERATION_ATTEMPTS_MULTIPLIER;

  const questionGenerators = [
      { type: 'easy', generator: QuestionGenerator.genIfElseQuestion, paramsKey: 'ifElse' },
      { type: 'medium', generator: QuestionGenerator.genIfElifElseQuestion, paramsKey: 'ifElifElse' },
      { type: 'hard', generator: QuestionGenerator.genNestedIfElseQuestion, paramsKey: 'nested' }
  ];

  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    const baseParams = getRandomConditionalParams();
    if (!baseParams) continue; // Retry if base parameter generation failed

    // Randomly select which type of question to generate in this iteration
    const selectedGeneratorInfo = getRandomElement(questionGenerators);

    let specificParams;
    switch (selectedGeneratorInfo.paramsKey) {
        case 'ifElse':
            specificParams = {
                varDefs: baseParams.varDefs,
                conditionExpr: baseParams.conditionExpr1,
                comparisonOp: baseParams.comparisonOp1,
                comparisonVal: baseParams.comparisonVal1,
                conditionValue: baseParams.conditionValue1,
                printValTrue: baseParams.printValIfElseTrue,
                printValFalse: baseParams.printValIfElseFalse
            };
            break;
        case 'ifElifElse':
            specificParams = {
                varDefs: baseParams.varDefs,
                conditionExpr1: baseParams.conditionExpr1, comparisonOp1: baseParams.comparisonOp1, comparisonVal1: baseParams.comparisonVal1, conditionValue1: baseParams.conditionValue1, printVal1: baseParams.printValElif1,
                conditionExpr2: baseParams.conditionExpr2, comparisonOp2: baseParams.comparisonOp2, comparisonVal2: baseParams.comparisonVal2, conditionValue2: baseParams.conditionValue2, printVal2: baseParams.printValElif2,
                printValElse: baseParams.printValElifElse
            };
            break;
        case 'nested':
             specificParams = {
                varDefs: baseParams.varDefs,
                conditionExprOuter: baseParams.conditionExpr1, comparisonOpOuter: baseParams.comparisonOp1, comparisonValOuter: baseParams.comparisonVal1, conditionValueOuter: baseParams.conditionValue1,
                conditionExprInner: baseParams.conditionExpr2, comparisonOpInner: baseParams.comparisonOp2, comparisonValInner: baseParams.comparisonVal2, conditionValueInner: baseParams.conditionValue2,
                printValOuterTrueInnerTrue: baseParams.printValNestOuterTrueInnerTrue,
                printValOuterTrueInnerFalse: baseParams.printValNestOuterTrueInnerFalse,
                printValOuterFalse: baseParams.printValNestOuterFalse
            };
            break;
        default:
            log("Error: Unknown generator type selected.");
            continue;
    }

    const nextEntry = selectedGeneratorInfo.generator(specificParams);

    if (nextEntry) {
        questions.push(nextEntry);
    }
  } // End while loop

  if (attempts >= maxAttempts && questions.length < numQuestions) {
      log(`Warning: Reached max attempts (${maxAttempts}) while trying to generate ${numQuestions} questions. Generated ${questions.length}.`);
  }

  log(`Generated ${questions.length} conditional questions.`);
  // Shuffle the final list to mix difficulties just before returning
  questions.sort(() => Math.random() - 0.5);

  // Return exactly numQuestions if more were generated due to loop structure
  return questions.slice(0, numQuestions);
}

// Export the main generation function
export { genCondQns };
