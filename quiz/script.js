const isLoggingEnabled = false;

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let quizQuestions = [];
let allQuestions = [];
let userName = '';
let isQuizStarted = false;

const topicSelect = document.getElementById('topic');
const subtopicSelect = document.getElementById('subtopic');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('start-quiz');
const nextButton = document.getElementById('next-button');
const quizScreen = document.getElementById('quiz-screen');
const selectionScreen = document.getElementById('selection-screen');
const resultScreen = document.getElementById('result-screen');
const progressBar = document.getElementById('progress-bar');
const submitAnswer = document.getElementById('submit-answer');
const nextQuestionButton = document.getElementById('next-question');
const fillBlankInput = document.getElementById('fill-blank');
const optionsDiv = document.getElementById('options');
const usernameInput = document.getElementById('username');

function log(...args) {
    if (isLoggingEnabled) {
      console.log(...args);
    }
}

// Import the question generator
import { genArithQns } from './arithmetic_qn_gen.js';
import { genConvQns } from './num_conv_qn_gen.js';
import { genCondQns } from './cond_qn_gen.js';
import { genWhileQns } from './while_qn_gen.js';
import { genForQns } from './for_qn_gen.js';
import { genListQns } from './list_qn_gen.js';

// Generate 100 random questions on page load
window.onload = () => {
    log("Window loaded. Generating questions...");
    const arithQuestions = genArithQns(600);
    const convQuestions = genConvQns();
    const condQuestions = genCondQns(600);
    const whileQuestions = genWhileQns(600);
    const forQuestions = genForQns(600);
    const listQuestions = genListQns(600);

    allQuestions = [...listQuestions, ...forQuestions, ...whileQuestions, ...condQuestions, ...arithQuestions, ...convQuestions];
    log("All questions:", allQuestions);
    populateDropdowns();
};

function populateDropdowns() {
    log("Populating dropdowns...");
    // Get unique topics
    const topics = [...new Set(allQuestions.map(q => q.topic))];
    log("Found topics:", topics);
    topicSelect.innerHTML = '<option value="">Select Topic</option>';
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
        topicSelect.appendChild(option);
    });

    // Auto-select if only one topic
    if (topics.length === 1) {
        log("Only one topic found. Auto-selecting:", topics[0]);
        topicSelect.value = topics[0];
        populateSubtopics(topics[0]); // Trigger subtopic population immediately
    } else {
        // Add event listener only if multiple topics
        log("Multiple topics found. Adding change listener to topicSelect.");
        topicSelect.addEventListener('change', () => {
            const selectedTopic = topicSelect.value;
            log("Topic changed to:", selectedTopic);
            populateSubtopics(selectedTopic);
        });
    }
}

function populateSubtopics(selectedTopic) {
    log("Populating subtopics for topic:", selectedTopic);
    subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
    difficultySelect.innerHTML = '<option value="">Select Difficulty</option>'; // Reset difficulty

    if (selectedTopic) {
        // Get subtopics for selected topic
        const subtopics = [...new Set(allQuestions
            .filter(q => q.topic === selectedTopic)
            .map(q => q.subtopic))];
        log("Found subtopics:", subtopics);
        subtopics.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub;
            option.textContent = sub.charAt(0).toUpperCase() + sub.slice(1);
            subtopicSelect.appendChild(option);
        });

        // Enable subtopic dropdown and auto-select if only one subtopic
        if (subtopics.length === 1) {
            log("Only one subtopic found. Auto-selecting:", subtopics[0]);
            subtopicSelect.value = subtopics[0];
            populateDifficulties(selectedTopic, subtopics[0]); // Trigger difficulty population
        } else {
            // Add event listener only if multiple subtopics
            log("Multiple subtopics found. Adding onchange listener to subtopicSelect.");
            subtopicSelect.onchange = () => {
                const selectedSubtopic = subtopicSelect.value;
                log("Subtopic changed to:", selectedSubtopic);
                populateDifficulties(selectedTopic, selectedSubtopic);
            };
        }
    } else {
        log("No topic selected. Disabling subtopic and difficulty dropdowns.");
        subtopicSelect.disabled = true;
        difficultySelect.disabled = true;
    }
}

