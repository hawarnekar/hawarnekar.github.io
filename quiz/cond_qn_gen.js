/**
 * cond_qn_gen.js
 * Generates quiz questions for Python conditional statements (if, if-else, if-elif-else, nested if-else).
 */

// --- Configuration ---
const isLoggingEnabled = false; // Set to true for debugging logs

function log(...args) {
  if (isLoggingEnabled) {
    console.log(...args);
  }
}

// --- Modules ---

/**
 * Module: NumberUtils (Adapted from arithmetic_qn_gen.js)
 * Description: Contains utility functions for number-related operations.
 */
const NumberUtils = {
  getRandomInt: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  // This function evaluates simple arithmetic expressions with actual numbers
  evaluateExpression: function (expression) {
    try {
        log(`evaluateExpression => Input expression: ${expression}`);
        // A safer way to evaluate simple arithmetic without full eval()
        expression = String(expression).replace(/\s/g, ''); // Ensure it's a string first
        let operatorIndex = -1;
        let operator = '';
        // Order matters for '//' vs '/' and handling negative numbers
        const operators = ['//', '%', '*', '/', '+', '-']; // Check longer ops first

        // Find the operator, handling potential negative numbers correctly
        for (const op of operators) {
            let currentIdx = expression.indexOf(op);
            while (currentIdx !== -1) {
                // Ensure it's not part of a negative number at the start or after another operator
                 if (currentIdx > 0 || (currentIdx === 0 && op !== '-')) {
                    // Check if the character before is also an operator (avoid matching '--', '++' etc. if needed)
                    if (currentIdx > 0 && operators.includes(expression[currentIdx-1])) {
                         // This might be a negative number following an operator, e.g., 5 + -3
                         // Continue searching for the *next* occurrence of this operator
                         currentIdx = expression.indexOf(op, currentIdx + 1);
                         continue;
                    }
                    operatorIndex = currentIdx;
                    operator = op;
                    break; // Found the main operator
                 }
                 // Check next occurrence if the first was a unary minus
                 currentIdx = expression.indexOf(op, currentIdx + 1);
            }
            if (operator) break;
        }


        if (!operator) { // No operator found, likely just a number (could be negative)
             const num = parseFloat(expression);
             if (isNaN(num)) throw new Error(`Invalid expression format or single number: ${expression}`);
             log(`evaluateExpression => Single number found: ${num}`);
             return num;
        }

        const operand1Str = expression.substring(0, operatorIndex);
        const operand2Str = expression.substring(operatorIndex + operator.length);

        const operand1 = parseFloat(operand1Str);
        const operand2 = parseFloat(operand2Str);

        if (isNaN(operand1) || isNaN(operand2)) {
             // Handle cases like '5 * -3' where operand2Str might be '-3'
             const operand2Retry = parseFloat(operand2Str);
             if (isNaN(operand1) || isNaN(operand2Retry)) {
                 throw new Error(`Invalid operands in expression: ${expression} (parsed as ${operand1Str}, ${operand2Str})`);
             }
             // If retry worked, use the retried value
             operand2 = operand2Retry;
        }


        log(`evaluateExpression => Evaluating: ${operand1} ${operator} ${operand2}`);

        switch (operator) {
            case '+': return operand1 + operand2;
            case '-': return operand1 - operand2;
            case '*': return operand1 * operand2;
            case '/':
                 if (operand2 === 0) return NaN; // Avoid division by zero
                 const result = operand1 / operand2;
                 // Ensure float result for '/' like Python 3
                 return Number.isInteger(result) ? parseFloat(result.toFixed(1)) : result;
            case '//':
                 if (operand2 === 0) return NaN; // Avoid division by zero
                 // Python's floor division behavior for negative numbers differs slightly
                 // from Math.floor in JS for negative results.
                 // Mimic Python:
                 if (operand1 * operand2 < 0 && operand1 % operand2 !== 0) {
                     // For negative results where there's a remainder, JS Math.floor matches Python
                     return Math.floor(operand1 / operand2) ;
                 } else {
                     // For positive results or exact division, JS Math.floor matches Python
                     return Math.floor(operand1 / operand2);
                 }
            case '%':
                 if (operand2 === 0) return NaN; // Avoid division by zero
                 // Mimic Python's modulo behavior (result has same sign as divisor)
                 return ((operand1 % operand2) + operand2) % operand2;
            // case '**': return Math.pow(operand1, operand2); // Add if needed
            default: throw new Error(`Unsupported operator: ${operator}`);
        }
    } catch (error) {
        console.error("Expression evaluation error:", error.message, "Expression:", expression);
        return NaN; // Indicate failure
    }
  },
  evaluateCondition: function(val1, compOp, val2) {
    log(`Evaluating condition: ${val1} ${compOp} ${val2}`);
    // Ensure values are numbers for comparison
    const num1 = Number(val1);
    const num2 = Number(val2);
    if (isNaN(num1) || isNaN(num2)) {
        log("Warning: Non-numeric value in condition evaluation:", val1, compOp, val2);
        return false; // Or handle as needed
    }
    switch (compOp) {
      case '<': return num1 < num2;
      case '<=': return num1 <= num2;
      case '>': return num1 > num2;
      case '>=': return num1 >= num2;
      case '==': return num1 == num2; // Note: Using == for loose comparison like Python often does with numbers
      case '!=': return num1 != num2;
      default:
        log("Warning: Unknown comparison operator:", compOp);
        return false;
    }
  }
};

