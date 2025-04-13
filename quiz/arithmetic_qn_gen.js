const isLoggingEnabled = false;

function log(...args) {
  if (isLoggingEnabled) {
    console.log(...args);
  }
}

// --- Modules ---

/**
 * Module: NumberUtils
 * Description: Contains utility functions for number-related operations.
 */
const NumberUtils = {
  /**
   * Checks if a number has more than one digit after the decimal point.
   * @param number - The number to check.
   * @returns {boolean} True if the number has more than one decimal place, False otherwise.
   */
  hasMoreThanOneDecimalPlace: function (number) {
    return !Number.isInteger(number) && String(number).split('.').length === 2 && String(number).split('.')[1].length > 1;
  },
};

/**
 * Module: QuestionFormatter
 * Description: Contains functions for formatting question and answer strings.
 */
const QuestionFormatter = {
  /**
   * @param args - The numbers used in the question.
   * @param ops - The operator used in the question.
   * @returns {string} The formatted question string.
   */
  formatOneOpQuestion: (args, op) => `${args[0]} ${op} ${args[1]}`,
  formatOneOpVariablesQuestion: (args, op) => `x = ${args[0]}\ny = ${args[1]}\nans = x ${op} y`,
  formatTwoOpQuestion: (args, ops) => `${args[0]} ${ops[0]} ${args[1]} ${ops[1]} ${args[2]}`,
  formatTwoOpVariablesQuestion: (args, ops) => `x = ${args[0]}\ny = ${args[1]}\nz = ${args[2]}\nans = x ${ops[0]} y ${ops[1]} z`,
  formatThreeOpQuestion: (args, ops) => `${args[0]} ${ops[0]} ${args[1]} ${ops[1]} ${args[2]} ${ops[2]} ${args[3]}`,
  formatThreeOpVariablesQuestion: (args, ops) => `w = ${args[0]}\nx = ${args[1]}\ny = ${args[2]}\nz = ${args[3]}\nans = w ${ops[0]} x ${ops[1]} y ${ops[2]} z`,
};
/**
 * Module: QuestionGenerator
 * Description: Contains functions for generating different types of arithmetic questions.
 */
