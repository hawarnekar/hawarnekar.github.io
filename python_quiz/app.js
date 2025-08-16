class PythonQuizApp {
    constructor() {
        this.currentScreen = 'setup';
        this.user = null;
        this.quizConfig = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.answerSubmitted = []; // Track which questions have been submitted
        this.quizStartTime = null;
        this.quizEndTime = null;
        
        this.subtopics = {
            python: [
                { value: 'arithmetic', label: 'Arithmetic Operations' },
                { value: 'conditionals', label: 'Conditional Statements' },
                { value: 'loops', label: 'Loop Constructs' },
                { value: 'lists', label: 'List Operations' },
                { value: 'conversion', label: 'Number Conversion' },
                { value: 'basic-algorithms', label: 'Basic Algorithms' },
                { value: 'all', label: 'All Together' }
            ]
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFormValidation();
        this.setupAutoSelection();
    }

    bindEvents() {
        // Setup form events
        document.getElementById('setup-form').addEventListener('submit', (e) => this.handleSetupSubmit(e));
        document.getElementById('user-name').addEventListener('input', (e) => this.validateName(e.target.value));
        document.getElementById('topic-select').addEventListener('change', (e) => this.handleTopicChange(e.target.value));
        document.getElementById('subtopic-select').addEventListener('change', (e) => this.handleSubtopicChange(e.target.value));
        document.getElementById('difficulty-select').addEventListener('change', (e) => this.handleDifficultyChange(e.target.value));

        // Quiz navigation events
        document.getElementById('prev-btn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('next-btn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submit-quiz-btn').addEventListener('click', () => this.submitQuiz());
        document.getElementById('submit-answer-btn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('answer-input').addEventListener('input', (e) => this.handleAnswerInput(e.target.value));

        // Results events
        document.getElementById('review-answers-btn').addEventListener('click', () => this.showAnswerReview());
        document.getElementById('restart-same-btn').addEventListener('click', () => this.restartSameUser());
        document.getElementById('restart-new-btn').addEventListener('click', () => this.restartNewUser());

        // Enter key support
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    setupFormValidation() {
        const form = document.getElementById('setup-form');
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('change', () => this.validateSetupForm());
        });
    }

    setupAutoSelection() {
        // Auto-select topic if only one option is available
        const topicSelect = document.getElementById('topic-select');
        const topicOptions = Array.from(topicSelect.options).filter(option => option.value !== '');
        
        if (topicOptions.length === 1) {
            topicSelect.value = topicOptions[0].value;
            this.handleTopicChange(topicOptions[0].value);
        }
    }

    validateName(name) {
        const nameRegex = /^[a-zA-Z][a-zA-Z\s]*$/;
        const errorElement = document.getElementById('name-error');
        
        if (!name) {
            this.showError(errorElement, '');
            return false;
        }
        
        if (!nameRegex.test(name)) {
            this.showError(errorElement, 'Name must contain only alphabetic characters and spaces, starting with a letter.');
            return false;
        }
        
        this.hideError(errorElement);
        return true;
    }

    handleTopicChange(topic) {
        const subtopicSelect = document.getElementById('subtopic-select');
        const difficultySelect = document.getElementById('difficulty-select');
        
        subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
        difficultySelect.disabled = true;
        difficultySelect.value = '';
        
        if (topic && this.subtopics[topic]) {
            subtopicSelect.disabled = false;
            this.subtopics[topic].forEach(subtopic => {
                const option = document.createElement('option');
                option.value = subtopic.value;
                option.textContent = subtopic.label;
                subtopicSelect.appendChild(option);
            });
            
            // Auto-select if only one option
            if (this.subtopics[topic].length === 1) {
                subtopicSelect.value = this.subtopics[topic][0].value;
                this.handleSubtopicChange(subtopicSelect.value);
            }
        } else {
            subtopicSelect.disabled = true;
        }
        
        this.validateSetupForm();
    }

    handleSubtopicChange(subtopic) {
        const difficultySelect = document.getElementById('difficulty-select');
        
        if (subtopic) {
            difficultySelect.disabled = false;
            // Auto-select first difficulty option
            if (difficultySelect.options.length > 1) {
                difficultySelect.value = 'easy';
                this.handleDifficultyChange('easy');
            }
        } else {
            difficultySelect.disabled = true;
            difficultySelect.value = '';
        }
        
        this.validateSetupForm();
    }

    handleDifficultyChange(difficulty) {
        this.validateSetupForm();
    }

    validateSetupForm() {
        const name = document.getElementById('user-name').value;
        const topic = document.getElementById('topic-select').value;
        const subtopic = document.getElementById('subtopic-select').value;
        const difficulty = document.getElementById('difficulty-select').value;
        const startBtn = document.getElementById('start-quiz-btn');
        
        const isValid = this.validateName(name) && topic && subtopic && difficulty;
        startBtn.disabled = !isValid;
        
        return isValid;
    }

    handleSetupSubmit(e) {
        e.preventDefault();
        
        if (!this.validateSetupForm()) {
            return;
        }
        
        const name = document.getElementById('user-name').value.trim();
        const topic = document.getElementById('topic-select').value;
        const subtopic = document.getElementById('subtopic-select').value;
        const difficulty = document.getElementById('difficulty-select').value;
        
        this.user = { name };
        this.quizConfig = { topic, subtopic, difficulty };
        
        this.startQuiz();
    }

    startQuiz() {
        // Generate questions based on configuration
        const questionCount = this.quizConfig.subtopic === 'all' ? 50 : 25;
        this.questions = this.generateQuestions(this.quizConfig, questionCount);
        this.userAnswers = new Array(this.questions.length).fill('');
        this.answerSubmitted = new Array(this.questions.length).fill(false);
        this.currentQuestionIndex = 0;
        this.quizStartTime = new Date();
        
        // Update UI
        this.showScreen('quiz');
        this.updateQuizHeader();
        this.displayQuestion();
    }

    generateQuestions(config, count) {
        let questionPool = [];
        
        if (config.subtopic === 'all') {
            // Generate questions from all subtopics
            const subtopicList = ['arithmetic', 'conditionals', 'loops', 'lists', 'conversion'];
            const questionsPerSubtopic = Math.floor(count / subtopicList.length);
            const remainder = count % subtopicList.length;
            
            subtopicList.forEach((subtopic, index) => {
                const subtopicCount = questionsPerSubtopic + (index < remainder ? 1 : 0);
                const subtopicQuestions = window.QuestionGenerator.generateQuestions(
                    config.topic, subtopic, config.difficulty, subtopicCount
                );
                questionPool.push(...subtopicQuestions);
            });
        } else {
            questionPool = window.QuestionGenerator.generateQuestions(
                config.topic, config.subtopic, config.difficulty, count
            );
        }
        
        // Shuffle questions
        return this.shuffleArray(questionPool);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    updateQuizHeader() {
        document.getElementById('quiz-user-name').textContent = this.user.name;
        
        const subtopicLabel = this.quizConfig.subtopic === 'all' ? 'All Topics' : 
            this.subtopics[this.quizConfig.topic].find(s => s.value === this.quizConfig.subtopic)?.label || this.quizConfig.subtopic;
        
        document.getElementById('quiz-topic-info').textContent = 
            `${this.quizConfig.topic.charAt(0).toUpperCase() + this.quizConfig.topic.slice(1)} - ${subtopicLabel} (${this.quizConfig.difficulty.charAt(0).toUpperCase() + this.quizConfig.difficulty.slice(1)})`;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        
        // Update progress
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        
        // Update question content
        document.getElementById('question-number').textContent = `Question ${this.currentQuestionIndex + 1}`;
        document.getElementById('question-text').innerHTML = question.question.split('\n\n')[0];
        
        // Extract and display code block (clear if none to avoid leftovers)
        const codeMatch = question.question.match(/```python\n([\s\S]*?)\n```/);
        const codeBlock = document.getElementById('code-block');
        if (codeMatch) {
            codeBlock.innerHTML = `<pre><code class="language-python">${this.escapeHtml(codeMatch[1])}</code></pre>`;
            if (window.Prism) {
                window.Prism.highlightElement(codeBlock.querySelector('code'));
            }
        } else {
            codeBlock.innerHTML = '';
        }
        
        // Update answer input
        const answerInput = document.getElementById('answer-input');
        answerInput.value = this.userAnswers[this.currentQuestionIndex];
        
        // Update answer feedback and submit button
        this.updateAnswerFeedback();
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Focus on answer input if not submitted, otherwise focus on navigation
        if (!this.answerSubmitted[this.currentQuestionIndex]) {
            answerInput.focus();
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-quiz-btn');
        const submitAnswerBtn = document.getElementById('submit-answer-btn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        // Enable/disable submit answer button
        const hasAnswer = this.userAnswers[this.currentQuestionIndex].trim();
        const isSubmitted = this.answerSubmitted[this.currentQuestionIndex];
        submitAnswerBtn.disabled = !hasAnswer || isSubmitted;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
            // Enable submit quiz only if all questions are answered and submitted
            submitBtn.disabled = !this.allQuestionsSubmitted();
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
            // Enable next button if current answer is submitted
            nextBtn.disabled = !this.answerSubmitted[this.currentQuestionIndex];
        }
    }
    
    allQuestionsSubmitted() {
        return this.answerSubmitted.every(submitted => submitted);
    }

    handleAnswerInput(answer) {
        this.userAnswers[this.currentQuestionIndex] = answer;
        this.updateNavigationButtons();
        this.validateAnswer(answer);
    }

    submitAnswer() {
        const currentAnswer = this.userAnswers[this.currentQuestionIndex].trim();
        if (!currentAnswer) return;

        // Mark as submitted
        this.answerSubmitted[this.currentQuestionIndex] = true;
        
        // Show feedback
        this.showAnswerFeedback();
        
        // Update buttons
        this.updateNavigationButtons();
        
        // Disable input after submission
        document.getElementById('answer-input').disabled = true;
    }

    showAnswerFeedback() {
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex].trim();
        const correctAnswer = question.answer.trim();
        const isCorrect = this.compareAnswers(question, userAnswer, correctAnswer);
        
        const feedbackElement = document.getElementById('answer-feedback');
        const statusElement = document.getElementById('feedback-status');
        const detailsElement = document.getElementById('feedback-details');
        
        // Clear existing classes
        feedbackElement.className = 'answer-feedback';
        statusElement.className = 'feedback-status';
        
        // Add appropriate classes and content
        if (isCorrect) {
            feedbackElement.classList.add('correct');
            statusElement.classList.add('correct');
            statusElement.textContent = 'Correct!';
            detailsElement.innerHTML = `<strong>Your answer:</strong> ${this.escapeHtml(userAnswer)}`;
        } else {
            feedbackElement.classList.add('incorrect');
            statusElement.classList.add('incorrect');
            statusElement.textContent = 'Incorrect';
            detailsElement.innerHTML = `
                <strong>Your answer:</strong> ${this.escapeHtml(userAnswer)}<br>
                <strong>Correct answer:</strong> ${this.escapeHtml(correctAnswer)}
            `;
        }
        
        // Show the feedback
        feedbackElement.style.display = 'block';
    }

    updateAnswerFeedback() {
        const feedbackElement = document.getElementById('answer-feedback');
        const answerInput = document.getElementById('answer-input');
        
        if (this.answerSubmitted[this.currentQuestionIndex]) {
            // Show existing feedback and disable input
            this.showAnswerFeedback();
            answerInput.disabled = true;
        } else {
            // Hide feedback and enable input
            feedbackElement.style.display = 'none';
            answerInput.disabled = false;
        }
    }

    validateAnswer(answer) {
        const errorElement = document.getElementById('answer-error');
        
        if (!answer.trim()) {
            this.hideError(errorElement);
            return true;
        }
        
        // Allow any user input - remove previous restrictions
        // Users can enter any number as their answer
        this.hideError(errorElement);
        return true;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    submitQuiz() {
        this.quizEndTime = new Date();
        this.calculateResults();
        this.showScreen('results');
        this.displayResults();
    }

    calculateResults() {
        let correctCount = 0;
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index].trim();
            const correctAnswer = question.answer.trim();
            if (this.compareAnswers(question, userAnswer, correctAnswer)) {
                correctCount++;
            }
        });
        
        this.results = {
            correct: correctCount,
            total: this.questions.length,
            percentage: Math.round((correctCount / this.questions.length) * 100),
            timeTaken: Math.round((this.quizEndTime - this.quizStartTime) / 1000 / 60) // minutes
        };
    }

    displayResults() {
        const { correct, total, percentage, timeTaken } = this.results;
        
        // Update score circle
        const scoreCircle = document.querySelector('.score-circle');
        scoreCircle.style.setProperty('--score-percentage', `${percentage * 3.6}deg`);
        
        document.getElementById('score-percentage').textContent = `${percentage}%`;
        document.getElementById('score-text').textContent = `${correct} out of ${total} correct`;
        
        const subtopicLabel = this.quizConfig.subtopic === 'all' ? 'All Topics' : 
            this.subtopics[this.quizConfig.topic].find(s => s.value === this.quizConfig.subtopic)?.label || this.quizConfig.subtopic;
        
        document.getElementById('user-result-info').textContent = 
            `${this.user.name} • ${subtopicLabel} • ${this.quizConfig.difficulty.charAt(0).toUpperCase() + this.quizConfig.difficulty.slice(1)} • ${timeTaken} min`;
    }

    showAnswerReview() {
        const reviewContainer = document.getElementById('answers-review');
        const answersList = document.getElementById('answers-list');
        
        answersList.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index].trim();
            const correctAnswer = question.answer.trim();
            const isCorrect = this.compareAnswers(question, userAnswer, correctAnswer);
            
            const reviewDiv = document.createElement('div');
            reviewDiv.className = `review-question ${isCorrect ? 'correct' : 'incorrect'}`;
            
            const codeMatch = question.question.match(/```python\n([\s\S]*?)\n```/);
            const questionText = question.question.split('\n\n')[0];
            
            reviewDiv.innerHTML = `
                <div class="review-header">
                    <span>Question ${index + 1}</span>
                    <span class="review-status ${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                <div class="review-content">
                    <div class="question-text">${questionText}</div>
                    ${codeMatch ? `<div class="review-code"><pre><code class="language-python">${this.escapeHtml(codeMatch[1])}</code></pre></div>` : ''}
                    <div class="review-answers">
                        <div class="review-answer user">
                            <label>Your Answer:</label>
                            <div class="review-answer-text">${this.escapeHtml(userAnswer || 'No answer provided')}</div>
                        </div>
                        <div class="review-answer correct">
                            <label>Correct Answer:</label>
                            <div class="review-answer-text">${this.escapeHtml(correctAnswer)}</div>
                        </div>
                    </div>
                </div>
            `;
            
            answersList.appendChild(reviewDiv);
        });
        
        // Apply syntax highlighting
        if (window.Prism) {
            window.Prism.highlightAllUnder(answersList);
        }
        
        reviewContainer.style.display = 'block';
        reviewContainer.scrollIntoView({ behavior: 'smooth' });
    }

    restartSameUser() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.answerSubmitted = [];
        this.questions = [];
        this.quizStartTime = null;
        this.quizEndTime = null;
        this.results = null;
        
        // Reset form with same user data
        document.getElementById('user-name').value = this.user.name;
        document.getElementById('topic-select').value = this.quizConfig.topic;
        this.handleTopicChange(this.quizConfig.topic);
        document.getElementById('subtopic-select').value = this.quizConfig.subtopic;
        this.handleSubtopicChange(this.quizConfig.subtopic);
        document.getElementById('difficulty-select').value = this.quizConfig.difficulty;
        
        this.showScreen('setup');
        this.validateSetupForm();
    }

    restartNewUser() {
        // Reset everything
        this.user = null;
        this.quizConfig = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.answerSubmitted = [];
        this.questions = [];
        this.quizStartTime = null;
        this.quizEndTime = null;
        this.results = null;
        
        // Reset form
        document.getElementById('setup-form').reset();
        document.getElementById('subtopic-select').disabled = true;
        document.getElementById('difficulty-select').disabled = true;
        document.getElementById('start-quiz-btn').disabled = true;
        
        this.showScreen('setup');
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.currentScreen = screenName;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            if (this.currentScreen === 'setup') {
                const form = document.getElementById('setup-form');
                if (this.validateSetupForm()) {
                    form.dispatchEvent(new Event('submit'));
                }
            } else if (this.currentScreen === 'quiz') {
                const submitAnswerBtn = document.getElementById('submit-answer-btn');
                const nextBtn = document.getElementById('next-btn');
                const submitQuizBtn = document.getElementById('submit-quiz-btn');
                
                // If answer hasn't been submitted yet, submit it
                if (!this.answerSubmitted[this.currentQuestionIndex] && 
                    this.userAnswers[this.currentQuestionIndex].trim() &&
                    !submitAnswerBtn.disabled) {
                    this.submitAnswer();
                }
                // If answer is submitted and we're on last question, submit quiz
                else if (this.currentQuestionIndex === this.questions.length - 1 && 
                         this.allQuestionsSubmitted()) {
                    this.submitQuiz();
                }
                // If answer is submitted and not last question, go to next
                else if (this.answerSubmitted[this.currentQuestionIndex] && 
                         this.currentQuestionIndex < this.questions.length - 1) {
                    this.nextQuestion();
                }
            }
        }
    }

    showError(element, message) {
        element.textContent = message;
        element.classList.add('show');
    }

    hideError(element) {
        element.classList.remove('show');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Compare answers with special handling for hex (case-insensitive)
    compareAnswers(question, userAnswer, correctAnswer) {
        // Accept case-insensitive answers for hexadecimal output in conversion questions
        const qtext = (question.question || '').toLowerCase();
        const isConversion = question.subtopic === 'conversion';
        const isHexFromDecimal = isConversion && qtext.includes('hexadecimal') && qtext.includes('for decimal number');

        if (isHexFromDecimal) {
            return userAnswer.toLowerCase() === correctAnswer.toLowerCase();
        }

        // Default strict comparison
        return userAnswer === correctAnswer;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PythonQuizApp();
});
