/**
 * for_qn_gen.js
 * Generates quiz questions for Python basic for loops using range() (summation).
 * Includes incrementing/decrementing loops, variable steps, and continue/break statements.
 * @module for_qn_gen
 */

// --- Configuration ---
const isLoggingEnabled = false; // Set to true for debugging logs

/**
 * Logs messages to the console if logging is enabled.
 * @param {...any} args - Arguments to log.
 */
function log(...args) {
  if (isLoggingEnabled) {
    console.log('[for_qn_gen]', ...args); // Added prefix for clarity
  }
}

// --- Constants ---
// Using similar ranges as while_qn_gen for consistency
const LOOP_RANGE_MIN = 1; // Min value for loop start/end boundary
const LOOP_RANGE_MAX = 15; // Max value for loop start/end boundary
const LOOP_MAX_DIFF = 6; // Max difference between start and end
const LOOP_END_MAX = LOOP_RANGE_MAX + LOOP_MAX_DIFF; // Absolute max boundary
const EXCLUDE_DIVISORS = Object.freeze([2, 3, 5]);
const LOOP_ACTIONS = Object.freeze(['continue', 'break']); // Actions for hard questions
const INCREMENT_STEPS = Object.freeze([1, 2]); // Possible steps for incrementing loops
const DECREMENT_STEPS = Object.freeze([-1, -2]); // Possible steps for decrementing loops
const MAX_GENERATION_ATTEMPTS_MULTIPLIER = 10; // Increased slightly due to more complex generation

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
    if (min > max) { // Handle cases where min might exceed max due to calculations
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
   * Simulates Python's range function to generate the sequence of numbers.
   * @param {number} start - The starting value.
   * @param {number} stop - The stopping value (exclusive).
   * @param {number} step - The step value.
   * @returns {number[]} An array of numbers generated by the range.
   */
  simulateRange: function(start, stop, step) {
    const result = [];
    if (step === 0) {
        log("Warning: Step cannot be zero in range simulation.");
        return [];
    }
    if (step > 0) {
        for (let i = start; i < stop; i += step) {
            result.push(i);
        }
    } else { // step < 0
        for (let i = start; i > stop; i += step) {
            result.push(i);
        }
    }
    return result;
  }
};

/**
 * Functions for formatting Python code snippets for for loop questions.
 * @namespace QuestionFormatter
 */
const QuestionFormatter = {
  /**
   * Formats the range arguments based on start, end (inclusive), and step.
   * @param {number} n - The starting value of the loop.
   * @param {number} m - The ending value (inclusive) of the loop.
   * @param {number} step - The step value.
   * @returns {string} Formatted range arguments string (e.g., "1, 6, 1" or "10, 0, -2").
   */
  formatRangeArgs: (n, m, step) => {
    let stop;
    if (step > 0) {
        stop = m + 1; // Go one past m for inclusion
    } else { // step < 0
        stop = m - 1; // Go one past m (in the negative direction) for inclusion
    }
    // Only include step if it's not 1
    return step === 1 ? `${n}, ${stop}` : `${n}, ${stop}, ${step}`;
  },

  /** Formats an easy for loop summation question using range(). */
  formatForLoopSumEasy: (n, m, step) => {
    const rangeArgs = QuestionFormatter.formatRangeArgs(n, m, step);
    return `total = 0\nfor i in range(${rangeArgs}):\n    total += i\nprint(total)`;
  },

  /** Formats a medium for loop summation question using range() with an exclusion condition. */
  formatForLoopSumMedium: (n, m, step, excludeDivisor) => {
    const rangeArgs = QuestionFormatter.formatRangeArgs(n, m, step);
    return `total = 0\nfor i in range(${rangeArgs}):\n    if i % ${excludeDivisor} != 0:\n        total += i\nprint(total)`;
  },

  /** Formats a hard for loop summation question using range() with conditional continue/break. */
  formatForLoopSumHard: (n, m, step, conditionValue, action) => {
    const rangeArgs = QuestionFormatter.formatRangeArgs(n, m, step);
    const conditionCheck = `if i == ${conditionValue}:`;
    // Note: 'continue' in for loop automatically goes to the next iteration based on range step
    const actionStatement = action === 'continue' ? `    continue` : `    break`;
    return `total = 0\nfor i in range(${rangeArgs}):\n    ${conditionCheck}\n    ${actionStatement}\n    total += i\nprint(total)`;
  }
};

/**
 * Functions for generating specific types of for loop questions.
 * @namespace QuestionGenerator
 */
