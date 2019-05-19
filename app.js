const QUESTIONS = [
  {
    question: `What ingredient do the turtles not like on their pizza?`,
    answers: ["Pepperoni", "Mushrooms", "Anchovies", "Sausage"],
    correctAnswer: "Anchovies"
  },
  {
    question:
      "What substance transformed the turtles into crime fighting ninjas?",
    answers: ["Anabolic steroids", "Pizza", "The ooze", "Pepsi Clear"],
    correctAnswer: "The ooze"
  },
  {
    question:
      "What are the names of Shredder's henchman who were once human gang members?",
    answers: [
      "Bebop and Rocksteady",
      "Bill and Ted",
      "Casey Jones and Keno",
      "Wild Bill and Steady Eddie"
    ],
    correctAnswer: "Bebop and Rocksteady"
  },
  {
    question: "What year was the first Ninja Turtles video game released?",
    answers: ["1982", "1984", "1989", "1991"],
    correctAnswer: "1989"
  },
  {
    question: "What is the name of Shredder's bodiless ally?",
    answers: ["Splinter", "The Brain", "Tommy", "Krang"],
    correctAnswer: "Krang"
  }
];

const STATE = {
  render: {
    startPage: true,
    questionPage: false,
    answerPage: false,
    resultsPage: false,
    noAnswerPage: false
  },

  currentQuestion: 0,
  currentScore: 0,
  currentQuestionCorrect: false,
  noAnswerSubmitted: false,
  onLastQuestion: false
};

// function to render content to the page based on the boolean value of the views in STATE.render
function render() {
  if (STATE.render.startPage === true) {
    renderStartPage();
  } else if (STATE.render.questionPage === true) {
    renderQuestionPage();
  } else if (STATE.render.answerPage) {
    renderAnswerPage();
  } else if (STATE.render.resultsPage) {
    renderResultsPage();
  } else if (STATE.render.noAnswerPage) {
    renderNoAnswerPage();
  }
}

// Render start page for the app
function renderStartPage() {
  CONTAINER.innerHTML = `
      <div class="start-page">
      <p class>
        This is a quiz that will test your knowledge of the Teenage Mutant Ninja Turtles.
      </p>
      <button id="js-start-quiz-button">Start Quiz</button>
      </div>
      `;
  handleStartQuiz();
}

// Render current question and answer form
function renderQuestionPage() {
  CONTAINER.innerHTML = `
  <div class="question-page">
    <div class="score-container">
        <p>Question ${STATE.currentQuestion + 1} of ${QUESTIONS.length}</p>
        <p>Current Score: ${STATE.currentScore}</p>
    </div>
    <div>
        <P class="red-text">${
          STATE.noAnswerSubmitted ? "You must select an answer" : ""
        }</p>
    </div>
    <div>
    <form id="question-form">
    ${getCurrentQuestion(QUESTIONS[STATE.currentQuestion])}
    <button type="submit" class="js-answer-submit">Submit Answer</button>
    </form>
    </div>
</div>
    `;
  STATE.noAnswerSubmitted = false;
  handleQuestionSubmit();
}

function renderAnswerPage() {
  console.log(STATE.currentQuestionCorrect);
  if (STATE.currentQuestionCorrect) {
    CONTAINER.innerHTML = `
        <div class="answer-page">
            <p>That's correct!</p>
            <button id="js-next-question-button">${
              STATE.onLastQuestion ? "Results" : "Next Question"
            }</button>
        </div>
        `;
  } else {
    CONTAINER.innerHTML = `
        <div class="answer-page">
            <p>Sorry that's incorrect! The correct answer is ${
              QUESTIONS[STATE.currentQuestion].correctAnswer
            }.</p>
            <button id="js-next-question-button">${
              STATE.onLastQuestion ? "Results" : "Next Question"
            }</button>
        </div>
        `;
  }
  handleNextQuestion();
}

function renderResultsPage() {
  CONTAINER.innerHTML = `
  <div class="results-page">
        <p>You got ${STATE.currentScore} out of ${QUESTIONS.length} correct</p>
        <button id="js-reset-quiz-button">Play Again</button>
    </div>
    `;
  handleResetQuiz();
}

// Handling of events

// Hnalde clicking of 'start quiz' button
function handleStartQuiz() {
  document
    .querySelector("#js-start-quiz-button")
    .addEventListener("click", e => {
      STATE.render.startPage = false;
      STATE.render.questionPage = true;
      render();
    });
}

// Handle clicking of button on answers page for 'next question'
function handleNextQuestion() {
  document
    .querySelector("#js-next-question-button")
    .addEventListener("click", e => {
      STATE.currentQuestion++;
      STATE.render.answerPage = false;
      if (STATE.onLastQuestion) {
        STATE.render.resultsPage = true;
      } else {
        STATE.render.questionPage = true;
      }
      render();
    });
}

//Handle submission of question/answers form
function handleQuestionSubmit() {
  const QUESTIONFORM = document.querySelector("#question-form");
  QUESTIONFORM.addEventListener("submit", e => {
    e.preventDefault();
    let currentAnswer = QUESTIONFORM.elements["answers"].value;
    console.log(currentAnswer);
    if (currentAnswer === "") {
      STATE.noAnswerSubmitted = true;
      render();
    } else if (STATE.currentQuestion === QUESTIONS.length - 1) {
      checkAnswer(currentAnswer);
      STATE.render.answerPage = true;
      STATE.render.questionPage = false;
      STATE.onLastQuestion = true;
      render();
    } else {
      checkAnswer(currentAnswer);
      STATE.render.answerPage = true;
      STATE.render.questionPage = false;
      render();
    }
  });
}
//Handle click of 'play again' button -- restarting the quiz
function handleResetQuiz() {
  document
    .querySelector("#js-reset-quiz-button")
    .addEventListener("click", e => {
      STATE.render.startPage = true;
      STATE.render.resultsPage = false;
      STATE.currentQuestion = 0;
      STATE.currentScore = 0;
      STATE.currentQuestionCorrect = false;
      STATE.noAnswerSubmitted = false;
      STATE.onLastQuestion = false;
      render();
    });
}

// Utility functions used within event listeners

function checkAnswer(answer) {
  if (answer === QUESTIONS[STATE.currentQuestion].correctAnswer) {
    STATE.currentScore++;
    STATE.currentQuestionCorrect = true;
  } else {
    STATE.currentQuestionCorrect = false;
  }
}

function getCurrentQuestion(question) {
  const answers = question.answers
    .map((answer, index) => {
      return `
            <div class="answer-option">
            <input type = "radio" name="answers" id=${index} value="${answer}" />
            <label for="answers">${answer}</label>
            </div>
            `;
    })
    .join("");
  return `
      <p class="question-p">${question.question}</p>
      ${answers}
      `;
}

const CONTAINER = document.querySelector(".container");
render();