const QuestionGenerator = {
  /**
   * Evaluate the arithmetic expression using code from python_exp_eval.js file
   * @param {string} expression - The arithmetic expression to evaluate.
   * @returns {number} The result of the expression.
   */
  evaluateExpression: function (expression) {
    // Check for '/' and '//' operators in the expression
    let hasDivision = false;
    let hasFloorDivision = false;

    log("Evaluating expression : ", expression);
    // Remove whitespace
    expression = expression.replace(/\s/g, '');
    log("Expression after removing spaces :", expression);

    // Tokenize the expression
    function tokenize(expr) {
      log("Tokenizing expression:", expr);
      const tokens = [];
      let currentNum = '';

      for (let i = 0; i < expr.length; i++) {
        const char = expr[i];

        if (/\d|\./.test(char)) {
            currentNum += char;
        } else if ('+-*/%()'.includes(char)) {
          if (currentNum) {
            tokens.push(parseFloat(currentNum));
            currentNum = '';
          }
          if (char === '*' && expr[i + 1] === '*') {
            tokens.push('**');
            i++;
          } else if (char === '/' && expr[i + 1] === '/') {
            tokens.push('//');
            i++;
          } else if (char === '-' && (i === 0 || expr[i-1] === '(' || '+-*/%'.includes(expr[i-1]))) {
            currentNum = '-'; // Start negative number
          } else {
            tokens.push(char);
          }
        } else if (char == '(' || char == ')') {
          if (currentNum) {
            tokens.push(parseFloat(currentNum));
            currentNum = '';
          }
          tokens.push(char);
        }
      }

      if (currentNum) {
        tokens.push(parseFloat(currentNum));
      }
      log("Tokens:", tokens);
      return tokens;
    }

    // Operator precedence
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '//': 2, '%': 2, '**': 3 };

    // Evaluate the tokens using Shunting Yard algorithm and RPN evaluation
    function evaluate(tokens) {
        log("Evaluating tokens using RPN :", tokens);
        const operators = [];
        const operands = [];

        // Convert to Reverse Polish Notation (RPN)
        for (const token of tokens) {
            if (typeof token === 'number') {
                operands.push(token);
            } else if (token === '(') {
                operators.push(token); // Push opening parenthesis
            } else if (token === ')') {
                // Process all operators until matching '('
                while (operators.length && operators[operators.length - 1] !== '(') {
                    operands.push(operators.pop());
                }
                if (!operators.length) throw new Error("Mismatched parentheses");
                operators.pop(); // Remove '('
            } else { // Operator
                while (operators.length &&
                    operators[operators.length - 1] !== '(' &&
                    precedence[operators[operators.length - 1]] >= precedence[token]) {
                    operands.push(operators.pop());
                }
                operators.push(token);
            }
        }

        // Process remaining operators
        while (operators.length) {
            if (operators[operators.length - 1] === '(') {
                throw new Error("Mismatched parentheses");
            }
            operands.push(operators.pop());
        }
        log("RPN result: ", operands);

        // Evaluate RPN
        const stack = [];
        for (const token of operands) {
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const b = stack.pop();
                const a = stack.pop();

                // Check if either operand is negative for floor division or modulo
                if ((token === '//' || token === '%') && (a < 1 || b < 1)) {
                  log("Skipping floor division or modulus with negative operand(s).");
                  return NaN; // Skip this operation
                }
                switch (token) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/':
                        // Ensure division always returns a float with at least 1 decimal place
                        const divResult = a / b;
                        stack.push(parseFloat(divResult.toFixed(Math.max(1, (divResult.toString().split('.')[1] || '').length))));
                        hasDivision = true;
                        break;
                    case '//': stack.push(Math.floor(a / b)); hasFloorDivision = true; break;
                    case '%': stack.push(a % b); break;
                    case '**': stack.push(Math.pow(a, b)); break;
                }
            }
        }
        let result = stack[0];
        log("Result without .0 : ", result);
        return result;
    }

    try {
        const tokens = tokenize(expression);
        let exp_result = evaluate(tokens);

        if(Number.isNaN(exp_result)) return exp_result;

        // If '/' is present and the result is an integer, add .0 to the result
        if (hasDivision && !hasFloorDivision && Number.isInteger(exp_result)) {
            exp_result = exp_result.toFixed(1);
            log(`Final result with .0 added: ${exp_result}`);
        }

        // If only '//' is present, ensure the result is an integer
        if (!hasDivision && hasFloorDivision) {
            exp_result = Math.floor(exp_result);
            log(`Final result as integer: ${exp_result}`);
        }

        log(`Final evaluated result is ${exp_result}`);
        return exp_result;
    } catch (error) {
        console.error("Invalid expression: " + error.message);
        return NaN;
    }
  },
  genQuestion: function(questionFormat, question, answer, difficulty) {

    if (Number.isNaN(answer)) {
      log("Answer is NaN, skipping.");
      return null;
    }
    if (NumberUtils.hasMoreThanOneDecimalPlace(answer)) {
      log("Answer has more than one decimal place, skipping.");
      return null;
    }
    if (answer > 99 || answer < -99) {
      log("Answer out of range, skipping.");
      return null;
    }
    if (answer < 3 && answer > -3) {
      log("Answer too close to zero, skipping.");
      return null;
    }

    const topic = 'python';
    const subtopic = 'arithmatic operations';
    const type = "fill";
    let entry = {};
    if(questionFormat === "ans = {ans}"){
        entry = {
        topic: topic,
        subtopic: subtopic,
        difficulty: difficulty,
        type: type,
        question: `What will this print?\n\n\`\`\`${question}\nprint(f\"ans = {ans}\")\`\`\``,
        answer: `ans = ${answer}`,
      };
    } else if (questionFormat === "print") {
      entry = {
        topic: topic,
        subtopic: subtopic,
        difficulty: difficulty,
        type: type,
        question: `What will this print?\n\n\`\`\`${question}\`\`\``,
        answer: `${answer}`,
      };
    } else {
      entry = {
        topic: topic,
        subtopic: subtopic,
        difficulty: difficulty,
        type: type,
        question: `What will this print?\n\n\`\`\`${question}\nprint(ans)\`\`\``,
        answer: `${answer}`,
      };
    }
    log(`Generated entry: ${JSON.stringify(entry)}`);
    return entry;
  },

  genArithmaticOneOpQuestions: function (args, op) {
    log(`Generating one-op question with args: ${args}, op: ${op}`);
    const question = `print(${QuestionFormatter.formatOneOpQuestion(args, op)})`;
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${op} (${args[1]})`);
    return QuestionGenerator.genQuestion("print",question, answer, 'easy');
  },
  genArithmaticOneOpVariablesQuestionFormat1: function (args, op) {
    log(`Generating one-op variable question format 1 with args: ${args}, op: ${op}`);
    const question = QuestionFormatter.formatOneOpVariablesQuestion(args, op);
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${op} (${args[1]})`);
    return QuestionGenerator.genQuestion("ans = {ans}",question, answer, 'easy');
  },
  genArithmaticOneOpVariablesQuestionFormat2: function (args, op) {
    log(`Generating one-op variable question format 2 with args: ${args}, op: ${op}`);
    const question = QuestionFormatter.formatOneOpVariablesQuestion(args, op);
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${op} (${args[1]})`);
    return QuestionGenerator.genQuestion("ans",question, answer, 'easy');
  },
  genArithmaticTwoOpQuestions: function (args, ops) {
    log(`Generating two-op question with args: ${args}, ops: ${ops}`);
    const question = `print(${QuestionFormatter.formatTwoOpQuestion(args, ops)})`;
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${ops[0]} (${args[1]}) ${ops[1]} (${args[2]})`);
    return QuestionGenerator.genQuestion("print",question, answer, 'easy');
  },
  genArithmaticTwoOpVariablesQuestionFormat1: function (args, ops) {
    log(`Generating two-op variable question format 1 with args: ${args}, ops: ${ops}`);
    const question = QuestionFormatter.formatTwoOpVariablesQuestion(args, ops);
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${ops[0]} (${args[1]}) ${ops[1]} (${args[2]})`);
    return QuestionGenerator.genQuestion("ans",question, answer, 'easy');
  },
  genArithmaticTwoOpVariablesQuestionFormat2: function (args, ops) {
    log(`Generating two-op variable question format 2 with args: ${args}, ops: ${ops}`);
    const question = QuestionFormatter.formatTwoOpVariablesQuestion(args, ops);
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${ops[0]} (${args[1]}) ${ops[1]} (${args[2]})`);
    return QuestionGenerator.genQuestion("ans = {ans}",question, answer, 'easy');
  },
  genArithmaticThreeOpQuestions: function (args, ops) {
    log(`Generating three-op question with args: ${args}, ops: ${ops}`);
    const question = `print(${QuestionFormatter.formatThreeOpQuestion(args, ops)})`;
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${ops[0]} (${args[1]}) ${ops[1]} (${args[2]}) ${ops[2]} (${args[3]})`);
    return QuestionGenerator.genQuestion("print",question, answer, 'medium');
  },
  genArithmaticThreeOpVariablesQuestionFormat1: function (args, ops) {
    log(`Generating three-op variable question format 1 with args: ${args}, ops: ${ops}`);
    const question = QuestionFormatter.formatThreeOpVariablesQuestion(args, ops);
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${ops[0]} (${args[1]}) ${ops[1]} (${args[2]}) ${ops[2]} (${args[3]})`);
    return QuestionGenerator.genQuestion("ans",question, answer, 'medium');
  },
  genArithmaticThreeOpVariablesQuestionFormat2: function (args, ops) {
    log(`Generating three-op variable question format 2 with args: ${args}, ops: ${ops}`);
    const question = QuestionFormatter.formatThreeOpVariablesQuestion(args, ops);
    const answer = QuestionGenerator.evaluateExpression(`(${args[0]}) ${ops[0]} (${args[1]}) ${ops[1]} (${args[2]}) ${ops[2]} (${args[3]})`);
    return QuestionGenerator.genQuestion("ans = {ans}",question, answer, 'medium');
  },
};

