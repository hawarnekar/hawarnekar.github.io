/**
 * while_qn_gen.js
 * Generates quiz questions for Python basic while loops (summation).
 * Uses randomized variable names for loop control and accumulator.
 * Initializes accumulator with a random value between -4 and 9.
 * Medium questions include an else block to modify the accumulator.
 * Randomly accumulates either the loop variable or the limit variable.
 * @module while_qn_gen
 */

// --- Configuration ---
const isLoggingEnabled = false; // Set to true for debugging logs

/**
 * Logs messages to the console if logging is enabled.
 * @param {...any} args - Arguments to log.
 */
function log(...args) {
  if (isLoggingEnabled) {
    console.log('[while_qn_gen]', ...args); // Added prefix for clarity
  }
}

// --- Constants ---
const LOOP_RANGE_MIN = 1; // Min value for loop start
const LOOP_RANGE_MAX = 10; // Max value for loop start - Increased range slightly
const LOOP_MAX_DIFF = 4; // Max difference between loop boundaries
const LOOP_END_MAX = LOOP_RANGE_MAX + LOOP_MAX_DIFF; // Absolute max boundary
const EXCLUDE_DIVISORS = Object.freeze([2, 3, 5]);
const LOOP_ACTIONS = Object.freeze(['continue', 'break']); // Actions for hard questions
const INCREMENTING_OPS = Object.freeze(['<', '<=']);
const DECREMENTING_OPS = Object.freeze(['>', '>=']);
const MAX_GENERATION_ATTEMPTS_MULTIPLIER = 5;
const ACCUMULATOR_INIT_MIN = -4;
const ACCUMULATOR_INIT_MAX = 9;
const MEDIUM_ELSE_ACTIONS = Object.freeze(['increment', 'decrement']); // Actions for medium else block
const MEDIUM_ELSE_VALUE_MIN = 1; // Min value for medium else modification
const MEDIUM_ELSE_VALUE_MAX = 5;  // Max value for medium else modification

