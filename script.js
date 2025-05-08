const quotes = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Typing is fun.",
    "Practice makes perfect.",
  ],
  medium: [
    "JavaScript is a versatile language for web development.",
    "Typing speed depends on both skill and focus.",
    "Coding challenges help improve logical thinking.",
  ],
  hard: [
    "Efficiency is doing things right; effectiveness is doing the right things.",
    "Simplicity is the soul of efficiency in any system.",
    "Debugging is twice as hard as writing the code in the first place.",
  ]
};

let currentQuote = "";
let startTime;
let typingStarted = false;

const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restart");
const leaderboardEl = document.getElementById("leaderboard");
const difficultyEl = document.getElementById("difficulty");

function getRandomQuote(level) {
  const qList = quotes[level];
  return qList[Math.floor(Math.random() * qList.length)];
}

function calculateResults() {
  const endTime = new Date().getTime();
  const typedText = inputEl.value;
  const elapsedMinutes = (endTime - startTime) / 60000;
  const wordCount = typedText.trim().split(/\s+/).length;
  const wpm = Math.round(wordCount / elapsedMinutes);

  let correctChars = 0;
  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === currentQuote[i]) correctChars++;
  }

  const accuracy = Math.round((correctChars / currentQuote.length) * 100);

  wpmEl.textContent = wpm;
  accuracyEl.textContent = `${accuracy}%`;

  updateLeaderboard(wpm, accuracy);
}

function updateLeaderboard(wpm, accuracy) {
  const difficulty = difficultyEl.value;
  const entry = {
    wpm,
    accuracy,
    timestamp: new Date().toLocaleString()
  };

  const key = `leaderboard-${difficulty}`;
  const leaderboard = JSON.parse(localStorage.getItem(key)) || [];
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.wpm - a.wpm);
  localStorage.setItem(key, JSON.stringify(leaderboard.slice(0, 5)));

  showLeaderboard();
}

function showLeaderboard() {
  const difficulty = difficultyEl.value;
  const leaderboard = JSON.parse(localStorage.getItem(`leaderboard-${difficulty}`)) || [];

  leaderboardEl.innerHTML = leaderboard
    .map(score => `<li>${score.wpm} WPM - ${score.accuracy}% (${score.timestamp})</li>`)
    .join("");
}

inputEl.addEventListener("input", () => {
  if (!typingStarted) {
    typingStarted = true;
    startTime = new Date().getTime();
  }

  if (inputEl.value === currentQuote) {
    inputEl.disabled = true;
    calculateResults();
  }
});

restartBtn.addEventListener("click", () => {
  const difficulty = difficultyEl.value;
  currentQuote = getRandomQuote(difficulty);
  quoteEl.textContent = currentQuote;
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();
  typingStarted = false;
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0%";
  showLeaderboard();
});

difficultyEl.addEventListener("change", showLeaderboard);