function populateDifficulties(selectedTopic, selectedSubtopic) {
    log("Populating difficulties for topic:", selectedTopic, "and subtopic:", selectedSubtopic);
    difficultySelect.innerHTML = '<option value="">Select Difficulty</option>';
    difficultySelect.disabled = true; // Disable initially

    // Define the desired order
    const difficultyOrder = ['easy', 'medium', 'hard'];

    if (selectedSubtopic) {
        // Get available difficulties for selected topic and subtopic
        const availableDifficulties = new Set(allQuestions
            .filter(q => q.topic === selectedTopic && q.subtopic === selectedSubtopic)
            .map(q => q.difficulty));
        log("Available difficulties:", availableDifficulties);

        let availableCount = 0;
        let lastAvailableDifficulty = '';

        // Iterate through the defined order and add options if available
        difficultyOrder.forEach(diff => {
            if (availableDifficulties.has(diff)) {
                const option = document.createElement('option');
                option.value = diff;
                option.textContent = diff.charAt(0).toUpperCase() + diff.slice(1);
                difficultySelect.appendChild(option);
                availableCount++;
                lastAvailableDifficulty = diff; // Keep track of the last one added
            }
        });

        // Enable dropdown if any difficulties were found
        if (availableCount > 0) {
            difficultySelect.disabled = false;
            log("Found difficulties:", Array.from(availableDifficulties)); // Log the ones actually found

            // Auto-select if only one difficulty is available for this selection
            if (availableCount === 1) {
                log("Only one difficulty available. Auto-selecting:", lastAvailableDifficulty);
                difficultySelect.value = lastAvailableDifficulty;
            }
        } else {
             log("No difficulties found for this selection.");
        }

    } else {
        log("No subtopic selected. Difficulty dropdown remains disabled.");
    }
}

nextButton.addEventListener('click', () => {
    log("Next button clicked.");
    userName = usernameInput.value.trim();
    const namePattern = /^[A-Za-z][A-Za-z\s]*$/;

    if (!userName || !namePattern.test(userName)) {
        log("Invalid username:", userName);
        alert('Please enter a valid name (alphabetic characters and spaces only, with a non-space first character).');
        return;
    }
    log("Username:", userName);
    topicSelect.disabled = false;
    subtopicSelect.disabled = false;
    difficultySelect.disabled = false;

    startButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    usernameInput.disabled = true;
    isQuizStarted = true;
    log("isQuizStarted set to:", isQuizStarted);
});

startButton.addEventListener('click', startQuiz);

function startQuiz() {
    log("Start Quiz button clicked.");
    const topic = topicSelect.value;
    const subtopic = subtopicSelect.value;
    const difficulty = difficultySelect.value;

    log("Selected topic:", topic, "subtopic:", subtopic, "difficulty:", difficulty);

    if (!topic || !subtopic || !difficulty) {
        log("Missing selection(s). Alerting user.");
        alert('Please select all options');
        return;
    }

    const filteredQuestions = allQuestions.filter(q =>
        q.topic === topic &&
        q.subtopic === subtopic &&
        q.difficulty === difficulty
    );
    log("Filtered questions:", filteredQuestions);
    quizQuestions = shuffle(filteredQuestions).slice(0, 15);
    log("Quiz questions:", quizQuestions);
    selectionScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
}

function shuffle(array) {
    log("Shuffling array:", array);
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    log("Shuffled array:", shuffledArray);
    return shuffledArray;
}

// --- Add input listener to enable/disable submit button ---
fillBlankInput.addEventListener('input', function() {
    // Enable submit button only if the input is not empty (after trimming)
    submitAnswer.disabled = fillBlankInput.value.trim() === '';
    log(`Fill-blank input changed. Submit button disabled: ${submitAnswer.disabled}`);
});
// --- End of input listener ---