/**
 * Module: QuestionFormatter
 * Description: Contains functions for formatting question and answer strings.
 */
const QuestionFormatter = {
  formatIfStatement: (varDefs, condition, printValTrue) => {
    return `${varDefs}\nif ${condition}:\n    print("${printValTrue}")`;
  },
  formatIfElseStatement: (varDefs, condition, printValTrue, printValFalse) => {
    return `${varDefs}\nif ${condition}:\n    print("${printValTrue}")\nelse:\n    print("${printValFalse}")`;
  },
  formatIfElifElseStatement: (varDefs, condition1, printVal1, condition2, printVal2, printValElse) => {
    return `${varDefs}\nif ${condition1}:\n    print("${printVal1}")\nelif ${condition2}:\n    print("${printVal2}")\nelse:\n    print("${printValElse}")`;
  },
  // --- NEW: Formatter for Nested If-Else ---
  formatNestedIfElseStatement: (varDefs, outerCondition, innerCondition, printValOuterTrueInnerTrue, printValOuterTrueInnerFalse, printValOuterFalse) => {
    return `${varDefs}\nif ${outerCondition}:\n    if ${innerCondition}:\n        print("${printValOuterTrueInnerTrue}")\n    else:\n        print("${printValOuterTrueInnerFalse}")\nelse:\n    print("${printValOuterFalse}")`;
  }
};

/**
 * Module: QuestionGenerator
 * Description: Contains functions for generating different types of conditional questions.
 */
const QuestionGenerator = {
  // Reusable function to create the final question object
  genQuestion: function(questionText, answer, difficulty) {
    // Ensure the answer is treated as a string, even if it's empty
    const finalAnswer = answer === null || answer === undefined ? "" : String(answer);
    const entry = {
      topic: 'python',
      subtopic: 'conditional statements',
      difficulty: difficulty,
      type: 'fill', // All conditional questions are fill-in-the-blank for the output
      question: `What will be the output of the following code?\n\n\`\`\`${questionText}\n\`\`\``,
      answer: finalAnswer, // Answer is the string that gets printed (or empty string if nothing prints)
    };
    log(`Generated entry: ${JSON.stringify(entry)}`);
    return entry;
  },

  // --- Specific Question Type Generators ---

  genIfElseQuestion: function(params) {
    const { varDefs, conditionExpr, comparisonOp, comparisonVal, conditionValue, printValTrue, printValFalse } = params;
    log(`Generating if-else question with params: ${JSON.stringify(params)}`);

    const conditionLHS = conditionValue;

     if (isNaN(conditionLHS)) {
        log("Skipping if-else due to invalid pre-calculated condition value.");
        return null;
    }

    const conditionIsTrue = NumberUtils.evaluateCondition(conditionLHS, comparisonOp, comparisonVal);
    const conditionString = `${conditionExpr} ${comparisonOp} ${comparisonVal}`;
    const questionText = QuestionFormatter.formatIfElseStatement(varDefs, conditionString, printValTrue, printValFalse);

    const answer = conditionIsTrue ? printValTrue : printValFalse;

    return QuestionGenerator.genQuestion(questionText, answer, 'easy');
  },

  genIfElifElseQuestion: function(params) {
    const { varDefs, conditionExpr1, comparisonOp1, comparisonVal1, conditionValue1, printVal1,
            conditionExpr2, comparisonOp2, comparisonVal2, conditionValue2, printVal2, printValElse } = params;
    log(`Generating if-elif-else question with params: ${JSON.stringify(params)}`);

    const conditionLHS1 = conditionValue1;
    const conditionLHS2 = conditionValue2;

     if (isNaN(conditionLHS1) || isNaN(conditionLHS2)) {
        log("Skipping if-elif-else due to invalid pre-calculated condition value(s).");
        return null;
    }

    const condition1IsTrue = NumberUtils.evaluateCondition(conditionLHS1, comparisonOp1, comparisonVal1);
    const condition2IsTrue = NumberUtils.evaluateCondition(conditionLHS2, comparisonOp2, comparisonVal2);

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

    return QuestionGenerator.genQuestion(questionText, answer, 'medium');
  },

  // --- NEW: Generator for Nested If-Else ---
  genNestedIfElseQuestion: function(params) {
    const { varDefs,
            conditionExprOuter, comparisonOpOuter, comparisonValOuter, conditionValueOuter,
            conditionExprInner, comparisonOpInner, comparisonValInner, conditionValueInner,
            printValOuterTrueInnerTrue, printValOuterTrueInnerFalse, printValOuterFalse } = params;
    log(`Generating nested if-else question with params: ${JSON.stringify(params)}`);

    const conditionLHSOuter = conditionValueOuter;
    const conditionLHSInner = conditionValueInner;

    if (isNaN(conditionLHSOuter) || isNaN(conditionLHSInner)) {
        log("Skipping nested if-else due to invalid pre-calculated condition value(s).");
        return null;
    }

    const outerConditionIsTrue = NumberUtils.evaluateCondition(conditionLHSOuter, comparisonOpOuter, comparisonValOuter);
    const innerConditionIsTrue = NumberUtils.evaluateCondition(conditionLHSInner, comparisonOpInner, comparisonValInner);

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

    return QuestionGenerator.genQuestion(questionText, answer, 'hard'); // Set difficulty to 'hard'
  }
};