/**
 * Generates a specified number of random arithmetic questions of each type.
 * @param {number} numQuestions - The number of questions to generate.
 * @returns {Array<object>} The generated questions.
 */
function genArithQns(numQuestions) {
  log(`Generating ${numQuestions} questions...`);
  const questions = [];
  const ops = ['+', '-', '*', '/', '**', '//', '%'];
  const N = 12;

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomOp() {
    return ops[Math.floor(Math.random() * ops.length)];
  }

  function getRandomParams(num) {
    const params = [];
    for (let i = 0; i < num; i++) {
      const v = getRandomInt(-N, N);
      if (v === 0) { i--; continue; }
      params.push(v);
    }

    const ops = [];
    for (let i = 0; i < num - 1; i++) {
      const op = getRandomOp();
      if ((op === '/' || op === '//' || op === '%') && params[i + 1] === 0) { i--; continue; }
      if (op === '**' && (params[i + 1] > 2 || params[i + 1] < 0)) { i--; continue; }
      if((op === "//" || op === "%") && (params[i] < 1 || params[i + 1] < 1)) { i--; continue; }
      ops.push(op);
    }
    return [params, ops];
  }

  while(questions.length < numQuestions * 9) {
    let nextEntry;
    // Generate one-operation questions
    let params = getRandomParams(2);
    nextEntry = QuestionGenerator.genArithmaticOneOpQuestions(params[0], params[1][0]);
    if(nextEntry) questions.push(nextEntry);

    params = getRandomParams(2);
    nextEntry = QuestionGenerator.genArithmaticOneOpVariablesQuestionFormat1(params[0], params[1][0]);
    if(nextEntry) questions.push(nextEntry);

    params = getRandomParams(2);
    nextEntry = QuestionGenerator.genArithmaticOneOpVariablesQuestionFormat2(params[0], params[1][0]);
    if(nextEntry) questions.push(nextEntry);

    // Generate two-operation questions
    params = getRandomParams(3);
    nextEntry = QuestionGenerator.genArithmaticTwoOpQuestions(params[0], params[1]);
    if(nextEntry) questions.push(nextEntry);

    params = getRandomParams(3);
    nextEntry = QuestionGenerator.genArithmaticTwoOpVariablesQuestionFormat1(params[0], params[1]);
    if(nextEntry) questions.push(nextEntry);

    params = getRandomParams(3);
    nextEntry = QuestionGenerator.genArithmaticTwoOpVariablesQuestionFormat2(params[0], params[1]);
    if(nextEntry) questions.push(nextEntry);

    // Generate three-operation questions
    params = getRandomParams(4);
    nextEntry = QuestionGenerator.genArithmaticThreeOpQuestions(params[0], params[1]);
    if(nextEntry) questions.push(nextEntry);

    params = getRandomParams(4);
    nextEntry = QuestionGenerator.genArithmaticThreeOpVariablesQuestionFormat1(params[0], params[1]);
    if(nextEntry) questions.push(nextEntry);

    params = getRandomParams(4);
    nextEntry = QuestionGenerator.genArithmaticThreeOpVariablesQuestionFormat2(params[0], params[1]);
    if(nextEntry) questions.push(nextEntry);
  }

  log(`Generated questions: ${questions.length}`);
  return questions;
}

export { genArithQns };
