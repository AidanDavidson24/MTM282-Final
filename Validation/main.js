const API_URL = 'https://opentdb.com/api.php?amount=50';

const categorySelect = document.getElementById('category');
const difficultySelect = document.getElementById('difficulty');
const scoreSelect = document.getElementById('score');
const questionElement = document.getElementById('question');
const choicesElement = document.getElementById('choices');
const resultElement = document.getElementById('result');
const nextButton = document.getElementById('next-button');
const leaderboardElement = document.getElementById('leaderboard');

let currentQuestionIndex = 0;
let score = 0;
let leaderboard = [];

nextButton.addEventListener('click', loadNextQuestion);

function loadNextQuestion() {
  resultElement.textContent = '';

  if (currentQuestionIndex >= questions.length) {
    displayResult();
    return;
  }

  const question = questions[currentQuestionIndex];
  showQuestion(question);
  currentQuestionIndex++;
}

async function fetchQuestions() {
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;
  const amount = scoreSelect.value / 100;

  const url = `${API_URL}?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
  const response = await fetch(url);
  const data = await response.json();

  return data.results;
}

function showQuestion(question) {
  questionElement.textContent = question.question;

  choicesElement.innerHTML = '';

  const choices = [...question.incorrect_answers, question.correct_answer];
  const shuffledChoices = shuffleArray(choices);

  shuffledChoices.forEach(choice => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = choice;
    button.addEventListener('click', checkAnswer.bind(null, question, choice));
    li.appendChild(button);
    choicesElement.appendChild(li);
  });
}

function checkAnswer(question, selectedChoice) {
  const correctChoice = question.correct_answer;

  if (selectedChoice === correctChoice) {
    resultElement.textContent = 'Correct!';
    score += scoreSelect.value;
  } else {
    resultElement.textContent = `Wrong! The correct answer is "${correctChoice}".`;
  }

  nextButton.disabled = false;
  choicesElement.querySelectorAll('button').forEach(button => {
    button.disabled = true;
  });
}

function displayResult() {
  questionElement.textContent = 'Quiz Completed!';
  choicesElement.innerHTML = '';

  resultElement.textContent = `Your score: ${score}`;

  const playerName = prompt('Enter your name:');
  leaderboard.push({ name: playerName, score: score });
  leaderboard.sort((a, b) => b.score - a.score);

  leaderboardElement.innerHTML = '';
  leaderboard.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardElement.appendChild(li);
  });
}

function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

async function startGame() {
    leaderboard = [];
    leaderboardElement.innerHTML = '';
    score = 0;
    currentQuestionIndex = 0;
    nextButton.disabled = true;
  
    try {
      const fetchedQuestions = await fetchQuestions();
      if (fetchedQuestions.length === 1) {
        alert('No questions found for the selected criteria. Please try again.');
        return;
      }
      questions = fetchedQuestions;
      showQuestion(questions[currentQuestionIndex]);
      currentQuestionIndex++;
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('An error occurred while fetching questions. Please try again.');
    }
  } 
  startGame();