const QuestionGenerator = {
   /**
   * Creates the final question object structure for for loops.
   * @param {string} questionText - The formatted Python code snippet.
   * @param {string} answer - The expected output string.
   * @param {'easy'|'medium'|'hard'} difficulty - The difficulty level.
   * @returns {object} The question object.
   */
  createQuestionEntry: function(questionText, answer, difficulty) {
    const finalAnswer = String(answer ?? ""); // Ensure string answer
    const entry = {
      topic: 'python',
      subtopic: 'for loops', // Correct subtopic
      difficulty: difficulty,
      type: 'fill',
      // Added 'python' tag for markdown code block highlighting
      question: `What will be the output of the following code?\n\n\`\`\`python\n${questionText}\n\`\`\``,
      answer: finalAnswer,
    };
    log(`Generated for loop entry: ${JSON.stringify(entry)}`);
    return entry;
  },

  /** Generates an 'easy' for loop summation question. */
  genForLoopSumEasy: function(params) {
    const { n, m, step } = params;
    log(`Generating for loop sum (easy) question with n=${n}, m=${m}, step=${step}`);

    // Calculate the correct sum by simulating the range
    let total = 0;
    const stop = step > 0 ? m + 1 : m - 1;
    const sequence = NumberUtils.simulateRange(n, stop, step);
    for (const i of sequence) {
        total += i;
    }

    const questionText = QuestionFormatter.formatForLoopSumEasy(n, m, step);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'easy');
  },

  /** Generates a 'medium' for loop summation question with exclusion. */
  genForLoopSumMedium: function(params) {
    const { n, m, step, excludeDivisor } = params;
    log(`Generating for loop sum (medium) question with n=${n}, m=${m}, step=${step}, exclude=${excludeDivisor}`);

    // Calculate the correct sum, excluding multiples, by simulating the range
    let total = 0;
    const stop = step > 0 ? m + 1 : m - 1;
    const sequence = NumberUtils.simulateRange(n, stop, step);
    for (const i of sequence) {
        if (i % excludeDivisor !== 0) {
            total += i;
        }
    }

    const questionText = QuestionFormatter.formatForLoopSumMedium(n, m, step, excludeDivisor);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'medium');
  },

  /** Generates a 'hard' for loop summation question with conditional continue/break. */
  genForLoopSumHard: function(params) {
    const { n, m, step, conditionValue, action } = params;
    log(`Generating for loop sum (hard) question with n=${n}, m=${m}, step=${step}, conditionValue=${conditionValue}, action=${action}`);

    // Calculate the correct sum, considering continue/break, by simulating the range
    let total = 0;
    const stop = step > 0 ? m + 1 : m - 1;
    const sequence = NumberUtils.simulateRange(n, stop, step);
    for (const i of sequence) {
        if (i == conditionValue) {
            if (action === 'continue') {
                continue; // Skip the rest of the loop body for this iteration
            } else { // action === 'break'
                break; // Exit the loop immediately
            }
        }
        total += i;
    }

    const questionText = QuestionFormatter.formatForLoopSumHard(n, m, step, conditionValue, action);
    const answer = String(total);

    return QuestionGenerator.createQuestionEntry(questionText, answer, 'hard');
  }
};

/**
 * Generates parameters for For Loop questions.
 * Includes n, m, step, direction, excludeDivisor, conditionValue, and action.
 * @returns {object|null} An object containing the generated parameters, or null if generation fails.
 */