// --- Add global listener for Enter key to trigger Next Question ---
document.addEventListener('keypress', function(event) {
    // Check if the key pressed is 'Enter'
    if (event.key === 'Enter' || event.keyCode === 13) {

        const isSubmitVisible = !submitAnswer.classList.contains('hidden');
        const isNextButtonVisible = !nextQuestionButton.classList.contains('hidden');

        // Scenario 1: Submit button is visible and enabled
        if (isSubmitVisible && !submitAnswer.disabled) {
            // Check if the event originated from the input field where the user types the answer
            if (event.target === fillBlankInput) {
                 event.preventDefault(); // Prevent default actions (like potential form submission)
                 log("Enter key pressed in input. Triggering submit.");
                 submitAnswer.click(); // Simulate clicking the submit button
                 // IMPORTANT: Stop processing this specific Enter event further.
                 // This prevents it from immediately triggering the "Next Question" button
                 // after the UI updates in the checkAnswer function.
                 return;
            }
        }

        // Scenario 2: Next Question button is visible
        // This condition is only reached if the Enter press didn't trigger submission above.
        if (isNextButtonVisible) {
             // We can assume the submit button is hidden because checkAnswer hides it
             // before showing the next button.
             event.preventDefault(); // Prevent default actions
             log("Enter key pressed. Triggering next question.");
             nextQuestionButton.click(); // Simulate clicking the next question button
        }
    }
});
// --- End of global Enter key listener ---


function showQuestion() {
    log("Showing question:", currentQuestion + 1);
    const q = quizQuestions[currentQuestion];
    log("Question data:", q);
    document.getElementById('question-number').textContent = `Question ${currentQuestion + 1} of 15`;
    document.getElementById('question-text').innerHTML = q.question.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');

    fillBlankInput.type = 'hidden';
    optionsDiv.classList.add('hidden');

    optionsDiv.innerHTML = '';
    fillBlankInput.value = ''; // Clear the fill-blank input

    if (q.type === 'multiple') {
        optionsDiv.classList.remove('hidden');
        submitAnswer.disabled = false; // Ensure submit is enabled for multiple choice initially
        const correctOption = q.options[q.correct];

        // Randomize options
        const randomizedOptions = shuffle(q.options);
        //Find the correct option index.
        q.correct = randomizedOptions.indexOf(correctOption);
        q.options = randomizedOptions;
        log("Randomized options:", q.options, "Correct index:", q.correct)

        q.options.forEach((opt, index) => {
            const div = document.createElement('div');
            div.className = 'option';
            div.textContent = opt;
            div.onclick = () => selectAnswer(index);
            optionsDiv.appendChild(div);
        });
        // For multiple choice, the button click is handled by selectAnswer
        submitAnswer.onclick = null; // Clear previous fill-blank handler if any
    } else { // Fill-in-the-blank
        fillBlankInput.type = 'text';
        submitAnswer.disabled = true; // Initially disable submit for fill-blank
        submitAnswer.onclick = () => checkAnswer(); // Set the handler
        fillBlankInput.focus(); // Automatically focus the input field
    }

    // Show the "Submit" button and hide the "Next Question" button
    submitAnswer.classList.remove('hidden');
    nextQuestionButton.classList.add('hidden');

    // Update progress bar
    updateProgressBar();
    // Apply syntax highlighting
    hljs.highlightAll();
}

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / 15) * 100;
    log("Updating progress bar to:", progress);
    progressBar.style.width = `${progress}%`;
}

function selectAnswer(index) {
    log("Answer selected:", index);
    const options = document.querySelectorAll('.option');
    options.forEach(opt => opt.style.background = '');
    options[index].style.background = '#ddd';
    submitAnswer.disabled = false; // Enable submit once an option is selected
    submitAnswer.onclick = () => checkAnswer(index); // Set the handler with the selected index
}

