let questions = [];
let currentQuestion = -1;
let totalScore = 0;
let totalTime = 0;
let timer = 0;
let timerInterval;
let totalTimerInterval;
let randomQuestions;
const numQuestions = 15;
const local_Qset = 0;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const quizContainerEl = document.getElementById("quiz-container");
const restartBtn = document.getElementById("restart-btn");

function updateSubTopics() {
    const subject = document.getElementById("subject").value;
    const subTopicSelect = document.getElementById("sub-topic");
    subTopicSelect.innerHTML = ""; // Clear existing options

    let subTopics;
    switch(subject) {
        case "python":
            subTopics = ["ganit",
                         "print",
                         "ifelse",
                         "loopnlists",
                         // "functions"
                        ];
            subTopicsText =
            [
                "Numbers & Operations",
                "Print statement",
                "Condition checks",
                "Loops & Lists",
                // "Functions"
            ];
            break;
        case "cbse9science":
            subTopics = ["diversityinlivingorganisms",
                         "fundamentalunitoflife",
			 "improvementinfoodresources",
			 "naturalresources",
			 "tissues",
			 "whydowefallill"
                        ];
            subTopicsText =
            [
                "Diversity in Living Organisms",
                "Fundamental Unit of Life",
		"Improvement in Food Resources",
		"Natural Resources",
		"Tissues",
		"Why Do We Fall Ill",
            ];
            break;
        default:
            subTopics = [];
    }

    for (let i = 0; i < subTopics.length; i++) {
        const option = document.createElement("option");
        option.value = subTopics[i];
        option.textContent = subTopicsText[i];
        subTopicSelect.appendChild(option);
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    // Update progress bar
    const progressPercentage = (currentQuestion + 1) / numQuestions * 100;
    document.getElementById("progress-bar-inner").style.width = progressPercentage + "%";
}

function updateTimer() {
    const timerEl = document.getElementById("timer");
    timerEl.textContent = timer;
    document.getElementById("total-time").textContent = totalTime;
}

function updateScore(correct) {
    const scoreEl = document.getElementById("score");
    if (correct) {
        totalScore += 10;
        score = 10;
        //const score_reducer_rate = 10;
        //let score = 10;
        //if(timer < 11) {
        //    score = 10;
        //} else {
        //    score = 10 - Math.ceil((timer - 10) / score_reducer_rate);
        //    if (score < 1) {
        //        score = 1;
        //    }
        //}
        //totalScore += score;
    } else {
        totalScore += 0;
    }
    scoreEl.textContent = totalScore;
}

function loadQuestion() {
    const subject = document.getElementById("subject").value;
    const level = document.getElementById("sub-topic").value;

    const question = randomQuestions[currentQuestion];

    console.log("Question choosen: " + question.question);
    optionsEl.innerHTML = "";
    resultEl.textContent = "";
    nextBtn.style.display = "none";
    submitBtn.style.display = "none";
    questionEl.style = "font-family: 'Noto Sans Devanagari', serif";

    // Create code block
    let qWithCode = question.question;
    const parts = qWithCode.split("[CODE]");
    const textBeforeCode = parts[0];
    if(parts.length > 1) {
        const codeBlockParts = parts[1].split("[STOPCODE]");
        let codeBlock = codeBlockParts[0];
        let hiddenText;
        // Parse the code block
        qWithCode = codeBlock.trim().slice(1, -1); // Remove curly braces
        const modifiedCodeLines = qWithCode.split('@,@').map(line => {
            return line.trim().replace(/^@|@$/g, '').replace(/\\@/g, '@');
        });

        const codeHtml = modifiedCodeLines.join('<br>');
        qinnerHTML = `${textBeforeCode}<br><div class="code-block" style="margin: 2px; background-color: #F7F7F7">${codeHtml}</div>`;
        if(codeBlockParts.length > 1) {
            qinnerHTML = `${qinnerHTML}${codeBlockParts[1]}`;
        }
    } else {
        qinnerHTML = qWithCode;
    }

    if (question.type === "multiple-choice") {
        questionEl.innerHTML = qinnerHTML;
        question.options.forEach((option, index) => {
            const button = document.createElement("div");
            button.className = "option";
            button.textContent = option;
            button.onclick = () => checkMultipleChoiceAnswer(index);
            optionsEl.appendChild(button);
        });
    } else if (question.type === "fill-in-blank") {
        const parts = qinnerHTML.split("[BLANK]");
        if (parts.length > 1) {
            questionEl.innerHTML = parts[0] + '<input type="text" id="fill-in-answer">' + parts[1];
            submitBtn.style.display = "block";
            submitBtn.onclick = checkFillInBlankAnswer;
        } else {
            // Find all parts between !s and !e
            let sentence;
            const regex = /!s(.*?)!e/g;
            const matches = [...parts[0].matchAll(regex)];
            if (matches.length > 0) {
                // Randomly select one of the hidden parts
                const randomIndex = Math.floor(Math.random() * (matches.length - 1))+1;
                hiddenText = matches[randomIndex][1];
                sentence = parts[0].replace(matches[randomIndex][0], "[BLANK]");
            } else {
                console.log("Cannot process question "+ currentQuestion + ":{" + parts[0] + "}");
                currentQuestion++;
                loadQuestion();
                return;
            }
            matches.forEach(match => {
                sentence = sentence.replace(match[0],match[1])
            });
            const blankParts = sentence.split("[BLANK]");
            questionEl.innerHTML = blankParts[0] + '<input type="text" id="fill-in-answer">' + blankParts[1];
            question.correctAnswer=hiddenText;

            submitBtn.style.display = "block";
            submitBtn.onclick = checkFillInBlankAnswer;
        }
    } else if (question.type === "paragraph-fill-in-blank") {
        // Find all parts between !s and !e
        const hiddenParts = [];
        const regex = /!s(.*?)!e/g;
        const matches = [...qinnerHTML.matchAll(regex)];
        if (matches.length > 0) {
            // Randomly select one of the hidden parts
            const randomIndex = Math.floor(Math.random() * matches.length);
            hiddenText = matches[randomIndex][1];
            qinnerHTML = qinnerHTML.replace(matches[randomIndex][0], "[BLANK]");
        } else {
            currentQuestion++;
            loadQuestion();
            return;
        }
        matches.forEach(match => {
            qinnerHTML = qinnerHTML.replace(match[0],match[1])
        });
        const blankParts = qinnerHTML.split("[BLANK]");
        qinnerHTML = blankParts[0] + '<input type="text" id="fill-in-answer">' + blankParts[1];

        if (matches.length > 0) {
            questionEl.innerHTML = qinnerHTML;
            questionEl.style = "font-family: 'Noto Sans Devanagari', serif";
            submitBtn.style.display = "block";

            submitBtn.onclick = () => {
                const userAnswer = document.getElementById("fill-in-answer").value.trim();
                const correctAnswer = hiddenText.trim();

                userAnswers.push({
                    question: questionEl.innerHTML,
                    userAnswer: userAnswer,
                    correctAnswer: correctAnswer,
                    isCorrect: userAnswer === correctAnswer
                });

                if (userAnswer === correctAnswer) {
                    resultEl.textContent = "Correct!";
                } else {
                    resultEl.textContent = `Incorrect. The correct answer is: ${hiddenText}`;
                }

                document.getElementById("fill-in-answer").disabled = true;
                submitBtn.style.display = "none";

                const isCorrect = userAnswer === correctAnswer;
                updateScore(isCorrect);
                stopTimer();
                nextBtn.style.display = "block";
            };
        }
    }

    if (currentQuestion < randomQuestions.length) {
        // Add the "active" class to trigger the animation
        quizContainerEl.classList.add("active");
    }

    startTimer();
}

function checkMultipleChoiceAnswer(selectedIndex) {
    const question = randomQuestions[currentQuestion];
    const options = optionsEl.children;
    
    for (let i = 0; i < options.length; i++) {
        options[i].style.pointerEvents = "none";
        if (i === question.correctAnswer) {
            options[i].style.backgroundColor = "#90EE90";
        } else if (i === selectedIndex) {
            options[i].style.backgroundColor = "#FFA07A";
        }
    }

    if (selectedIndex === question.correctAnswer) {
        resultEl.textContent = "Correct!";
    } else {
        resultEl.textContent = "Incorrect. The correct answer is: " + question.options[question.correctAnswer];
    }

    const isCorrect = selectedIndex === question.correctAnswer;
    updateScore(isCorrect);
    stopTimer();
    nextBtn.style.display = "block";

    userAnswers.push({
        question: questionEl.innerHTML,
        userAnswer: question.options[selectedIndex],
        correctAnswer: question.options[question.correctAnswer],
        isCorrect: selectedIndex === question.correctAnswer
    });
}

function checkFillInBlankAnswer() {
    const question = randomQuestions[currentQuestion];
    const userAnswer = document.getElementById("fill-in-answer").value.trim().toLowerCase();
    const correctAnswer = question.correctAnswer.toLowerCase();

    if (userAnswer === correctAnswer) {
        resultEl.textContent = "Correct!";
    } else {
        resultEl.textContent = `Incorrect. The correct answer is: ${question.correctAnswer}`;
    }

    document.getElementById("fill-in-answer").disabled = true;
    submitBtn.style.display = "none";

    const isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    updateScore(isCorrect);
    stopTimer();
    nextBtn.style.display = "block";

    userAnswers.push({
        question: questionEl.innerHTML,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: userAnswer.toLowerCase() === correctAnswer.toLowerCase()
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

nextBtn.onclick = () => {
    // Remove the "active" class before loading the next question
    quizContainerEl.classList.remove("active");

    currentQuestion++;
    timer = 0;
    if (currentQuestion < numQuestions) {
        loadQuestion();
    } else {
        clearInterval(totalTimerInterval);
        questionEl.textContent = "Quiz completed!";
        optionsEl.innerHTML = "";
        document.getElementById("final-result").textContent = `Your final score is ${totalScore} out of ${randomQuestions.length * 10}. It took you ${totalTime} seconds to complete the quiz.`;
        document.getElementById("final-result").style.display = "block";
        nextBtn.style.display = "none";
        submitBtn.style.display = "none";
        quizContainerEl.style.display = "none";

        restartBtn.style.display = "block";
        restartBtn.onclick = restartQuiz;
        stopTimer();
        displayQuizSummary();
    }
};

function displayQuizSummary() {
    questionEl.textContent = "Quiz completed!";
    optionsEl.innerHTML = "";
    
    let summaryHTML = `<h2>Quiz Summary for ${userName}</h2>
                        <p style="font-size: 24px; font-weight: bold;">Your final score is ${totalScore} out of ${numQuestions * 10}.</p>
                        <p>It took you ${totalTime} seconds to complete the quiz.</p>
                        <div id="question-summary">`;
    
    userAnswers.forEach((answer, index) => {
        const color = answer.isCorrect ? "green" : "red";
        summaryHTML += `
            <div class="summary-item" style="margin-bottom: 15px; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                <p><strong>Question ${index + 1}:</strong> ${answer.question}</p>
                <p style="color: ${color};">Your answer: ${answer.userAnswer}</p>
                <p>Correct answer: ${answer.correctAnswer}</p>
            </div>
        `;
    });
    
    summaryHTML += '</div>';
    
    document.getElementById("final-result").innerHTML = summaryHTML;
    document.getElementById("final-result").style.display = "block";
    nextBtn.style.display = "none";
    submitBtn.style.display = "none";
    quizContainerEl.style.display = "none";

    restartBtn.style.display = "block";
    restartBtn.onclick = restartQuiz;
}

function resetQuestions() {
    console.log("Shuffling the question set and selecting " + numQuestions + " questions.");
    shuffleArray(questions);
    // Select the first 'numQuestions' questions of the shuffled Questions.
    randomQuestions = questions.slice(0, numQuestions);
}

function restartQuiz() {
    totalScore = 0;
    totalTime = 0;
    userAnswers = []; // Clear user answers
    userName = "";
    document.getElementById("name").value = ""; // Clear the name input
    document.getElementById("subject-selection").style.display = "block";
    document.getElementById("final-result").style.display = "none";
    restartBtn.style.display = "none";
    currentQuestion = 0;
    stopTimer();
    document.getElementById("timer-score").style.display = "none";
}

document.getElementById("start-btn").addEventListener("click", () => {
    const urlPrefix = './questions/questions';
    const subject = document.getElementById("subject").value;
    const subTopic = document.getElementById("sub-topic").value;
    const questionsFile = `${urlPrefix}-${subject}-${subTopic}.json`;
    const nameInput = document.getElementById("name");
    userName = nameInput.value.trim();

    if (!userName || !/^[A-Za-z\s]+$/.test(userName)) {
        alert("Please enter a valid name (only alphabets and spaces)");
        return;
    }

    if(local_Qset != 1) {
        console.log("Questions JSON file: " + questionsFile);

        fetch(questionsFile)
        .then(response => response.json())
        .then(data => {
            console.log("Questions File loaded successfully.");
            questions = data;
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            // Use a fallback set of questions or handle the error in some other way
        });
    }
    console.log("Total no of questions: " + questions.length);
    if(questions.length > 0) {
		resetQuestions();
		document.getElementById("timer-score").style.display = "flex";
		document.getElementById("subject-selection").style.display = "none";
		quizContainerEl.style.display = "block";
		totalTimerInterval = setInterval(() => {
			totalTime++;
			updateTimer();
		}, 1000);

        console.log("Loading question...");
	loadQuestion();
    }
});

// Call this function once when the page loads to populate the initial sub-topics
document.addEventListener("DOMContentLoaded", updateSubTopics);

restartQuiz();
