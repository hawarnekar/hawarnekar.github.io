/**
 * list_qn_gen.js
 * Generates quiz questions for Python basic list operations with numeric lists.
 * Avoids using Python's built-in functions like sum(), len(), min(), max(), count(), or 'in' operator for lists.
 * @module list_qn_gen
 */

// --- Configuration ---
const isLoggingEnabled = false; // Set to true for debugging logs

/**
 * Logs messages to the console if logging is enabled.
 * @param {...any} args - Arguments to log.
 */
function log(...args) {
  if (isLoggingEnabled) {
    console.log('[list_qn_gen]', ...args);
  }
}

// --- Constants ---
const LIST_NUMBER_MIN_VALUE = -9;
const LIST_NUMBER_MAX_VALUE = 10;
const LIST_MIN_LENGTH_EASY = 4;
const LIST_MAX_LENGTH_EASY = 8;
const LIST_MIN_LENGTH_MEDIUM = 15;
const LIST_MAX_LENGTH_MEDIUM = 25;

const TARGET_NUMBER_MIN_VALUE = -11;
const TARGET_NUMBER_MAX_VALUE = 12;
const MAX_GENERATION_ATTEMPTS_MULTIPLIER = 10;

// --- Variable Names ---
const LIST_VAR_NAMES = Object.freeze(['my_list', 'data', 'numbers', 'elements', 'items', 'x', 'y', 'a', 'arr', 'my_arr']);
const ITEM_VAR_NAMES = Object.freeze(['i', 'j', 'idx', 'n', 'num', 'val', 'el']);
const ACCUMULATOR_VAR_NAMES = Object.freeze(['res', 'ans', 'm', 't', 's', 'c']);
const TARGET_VAR_NAMES = Object.freeze(['v2', 's1', 'key']);

// --- Modules ---

/**
 * Utility functions for number-related operations.
 * @namespace NumberUtils
 */