// --- Variable Names ---
const LOOP_VAR_NAMES = Object.freeze(['a', 'b', 'c', 'd', 'm', 'n', 'p', 'q', 'x', 'y', 'z']);
const ACCUMULATOR_VAR_NAMES = Object.freeze(['sum', 'total']);

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
    min = Math.ceil(min);
    max = Math.floor(max);
    // Handle case where min might be greater than max after ceiling/flooring
    if (min > max) {
        [min, max] = [max, min]; // Swap them
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Selects a random element from an array.
   * @template T
   * @param {T[]} list - The array to choose from.
   * @returns {T} A random element from the array.
   */
   getRandomElement: function(list) {
    if (!list || list.length === 0) {
        throw new Error("Cannot get random element from empty or invalid list.");
    }
    return list[Math.floor(Math.random() * list.length)];
  },

  /**
   * Selects N distinct random elements from an array.
   * @template T
   * @param {T[]} list - The array to choose from.
   * @param {number} count - The number of distinct elements to select.
   * @returns {T[]} An array containing N distinct random elements.
   * @throws {Error} If the list has fewer than N elements or count is invalid.
   */
   getNDistinctRandomElements: function(list, count) {
    if (!list || list.length < count || count < 1) {
        throw new Error(`Cannot get ${count} distinct random elements from a list with ${list?.length ?? 0} items.`);
    }
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  /**
   * Evaluates a simple comparison between two values.
   * @param {number|string} val1 - The left-hand side value.
   * @param {string} compOp - The comparison operator (e.g., '<', '==').
   * @param {number|string} val2 - The right-hand side value.
   * @returns {boolean} The result of the comparison.
   */
  evaluateCondition: function(val1, compOp, val2) {
    // This function is also defined in cond_qn_gen.js, ensure consistency if modified.
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
  // Add other NumberUtils functions here if needed by future while loop questions
};

/**
 * Functions for formatting Python code snippets for while loop questions.
 * @namespace QuestionFormatter
 */
const QuestionFormatter = {
  /** Formats an easy while loop summation question. */
  formatWhileLoopSumEasy: (loopVarName, limitVarName, n, m, comparisonOp, direction, accumulatorName, initialAccumulatorValue, accumulateTargetName) => {
    const step = direction === 'increment' ? `${loopVarName} += 1` : `${loopVarName} -= 1`;
    const condition = `${loopVarName} ${comparisonOp} ${limitVarName}`;
    // Use the initialAccumulatorValue and accumulateTargetName here
    return `${loopVarName} = ${n}\n${limitVarName} = ${m}\n${accumulatorName} = ${initialAccumulatorValue}\nwhile ${condition}:\n    ${accumulatorName} += ${accumulateTargetName}\n    ${step}\nprint(${accumulatorName})`;
  },
  /** Formats a medium while loop summation question with an exclusion condition and else modification. */
  formatWhileLoopSumMedium: (loopVarName, limitVarName, n, m, excludeDivisor, comparisonOp, direction, accumulatorName, initialAccumulatorValue, elseAction, elseValue, accumulateTargetName) => {
    const step = direction === 'increment' ? `${loopVarName} += 1` : `${loopVarName} -= 1`;
    const condition = `${loopVarName} ${comparisonOp} ${limitVarName}`;
    const elseOperator = elseAction === 'increment' ? '+=' : '-=';
    // Use the initialAccumulatorValue and accumulateTargetName here
    return `${loopVarName} = ${n}\n${limitVarName} = ${m}\n${accumulatorName} = ${initialAccumulatorValue}\nwhile ${condition}:\n    if ${loopVarName} % ${excludeDivisor} != 0:\n        ${accumulatorName} += ${accumulateTargetName}\n    else:\n        ${accumulatorName} ${elseOperator} ${elseValue}\n    ${step}\nprint(${accumulatorName})`;
  },
  /**
   * Formats a hard while loop summation question with a conditional continue or break.
   * @param {string} loopVarName - Name of the loop control variable.
   * @param {string} limitVarName - Name of the loop limit variable.
   * @param {number} n - Loop start value.
   * @param {number} m - Loop end value (or start for decrementing).
   * @param {number} conditionValue - The value to check against the loop variable.
   * @param {'continue'|'break'} action - The action to take if loopVar == conditionValue.
   * @param {string} comparisonOp - The comparison operator (e.g., '<=', '>').
   * @param {'increment'|'decrement'} direction - The loop direction.
   * @param {string} accumulatorName - Name of the accumulator variable.
   * @param {number} initialAccumulatorValue - The starting value for the accumulator.
   * @param {string} accumulateTargetName - The name of the variable to add to the accumulator.
   * @returns {string} Formatted Python code snippet.
   */
  formatWhileLoopSumHard: (loopVarName, limitVarName, n, m, conditionValue, action, comparisonOp, direction, accumulatorName, initialAccumulatorValue, accumulateTargetName) => {
    const step = direction === 'increment' ? `${loopVarName} += 1` : `${loopVarName} -= 1`;
    const condition = `${loopVarName} ${comparisonOp} ${limitVarName}`;
    const conditionCheck = `if ${loopVarName} == ${conditionValue}:`;
    // Important: The 'continue' action needs to include the step *before* continuing
    const actionStatement = action === 'continue' ? `    ${step}\n        continue` : `    break`;
    // Use the initialAccumulatorValue and accumulateTargetName here
    return `${loopVarName} = ${n}\n${limitVarName} = ${m}\n${accumulatorName} = ${initialAccumulatorValue}\nwhile ${condition}:\n    ${conditionCheck}\n    ${actionStatement}\n    ${accumulatorName} += ${accumulateTargetName}\n    ${step}\nprint(${accumulatorName})`;
  },
};

/**
 * Functions for generating specific types of while loop questions.
 * @namespace QuestionGenerator
 */
const QuestionGenerator = {
   /**
   * Creates the final question object structure for while loops.
   * @param {string} questionText - The formatted Python code snippet.
   * @param {string} answer - The expected output string.
   * @param {'easy'|'medium'|'hard'} difficulty - The difficulty level.
   * @returns {object} The question object.
   */
  createQuestionEntry: function(questionText, answer, difficulty) {
    const finalAnswer = String(answer ?? ""); // Ensure string answer
    const entry = {
      topic: 'python',
      subtopic: 'while loops',
      difficulty: difficulty,
      type: 'fill',
      // Added 'python' tag for markdown code block highlighting
      question: `What will be the output of the following code?\n\n\`\`\`${questionText}\n\`\`\``,
      answer: finalAnswer,
    };
    log(`Generated while loop entry: ${JSON.stringify(entry)}`);
    return entry;
  },

  /** Generates an 'easy' while loop summation question. */
  genWhileLoopSumEasy: function(params) {
    const { loopVarName, limitVarName, n, m, comparisonOp, direction, accumulatorName, initialAccumulatorValue, accumulateTargetName } = params;
    log(`Generating while loop sum (easy) question with ${loopVarName}=${n}, ${limitVarName}=${m}, op=${comparisonOp}, dir=${direction}, acc=${accumulatorName}, init=${initialAccumulatorValue}, target=${accumulateTargetName}`);

    // Calculate the correct sum by simulating the loop, starting with initial value
    let total = initialAccumulatorValue; // Start simulation with the initial value
    let currentN = n;
    const limitValue = m; // Store the constant limit value

    while (NumberUtils.evaluateCondition(currentN, comparisonOp, limitValue)) {
        const valueToAdd = (accumulateTargetName === loopVarName) ? currentN : limitValue;
        total += valueToAdd;
        if (direction === 'increment') {
            currentN += 1;
        } else {
            currentN -= 1;
        }
    }

    const questionText = QuestionFormatter.formatWhileLoopSumEasy(loopVarName, limitVarName, n, m, comparisonOp, direction, accumulatorName, initialAccumulatorValue, accumulateTargetName);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'easy');
  },

  /** Generates a 'medium' while loop summation question with exclusion and else modification. */
  genWhileLoopSumMedium: function(params) {
    const { loopVarName, limitVarName, n, m, excludeDivisor, comparisonOp, direction, accumulatorName, initialAccumulatorValue, elseAction, elseValue, accumulateTargetName } = params;
    log(`Generating while loop sum (medium) question with ${loopVarName}=${n}, ${limitVarName}=${m}, exclude=${excludeDivisor}, op=${comparisonOp}, dir=${direction}, acc=${accumulatorName}, init=${initialAccumulatorValue}, elseAction=${elseAction}, elseValue=${elseValue}, target=${accumulateTargetName}`);

    // Calculate the correct sum, excluding multiples, starting with initial value, and applying else modification
    let total = initialAccumulatorValue; // Start simulation with the initial value
    let currentN = n;
    const limitValue = m; // Store the constant limit value

    while (NumberUtils.evaluateCondition(currentN, comparisonOp, limitValue)) {
        if (currentN % excludeDivisor !== 0) {
            const valueToAdd = (accumulateTargetName === loopVarName) ? currentN : limitValue;
            total += valueToAdd;
        } else {
            // Apply the else modification
            if (elseAction === 'increment') {
                total += elseValue;
            } else { // decrement
                total -= elseValue;
            }
        }
        // Increment/decrement loop variable
        if (direction === 'increment') {
            currentN += 1;
        } else {
            currentN -= 1;
        }
    }

    const questionText = QuestionFormatter.formatWhileLoopSumMedium(loopVarName, limitVarName, n, m, excludeDivisor, comparisonOp, direction, accumulatorName, initialAccumulatorValue, elseAction, elseValue, accumulateTargetName);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'medium');
  },

  /** Generates a 'hard' while loop summation question with conditional continue/break. */
  genWhileLoopSumHard: function(params) {
    const { loopVarName, limitVarName, n, m, conditionValue, action, comparisonOp, direction, accumulatorName, initialAccumulatorValue, accumulateTargetName } = params;
    log(`Generating while loop sum (hard) question with ${loopVarName}=${n}, ${limitVarName}=${m}, conditionValue=${conditionValue}, action=${action}, op=${comparisonOp}, dir=${direction}, acc=${accumulatorName}, init=${initialAccumulatorValue}, target=${accumulateTargetName}`);

    // Calculate the correct sum, considering continue/break, starting with initial value
    let total = initialAccumulatorValue; // Start simulation with the initial value
    let currentN = n; // Use a temporary variable for calculation
    const limitValue = m; // Store the constant limit value

    while (NumberUtils.evaluateCondition(currentN, comparisonOp, limitValue)) {
        if (currentN == conditionValue) {
            if (action === 'continue') {
                // Simulate the step happening *before* continue in the formatted code
                if (direction === 'increment') {
                    currentN += 1;
                } else {
                    currentN -= 1;
                }
                continue; // Skip the rest of the loop body for this iteration
            } else { // action === 'break'
                break; // Exit the loop immediately
            }
        }
        const valueToAdd = (accumulateTargetName === loopVarName) ? currentN : limitValue;
        total += valueToAdd;
        // Simulate the step at the end of the loop body
        if (direction === 'increment') {
            currentN += 1;
        } else {
            currentN -= 1;
        }
    }

    const questionText = QuestionFormatter.formatWhileLoopSumHard(loopVarName, limitVarName, n, m, conditionValue, action, comparisonOp, direction, accumulatorName, initialAccumulatorValue, accumulateTargetName);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'hard');
  }
};