/**
 * Generates a specified number of random conditional questions.
 * @param {number} numQuestions - The total number of questions to generate across all difficulties.
 * @returns {Array<object>} The generated questions.
 */
function genCondQns(numQuestions) {
  log(`Generating ${numQuestions} conditional questions...`);
  const questions = [];
  const arithOps = ['+', '-', '*', '//', '%'];
  const compOps = ['<', '<=', '>', '>=', '==', '!='];
  const N = 25; // Range for random numbers for variables
  const M = 25; // Range for comparison values

  // Use distinct print values to make answers clear
  const printVals = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima"];

  function getRandomOp(opsList) {
    return opsList[Math.floor(Math.random() * opsList.length)];
  }

  // --- MODIFIED: Generates parameters for TWO conditions based on the SAME variables ---
  function getRandomMultiConditionParams() {
      log(`Entering getRandomMultiConditionParams`);
      let x, y, z;
      let varDefs = "";
      let existingVars = {};

      // Define variables
      x = NumberUtils.getRandomInt(2, N);
      y = NumberUtils.getRandomInt(2, N);
      // Ensure y is not zero for division/modulo if it might be used as divisor
      while (y === 0) {
          y = NumberUtils.getRandomInt(2, N);
      }
      existingVars['x'] = x;
      existingVars['y'] = y;
      varDefs = `x = ${x}\ny = ${y}`;

      // --- Condition 1 ---
      let operand1Name1 = 'x';
      let operand2Name1 = 'y';
      let operand1Value1 = existingVars[operand1Name1];
      let operand2Value1 = existingVars[operand2Name1];
      let arithOp1 = getRandomOp(arithOps);
      // Avoid division/modulo by zero if y was chosen as the second operand
      while (['/', '//', '%'].includes(arithOp1) && operand2Value1 === 0) {
          log("Retrying arithOp1 due to potential division by zero");
          arithOp1 = getRandomOp(arithOps); // Simple retry, could refine
      }
      let conditionExpr1 = `${operand1Name1} ${arithOp1} ${operand2Name1}`;
      let expressionToEvaluate1 = `${operand1Value1} ${arithOp1} ${operand2Value1}`;
      let conditionValue1 = NumberUtils.evaluateExpression(expressionToEvaluate1);
      if (isNaN(conditionValue1)) {
          log(`Invalid arithmetic expression 1: ${conditionExpr1} with values ${expressionToEvaluate1}. Retrying.`);
          return null; // Signal to retry
      }
      let comparisonOp1 = getRandomOp(compOps);
      let comparisonVal1 = NumberUtils.getRandomInt(2, M);

      // --- Condition 2 ---
      // Use the same variables but potentially different operands and operator
      let operand1Name2 = Math.random() < 0.5 ? 'x' : 'y'; // Choose x or y
      let operand2Name2 = Math.random() < 0.5 ? 'x' : 'y'; // Choose x or y
      let operand1Value2 = existingVars[operand1Name2];
      let operand2Value2 = existingVars[operand2Name2];
      let arithOp2 = getRandomOp(arithOps);
      // Avoid division/modulo by zero
      while (['/', '//', '%'].includes(arithOp2) && operand2Value2 === 0) {
          log("Retrying arithOp2 due to potential division by zero");
          arithOp2 = getRandomOp(arithOps);
      }
      let conditionExpr2 = `${operand1Name2} ${arithOp2} ${operand2Name2}`;
      let expressionToEvaluate2 = `${operand1Value2} ${arithOp2} ${operand2Value2}`;
      let conditionValue2 = NumberUtils.evaluateExpression(expressionToEvaluate2);
      if (isNaN(conditionValue2)) {
          log(`Invalid arithmetic expression 2: ${conditionExpr2} with values ${expressionToEvaluate2}. Retrying.`);
          return null; // Signal to retry
      }
      let comparisonOp2 = getRandomOp(compOps);
      let comparisonVal2 = NumberUtils.getRandomInt(2, M); // Can be different from comparisonVal1

      // Shuffle and pick distinct print values
      const shuffledVals = [...printVals].sort(() => 0.5 - Math.random()); // Create a shuffled copy

      log(`Exiting getRandomMultiConditionParams`);

      return {
          varDefs,
          // Condition 1 details
          conditionExpr1,
          comparisonOp1,
          comparisonVal1,
          conditionValue1,
          // Condition 2 details
          conditionExpr2,
          comparisonOp2,
          comparisonVal2,
          conditionValue2,
          // Print values (ensure enough unique ones are picked)
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


  let attempts = 0;
  const maxAttempts = numQuestions * 15; // Allow more attempts for variety


  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    let params = getRandomMultiConditionParams();
    if (!params) continue; // Retry if params generation failed

    let nextEntry;

    // --- Generate Easy: If-Else ---
    const ifElseParams = {
        varDefs: params.varDefs,
        conditionExpr: params.conditionExpr1, // Use condition 1
        comparisonOp: params.comparisonOp1,
        comparisonVal: params.comparisonVal1,
        conditionValue: params.conditionValue1,
        printValTrue: params.printValIfElseTrue,
        printValFalse: params.printValIfElseFalse
    };
    nextEntry = QuestionGenerator.genIfElseQuestion(ifElseParams);
    if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }

    // --- Generate Medium: If-Elif-Else ---
    const ifElifElseParams = {
        varDefs: params.varDefs,
        conditionExpr1: params.conditionExpr1,
        comparisonOp1: params.comparisonOp1,
        comparisonVal1: params.comparisonVal1,
        conditionValue1: params.conditionValue1,
        printVal1: params.printValElif1,
        conditionExpr2: params.conditionExpr2, // Use condition 2
        comparisonOp2: params.comparisonOp2,
        comparisonVal2: params.comparisonVal2,
        conditionValue2: params.conditionValue2,
        printVal2: params.printValElif2,
        printValElse: params.printValElifElse
    };
    nextEntry = QuestionGenerator.genIfElifElseQuestion(ifElifElseParams);
     if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }

    // --- Generate Hard: Nested If-Else ---
    const nestedParams = {
        varDefs: params.varDefs,
        conditionExprOuter: params.conditionExpr1, // Use condition 1 as outer
        comparisonOpOuter: params.comparisonOp1,
        comparisonValOuter: params.comparisonVal1,
        conditionValueOuter: params.conditionValue1,
        conditionExprInner: params.conditionExpr2, // Use condition 2 as inner
        comparisonOpInner: params.comparisonOp2,
        comparisonValInner: params.comparisonVal2,
        conditionValueInner: params.conditionValue2,
        printValOuterTrueInnerTrue: params.printValNestOuterTrueInnerTrue,
        printValOuterTrueInnerFalse: params.printValNestOuterTrueInnerFalse,
        printValOuterFalse: params.printValNestOuterFalse
    };
    nextEntry = QuestionGenerator.genNestedIfElseQuestion(nestedParams);
    if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }
  }


  if (attempts >= maxAttempts && questions.length < numQuestions) {
      log(`Warning: Reached max attempts (${maxAttempts}) while trying to generate ${numQuestions} questions. Generated ${questions.length}.`);
  }


  log(`Generated ${questions.length} conditional questions.`);
  // Shuffle the final list to mix difficulties
  questions.sort(() => Math.random() - 0.5);


  return questions.slice(0, numQuestions); // Return exactly numQuestions if more were generated
}

// Example Usage (can be removed or commented out in final version)
// const generatedQuestions = genCondQns(20); // Generate 20 questions including easy, medium, hard
// console.log(JSON.stringify(generatedQuestions.filter(q => q.difficulty === 'hard'), null, 2)); // Log only hard ones for check
// console.log(`Total generated: ${generatedQuestions.length}`);

// Export the main generation function
export { genCondQns };
