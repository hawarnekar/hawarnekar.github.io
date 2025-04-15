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
  }
  // Add other NumberUtils functions here if needed by future while loop questions
};

/**
 * Functions for formatting Python code snippets for while loop questions.
 * @namespace QuestionFormatter
 */
const QuestionFormatter = {
  /** Formats an easy while loop summation question. */
  formatWhileLoopSumEasy: (n, m) => {
    return `n = ${n}\nm = ${m}\ntotal = 0\nwhile n <= m:\n    total += n\n    n += 1\nprint(total)`;
  },
  /** Formats a medium while loop summation question with an exclusion condition. */
  formatWhileLoopSumMedium: (n, m, excludeDivisor) => {
    return `n = ${n}\nm = ${m}\ntotal = 0\nwhile n <= m:\n    if n % ${excludeDivisor} != 0:\n        total += n\n    n += 1\nprint(total)`;
  }
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
    const { n, m } = params;
    log(`Generating while loop sum (easy) question with n=${n}, m=${m}`);

    // Calculate the correct sum
    let total = 0;
    for (let i = n; i <= m; i++) {
        total += i;
    }

    const questionText = QuestionFormatter.formatWhileLoopSumEasy(n, m);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'easy');
  },

  /** Generates a 'medium' while loop summation question with exclusion. */
  genWhileLoopSumMedium: function(params) {
    const { n, m, excludeDivisor } = params;
    log(`Generating while loop sum (medium) question with n=${n}, m=${m}, exclude=${excludeDivisor}`);

    // Calculate the correct sum, excluding multiples of excludeDivisor
    let total = 0;
    for (let i = n; i <= m; i++) {
        if (i % excludeDivisor !== 0) {
            total += i;
        }
    }

    const questionText = QuestionFormatter.formatWhileLoopSumMedium(n, m, excludeDivisor);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'medium');
  }
};

/**
 * Generates parameters for While Loop questions (n, m, excludeDivisor).
 * @returns {object} An object containing n, m, and excludeDivisor.
 */
function getRandomWhileLoopParams() {
    log(`Entering getRandomWhileLoopParams`);
    const n = NumberUtils.getRandomInt(LOOP_RANGE_MIN, LOOP_RANGE_MAX);
    // Ensure m > n and m - n <= MAX_DIFF, and m <= LOOP_END_MAX
    const m = NumberUtils.getRandomInt(n + 1, Math.min(n + LOOP_MAX_DIFF, LOOP_END_MAX));
    const excludeDivisor = NumberUtils.getRandomElement(EXCLUDE_DIVISORS);

    log(`Exiting getRandomWhileLoopParams with n=${n}, m=${m}, exclude=${excludeDivisor}`);
    return { n, m, excludeDivisor };
}

/**
 * Generates a specified number of random while loop questions (easy and medium).
 * @param {number} numQuestions - The total number of questions to generate.
 * @returns {Array<object>} An array of generated question objects.
 * @alias module:while_qn_gen.genWhileQns
 */
function genWhileQns(numQuestions) {
  log(`Generating ${numQuestions} while loop questions...`);
  const questions = [];
  let attempts = 0;
  const maxAttempts = numQuestions * MAX_GENERATION_ATTEMPTS_MULTIPLIER;

  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    const loopParams = getRandomWhileLoopParams();
    if (!loopParams) continue; // Should not happen here, but good practice

    // Generate easy question
    let nextEntry = QuestionGenerator.genWhileLoopSumEasy(loopParams);
    if (nextEntry) {
        questions.push(nextEntry);
    }

    // Generate medium question
    nextEntry = QuestionGenerator.genWhileLoopSumMedium(loopParams);
    if (nextEntry) {
        questions.push(nextEntry);
    }
  } // End while loop

  if (attempts >= maxAttempts && questions.length < numQuestions) {
      log(`Warning: Reached max attempts (${maxAttempts}) while trying to generate ${numQuestions} while loop questions. Generated ${questions.length}.`);
  }

  log(`Generated ${questions.length} while loop questions.`);
  // Shuffle the final list to mix difficulties just before returning
  questions.sort(() => Math.random() - 0.5);

  // Return exactly numQuestions if more were generated
  return questions.slice(0, numQuestions);
}

// Export the main generation function
export { genWhileQns };
