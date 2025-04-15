/**
 * while_qn_gen.js
 * Generates quiz questions for Python basic while loops (summation).
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
const LOOP_RANGE_MIN = 1; // Min value for loop start (n)
const LOOP_RANGE_MAX = 10; // Max value for loop start (n) - Increased range slightly
const LOOP_MAX_DIFF = 5; // Max difference (m - n) for loops (so m-n <= 6)
const LOOP_END_MAX = LOOP_RANGE_MAX + LOOP_MAX_DIFF; // Absolute max for m
const EXCLUDE_DIVISORS = Object.freeze([2, 3, 5]);
const LOOP_ACTIONS = Object.freeze(['continue', 'break']); // Actions for hard questions
const INCREMENTING_OPS = Object.freeze(['<', '<=']);
const DECREMENTING_OPS = Object.freeze(['>', '>=']);
const MAX_GENERATION_ATTEMPTS_MULTIPLIER = 5;

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
  formatWhileLoopSumEasy: (n, m, comparisonOp, direction) => {
    const step = direction === 'increment' ? 'n += 1' : 'n -= 1';
    const condition = `n ${comparisonOp} m`;
    return `n = ${n}\nm = ${m}\ntotal = 0\nwhile ${condition}:\n    total += n\n    ${step}\nprint(total)`;
  },
  /** Formats a medium while loop summation question with an exclusion condition. */
  formatWhileLoopSumMedium: (n, m, excludeDivisor, comparisonOp, direction) => {
    const step = direction === 'increment' ? 'n += 1' : 'n -= 1';
    const condition = `n ${comparisonOp} m`;
    return `n = ${n}\nm = ${m}\ntotal = 0\nwhile ${condition}:\n    if n % ${excludeDivisor} != 0:\n        total += n\n    ${step}\nprint(total)`;
  },
  /**
   * Formats a hard while loop summation question with a conditional continue or break.
   * @param {number} n - Loop start value.
   * @param {number} m - Loop end value (or start for decrementing).
   * @param {number} conditionValue - The value to check against 'n'.
   * @param {'continue'|'break'} action - The action to take if n == conditionValue.
   * @param {string} comparisonOp - The comparison operator (e.g., '<=', '>').
   * @param {'increment'|'decrement'} direction - The loop direction.
   * @returns {string} Formatted Python code snippet.
   */
  formatWhileLoopSumHard: (n, m, conditionValue, action, comparisonOp, direction) => {
    const step = direction === 'increment' ? 'n += 1' : 'n -= 1';
    const condition = `n ${comparisonOp} m`;
    const conditionCheck = `if n == ${conditionValue}:`;
    // Important: The 'continue' action needs to include the step *before* continuing
    const actionStatement = action === 'continue' ? `    ${step}\n        continue` : `    break`;
    return `n = ${n}\nm = ${m}\ntotal = 0\nwhile ${condition}:\n    ${conditionCheck}\n    ${actionStatement}\n    total += n\n    ${step}\nprint(total)`;
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
    const { n, m, comparisonOp, direction } = params;
    log(`Generating while loop sum (easy) question with n=${n}, m=${m}, op=${comparisonOp}, dir=${direction}`);

    // Calculate the correct sum by simulating the loop
    let total = 0;
    let currentN = n;
    while (NumberUtils.evaluateCondition(currentN, comparisonOp, m)) {
        total += currentN;
        if (direction === 'increment') {
            currentN += 1;
        } else {
            currentN -= 1;
        }
    }

    const questionText = QuestionFormatter.formatWhileLoopSumEasy(n, m, comparisonOp, direction);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'easy');
  },

  /** Generates a 'medium' while loop summation question with exclusion. */
  genWhileLoopSumMedium: function(params) {
    const { n, m, excludeDivisor, comparisonOp, direction } = params;
    log(`Generating while loop sum (medium) question with n=${n}, m=${m}, exclude=${excludeDivisor}, op=${comparisonOp}, dir=${direction}`);

    // Calculate the correct sum, excluding multiples of excludeDivisor, by simulating the loop
    let total = 0;
    let currentN = n;
    while (NumberUtils.evaluateCondition(currentN, comparisonOp, m)) {
        if (currentN % excludeDivisor !== 0) {
            total += currentN;
        }
        if (direction === 'increment') {
            currentN += 1;
        } else {
            currentN -= 1;
        }
    }

    const questionText = QuestionFormatter.formatWhileLoopSumMedium(n, m, excludeDivisor, comparisonOp, direction);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'medium');
  },

  /** Generates a 'hard' while loop summation question with conditional continue/break. */
  genWhileLoopSumHard: function(params) {
    const { n, m, conditionValue, action, comparisonOp, direction } = params;
    log(`Generating while loop sum (hard) question with n=${n}, m=${m}, conditionValue=${conditionValue}, action=${action}, op=${comparisonOp}, dir=${direction}`);

    // Calculate the correct sum, considering continue or break, by simulating the loop
    let total = 0;
    let currentN = n; // Use a temporary variable for calculation
    while (NumberUtils.evaluateCondition(currentN, comparisonOp, m)) {
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
        total += currentN;
        // Simulate the step at the end of the loop body
        if (direction === 'increment') {
            currentN += 1;
        } else {
            currentN -= 1;
        }
    }

    const questionText = QuestionFormatter.formatWhileLoopSumHard(n, m, conditionValue, action, comparisonOp, direction);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'hard');
  }
};

