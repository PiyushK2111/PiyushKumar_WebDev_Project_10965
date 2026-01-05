const quoteDisplay = document.getElementById('quote-display');
const quoteInput = document.getElementById('quote-input');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

let timer = 60;
let interval = null;
let isStarting = false;

const sampleQuotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Data structures and algorithms are the heart of computer science.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "JavaScript allows you to build beautiful and interactive websites."
];

// 1. Initialize the Test
function renderNewQuote() {
    const randomIndex = Math.floor(Math.random() * sampleQuotes.length);
    const quote = sampleQuotes[randomIndex];
    quoteDisplay.innerHTML = '';
    
    // Wrap each character in a span so we can color them individually
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        quoteDisplay.appendChild(charSpan);
    });
    
    quoteInput.value = null;
    resetStats();
}

// 2. Start the Countdown
function startTimer() {
    interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.innerText = timer;
            updateWPM(); 
        } else {
            stopTest(false); // End if time runs out
        }
    }, 1000);
}

// 3. Main Logic: Check Input and Calculate Stats
function calculateStats() {
    const arrayQuote = quoteDisplay.querySelectorAll('span');
    const arrayValue = quoteInput.value.split('');
    let correctChars = 0;
    let charactersTyped = arrayValue.length;

    arrayQuote.forEach((charSpan, index) => {
        const char = arrayValue[index];
        if (char == null) {
            charSpan.classList.remove('correct', 'incorrect');
        } else if (char === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            charSpan.classList.remove('correct');
            charSpan.classList.add('incorrect');
        }
    });

    // Calculate Accuracy
    if (charactersTyped > 0) {
        const acc = Math.round((correctChars / charactersTyped) * 100);
        accuracyElement.innerText = acc;
    }

    // UPDATE: Check for completion immediately
    if (charactersTyped === arrayQuote.length) {
        stopTest(true); 
    }
}

// 4. Calculate WPM
function updateWPM() {
    const timeElapsed = 60 - timer;
    if (timeElapsed <= 0) return;

    const correctChars = quoteDisplay.querySelectorAll('.correct').length;
    // Standard WPM formula: (correct characters / 5) / (time in minutes)
    const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
    wpmElement.innerText = wpm;
}

// 5. Stop the Test and Show Popup
function stopTest(isCompleted) {
    clearInterval(interval);
    quoteInput.disabled = true;
    
    // Final WPM calculation at the moment of stopping
    updateWPM();

    const finalWPM = wpmElement.innerText;
    const finalAcc = accuracyElement.innerText;

    if (isCompleted) {
        alert(`🏁 Congratulations! You finished the test.\n\nSpeed: ${finalWPM} WPM\nAccuracy: ${finalAcc}%`);
    } else {
        alert(`⏰ Time's up!\n\nSpeed: ${finalWPM} WPM\nAccuracy: ${finalAcc}%`);
    }
}

// 6. Event Listeners
quoteInput.addEventListener('input', () => {
    if (!isStarting) {
        startTimer();
        isStarting = true;
    }
    calculateStats();
});

function resetStats() {
    clearInterval(interval);
    timer = 60;
    isStarting = false;
    timerElement.innerText = timer;
    wpmElement.innerText = 0;
    accuracyElement.innerText = 100;
    quoteInput.disabled = false;
}

restartBtn.addEventListener('click', renderNewQuote);

// Initial Load
renderNewQuote();