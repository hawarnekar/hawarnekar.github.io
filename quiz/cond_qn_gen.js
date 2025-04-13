/**
 * cond_qn_gen.js
 * Generates quiz questions for Python conditional statements (if, if-else, if-elif-else).
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
        expression = expression.replace(/\s/g, '');
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
            throw new Error(`Invalid operands in expression: ${expression} (parsed as ${operand1Str}, ${operand2Str})`);
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
                     return Math.floor(operand1 / operand2) ; // JS Math.floor matches Python here
                 } else {
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
    switch (compOp) {
      case '<': return val1 < val2;
      case '<=': return val1 <= val2;
      case '>': return val1 > val2;
      case '>=': return val1 >= val2;
      case '==': return val1 == val2; // Note: Using == for loose comparison like Python often does with numbers
      case '!=': return val1 != val2;
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
  }
};

/**
 * Module: QuestionGenerator
 * Description: Contains functions for generating different types of conditional questions.
 */
const QuestionGenerator = {
  // Reusable function to create the final question object
  genQuestion: function(questionText, answer, difficulty) {
    const entry = {
      topic: 'python',
      subtopic: 'conditional statements',
      difficulty: difficulty,
      type: 'fill',
      question: `What will be the output of the following code?\n\n\`\`\`${questionText}\n\`\`\``,
      answer: `${answer}`, // Answer is the string that gets printed
    };
    log(`Generated entry: ${JSON.stringify(entry)}`);
    return entry;
  },

  // --- Specific Question Type Generators ---

  // genIfQuestion: function(params) {
  //   // **MODIFIED**: Use pre-calculated conditionValue directly
  //   const { varDefs, conditionExpr, comparisonOp, comparisonVal, conditionValue, printValTrue } = params;
  //   log(`Generating if question with params: ${JSON.stringify(params)}`);

  //   // **REMOVED**: No need to evaluate conditionExpr string here
  //   // const conditionLHS = NumberUtils.evaluateExpression(conditionExpr);
  //   const conditionLHS = conditionValue; // Use the pre-calculated value

  //   if (isNaN(conditionLHS)) {
  //       log("Skipping due to invalid pre-calculated condition value.");
  //       return null;
  //   }

  //   const conditionIsTrue = NumberUtils.evaluateCondition(conditionLHS, comparisonOp, comparisonVal);
  //   // Still use conditionExpr for the text representation in the code
  //   const conditionString = `${conditionExpr} ${comparisonOp} ${comparisonVal}`;
  //   const questionText = QuestionFormatter.formatIfStatement(varDefs, conditionString, printValTrue);

  //   const answer = conditionIsTrue ? printValTrue : "";

  //   if (!conditionIsTrue) {
  //       log("Skipping 'if' question where condition is false.");
  //       return null;
  //   }

  //   return QuestionGenerator.genQuestion(questionText, answer, 'easy');
  // },

  genIfElseQuestion: function(params) {
    // **MODIFIED**: Use pre-calculated conditionValue directly
    const { varDefs, conditionExpr, comparisonOp, comparisonVal, conditionValue, printValTrue, printValFalse } = params;
    log(`Generating if-else question with params: ${JSON.stringify(params)}`);

    // **REMOVED**: No need to evaluate conditionExpr string here
    // const conditionLHS = NumberUtils.evaluateExpression(conditionExpr);
    const conditionLHS = conditionValue; // Use the pre-calculated value

     if (isNaN(conditionLHS)) {
        log("Skipping due to invalid pre-calculated condition value.");
        return null;
    }

    const conditionIsTrue = NumberUtils.evaluateCondition(conditionLHS, comparisonOp, comparisonVal);
    const conditionString = `${conditionExpr} ${comparisonOp} ${comparisonVal}`;
    const questionText = QuestionFormatter.formatIfElseStatement(varDefs, conditionString, printValTrue, printValFalse);

    const answer = conditionIsTrue ? printValTrue : printValFalse;

    return QuestionGenerator.genQuestion(questionText, answer, 'easy');
  },

  genIfElifElseQuestion: function(params) {
    // **MODIFIED**: Use pre-calculated conditionValue1 and conditionValue2 directly
    const { varDefs, conditionExpr1, comparisonOp1, comparisonVal1, conditionValue1, printVal1,
            conditionExpr2, comparisonOp2, comparisonVal2, conditionValue2, printVal2, printValElse } = params;
    log(`Generating if-elif-else question with params: ${JSON.stringify(params)}`);

    // **REMOVED**: No need to evaluate conditionExpr strings here
    // const conditionLHS1 = NumberUtils.evaluateExpression(conditionExpr1);
    // const conditionLHS2 = NumberUtils.evaluateExpression(conditionExpr2);
    const conditionLHS1 = conditionValue1; // Use pre-calculated value
    const conditionLHS2 = conditionValue2; // Use pre-calculated value

     if (isNaN(conditionLHS1) || isNaN(conditionLHS2)) {
        log("Skipping due to invalid pre-calculated condition value(s).");
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
  }
};

/**
 * Generates a specified number of random conditional questions.
 * @param {number} numQuestions - The total number of questions to generate.
 * @returns {Array<object>} The generated questions.
 */
function genCondQns(numQuestions) {
  log(`Generating ${numQuestions} conditional questions...`);
  const questions = [];
  const arithOps = ['+', '-', '*', '//', '%'];
  const compOps = ['<', '<=', '>', '>=', '==', '!='];
  const N = 25; // Range for random numbers for variables
  const M = 25; // Range for comparison values

  function getRandomOp(opsList) {
    return opsList[Math.floor(Math.random() * opsList.length)];
  }

  // Generates parameters for a single condition block
  function getRandomConditionParams(existingVars = {}) {
      let x, y, z;
      let varDefs = "";
      let conditionExpr = "";
      let operand1Name, operand2Name;
      let operand1Value, operand2Value;
      // const numVars = Object.keys(existingVars).length === 0 ? NumberUtils.getRandomInt(2, 3) : 0; // Decide 2 or 3 vars only if none exist

      log(`Entering getRandomConditionParams`);

      // Define variables if they don't exist
      x = NumberUtils.getRandomInt(2, N);
      y = NumberUtils.getRandomInt(2, N);
      // Ensure y is not zero for division/modulo if it might be used as divisor
      if (y === 0) y = NumberUtils.getRandomInt(2, N); // Ensure non-zero positive
      existingVars['x'] = x;
      existingVars['y'] = y;
      varDefs = `x = ${x}\ny = ${y}`;

      // Randomly choose which two variables to use in the expression
      // const varNames = Object.keys(existingVars);
      // operand1Name = varNames[Math.floor(Math.random() * varNames.length)];
      // operand2Name = varNames[Math.floor(Math.random() * varNames.length)];
      operand1Name = 'x';
      operand2Name = 'y';
      operand1Value = existingVars[operand1Name];
      operand2Value = existingVars[operand2Name];

      const arithOp = getRandomOp(arithOps);
      conditionExpr = `${operand1Name} ${arithOp} ${operand2Name}`;

      // **MODIFIED**: Evaluate the expression using the *actual values* here
      const expressionToEvaluate = `${operand1Value} ${arithOp} ${operand2Value}`;
      const conditionValue = NumberUtils.evaluateExpression(expressionToEvaluate);

      // Check if the evaluation was valid (e.g., no division by zero)
      if (isNaN(conditionValue)) {
          log(`Invalid arithmetic expression generated or evaluated: ${conditionExpr} with values ${expressionToEvaluate}. Retrying.`);
          return null; // Signal to retry
      }

      const comparisonOp = getRandomOp(compOps);
      const comparisonVal = NumberUtils.getRandomInt(2, M);

      // Use distinct print values to make answers clear
      const printVals = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India"];
      // Shuffle and pick to ensure distinctness more easily
      const shuffledVals = printVals.sort(() => 0.5 - Math.random());

      log(`Exiting getRandomConditionParams`);

      return {
          varDefs,
          conditionExpr,  // The string 'x + y'
          comparisonOp,
          comparisonVal,
          conditionValue, // **NEW**: The calculated numeric value of 'x + y'
          printValTrue: shuffledVals[0],
          printValFalse: shuffledVals[1], // For if-else
          printVal1: shuffledVals[2],     // For if-elif-else
          printVal2: shuffledVals[3],     // For if-elif-else
          printValElse: shuffledVals[4]   // For if-elif-else
      };
  }


  let attempts = 0;
  const maxAttempts = numQuestions * 10; // Increase attempts slightly


  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    let generatedVars = {}; // Store variables defined for this question set
    let params1 = getRandomConditionParams(generatedVars); // Pass empty object to generate initial vars
    if (!params1) continue; // Retry if params generation failed

    // // Try generating an 'if' question (only adds if condition is true)
    // let nextEntry = QuestionGenerator.genIfQuestion(params1);
    // if (nextEntry && questions.length < numQuestions) {
    //     questions.push(nextEntry);
    // }

    // Try generating an 'if-else' question using the same params1
    let nextEntry = QuestionGenerator.genIfElseQuestion(params1);
    nextEntry.comparisonOp = '<';   // ['<', '<=', '>', '>=', '==', '!=']
     if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }

    nextEntry = QuestionGenerator.genIfElseQuestion(params1);
    nextEntry.comparisonOp = '<=';   // ['<', '<=', '>', '>=', '==', '!=']
     if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }

    nextEntry = QuestionGenerator.genIfElseQuestion(params1);
    nextEntry.comparisonOp = '>';   // ['<', '<=', '>', '>=', '==', '!=']
     if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }

    nextEntry = QuestionGenerator.genIfElseQuestion(params1);
    nextEntry.comparisonOp = '>=';   // ['<', '<=', '>', '>=', '==', '!=']
     if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }

    nextEntry = QuestionGenerator.genIfElseQuestion(params1);
    nextEntry.comparisonOp = '==';   // ['<', '<=', '>', '>=', '==', '!=']
     if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }

    nextEntry = QuestionGenerator.genIfElseQuestion(params1);
    nextEntry.comparisonOp = '!=';   // ['<', '<=', '>', '>=', '==', '!=']
     if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }

    // Try generating an 'if-elif-else' question
    // **MODIFIED**: Pass the already generated variables to ensure consistency if needed,
    // but allow it to pick different operands for the second condition.
    let params2 = getRandomConditionParams(generatedVars);
    if (!params2) continue; // Retry if params generation failed

    // Combine params for if-elif-else, ensuring we use the correct calculated values
    const ifElifElseParams = {
        varDefs: params1.varDefs, // Use var defs from the first set (already includes all needed vars)
        conditionExpr1: params1.conditionExpr,
        comparisonOp1: params1.comparisonOp,
        comparisonVal1: params1.comparisonVal,
        conditionValue1: params1.conditionValue, // Use calculated value from params1
        printVal1: params1.printVal1,
        conditionExpr2: params2.conditionExpr, // Use expression string from params2
        comparisonOp2: params2.comparisonOp,
        comparisonVal2: params2.comparisonVal,
        conditionValue2: params2.conditionValue, // Use calculated value from params2
        printVal2: params1.printVal2, // Use distinct print vals assigned earlier
        printValElse: params1.printValElse
    };

    nextEntry = QuestionGenerator.genIfElifElseQuestion(ifElifElseParams);
     if (nextEntry && questions.length < numQuestions) {
        questions.push(nextEntry);
    }
  }


  if (attempts >= maxAttempts) {
      log(`Warning: Reached max attempts (${maxAttempts}) while trying to generate ${numQuestions} questions. Generated ${questions.length}.`);
  }


  log(`Generated ${questions.length} conditional questions.`);
  // Shuffle the questions for better distribution if needed
  // questions.sort(() => Math.random() - 0.5);


  return questions.slice(0, numQuestions); // Return exactly numQuestions if more were generated
}

// Example Usage (can be removed or commented out in final version)
// const generatedQuestions = genCondQns(10);
// console.log(JSON.stringify(generatedQuestions, null, 2));

// Export the main generation function
export { genCondQns };
