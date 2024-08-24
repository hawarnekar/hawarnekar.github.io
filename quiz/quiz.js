let questions = [];
let currentQuestion = -1;
let totalScore = 0;
let totalTime = 0;
let timer = 0;
let timerInterval;
let totalTimerInterval;
let randomQuestions;
const numQuestions = 15;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const quizContainerEl = document.getElementById("quiz-container");
const restartBtn = document.getElementById("restart-btn");

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
        const score_reducer_rate = 10;
        let score = 10;
        if(timer < 11) {
            console.log('timer = '+timer+'; timer < 11  = '+score)
            score = 10;
        } else {
            score = 10 - Math.ceil((timer - 10) / score_reducer_rate);
            if (score < 1) {
                score = 1;
            }
            console.log('timer = '+timer+'; else = '+score)
        }
        totalScore += score;
    } else {
        totalScore += 0;
    }
    scoreEl.textContent = totalScore;
}

function loadQuestion() {
    const subject = document.getElementById("subject").value;
    const level = document.getElementById("level").value;

    const question = randomQuestions[currentQuestion];

    optionsEl.innerHTML = "";
    resultEl.textContent = "";
    nextBtn.style.display = "none";
    submitBtn.style.display = "none";
    console.log(question);

    if (question.type === "multiple-choice") {
        questionEl.textContent = question.question;
        question.options.forEach((option, index) => {
            const button = document.createElement("div");
            button.className = "option";
            button.textContent = option;
            button.onclick = () => checkMultipleChoiceAnswer(index);
            optionsEl.appendChild(button);
        });
    } else if (question.type === "fill-in-blank") {
        const parts = question.question.split("[BLANK]");
        questionEl.innerHTML = parts[0] + '<input type="text" id="fill-in-answer">' + parts[1];
        submitBtn.style.display = "block";
        submitBtn.onclick = checkFillInBlankAnswer;
    } else if (question.type === "paragraph-fill-in-blank") {
        const paragraph = question.question;
        const parts = paragraph.split("[CODE]");
        const textBeforeCode = parts[0];
        const codeBlockParts = parts[1].split("[STOPCODE]");
        let codeBlock = codeBlockParts[0];
        let hiddenText;

        // Parse the code block
        codeBlock = codeBlock.trim().slice(1, -1); // Remove curly braces
        console.log("codeBlock="+codeBlock)

        // Find all parts between !s and !e
        const hiddenParts = [];
        const regex = /!s(.*?)!e/g;
        const matches = [...codeBlock.matchAll(regex)];
        console.log("matches="+matches+",\n    length = "+matches.length);
        if (matches.length > 0) {
            // Randomly select one of the hidden parts
            const randomIndex = Math.floor(Math.random() * matches.length);
            hiddenText = matches[randomIndex][1];
            console.log("randomIndex="+randomIndex)
            codeBlock = codeBlock.replace(matches[randomIndex][0], "[BLANK]");
            console.log("hiddenText="+hiddenText)
        }
        matches.forEach(match => {
            codeBlock = codeBlock.replace(match[0],match[1])
        });
        console.log("codeBlock="+codeBlock)
        const blankParts = codeBlock.split("[BLANK]");
        codeBlock = blankParts[0] + '<input type="text" id="fill-in-answer">' + blankParts[1];

        const modifiedCodeLines = codeBlock.split('@,@').map(line => {
            return line.trim().replace(/^@|@$/g, '').replace(/\\@/g, '@');
        });
        console.log("modifiedCodeLines="+modifiedCodeLines)

        if (matches.length > 0) {
            const codeHtml = modifiedCodeLines.join('<br>');

            questionEl.innerHTML = `${textBeforeCode}<br><div class="code-block">${codeHtml}</div>`;
            submitBtn.style.display = "block";

            submitBtn.onclick = () => {
                const userAnswer = document.getElementById("fill-in-answer").value.trim();
                const correctAnswer = hiddenText.trim();

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
    }
};

function restartQuiz() {
    totalScore = 0;
    totalTime = 0;
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
    const level = document.getElementById("level").value;
    const questionsFile = `${urlPrefix}-${subject}-${level}.json`;
    console.log(questionsFile);

    fetch(questionsFile)
    .then(response => response.json())
    .then(data => {
        questions = data;
        shuffleArray(questions);
        // Select the first 'numQuestions' questions of the shuffled Questions.
        randomQuestions = questions.slice(0, numQuestions);
        loadQuestion();
    })
    .catch(error => {
        console.error('Error fetching questions:', error);
        // Use a fallback set of questions or handle the error in some other way
    });
    document.getElementById("timer-score").style.display = "flex";
    document.getElementById("subject-selection").style.display = "none";
    quizContainerEl.style.display = "block";
    totalTimerInterval = setInterval(() => {
        totalTime++;
        updateTimer();
    }, 1000);
});

restartQuiz();