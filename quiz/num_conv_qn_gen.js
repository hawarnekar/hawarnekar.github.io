const isLoggingEnabled = true;

function log(...args) {
  if (isLoggingEnabled) {
    console.log(...args);
  }
}

/**
 * Module: QuestionGenerator
 * Description: Contains functions for generating different types of number conversion questions.
 */
const QuestionGenerator = {
    genConversionQuestion: function(decimalValue, fromBase, fromBaseName, toBase, toBaseName) {
        log(`Generating conversion question: ${decimalValue} (from ${fromBaseName}) to ${toBaseName}`);

        const binaryValue = decimalValue.toString(2);
        let hexValue = decimalValue.toString(16).toUpperCase();
        let question;
        let answer;
        const topic = 'python';
        const subtopic = 'number base conversions';
        let difficulty = 'easy';
        const type = "fill";

        if (fromBase === 10) {
            question = `What is the ${toBaseName} representation of the decimal number ${decimalValue}?`;
            if (toBase === 2) {
                answer = binaryValue;
            } else if (toBase === 16) {
                answer = hexValue;
            }

            if (decimalValue > 31) {
                difficulty = 'medium';
            }

            const entry = {
                topic: topic,
                subtopic: subtopic,
                difficulty: difficulty,
                type: type,
                question: question,
                answer: answer,
            };

            log(`Generated entry: ${JSON.stringify(entry)}`);
            return entry;
        } else {
            let Value;
            if (fromBase === 2) {
                Value = binaryValue;
            } else if (fromBase === 16) {
                Value = hexValue;
            }

            question = `What is the decimal representation of the ${fromBaseName} number ${Value}?`;
            if (decimalValue > 31) {
                difficulty = 'medium';
            }

            const entry = {
                topic: topic,
                subtopic: subtopic,
                difficulty: difficulty,
                type: type,
                question: question,
                answer: `${decimalValue}`,
            };

            log(`Generated entry: ${JSON.stringify(entry)}`);
            return entry;
        }
    }
}

function genConvQns() {
    log(`Generating conversion questions...`);
    const questions = [];
    let i = 0;
    for(i = 2; i < 127; i++) {
        //Generate a random number between 0-255
        const decimalValue = i;
        // Generate decimal to binary conversion question
        let nextEntry = QuestionGenerator.genConversionQuestion(decimalValue, 10, "decimal", 2, "binary");
        if (nextEntry) {
            questions.push(nextEntry);
        }
        // Generate decimal to hexadecimal conversion question
        nextEntry = QuestionGenerator.genConversionQuestion(decimalValue, 10, "decimal", 16, "hexadecimal");
        if (nextEntry) {
            questions.push(nextEntry);
        }

        // Generate binary to decimal conversion question
        nextEntry = QuestionGenerator.genConversionQuestion(decimalValue, 2, "binary", 10, "decimal");
        if (nextEntry) {
            questions.push(nextEntry);
        }
        // Generate hex to decimal conversion question
        nextEntry = QuestionGenerator.genConversionQuestion(decimalValue, 16, "hexadecimal", 10, "decimal");
        if (nextEntry) {
            questions.push(nextEntry);
        }
    }
    log(`Generated questions: ${questions.length}`);
    return questions;
}

export { genConvQns };