const NumberUtils = {
  getRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    if (min > max) {
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getRandomElement: function(list) {
    if (!list || list.length === 0) {
        throw new Error("Cannot get random element from empty or invalid list.");
    }
    return list[Math.floor(Math.random() * list.length)];
  },

  getNDistinctRandomElements: function(list, count) {
    if (!list || list.length < count || count < 1) {
        throw new Error(`Cannot get ${count} distinct random elements from a list with ${list?.length ?? 0} items.`);
    }
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
};

/**
 * Functions for formatting Python code snippets for list questions.
 * @namespace QuestionFormatter
 */
const QuestionFormatter = {
  /**
   * Formats a JavaScript array into a Python list string representation.
   * For 'medium' difficulty questions with more than 'elementsPerLine' items,
   * it formats the list across multiple lines.
   * @param {string} listVarName - The name of the list variable (for indentation calculation).
   * @param {number[]} actualList - The array of numbers.
   * @param {'easy'|'medium'} difficulty - The difficulty level of the question.
   * @param {number} [elementsPerLine=6] - Max elements per line for multi-line lists.
   * @returns {string} Python list string (e.g., "[1, 2, 3]" or "[1, 2, 3, 4, 5, 6,\n           7, 8]").
   */
  formatPythonListString: function(listVarName, actualList, difficulty, elementsPerLine = 6) {
    if (actualList.length === 0) {
        return "[]";
    }

    // For easy questions or medium lists short enough for a single line
    if (difficulty !== 'medium' || actualList.length <= elementsPerLine) {
        return `[${actualList.join(', ')}]`;
    }

    // Medium difficulty and list is long enough for multi-line
    let result = "[";
    const indentString = " ".repeat(listVarName.length + 4); // Indent to align with first element after "listVarName = ["

    for (let i = 0; i < actualList.length; i++) {
        result += actualList[i];
        if (i < actualList.length - 1) { // If not the last element
            result += ", ";
            if ((i + 1) % elementsPerLine === 0) { // End of a line
                result += `\n${indentString}`;
            }
        }
    }
    result += "]";
    return result;
  },

  formatListSumAll: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n${accVarName} = 0\nfor ${itemVarName} in ${listVarName}:\n    ${accVarName} += ${itemVarName}\nprint(${accVarName})`,

  formatListCountElements: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n${accVarName} = 0\nfor ${itemVarName} in ${listVarName}:\n    ${accVarName} += 1\nprint(${accVarName})`,

  formatListSumEven: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n${accVarName} = 0\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} % 2 == 0:\n        ${accVarName} += ${itemVarName}\nprint(${accVarName})`,

  formatListSumOdd: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n${accVarName} = 0\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} % 2 != 0:\n        ${accVarName} += ${itemVarName}\nprint(${accVarName})`,

  formatListCheckPresence: (listVarName, listPyString, itemVarName, targetVarName, targetValue, accVarName, idxVarName) =>
    `${listVarName} = ${listPyString}\n${targetVarName} = ${targetValue}\n${accVarName} = -1\n${idxVarName} = 0\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} == ${targetVarName}:\n        ${accVarName} = ${idxVarName}\n    ${idxVarName} += 1\nprint(${accVarName})`,

  formatListCountOccurrences: (listVarName, listPyString, itemVarName, targetVarName, targetValue, accVarName) =>
    `${listVarName} = ${listPyString}\n${targetVarName} = ${targetValue}\n${accVarName} = 0\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} == ${targetVarName}:\n        ${accVarName} += 1\nprint(${accVarName})`,

  formatListFindSmallest: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n${accVarName} = ${listVarName}[0]\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${accVarName}:\n        ${accVarName} = ${itemVarName}\nprint(${accVarName})`,

  formatListFindLargest: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n${accVarName} = ${listVarName}[0]\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > ${accVarName}:\n        ${accVarName} = ${itemVarName}\nprint(${accVarName})`,
};

/**
 * Functions for generating specific types of list questions.
 * @namespace QuestionGenerator
 */
const QuestionGenerator = {
  createQuestionEntry: function(questionText, answer, difficulty) {
    const finalAnswer = String(answer ?? "");
    const entry = {
      topic: 'python',
      subtopic: 'list operations',
      difficulty: difficulty,
      type: 'fill',
      question: `What will be the output of the following code?\n\n\`\`\`${questionText}\n\`\`\``,
      answer: finalAnswer,
    };
    log(`Generated list entry: ${JSON.stringify(entry)}`);
    return entry;
  },

  genListSumAllEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum all (easy) with ${listVarName}, acc=${accVarName}`);
    let total = 0;
    for (const num of actualList) {
      total += num;
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumAll(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, total, 'easy');
  },

  genListCountElementsEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list count elements (easy) with ${listVarName}, acc=${accVarName}`);
    const count = actualList.length;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListCountElements(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, count, 'easy');
  },

  genListSumEvenEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum even (easy) with ${listVarName}, acc=${accVarName}`);
    let evenSum = 0;
    for (const num of actualList) {
      if (num % 2 === 0) {
        evenSum += num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumEven(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, evenSum, 'easy');
  },

  genListSumOddEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum odd (easy) with ${listVarName}, acc=${accVarName}`);
    let oddSum = 0;
    for (const num of actualList) {
      if (num % 2 !== 0) {
        oddSum += num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumOdd(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, oddSum, 'easy');
  },

  genListCheckPresenceMedium: function(params) {
    const { listVarName, actualList, itemVarName, targetVarName, targetValue, accVarName, idxVarName } = params;
    log(`Generating list check presence (medium) with ${listVarName}, target=${targetValue}, acc=${accVarName}`);
    let foundAtIndex = -1;
    // Find the last occurrence
    for (let i = 0; i < actualList.length; i++) {
      if (actualList[i] === targetValue) {
        foundAtIndex = i;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'medium');
    const questionText = QuestionFormatter.formatListCheckPresence(listVarName, listPyString, itemVarName, targetVarName, targetValue, accVarName, idxVarName);
    return QuestionGenerator.createQuestionEntry(questionText, foundAtIndex, 'medium');
  },

  genListCountOccurrencesMedium: function(params) {
    const { listVarName, actualList, itemVarName, targetVarName, targetValue, accVarName } = params;
    log(`Generating list count occurrences (medium) with ${listVarName}, target=${targetValue}, acc=${accVarName}`);
    let occurrences = 0;
    for (const num of actualList) {
      if (num === targetValue) {
        occurrences++;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'medium');
    const questionText = QuestionFormatter.formatListCountOccurrences(listVarName, listPyString, itemVarName, targetVarName, targetValue, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, occurrences, 'medium');
  },

  genListFindSmallestMedium: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list find smallest (medium) with ${listVarName}, acc=${accVarName}`);
    if (actualList.length === 0) return null; // Should be handled by param generation
    let smallest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) {
        smallest = num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'medium');
    const questionText = QuestionFormatter.formatListFindSmallest(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, smallest, 'medium');
  },

  genListFindLargestMedium: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list find largest (medium) with ${listVarName}, acc=${accVarName}`);
    if (actualList.length === 0) return null; // Should be handled by param generation
    let largest = actualList[0];
    for (const num of actualList) {
      if (num > largest) {
        largest = num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'medium');
    const questionText = QuestionFormatter.formatListFindLargest(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, largest, 'medium');
  }
};

/**
 * Generates parameters for List questions.
 * @returns {object|null} An object containing the generated parameters, or null if generation fails.
 */
function getRandomListParams(difficulty) {
  log(`Entering getRandomListParams with difficulty: ${difficulty}`);

  const uniqueItemVarNames = [...new Set(ITEM_VAR_NAMES)];
  if (uniqueItemVarNames.length < 2) {
      const errorMsg = "CRITICAL: Not enough unique names in ITEM_VAR_NAMES to pick itemVarName and idxVarName.";
      log(errorMsg);
      // Depending on desired strictness, could throw new Error(errorMsg);
      // For now, this will likely cause getNDistinctRandomElements to fail if it's strict.
  }
  const [itemVarName, idxVarName] = NumberUtils.getNDistinctRandomElements(uniqueItemVarNames, 2);
  const listVarName = NumberUtils.getRandomElement(LIST_VAR_NAMES);
  const accVarName = NumberUtils.getRandomElement(ACCUMULATOR_VAR_NAMES);
  const targetVarName = NumberUtils.getRandomElement(TARGET_VAR_NAMES);

  let minLength, maxLength;
  if (difficulty === 'easy') {
    minLength = LIST_MIN_LENGTH_EASY;
    maxLength = LIST_MAX_LENGTH_EASY;
  } else if (difficulty === 'medium') {
    minLength = LIST_MIN_LENGTH_MEDIUM;
    maxLength = LIST_MAX_LENGTH_MEDIUM;
  } else {
    // Fallback to a general range if difficulty is not specified or unknown
    log(`Warning: Unknown or no difficulty ('${difficulty}') passed to getRandomListParams, defaulting to medium range.`);
    minLength = LIST_MIN_LENGTH_MEDIUM;
    maxLength = LIST_MAX_LENGTH_MEDIUM;
  }

  const actualList = [];
  const listLength = NumberUtils.getRandomInt(minLength, maxLength);
  for (let i = 0; i < listLength; i++) {
    actualList.push(NumberUtils.getRandomInt(LIST_NUMBER_MIN_VALUE, LIST_NUMBER_MAX_VALUE));
  }

  // Generate targetValue: 50% chance it's in the list, 50% chance it's random
  let targetValue;
  if (Math.random() < 0.5 && actualList.length > 0) {
    targetValue = NumberUtils.getRandomElement(actualList);
  } else {
    targetValue = NumberUtils.getRandomInt(TARGET_NUMBER_MIN_VALUE, TARGET_NUMBER_MAX_VALUE);
  }

  // Note: itemVarName and idxVarName are now selected to be distinct.
  // Further checks for distinctness against listVarName, accVarName, targetVarName could be added
  // if variable name sets had more overlap or if more complex scenarios arise.
  // For now, the current selection strategy for itemVarName/idxVarName is the main focus.

  log(`Exiting getRandomListParams with listVarName=${listVarName}, list=[${actualList.join(', ')}], itemVarName=${itemVarName}, idxVarName=${idxVarName}, accVarName=${accVarName}, targetVarName=${targetVarName}, targetValue=${targetValue}`);
  return {
    listVarName,
    actualList,
    itemVarName,
    idxVarName,
    accVarName,
    targetVarName,
    targetValue
  };
}

/**
 * Generates a specified number of random list operation questions.
 * @param {number} numQuestions - The total number of questions to generate.
 * @returns {Array<object>} An array of generated question objects.
 * @alias module:list_qn_gen.genListQns
 */
function genListQns(numQuestions) {
  log(`Generating ${numQuestions} list questions...`);
  const questions = [];
  let attempts = 0;
  const maxAttempts = numQuestions * MAX_GENERATION_ATTEMPTS_MULTIPLIER;

  const questionGenerators = [
    { func: QuestionGenerator.genListSumAllEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListCountElementsEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumEvenEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumOddEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListCheckPresenceMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListCountOccurrencesMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListFindSmallestMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListFindLargestMedium, difficulty: 'medium' }
  ];

  let generatorIndex = 0; // To cycle through generators for variety

  while (questions.length < numQuestions && attempts < maxAttempts) {
    attempts++;
    // Cycle through generators to try and get a mix
    const generatorInfo = questionGenerators[generatorIndex % questionGenerators.length];
    generatorIndex++;

    const params = getRandomListParams(generatorInfo.difficulty);
    if (!params) {
        log(`Parameter generation failed on attempt ${attempts}, retrying...`);
        continue;
    }
    log(`Attempt ${attempts}: Using generator ${generatorInfo.func.name} (difficulty: ${generatorInfo.difficulty}) with params: ${JSON.stringify(params)}`);

    const nextEntry = generatorInfo.func(params);

    if (nextEntry) {
      // Basic check for duplicate questions (simple version based on stringified entry)
      // A more robust check would compare question text and answer.
      const isDuplicate = questions.some(q => JSON.stringify(q) === JSON.stringify(nextEntry));
      if (!isDuplicate) {
        questions.push(nextEntry);
      } else {
        log("Skipped duplicate question.");
      }
    }
  } // End while loop

  if (attempts >= maxAttempts && questions.length < numQuestions) {
      log(`Warning: Reached max attempts (${maxAttempts}) while trying to generate ${numQuestions} list questions. Generated ${questions.length}.`);
  }

  log(`Generated ${questions.length} list questions.`);
  // Shuffle the final list to mix difficulties and types just before returning
  questions.sort(() => Math.random() - 0.5);

  // Return exactly numQuestions
  return questions.slice(0, numQuestions);
}

// Export the main generation function
export { genListQns };
