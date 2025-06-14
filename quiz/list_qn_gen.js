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
const LIST_MIN_LENGTH_HARD = 15; // Same as medium for now
const LIST_MAX_LENGTH_HARD = 25; // Same as medium for now

const TARGET_NUMBER_MIN_VALUE = -11;
const TARGET_NUMBER_MAX_VALUE = 12;
const MAX_GENERATION_ATTEMPTS_MULTIPLIER = 10;

// --- Variable Names ---
const LIST_VAR_NAMES = Object.freeze(['my_list', 'data', 'numbers', 'collection', 'items', 'arr', 'my_arr']);
const ITEM_VAR_NAMES = Object.freeze(['i', 'j', 'n', 'num', 'val', 'ele', 'x', 'y', 'a', 'b', 'c']);
const ACCUMULATOR_VAR_NAMES = Object.freeze(['res', 'ans', 'final', 'result', 'answer']);
const TARGET_VAR_NAMES = Object.freeze(['v2', 's1', 'k', 'v1', 's2']);

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
   * For 'medium' or 'hard' difficulty questions with more than 'elementsPerLine' items,
   * it formats the list across multiple lines.
   * @param {string} listVarName - The name of the list variable (for indentation calculation).
   * @param {number[]} actualList - The array of numbers.
   * @param {'easy'|'medium'|'hard'} difficulty - The difficulty level of the question.
   * @param {number} [elementsPerLine=6] - Max elements per line for multi-line lists.
   * @returns {string} Python list string (e.g., "[1, 2, 3]" or "[1, 2, 3, 4, 5, 6,\n           7, 8]").
   */
  formatPythonListString: function(listVarName, actualList, difficulty, elementsPerLine = 6) {
    if (actualList.length === 0) {
        return "[]";
    }

    // Single line for easy, or if list is short for medium/hard
    if (difficulty === 'easy' || actualList.length <= elementsPerLine) {
        return `[${actualList.join(', ')}]`;
    }

    // Multi-line for medium or hard if list is long
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
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    ${accVarName} += ${itemVarName}\n\nprint(${accVarName})`,

  formatListCountElements: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    ${accVarName} += 1\n\nprint(${accVarName})`,

  formatListSumEven: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} % 2 == 0:\n        ${accVarName} += ${itemVarName}\n\nprint(${accVarName})`,

  formatListSumOdd: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} % 2 != 0:\n        ${accVarName} += ${itemVarName}\n\nprint(${accVarName})`,

  formatListCountOdd: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} % 2 != 0:\n        ${accVarName} += 1\n\nprint(${accVarName})`,

  formatListCountEven: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} % 2 == 0:\n        ${accVarName} += 1\n\nprint(${accVarName})`,

  formatListCountPositive: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > 0:\n        ${accVarName} += 1\n\nprint(${accVarName})`,

  formatListCountNegative: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < 0:\n        ${accVarName} += 1\n\nprint(${accVarName})`,

  formatListSumPositive: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > 0:\n        ${accVarName} += ${itemVarName}\n\nprint(${accVarName})`,

  formatListSumNegative: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < 0:\n        ${accVarName} += ${itemVarName}\n\nprint(${accVarName})`,

  formatListSumSquaresAll: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    ${accVarName} += ${itemVarName} * ${itemVarName}\n\nprint(${accVarName})`,

  formatListSumSquaresEven: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} % 2 == 0:\n        ${accVarName} += ${itemVarName} * ${itemVarName}\n\nprint(${accVarName})`,

  formatListSumSquaresOdd: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} % 2 != 0:\n        ${accVarName} += ${itemVarName} * ${itemVarName}\n\nprint(${accVarName})`,

  formatListSumSquaresPositive: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > 0:\n        ${accVarName} += ${itemVarName} * ${itemVarName}\n\nprint(${accVarName})`,

  formatListSumSquaresNegative: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < 0:\n        ${accVarName} += ${itemVarName} * ${itemVarName}\n\nprint(${accVarName})`,

  formatListSumEvenIndexedWhile: (listVarName, listPyString, idxVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n${idxVarName} = 0\nwhile ${idxVarName} < len(${listVarName}):\n    if ${idxVarName} % 2 == 0:\n        ${accVarName} += ${listVarName}[${idxVarName}]\n    ${idxVarName} += 1\n\nprint(${accVarName})`,

  formatListSumOddIndexedWhile: (listVarName, listPyString, idxVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = 0\n${idxVarName} = 0\nwhile ${idxVarName} < len(${listVarName}):\n    if ${idxVarName} % 2 != 0:\n        ${accVarName} += ${listVarName}[${idxVarName}]\n    ${idxVarName} += 1\n\nprint(${accVarName})`,

  formatListCheckPresence: (listVarName, listPyString, itemVarName, targetVarName, targetValue, accVarName, idxVarName) =>
    `${listVarName} = ${listPyString}\n\n${targetVarName} = ${targetValue}\n${accVarName} = -1\n${idxVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} == ${targetVarName}:\n        ${accVarName} = ${idxVarName}\n    ${idxVarName} += 1\n\nprint(${accVarName})`,

  formatListCheckFirstPresence: (listVarName, listPyString, itemVarName, targetVarName, targetValue, resultVarName, idxVarName) =>
    `${listVarName} = ${listPyString}\n\n${targetVarName} = ${targetValue}\n${resultVarName} = -1\n${idxVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} == ${targetVarName}:\n        ${resultVarName} = ${idxVarName}\n        break\n    ${idxVarName} += 1\n\nprint(${resultVarName})`,

  formatListCountOccurrences: (listVarName, listPyString, itemVarName, targetVarName, targetValue, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${targetVarName} = ${targetValue}\n${accVarName} = 0\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} == ${targetVarName}:\n        ${accVarName} += 1\n\nprint(${accVarName})`,

  formatListFindSmallest: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${accVarName}:\n        ${accVarName} = ${itemVarName}\n\nprint(${accVarName})`,

  formatListFindLargest: (listVarName, listPyString, itemVarName, accVarName) =>
    `${listVarName} = ${listPyString}\n\n${accVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > ${accVarName}:\n        ${accVarName} = ${itemVarName}\n\nprint(${accVarName})`,

  formatListProdSmallestLargestSeparateLoops: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ${smallestVarName} * ${largestVarName}\n\nprint(${resultVarName})`,

  formatListLargestMinusSmallestSeparateLoops: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ${largestVarName} - ${smallestVarName}\n\nprint(${resultVarName})`,

  formatListSmallestMinusLargestSeparateLoops: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ${smallestVarName} - ${largestVarName}\n\nprint(${resultVarName})`,

  formatListLargestPlusSmallestSeparateLoops: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ${largestVarName} + ${smallestVarName}\n\nprint(${resultVarName})`,

  formatListProdSmallestLargestSingleLoop: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ${smallestVarName} * ${largestVarName}\n\nprint(${resultVarName})`,

  formatListLargestMinusSmallestSingleLoop: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ${largestVarName} - ${smallestVarName}\n\nprint(${resultVarName})`,

  formatListSmallestMinusLargestSingleLoop: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ${smallestVarName} - ${largestVarName}\n\nprint(${resultVarName})`,

  formatListLargestPlusSmallestSingleLoop: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ${largestVarName} + ${smallestVarName}\n\nprint(${resultVarName})`,

  formatListAvgSmallestLargestSingleLoop: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = (${smallestVarName} + ${largestVarName}) / 2\n\nprint(${resultVarName})`,

  formatListAvgSquaresSmallestLargestSingleLoop: (listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\n${largestVarName} = ${listVarName}[0]\n\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n${resultVarName} = ((${smallestVarName} * ${smallestVarName}) + (${largestVarName} * ${largestVarName})) / 2\n\nprint(${resultVarName})`,

  formatListProdLargestWithIndex: (listVarName, listPyString, itemVarName, largestVarName, idxVarName, targetIndexValue, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${largestVarName} = ${listVarName}[0]\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} > ${largestVarName}:\n        ${largestVarName} = ${itemVarName}\n\n${idxVarName} = ${targetIndexValue}\n${resultVarName} = ${largestVarName} * ${listVarName}[${idxVarName}]\n\nprint(${resultVarName})`,

  formatListProdSmallestWithIndex: (listVarName, listPyString, itemVarName, smallestVarName, idxVarName, targetIndexValue, resultVarName) =>
    `${listVarName} = ${listPyString}\n\n${smallestVarName} = ${listVarName}[0]\nfor ${itemVarName} in ${listVarName}:\n    if ${itemVarName} < ${smallestVarName}:\n        ${smallestVarName} = ${itemVarName}\n\n${idxVarName} = ${targetIndexValue}\n${resultVarName} = ${smallestVarName} * ${listVarName}[${idxVarName}]\n\nprint(${resultVarName})`,

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

  genListCountOddEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list count odd (easy) with ${listVarName}, acc=${accVarName}`);
    let count = 0;
    for (const num of actualList) {
      if (num % 2 !== 0) {
        count++;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListCountOdd(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, count, 'easy');
  },

  genListCountEvenEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list count even (easy) with ${listVarName}, acc=${accVarName}`);
    let count = 0;
    for (const num of actualList) {
      if (num % 2 === 0) {
        count++;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListCountEven(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, count, 'easy');
  },

  genListCountPositiveEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list count positive (easy) with ${listVarName}, acc=${accVarName}`);
    let count = 0;
    for (const num of actualList) {
      if (num > 0) {
        count++;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListCountPositive(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, count, 'easy');
  },

  genListCountNegativeEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list count negative (easy) with ${listVarName}, acc=${accVarName}`);
    let count = 0;
    for (const num of actualList) {
      if (num < 0) {
        count++;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListCountNegative(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, count, 'easy');
  },

  genListSumPositiveEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum positive (easy) with ${listVarName}, acc=${accVarName}`);
    let sum = 0;
    for (const num of actualList) {
      if (num > 0) {
        sum += num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumPositive(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sum, 'easy');
  },

  genListSumNegativeEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum negative (easy) with ${listVarName}, acc=${accVarName}`);
    let sum = 0;
    for (const num of actualList) {
      if (num < 0) {
        sum += num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumNegative(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sum, 'easy');
  },

  genListSumSquaresAllEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum of squares all (easy) with ${listVarName}, acc=${accVarName}`);
    let sumOfSquares = 0;
    for (const num of actualList) {
      sumOfSquares += num * num;
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumSquaresAll(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sumOfSquares, 'easy');
  },

  genListSumSquaresEvenEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum of squares even (easy) with ${listVarName}, acc=${accVarName}`);
    let sumOfSquares = 0;
    for (const num of actualList) {
      if (num % 2 === 0) {
        sumOfSquares += num * num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumSquaresEven(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sumOfSquares, 'easy');
  },

  genListSumSquaresOddEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum of squares odd (easy) with ${listVarName}, acc=${accVarName}`);
    let sumOfSquares = 0;
    for (const num of actualList) {
      if (num % 2 !== 0) {
        sumOfSquares += num * num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumSquaresOdd(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sumOfSquares, 'easy');
  },

  genListSumSquaresPositiveEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum of squares positive (easy) with ${listVarName}, acc=${accVarName}`);
    let sumOfSquares = 0;
    for (const num of actualList) {
      if (num > 0) {
        sumOfSquares += num * num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumSquaresPositive(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sumOfSquares, 'easy');
  },

  genListSumSquaresNegativeEasy: function(params) {
    const { listVarName, actualList, itemVarName, accVarName } = params;
    log(`Generating list sum of squares negative (easy) with ${listVarName}, acc=${accVarName}`);
    let sumOfSquares = 0;
    for (const num of actualList) {
      if (num < 0) {
        sumOfSquares += num * num;
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumSquaresNegative(listVarName, listPyString, itemVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sumOfSquares, 'easy');
  },

  genListSumEvenIndexedWhileEasy: function(params) {
    const { listVarName, actualList, idxVarName, accVarName } = params;
    log(`Generating list sum even indexed (while loop, easy) with ${listVarName}, idx=${idxVarName}, acc=${accVarName}`);
    let sum = 0;
    for (let i = 0; i < actualList.length; i++) {
      if (i % 2 === 0) {
        sum += actualList[i];
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumEvenIndexedWhile(listVarName, listPyString, idxVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sum, 'easy');
  },

  genListSumOddIndexedWhileEasy: function(params) {
    const { listVarName, actualList, idxVarName, accVarName } = params;
    log(`Generating list sum odd indexed (while loop, easy) with ${listVarName}, idx=${idxVarName}, acc=${accVarName}`);
    let sum = 0;
    for (let i = 0; i < actualList.length; i++) {
      if (i % 2 !== 0) {
        sum += actualList[i];
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'easy');
    const questionText = QuestionFormatter.formatListSumOddIndexedWhile(listVarName, listPyString, idxVarName, accVarName);
    return QuestionGenerator.createQuestionEntry(questionText, sum, 'easy');
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

  genListCheckFirstPresenceMedium: function(params) {
    const { listVarName, actualList, itemVarName, targetVarName, targetValue, accVarName, idxVarName } = params; // accVarName used as resultVarName
    log(`Generating list check first presence (medium) with ${listVarName}, target=${targetValue}, resultVar=${accVarName}`);
    let firstFoundAtIndex = -1;
    for (let i = 0; i < actualList.length; i++) {
      if (actualList[i] === targetValue) {
        firstFoundAtIndex = i;
        break; // Found the first occurrence
      }
    }
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'medium');
    // Use accVarName as resultVarName and idxVarName for the Python loop's index
    const questionText = QuestionFormatter.formatListCheckFirstPresence(listVarName, listPyString, itemVarName, targetVarName, targetValue, accVarName, idxVarName);
    return QuestionGenerator.createQuestionEntry(questionText, firstFoundAtIndex, 'medium');
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
  },

  genListProdSmallestLargestSeparateLoopsHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list prod(smallest, largest) separate loops (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
    }
    let largest = actualList[0];
    for (const num of actualList) {
      if (num > largest) largest = num;
    }
    const result = smallest * largest;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListProdSmallestLargestSeparateLoops(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListLargestMinusSmallestSeparateLoopsHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list largest - smallest separate loops (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
    }
    let largest = actualList[0];
    for (const num of actualList) {
      if (num > largest) largest = num;
    }
    const result = largest - smallest;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListLargestMinusSmallestSeparateLoops(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListSmallestMinusLargestSeparateLoopsHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list smallest - largest separate loops (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
    }
    let largest = actualList[0];
    for (const num of actualList) {
      if (num > largest) largest = num;
    }
    const result = smallest - largest;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListSmallestMinusLargestSeparateLoops(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListLargestPlusSmallestSeparateLoopsHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list largest + smallest separate loops (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
    }
    let largest = actualList[0];
    for (const num of actualList) {
      if (num > largest) largest = num;
    }
    const result = largest + smallest;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListLargestPlusSmallestSeparateLoops(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListProdSmallestLargestSingleLoopHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list prod(smallest, largest) single loop (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    let largest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
      if (num > largest) largest = num;
    }
    const result = smallest * largest;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListProdSmallestLargestSingleLoop(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListLargestMinusSmallestSingleLoopHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list largest - smallest single loop (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    let largest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
      if (num > largest) largest = num;
    }
    const result = largest - smallest;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListLargestMinusSmallestSingleLoop(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListSmallestMinusLargestSingleLoopHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list smallest - largest single loop (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    let largest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
      if (num > largest) largest = num;
    }
    const result = smallest - largest;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListSmallestMinusLargestSingleLoop(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListLargestPlusSmallestSingleLoopHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list largest + smallest single loop (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    let largest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
      if (num > largest) largest = num;
    }
    const result = largest + smallest;
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListLargestPlusSmallestSingleLoop(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListAvgSmallestLargestSingleLoopHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list avg(smallest, largest) single loop (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    let largest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
      if (num > largest) largest = num;
    }
    // Ensure the result is a string with exactly one decimal place
    const result = ((smallest + largest) / 2).toFixed(1);
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListAvgSmallestLargestSingleLoop(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListAvgSquaresSmallestLargestSingleLoopHard: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, largestVarName, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list avg(sq(smallest), sq(largest)) single loop (hard) with ${listVarName}, item=${itemVarName}, smallest=${smallestVarName}, largest=${largestVarName}, result=${resultVarName}`);

    let smallest = actualList[0];
    let largest = actualList[0];
    for (const num of actualList) {
      if (num < smallest) smallest = num;
      if (num > largest) largest = num;
    }
    // Ensure the result is a string with exactly one decimal place
    const result = (((smallest * smallest) + (largest * largest)) / 2).toFixed(1);
    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'hard');
    const questionText = QuestionFormatter.formatListAvgSquaresSmallestLargestSingleLoop(listVarName, listPyString, itemVarName, smallestVarName, largestVarName, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'hard');
  },

  genListProdLargestWithIndexMedium: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    // Need 3 distinct names: one for largest, one for index var, one for result.
    const [largestVarName, idxVarNamePy, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list prod(largest, list[idx]) (medium) with ${listVarName}, item=${itemVarName}, largestVar=${largestVarName}, idxVarPy=${idxVarNamePy}, resultVar=${resultVarName}`);

    if (actualList.length === 0) return null; // Should be handled by param generation
    let largestNum = actualList[0];
    for (const num of actualList) {
      if (num > largestNum) largestNum = num;
    }
    const targetIndexValue = NumberUtils.getRandomInt(0, actualList.length - 1);
    const numAtIndex = actualList[targetIndexValue];
    const result = largestNum * numAtIndex;

    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'medium');
    const questionText = QuestionFormatter.formatListProdLargestWithIndex(listVarName, listPyString, itemVarName, largestVarName, idxVarNamePy, targetIndexValue, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'medium');
  },

  genListProdSmallestWithIndexMedium: function(params) {
    const { listVarName, actualList, itemVarName } = params;
    const [smallestVarName, idxVarNamePy, resultVarName] = NumberUtils.getNDistinctRandomElements(ACCUMULATOR_VAR_NAMES, 3);
    log(`Generating list prod(smallest, list[idx]) (medium) with ${listVarName}, item=${itemVarName}, smallestVar=${smallestVarName}, idxVarPy=${idxVarNamePy}, resultVar=${resultVarName}`);

    if (actualList.length === 0) return null;
    let smallestNum = actualList[0];
    for (const num of actualList) {
      if (num < smallestNum) smallestNum = num;
    }
    const targetIndexValue = NumberUtils.getRandomInt(0, actualList.length - 1);
    const numAtIndex = actualList[targetIndexValue];
    const result = smallestNum * numAtIndex;

    const listPyString = QuestionFormatter.formatPythonListString(listVarName, actualList, 'medium');
    const questionText = QuestionFormatter.formatListProdSmallestWithIndex(listVarName, listPyString, itemVarName, smallestVarName, idxVarNamePy, targetIndexValue, resultVarName);
    return QuestionGenerator.createQuestionEntry(questionText, result, 'medium');
  },
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
  } else if (difficulty === 'hard') {
    minLength = LIST_MIN_LENGTH_HARD;
    maxLength = LIST_MAX_LENGTH_HARD;
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
    // Easy difficulty questions
    { func: QuestionGenerator.genListSumAllEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListCountElementsEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumEvenEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumOddEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListCountOddEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListCountEvenEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListCountPositiveEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListCountNegativeEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumPositiveEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumNegativeEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumSquaresAllEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumSquaresEvenEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumSquaresOddEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumSquaresPositiveEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumSquaresNegativeEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumEvenIndexedWhileEasy, difficulty: 'easy' },
    { func: QuestionGenerator.genListSumOddIndexedWhileEasy, difficulty: 'easy' },
    // Medium difficulty questions
    { func: QuestionGenerator.genListCheckFirstPresenceMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListCheckPresenceMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListCountOccurrencesMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListFindSmallestMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListFindLargestMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListProdLargestWithIndexMedium, difficulty: 'medium' },
    { func: QuestionGenerator.genListProdSmallestWithIndexMedium, difficulty: 'medium' },
    // Hard difficulty questions
    { func: QuestionGenerator.genListProdSmallestLargestSeparateLoopsHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListLargestMinusSmallestSeparateLoopsHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListSmallestMinusLargestSeparateLoopsHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListLargestPlusSmallestSeparateLoopsHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListProdSmallestLargestSingleLoopHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListLargestMinusSmallestSingleLoopHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListSmallestMinusLargestSingleLoopHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListLargestPlusSmallestSingleLoopHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListAvgSmallestLargestSingleLoopHard, difficulty: 'hard' },
    { func: QuestionGenerator.genListAvgSquaresSmallestLargestSingleLoopHard, difficulty: 'hard' },
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