function getRandomForLoopParams() {
    log(`Entering getRandomForLoopParams`);
    let n, m, step, direction, conditionValue;

    // Decide direction first (50/50 chance)
    direction = NumberUtils.getRandomElement(['increment', 'decrement']);

    if (direction === 'increment') {
        step = NumberUtils.getRandomElement(INCREMENT_STEPS);
        // Generate n and m for incrementing loop (n < m)
        n = NumberUtils.getRandomInt(LOOP_RANGE_MIN, LOOP_RANGE_MAX);
        // Ensure m > n, m - n <= MAX_DIFF, and m <= LOOP_END_MAX
        // Also ensure the range is valid for the step (at least one iteration possible)
        const minM = n + step; // m must be at least n + step to have a loop body execute
        const maxM = Math.min(n + LOOP_MAX_DIFF, LOOP_END_MAX);
        if (minM > maxM) {
             log("Cannot generate valid incrementing range, retrying...");
             return null; // Indicate failure to generate valid params
        }
        m = NumberUtils.getRandomInt(minM, maxM);
        // Ensure conditionValue is potentially reachable within the loop's range [n, m]
        conditionValue = NumberUtils.getRandomInt(n, m);
    } else { // direction === 'decrement'
        step = NumberUtils.getRandomElement(DECREMENT_STEPS);
        // Generate n and m for decrementing loop (n > m)
        // Let m be the lower bound (target)
        m = NumberUtils.getRandomInt(LOOP_RANGE_MIN, LOOP_RANGE_MAX);
        // Ensure n > m, n - m <= MAX_DIFF, and n <= LOOP_END_MAX
        // Also ensure the range is valid for the step (at least one iteration possible)
        const minN = m - step; // n must be at least m - step (e.g., m + 1 or m + 2)
        const maxN = Math.min(m + LOOP_MAX_DIFF, LOOP_END_MAX);
         if (minN > maxN) {
             log("Cannot generate valid decrementing range, retrying...");
             return null; // Indicate failure to generate valid params
        }
        n = NumberUtils.getRandomInt(minN, maxN);
        // Ensure conditionValue is potentially reachable within the loop's range [m, n]
        conditionValue = NumberUtils.getRandomInt(m, n);
    }

    // Ensure conditionValue is actually reachable with the chosen step
    // Check if (conditionValue - n) is a multiple of step
    if ((conditionValue - n) % step !== 0) {
        // Adjust conditionValue to the nearest reachable value within the range
        const diff = conditionValue - n;
        const remainder = diff % step;
        // Find the closest value <= conditionValue that is reachable
        let adjustedValue = conditionValue - remainder;
        // If the step is negative, the remainder logic might need adjustment,
        // but usually, we want a value *within* the generated sequence.
        // Let's try finding a value within the simulated sequence instead.
        const stopSim = step > 0 ? m + 1 : m - 1;
        const possibleValues = NumberUtils.simulateRange(n, stopSim, step);
        if (possibleValues.length === 0) {
             log("Generated range is empty, retrying...");
             return null; // Empty range, cannot set conditionValue
        }
        // Find the value in the sequence closest to the original random conditionValue
        conditionValue = possibleValues.reduce((prev, curr) => {
            return (Math.abs(curr - conditionValue) < Math.abs(prev - conditionValue) ? curr : prev);
        });
        log(`Adjusted conditionValue to be reachable: ${conditionValue}`);
    }


    const excludeDivisor = NumberUtils.getRandomElement(EXCLUDE_DIVISORS);
    const action = NumberUtils.getRandomElement(LOOP_ACTIONS);

    log(`Exiting getRandomForLoopParams with n=${n}, m=${m}, step=${step}, dir=${direction}, exclude=${excludeDivisor}, conditionValue=${conditionValue}, action=${action}`);
    return { n, m, step, direction, excludeDivisor, conditionValue, action };
}

/**
 * Generates a specified number of random for loop questions covering all difficulties.
 * Ensures an attempt to generate one of each difficulty (easy, medium, hard) per parameter set.
 * @param {number} numQuestions - The total number of questions to generate.
 * @returns {Array<object>} An array of generated question objects.
 * @alias module:for_qn_gen.genForQns
 */
function genForQns(numQuestions) {
  log(`Generating ${numQuestions} for loop questions (attempting all difficulties per param set)...`);
  const questions = [];
  let attempts = 0;
  // Adjust maxAttempts slightly, as each attempt tries to generate 3 questions
  const maxAttempts = Math.ceil(numQuestions / 3) * MAX_GENERATION_ATTEMPTS_MULTIPLIER;

  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    const loopParams = getRandomForLoopParams();
    // Retry if parameter generation failed (e.g., couldn't create a valid range)
    if (!loopParams) {
        log(`Parameter generation failed on attempt ${attempts}, retrying...`);
        continue;
    }

    log(`Attempt ${attempts}: Using params n=${loopParams.n}, m=${loopParams.m}, step=${loopParams.step}, dir=${loopParams.direction}`);

    // Attempt to generate one of each difficulty using the same parameters
    const easyEntry = QuestionGenerator.genForLoopSumEasy(loopParams);
    if (easyEntry && questions.length < numQuestions) {
        questions.push(easyEntry);
    }

    const mediumEntry = QuestionGenerator.genForLoopSumMedium(loopParams);
    if (mediumEntry && questions.length < numQuestions) {
        questions.push(mediumEntry);
    }

    const hardEntry = QuestionGenerator.genForLoopSumHard(loopParams);
    if (hardEntry && questions.length < numQuestions) {
        questions.push(hardEntry);
    }

  } // End while loop

  if (attempts >= maxAttempts && questions.length < numQuestions) {
      log(`Warning: Reached max attempts (${maxAttempts}) while trying to generate ${numQuestions} for loop questions. Generated ${questions.length}.`);
  }

  log(`Generated ${questions.length} for loop questions.`);
  // Shuffle the final list to mix difficulties just before returning
  questions.sort(() => Math.random() - 0.5);

  // Return exactly numQuestions
  return questions.slice(0, numQuestions);
}

// Export the main generation function
export { genForQns };
