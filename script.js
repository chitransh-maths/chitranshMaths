
// Password checking
function checkPassword() {
  const passwordInput = document.getElementById('passwordInput').value;
  const passwordError = document.getElementById('passwordError');

  if (passwordInput === "2520") {
    document.getElementById('passwordPage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
  } else {
    passwordError.textContent = "Incorrect password. Please try again.";
  }
}


const facts = [
  "Zero is the only number that can’t be represented in Roman numerals.",
  "A 'googol' is the number 1 followed by 100 zeros.",
  "The word 'hundred' comes from the old Norse term, 'hundrath', meaning 120.",
  "The division symbol (÷) is called an obelus.",
  "There are infinitely many prime numbers."
];

let questions = [];
let currentQuestion = 0;
let correct = 0;
let wrong = 0;
let skipped = 0;
let total = 20;
let userLevel = "easy";
let userTopic = "addition";

let startTime;
let timerInterval;

document.getElementById("start-btn").onclick = () => {
  userLevel = document.getElementById("level-select").value;
  userTopic = document.getElementById("topic-select").value;

  document.getElementById("start-section").style.display = "none";
  document.getElementById("quiz-container").style.display = "flex";
  document.getElementById("progress-section").style.display = "block";
  
  resetQuiz();
};

function showFlash(message, isFact = false) {
  const flash = document.getElementById("flash");
  flash.innerText = isFact ? `Fact: ${message}` : message;
  flash.style.opacity = 1;
  setTimeout(() => { flash.style.opacity = 0; }, 2000);
}

function generateQuestions(level, topic) {
  const range = { easy: [1, 10], medium: [10, 50], hard: [30, 100] }[level];
  const ops = { addition: "+", subtraction: "-", multiplication: "*", division: "/" };
  const symbol = ops[topic];
  const questions = [];

  while (questions.length < total) {
    let a = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    let b = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    if (topic === "division") a = a * b;

    let text = `${a} ${symbol} ${b}`;
    let ans = eval(text);
    if (topic === "division") ans = Math.floor(ans);

    questions.push({ text, ans });
  }
  return questions;
}

function displayQuestion() {
  const q = questions[currentQuestion];
  document.getElementById("question-number").innerText = `Question ${currentQuestion + 1}`;
  document.getElementById("question-text").innerText = q.text;
  document.getElementById("answer").value = "";
  document.getElementById("next-btn").style.display = "none";
}

function updateProgress() {
  document.getElementById("progress").innerText = `Right: ${correct} | Wrong: ${wrong} | Skipped: ${skipped}`;
}

function updateTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  document.getElementById("timer").innerText = `Time Elapsed: ${minutes}m ${seconds}s`;
}

function showCertificate() {
  clearInterval(timerInterval);
  const canvas = document.getElementById("certificate-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;

  const gradient = ctx.createLinearGradient(0, 0, 800, 600);
  gradient.addColorStop(0, "#a1c4fd");
  gradient.addColorStop(1, "#c2e9fb");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#004080";
  ctx.fillRect(0, 0, canvas.width, 80);

  ctx.font = "bold 36px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Chitransh Maths Certificate", 200, 55);

  const name = prompt("Enter your name for the certificate:") || "Anonymous";

  ctx.font = "24px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText(`Awarded to`, 320, 140);

  ctx.font = "30px Georgia";
  ctx.fillStyle = "#000";
  ctx.fillText(name, 300, 190);

  ctx.font = "22px Arial";
  ctx.fillText(`for completing the quiz on`, 270, 240);
  ctx.fillText(`Topic: ${userTopic}`, 310, 280);
  ctx.fillText(`Level: ${userLevel}`, 310, 320);
  ctx.fillText(`Correct: ${correct}`, 310, 360);
  ctx.fillText(`Wrong: ${wrong}`, 310, 400);
  ctx.fillText(`Skipped: ${skipped}`, 310, 440);

  const endTime = Date.now();
  const elapsedSeconds = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  ctx.fillText(`Time: ${minutes}m ${seconds}s`, 310, 480);

  ctx.beginPath();
  ctx.moveTo(500, 530);
  ctx.lineTo(720, 530);
  ctx.strokeStyle = "#000";
  ctx.stroke();

  ctx.font = "28px cursive";
  ctx.fillStyle = "#000";
  ctx.fillText("Chitransh Ganesh Yadav", 510, 520);

  ctx.font = "18px Arial";
  ctx.fillText("Founder, Chitransh Maths", 550, 560);

  document.getElementById("download-link").href = canvas.toDataURL();
  document.getElementById("download-link").style.display = "block";
}

function resetQuiz() {
  correct = wrong = skipped = currentQuestion = 0;
  questions = generateQuestions(userLevel, userTopic);
  updateProgress();
  displayQuestion();
  document.getElementById("download-link").style.display = "none";

  if (timerInterval) clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

document.getElementById("submit-btn").onclick = () => {
  const answer = parseInt(document.getElementById("answer").value);
  if (isNaN(answer)) return;

  const correctAnswer = questions[currentQuestion].ans;
  if (answer === correctAnswer) {
    correct++;
    showFlash(facts[Math.floor(Math.random() * facts.length)], true);
  } else {
    wrong++;
    showFlash(`Wrong! Correct: ${correctAnswer}`);
  }

  document.getElementById("next-btn").style.display = "inline-block";
  updateProgress();
};

document.getElementById("next-btn").onclick = () => {
  currentQuestion++;
  if (currentQuestion >= total) {
    showCertificate();
  } else {
    displayQuestion();
  }
};

document.getElementById("skip-btn").onclick = () => {
  skipped++;
  currentQuestion++;
  if (currentQuestion >= total) {
    showCertificate();
  } else {
    displayQuestion();
  }
  updateProgress();
};

document.getElementById("share-btn").onclick = () => {
  const shareText = `I just practiced ${total} ${userTopic} questions at Chitransh Maths!`;
  navigator.share ? navigator.share({ text: shareText }) : alert(shareText);
};