/**
 * Generates parameters for While Loop questions.
 * Includes n, m, excludeDivisor, conditionValue, action, direction, comparisonOp,
 * randomized variable names (loopVarName, limitVarName, accumulatorName),
 * a random initial accumulator value, parameters for the medium else block,
 * and determines whether to accumulate the loop variable or the limit variable.
 * @returns {object} An object containing the generated parameters.
 */
function getRandomWhileLoopParams() {
  log(`Entering getRandomWhileLoopParams`);
  let n, m, comparisonOp, direction, conditionValue;
  let loopVarName, limitVarName, accumulatorName, accumulateTargetName;

  // Select loop, limit, and accumulator variable names (must be distinct)
  [loopVarName, limitVarName] = NumberUtils.getNDistinctRandomElements(LOOP_VAR_NAMES, 2);
  [accumulatorName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 1);

  // Decide whether to accumulate the loop variable or the limit variable (50/50 chance)
  accumulateTargetName = (Math.random() < 0.5) ? loopVarName : limitVarName;
  log(`Accumulation target set to: ${accumulateTargetName}`);

  // Generate random initial value for the accumulator
  const initialAccumulatorValue = NumberUtils.getRandomInt(ACCUMULATOR_INIT_MIN, ACCUMULATOR_INIT_MAX);

  // Generate parameters for the medium else block
  const elseAction = NumberUtils.getRandomElement(MEDIUM_ELSE_ACTIONS);
  const elseValue = NumberUtils.getRandomInt(MEDIUM_ELSE_VALUE_MIN, MEDIUM_ELSE_VALUE_MAX);

  // Decide direction first (50/50 chance)
  direction = NumberUtils.getRandomElement(['increment', 'decrement']);

  if (direction === 'increment') {
      // Generate n and m for incrementing loop (n < m)
      n = NumberUtils.getRandomInt(LOOP_RANGE_MIN, LOOP_RANGE_MAX);
      // Ensure m > n and m - n <= MAX_DIFF, and m <= LOOP_END_MAX
      m = NumberUtils.getRandomInt(n + 1, Math.min(n + LOOP_MAX_DIFF, LOOP_END_MAX));
      comparisonOp = NumberUtils.getRandomElement(INCREMENTING_OPS);
      // Ensure conditionValue is within the loop's intended range [n, m]
      conditionValue = NumberUtils.getRandomInt(n, m);
  } else { // direction === 'decrement'
      // Generate n and m for decrementing loop (n > m)
      // Let m be the lower bound (target)
      m = NumberUtils.getRandomInt(LOOP_RANGE_MIN, LOOP_RANGE_MAX);
      // Ensure n > m and n - m <= MAX_DIFF, and n <= LOOP_END_MAX
      n = NumberUtils.getRandomInt(m + 1, Math.min(m + LOOP_MAX_DIFF, LOOP_END_MAX));
      comparisonOp = NumberUtils.getRandomElement(DECREMENTING_OPS);
      // Ensure conditionValue is within the loop's intended range [m, n]
      conditionValue = NumberUtils.getRandomInt(m, n);
  }

  const excludeDivisor = NumberUtils.getRandomElement(EXCLUDE_DIVISORS);
  const action = NumberUtils.getRandomElement(LOOP_ACTIONS); // For hard questions

  log(`Exiting getRandomWhileLoopParams with loopVar=${loopVarName}(${n}), limitVar=${limitVarName}(${m}), acc=${accumulatorName}, init=${initialAccumulatorValue}, target=${accumulateTargetName}, exclude=${excludeDivisor}, conditionValue=${conditionValue}, action=${action}, op=${comparisonOp}, dir=${direction}, elseAction=${elseAction}, elseValue=${elseValue}`);
  return {
      loopVarName, limitVarName, n, m, excludeDivisor, conditionValue, action,
      comparisonOp, direction, accumulatorName, initialAccumulatorValue,
      elseAction, elseValue,
      accumulateTargetName // Added new param
    };
}