function checkAnswer(answer) {
    log("Checking answer. Current question:", currentQuestion);
    const q = quizQuestions[currentQuestion];
    log("Question Data:", q)
    const resultDiv = document.getElementById('result');
    let userAnswer;

    if (q.type === 'multiple') {
        if (answer === undefined) {
            log("No answer selected for multiple choice.");
            // This check might be redundant now since submit is disabled until selection
            alert("Please select an answer.");
            return;
        }
        userAnswer = q.options[answer];
        log(`User's Multiple Choice answer is: ${userAnswer}`);
    } else { // Fill-in-the-blank
        userAnswer = fillBlankInput.value.trim();
        log(`User's fill in the blank answer: ${userAnswer}`);
        // This check might be redundant now since submit is disabled when empty
        if (userAnswer === "") {
            log("Fill in the blank was empty.");
            alert("Please fill in the blank.");
            return;
        }
    }

    userAnswers.push({ question: q.question, userAnswer, correctAnswer: q.answer });

    const isCorrect = q.type === 'multiple' ? answer === q.correct : userAnswer === q.answer;
    log("Is correct:", isCorrect, "Correct Answer: ",q.answer);
    if (isCorrect) score++;

    if (isCorrect) {
        resultDiv.innerHTML = `<span style="color: green; font-weight: bold;">Correct!</span>`;
    } else {
        resultDiv.innerHTML = `
            <span style="color: red; font-style: italic;">Incorrect...</span><br>
            Your Answer: ${userAnswer}<br>
            Correct Answer: ${q.answer}
        `;
    }
    resultDiv.classList.remove('hidden');
    submitAnswer.classList.add('hidden'); // Hide submit after checking
    // Show the "Next Question" button
    nextQuestionButton.classList.remove('hidden');

    if (currentQuestion < 14) {
        nextQuestionButton.textContent = "Next Question";
        nextQuestionButton.onclick = () => {
            resultDiv.classList.add('hidden');
            // nextQuestionButton.classList.add('hidden'); // Keep visible until next question loads
            currentQuestion++;
            showQuestion();
        };
    } else {
        nextQuestionButton.textContent = "Show Score";
        nextQuestionButton.onclick = () => {
            resultDiv.classList.add('hidden');
            // nextQuestionButton.classList.add('hidden'); // Keep visible until results show
            currentQuestion++; // Increment to signal end
            showResults();
        };
    }

    // Optional: Add visual feedback to submit button (already present)
    submitAnswer.classList.add('submitted');
    setTimeout(() => {
        submitAnswer.classList.remove('submitted');
    }, 1000);
}

function showResults() {
    log("Showing results.");
    const review = document.getElementById('review-answers');

    //1. Generate the HTML for the review
    review.innerHTML = userAnswers.map((a, i) => `
        <div style="margin-bottom: 20px;">
            <h3>Question ${i + 1}</h3>
            <p>${a.question.replace(/\n/g, '<br>').replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')}</p>
            <p style="color: ${a.userAnswer.toLowerCase() === a.correctAnswer.toLowerCase() ? 'green' : 'red'};">
                Your Answer: ${a.userAnswer}
            </p>
            <p>Correct Answer: ${a.correctAnswer}</p>
        </div>
    `).join('');

    //2. Display final score
    document.getElementById('final-score').innerHTML = `<strong>${userName}</strong>, your score is: ${score}/15`;

    // 3. Wait for the next animation frame to ensure the DOM is updated
    requestAnimationFrame(() => {
        // 4. Display the result screen
        quizScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
        nextQuestionButton.classList.add('hidden'); // Hide next button on results screen

        // 5. Scroll to the top.
        window.scrollTo(0, 0);
    });

    document.getElementById('restart-quiz').onclick = () => restartQuiz();
}

function restartQuiz() {
    log("Restarting quiz.");
    if (isQuizStarted) {
        // Confirm if the user wants to continue as the same user or start as a new user
        const continueAsSameUser = confirm(`Do you want to continue as ${userName}? Click "OK" to continue with same user or "Cancel" to start as new user.`);

        if (continueAsSameUser) {
            // Continue as the same user
            log("Continuing as same user.");
            resetQuiz();
        } else {
            // Start as a new user
            log("Starting as a new user.");
            resetQuiz(true);
        }
    } else {
        // If the quiz hasn't started, reset as a new user
        log("Quiz hasn't started. Resetting as a new user.");
        resetQuiz(true);
    }
}
function resetQuiz(resetUser = false){
    log("Resetting quiz. Reset user:", resetUser);
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    quizQuestions = [];

    resultScreen.classList.add('hidden');
    selectionScreen.classList.remove('hidden');
    progressBar.style.width = `0%`; // Reset progress bar visually

    if(resetUser){
      usernameInput.disabled = false;
      startButton.classList.add('hidden'); // Hide start until name is entered
      nextButton.classList.remove('hidden'); // Show next (name entry) button
      isQuizStarted = false;
      usernameInput.value = "";
      // Reset dropdowns to initial state
      topicSelect.value = "";
      subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
      subtopicSelect.disabled = true;
      difficultySelect.innerHTML = '<option value="">Select Difficulty</option>';
      difficultySelect.disabled = true;
    } else {
        // If continuing as same user, just go back to selection
        startButton.classList.remove('hidden'); // Ensure start button is visible
        nextButton.classList.add('hidden'); // Hide name entry button
    }
    // No need to call showQuestion() here, wait for user to start
}
