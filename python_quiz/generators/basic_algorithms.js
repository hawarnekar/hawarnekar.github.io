// Basic Algorithms Question Generator
// Generates questions about simple algorithmic patterns using conditionals, loops, and lists

window.BasicAlgorithmsGenerator = {
    algorithms: ['prime_check', 'count_factors', 'sum_digits', 'reverse_number', 
                'find_maximum', 'count_even', 'palindrome_check', 'bubble_sort_step', 
                'fibonacci', 'perfect_number', 'count_words_starting_with', 'count_words_containing',
                'most_frequent_letter_before_t', 'string_bubble_sort', 'complex_string_processing'],
    
    phonetic: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 
               'Hotel', 'India', 'Juliet', 'Kilo', 'Lima', 'Mike', 'November', 
               'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 
               'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'],

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    getRandomNumbers(count, min, max) {
        const numbers = [];
        for (let i = 0; i < count; i++) {
            numbers.push(this.getRandomNumber(min, max));
        }
        return numbers;
    },

    // EASY DIFFICULTY QUESTIONS

    generateCountEven() {
        const nums = this.getRandomNumbers(this.getRandomNumber(8, 15), 1, 9);
        let result = 0;
        for (let num of nums) {
            if (num % 2 === 0) result++;
        }

        const question = `What will this print?

\`\`\`python
arr = [${nums.join(',')}]
x = 0
for val in arr:
    if val % 2 == 0:
        x += 1
print(x)
\`\`\``;

        return {
            question: question,
            answer: result.toString(),
            difficulty: 'easy'
        };
    },

    generateFindMaximum() {
        const nums = this.getRandomNumbers(this.getRandomNumber(8, 15), 1, 20);
        const target_val = Math.max(...nums);
        const position = nums.indexOf(target_val);

        const question = `What will this print?

\`\`\`python
arr = [${nums.join(',')}]
val = arr[0]
pos = 0
i = 1
while i < len(arr):
    if arr[i] > val:
        val = arr[i]
        pos = i
    i += 1
print(pos)
\`\`\``;

        return {
            question: question,
            answer: position.toString(),
            difficulty: 'easy'
        };
    },

    generateSumDigits() {
        const n = this.getRandomNumber(123, 999);
        let temp = n;
        let total = 0;
        while (temp > 0) {
            total += temp % 10;
            temp = Math.floor(temp / 10);
        }

        const question = `What will this print?

\`\`\`python
n = ${n}
x = 0
while n > 0:
    x += n % 10
    n = n // 10
print(x)
\`\`\``;

        return {
            question: question,
            answer: total.toString(),
            difficulty: 'easy'
        };
    },

    // STRING ALGORITHMS - EASY

    generateCountWordsStartingWith() {
        const words = ['atom', 'acceleration', 'algebra', 'angle', 'bacteria', 'biodiversity', 'carbon', 'cell', 'circle', 'density', 'diameter', 'equation', 'element', 'energy', 'friction', 'force', 'genetics', 'gravity', 'hydrogen', 'integer', 'kinetic', 'mass', 'molecule', 'neutron', 'oxygen', 'photosynthesis', 'polygon', 'pressure', 'quadratic', 'radius', 'speed', 'temperature', 'velocity', 'volume'];
        const selectedWords = [];
        const numWords = this.getRandomNumber(8, 12);
        
        for (let i = 0; i < numWords; i++) {
            selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        
        const targetLetter = ['a', 'b', 'c', 'm', 'p'][Math.floor(Math.random() * 5)];
        
        let count = 0;
        selectedWords.forEach(word => {
            if (word.toLowerCase().startsWith(targetLetter)) count++;
        });

        const question = `What will this print?

\`\`\`python
w = [${selectedWords.map(w => `"${w}"`).join(',')}]
t = "${targetLetter}"
x = 0
for wrd in w:
    if wrd.lower().startswith(t):
        x += 1
print(x)
\`\`\``;

        return {
            question: question,
            answer: count.toString(),
            difficulty: 'easy'
        };
    },

    generateCountWordsContaining() {
        const words = ['mitosis', 'respiration', 'photosynthesis', 'chromosome', 'ecosystem', 'formula', 'theorem', 'factorization', 'polynomial', 'triangle', 'rectangle', 'coordinate', 'proportion', 'statistics', 'probability', 'magnetic', 'electric', 'chemical', 'physical', 'organic', 'compound', 'solution', 'reaction', 'isotope'];
        const selectedWords = [];
        const numWords = this.getRandomNumber(8, 12);
        
        for (let i = 0; i < numWords; i++) {
            selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        
        const targetLetter = ['e', 'o', 't', 'a', 'i'][Math.floor(Math.random() * 5)];
        
        let count = 0;
        selectedWords.forEach(word => {
            if (word.toLowerCase().includes(targetLetter)) count++;
        });

        const question = `What will this print?

\`\`\`python
w = [${selectedWords.map(w => `"${w}"`).join(',')}]
ltr = "${targetLetter}"
x = 0
for wrd in w:
    if ltr in wrd.lower():
        x += 1
print(x)
\`\`\``;

        return {
            question: question,
            answer: count.toString(),
            difficulty: 'easy'
        };
    },


    // STRING ALGORITHMS - MEDIUM

    generateMostFrequentLetterBeforeT() {
        const words = ['orbit', 'habitat', 'magnet', 'vertex', 'factor', 'vector', 'centre', 'matter', 'rotational', 'potential', 'systematic', 'genetics', 'mathematics', 'statistics', 'quadratic', 'arithmetic'];
        const selectedWords = [];
        const numWords = this.getRandomNumber(6, 10);
        
        for (let i = 0; i < numWords; i++) {
            selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        
        const letterCounts = {};
        selectedWords.forEach(word => {
            for (let i = 0; i < word.length - 1; i++) {
                if (word[i + 1].toLowerCase() === 't') {
                    const prevLetter = word[i].toLowerCase();
                    letterCounts[prevLetter] = (letterCounts[prevLetter] || 0) + 1;
                }
            }
        });
        
        let mostFrequentLetter = '';
        let maxCount = 0;
        for (const [letter, count] of Object.entries(letterCounts)) {
            if (count > maxCount) {
                maxCount = count;
                mostFrequentLetter = letter;
            }
        }
        
        // If no letters found before 't', return 'x'
        if (!mostFrequentLetter) mostFrequentLetter = 'x';

        const question = `What will this print?

\`\`\`python
w = [${selectedWords.map(w => `"${w}"`).join(',')}]
cnt = {}
for wrd in w:
    for i in range(len(wrd) - 1):
        if wrd[i + 1].lower() == 't':
            ch = wrd[i].lower()
            if ch in cnt:
                cnt[ch] += 1
            else:
                cnt[ch] = 1

mc = 'x'
mn = 0
for ch, count in cnt.items():
    if count > mn:
        mn = count
        mc = ch
print(mc)
\`\`\``;

        return {
            question: question,
            answer: mostFrequentLetter,
            difficulty: 'medium'
        };
    },


    // MEDIUM DIFFICULTY QUESTIONS

    generatePrimeCheck() {
        const primes = [7, 11, 13, 17, 19, 23];
        const composites = [8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
        const allNumbers = [...primes, ...composites];
        const n = allNumbers[Math.floor(Math.random() * allNumbers.length)];
        
        let is_prime = true;
        if (n < 2) is_prime = false;
        for (let i = 2; i < n; i++) {
            if (n % i === 0) {
                is_prime = false;
                break;
            }
        }

        const question = `What will this print?

\`\`\`python
n = ${n}
f = True
i = 2
while i < n:
    if n % i == 0:
        f = False
    i += 1
print(f)
\`\`\``;

        return {
            question: question,
            answer: is_prime.toString(),
            difficulty: 'medium'
        };
    },

    generateCountFactors() {
        const n = this.getRandomNumber(6, 20);
        let count = 0;
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) count++;
        }

        const question = `What will this print?

\`\`\`python
n = ${n}
c = 0
i = 1
while i <= n:
    if n % i == 0:
        c += 1
    i += 1
print(c)
\`\`\``;

        return {
            question: question,
            answer: count.toString(),
            difficulty: 'medium'
        };
    },

    generateReverseNumber() {
        const n = this.getRandomNumber(123, 987);
        let temp = n;
        let reversed_n = 0;
        while (temp > 0) {
            reversed_n = reversed_n * 10 + temp % 10;
            temp = Math.floor(temp / 10);
        }

        const question = `What will this print?

\`\`\`python
n = ${n}
r = 0
while n > 0:
    r = r * 10 + n % 10
    n = n // 10
print(r)
\`\`\``;

        return {
            question: question,
            answer: reversed_n.toString(),
            difficulty: 'medium'
        };
    },

    generatePalindromeCheck() {
        // Create palindromic and non-palindromic lists
        const palindromic = [[1,2,1], [3,4,3], [5,6,7,6,5], [8,9,8], [1,2,3,2,1]];
        const nonPalindromic = [[1,2,3], [4,5,6], [7,8,9,1], [2,3,4,5], [6,7,8,9,1]];
        const allLists = [...palindromic, ...nonPalindromic];
        const nums = allLists[Math.floor(Math.random() * allLists.length)];
        
        let is_palindrome = true;
        for (let i = 0; i < Math.floor(nums.length / 2); i++) {
            if (nums[i] !== nums[nums.length - 1 - i]) {
                is_palindrome = false;
                break;
            }
        }

        const question = `What will this print?

\`\`\`python
arr = [${nums.join(',')}]
b = True
i = 0
while i < len(arr) // 2:
    if arr[i] != arr[len(arr) - 1 - i]:
        b = False
    i += 1
print(b)
\`\`\``;

        return {
            question: question,
            answer: is_palindrome.toString(),
            difficulty: 'medium'
        };
    },

    generateFibonacci() {
        const n = this.getRandomNumber(4, 7);
        const fib = [0, 1];
        for (let i = 2; i < n; i++) {
            fib.push(fib[i-1] + fib[i-2]);
        }
        
        // Pick a random index to print (positive or negative)
        const useNegativeIndex = Math.random() < 0.5;
        let index, actualIndex;
        
        if (useNegativeIndex) {
            index = -this.getRandomNumber(1, n);
            actualIndex = n + index;
        } else {
            index = this.getRandomNumber(0, n-1);
            actualIndex = index;
        }
        
        const result = fib[actualIndex];

        const question = `What will this print?

\`\`\`python
n = ${n}
s = [0, 1]
i = 2
while i < n:
    s.append(s[i-1] + s[i-2])
    i += 1
print(s[${index}])
\`\`\``;

        return {
            question: question,
            answer: result.toString(),
            difficulty: 'medium'
        };
    },

    // STRING ALGORITHMS - HARD

    generateStringBubbleSort() {
        const words = ['atom', 'biology', 'carbon', 'density', 'element', 'friction', 'genetics', 'hydrogen', 'isotope', 'kinetic', 'molecule', 'neutron', 'oxygen', 'polygon', 'quadratic', 'radius', 'statistics', 'triangle', 'velocity', 'volume'];
        const selectedWords = [];
        const numWords = this.getRandomNumber(5, 8);
        
        for (let i = 0; i < numWords; i++) {
            selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        
        // Perform one pass of bubble sort
        const sortedWords = [...selectedWords];
        for (let i = 0; i < sortedWords.length - 1; i++) {
            if (sortedWords[i].toLowerCase() > sortedWords[i + 1].toLowerCase()) {
                [sortedWords[i], sortedWords[i + 1]] = [sortedWords[i + 1], sortedWords[i]];
            }
        }
        
        // Pick a random index to print
        const useNegativeIndex = Math.random() < 0.5;
        let index, actualIndex;
        
        if (useNegativeIndex) {
            index = -this.getRandomNumber(1, sortedWords.length);
            actualIndex = sortedWords.length + index;
        } else {
            index = this.getRandomNumber(0, sortedWords.length - 1);
            actualIndex = index;
        }
        
        const result = sortedWords[actualIndex];

        const question = `What will this print?

\`\`\`python
w = [${selectedWords.map(w => `"${w}"`).join(',')}]
i = 0
while i < len(w) - 1:
    if w[i].lower() > w[i + 1].lower():
        tmp = w[i]
        w[i] = w[i + 1]
        w[i + 1] = tmp
    i += 1
print(w[${index}])
\`\`\``;

        return {
            question: question,
            answer: result,
            difficulty: 'hard'
        };
    },

    generateComplexStringProcessing() {
        const words = [' Cellular respiration ', 'Photosynthesis process', ' Light reaction ', 'Gravitational force', 
                      'Nuclear fusion', ' Atomic structure ', 'Chemical bonding', ' Periodic table ', 
                      'Electromagnetic waves', ' Sound waves ', 'Heat transfer', ' Newton laws ',
                      ' Quadratic equation ', ' Linear equation ', ' Polynomial function ', ' Trigonometric ratio ',
                      ' Circle theorem ', ' Triangle inequality ', ' Probability theory ', ' Statistics data ',
                      ' Cell wall ', ' DNA RNA ', ' Photon ', 'Gravity', ' Enzyme ', ' Protein ', 
                      'Ion bond', ' pH scale ', ' Neutron ', ' Proton ', ' Electron ', ' Mitosis ',
                      ' Prime number ', ' Integer set ', ' Rational number ', ' Real number '];
        const selectedWords = [];
        const numWords = this.getRandomNumber(4, 6);
        
        for (let i = 0; i < numWords; i++) {
            selectedWords.push(words[Math.floor(Math.random() * words.length)]);
        }
        
        // Randomize the comparison constant between 8 and 12
        const lengthThreshold = this.getRandomNumber(8, 12);
        
        let result = 0;
        selectedWords.forEach(word => {
            const processed = word.trim().replace(/ /g, '_').toLowerCase();
            if (processed.length > lengthThreshold) {
                result += processed.split('_').length;
            }
        });

        const question = `What will this print?

\`\`\`python
w = [${selectedWords.map(w => `"${w}"`).join(',')}]
res = 0
for wrd in w:
    p = wrd.strip().replace(" ", "_").lower()
    if len(p) > ${lengthThreshold}:
        res += len(p.split("_"))
print(res)
\`\`\``;

        return {
            question: question,
            answer: result.toString(),
            difficulty: 'hard'
        };
    },

    // HARD DIFFICULTY QUESTIONS

    generateBubbleSortStep() {
        const nums = this.getRandomNumbers(4, 1, 9);
        const original = [...nums];
        
        // Perform one pass of bubble sort
        for (let i = 0; i < nums.length - 1; i++) {
            if (nums[i] > nums[i + 1]) {
                [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
            }
        }
        
        // Pick a random index to print
        const useNegativeIndex = Math.random() < 0.5;
        let index, actualIndex;
        
        if (useNegativeIndex) {
            index = -this.getRandomNumber(1, nums.length);
            actualIndex = nums.length + index;
        } else {
            index = this.getRandomNumber(0, nums.length-1);
            actualIndex = index;
        }
        
        const result = nums[actualIndex];

        const question = `What will this print?

\`\`\`python
a = [${original.join(',')}]
i = 0
while i < len(a) - 1:
    if a[i] > a[i + 1]:
        tmp = a[i]
        a[i] = a[i + 1]
        a[i + 1] = tmp
    i += 1
print(a[${index}])
\`\`\``;

        return {
            question: question,
            answer: result.toString(),
            difficulty: 'hard'
        };
    },

    generatePerfectNumber() {
        const perfectNumbers = [6, 28];
        const nonPerfectNumbers = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 30];
        const allNumbers = [...perfectNumbers, ...nonPerfectNumbers];
        const n = allNumbers[Math.floor(Math.random() * allNumbers.length)];
        
        let sum_divisors = 0;
        for (let i = 1; i < n; i++) {
            if (n % i === 0) {
                sum_divisors += i;
            }
        }
        const is_perfect = sum_divisors === n;

        const question = `What will this print?

\`\`\`python
n = ${n}
s = 0
i = 1
while i < n:
    if n % i == 0:
        s += i
    i += 1
res = s == n
print(res)
\`\`\``;

        return {
            question: question,
            answer: is_perfect.toString(),
            difficulty: 'hard'
        };
    },

    // Generate multiple questions for the quiz
    generateQuestions(difficulty, count) {
        const questions = [];
        
        for (let i = 0; i < count; i++) {
            const question = this.generateQuestion(difficulty);
            questions.push({
                topic: 'python',
                subtopic: 'basic-algorithms',
                difficulty: question.difficulty,
                type: 'fill',
                question: question.question,
                answer: question.answer
            });
        }
        
        return questions;
    },

    // Main generation method
    generateQuestion(difficulty = null) {
        const easyQuestions = ['count_even', 'find_maximum', 'sum_digits', 'count_words_starting_with', 'count_words_containing'];
        const mediumQuestions = ['prime_check', 'count_factors', 'reverse_number', 'palindrome_check', 'fibonacci', 'most_frequent_letter_before_t'];
        const hardQuestions = ['bubble_sort_step', 'perfect_number', 'string_bubble_sort', 'complex_string_processing'];
        
        let selectedQuestions;
        if (difficulty === 'easy') {
            selectedQuestions = easyQuestions;
        } else if (difficulty === 'medium') {
            selectedQuestions = mediumQuestions;
        } else if (difficulty === 'hard') {
            selectedQuestions = hardQuestions;
        } else {
            selectedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        }
        
        const questionType = selectedQuestions[Math.floor(Math.random() * selectedQuestions.length)];
        
        switch (questionType) {
            case 'count_even': return this.generateCountEven();
            case 'find_maximum': return this.generateFindMaximum();
            case 'sum_digits': return this.generateSumDigits();
            case 'count_words_starting_with': return this.generateCountWordsStartingWith();
            case 'count_words_containing': return this.generateCountWordsContaining();
            case 'prime_check': return this.generatePrimeCheck();
            case 'count_factors': return this.generateCountFactors();
            case 'reverse_number': return this.generateReverseNumber();
            case 'palindrome_check': return this.generatePalindromeCheck();
            case 'fibonacci': return this.generateFibonacci();
            case 'most_frequent_letter_before_t': return this.generateMostFrequentLetterBeforeT();
            case 'bubble_sort_step': return this.generateBubbleSortStep();
            case 'perfect_number': return this.generatePerfectNumber();
            case 'string_bubble_sort': return this.generateStringBubbleSort();
            case 'complex_string_processing': return this.generateComplexStringProcessing();
            default: return this.generateCountEven();
        }
    }
};