/**
 * Generates parameters for While Loop questions.
 * Includes n, m, excludeDivisor, conditionValue, action, direction, and comparisonOp.
 * @returns {object} An object containing the generated parameters.
 */
function getRandomWhileLoopParams() {
  log(`Entering getRandomWhileLoopParams`);
  let n, m, comparisonOp, direction, conditionValue;

  // Decide direction first (50/50 chance)
  direction = NumberUtils.getRandomElement(['increment', 'decrement']);

  if (direction === 'increment') {
      // Generate n and m for incrementing loop (n < m)
      n = NumberUtils.getRandomInt(LOOP_RANGE_MIN, LOOP_RANGE_MAX);
      // Ensure m > n and m - n <= MAX_DIFF, and m <= LOOP_END_MAX
      m = NumberUtils.getRandomInt(n + 1, Math.min(n + LOOP_MAX_DIFF, LOOP_END_MAX));
      comparisonOp = NumberUtils.getRandomElement(INCREMENTING_OPS);
      // Ensure conditionValue is within the loop's intended range [n, m]
      // For '<', the loop might not reach m, but the condition check can still use m.
      conditionValue = NumberUtils.getRandomInt(n, m);
  } else { // direction === 'decrement'
      // Generate n and m for decrementing loop (n > m)
      // Let m be the lower bound (target)
      m = NumberUtils.getRandomInt(LOOP_RANGE_MIN, LOOP_RANGE_MAX);
      // Ensure n > m and n - m <= MAX_DIFF, and n <= LOOP_END_MAX
      n = NumberUtils.getRandomInt(m + 1, Math.min(m + LOOP_MAX_DIFF, LOOP_END_MAX));
      comparisonOp = NumberUtils.getRandomElement(DECREMENTING_OPS);
      // Ensure conditionValue is within the loop's intended range [m, n]
      // For '>', the loop might not reach m, but the condition check can still use m.
      conditionValue = NumberUtils.getRandomInt(m, n);
  }

  const excludeDivisor = NumberUtils.getRandomElement(EXCLUDE_DIVISORS);
  const action = NumberUtils.getRandomElement(LOOP_ACTIONS);

  log(`Exiting getRandomWhileLoopParams with n=${n}, m=${m}, exclude=${excludeDivisor}, conditionValue=${conditionValue}, action=${action}, op=${comparisonOp}, dir=${direction}`);
  return { n, m, excludeDivisor, conditionValue, action, comparisonOp, direction };
}

/**
 * Generates a specified number of random while loop questions (easy and medium).
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

    log(`Attempt ${attempts}: Using params n=${loopParams.n}, m=${loopParams.m}, op=${loopParams.comparisonOp}, dir=${loopParams.direction}`);

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