/**
 * Generates a specified number of random while loop questions (easy, medium, hard).
 * Uses randomized variable names and initial accumulator values.
 * Medium questions include an else block modification.
 * Randomly accumulates either the loop variable or the limit variable.
 * @param {number} numQuestions - The total number of questions to generate.
 * @returns {Array<object>} An array of generated question objects.
 * @alias module:while_qn_gen.genWhileQns
 */
function genWhileQns(numQuestions) {
  log(`Generating ${numQuestions} while loop questions (attempting all difficulties per param set)...`);
  const questions = [];
  let attempts = 0;
  // Adjust maxAttempts slightly, as each attempt tries to generate 3 questions
  const maxAttempts = Math.ceil(numQuestions / 3) * MAX_GENERATION_ATTEMPTS_MULTIPLIER;

  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    const loopParams = getRandomWhileLoopParams();
    if (!loopParams) continue; // Should not happen here, but good practice

    log(`Attempt ${attempts}: Using params loopVar=${loopParams.loopVarName}(${loopParams.n}), limitVar=${loopParams.limitVarName}(${loopParams.m}), op=${loopParams.comparisonOp}, dir=${loopParams.direction}, acc=${loopParams.accumulatorName}, init=${loopParams.initialAccumulatorValue}, target=${loopParams.accumulateTargetName}, elseAction=${loopParams.elseAction}, elseValue=${loopParams.elseValue}`);

    // Attempt to generate one of each difficulty using the same parameters
    const easyEntry = QuestionGenerator.genWhileLoopSumEasy(loopParams);
    if (easyEntry && questions.length < numQuestions) {
        questions.push(easyEntry);
    }

    const mediumEntry = QuestionGenerator.genWhileLoopSumMedium(loopParams);
    if (mediumEntry && questions.length < numQuestions) {
        questions.push(mediumEntry);
    }

    const hardEntry = QuestionGenerator.genWhileLoopSumHard(loopParams);
    if (hardEntry && questions.length < numQuestions) {
        questions.push(hardEntry);
    }

  } // End while loop

  if (attempts >= maxAttempts && questions.length < numQuestions) {
      log(`Warning: Reached max attempts (${maxAttempts}) while trying to generate ${numQuestions} while loop questions. Generated ${questions.length}.`);
  }

  log(`Generated ${questions.length} while loop questions.`);
  // Shuffle the final list to mix difficulties just before returning
  questions.sort(() => Math.random() - 0.5);

  // Return exactly numQuestions
  return questions.slice(0, numQuestions);
}

// Export the main generation function
export { genWhileQns };
