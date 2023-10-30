import View from "./view.js";

class QuizView extends View {
  _parentElement = document.querySelector(".question-answer__container"); //the question and element container
  _data;
  _pagination = document.querySelector(".pagination"); //the pagination container
  _questionsLen; //total number of question
  _questionNum = document.querySelector(".question-num"); //to display the currQuestin Num
  _topic = document.querySelector(".topic"); //the topic container
  _prevButton = document.querySelector(".prevButton"); //prev button
  _nextButton = document.querySelector(".nextButton"); //the next button
  _options = "";
  _currQuesNumber; //the container to show the currQuestion Number
  _answerContainer = document.querySelector(".wrong-answer__container"); //the answerContainer
  _score = document.querySelector(".curr-score"); //score container
  _timer = document.querySelector(".time-remaing"); //timer container
  _finish = document.querySelector(".finish");
  addStartQuizHandler(handler) {
    window.addEventListener("load", (e) => {
      handler();
    });
  }

  //generate the currQuestion and the options
  _generateMarkup() {
    const question = this._data;
    const isAnswered = question?.isAnswered;
    const correctlyAnswered = question?.correctlyAnswered;
    const optionNum = question?.optionNum;
    const currQuestionNum = this._currQuesNumber >= 9 ? true : false;
    this._questionNum.textContent = `${
      currQuestionNum ? 10 : this._currQuesNumber + 1
    }/${this._questionsLen}`;
    let markup = `<div class="question">
    <p>
     ${question?.question}
    </p>
  </div>`;

    let options = question.options
      .map((option, i) => {
        return `
    <div class="${
      isAnswered && i + 1 === optionNum
        ? correctlyAnswered
          ? "correct-answer"
          : "wrong-answer"
        : ""
    }" data-option-num=${i + 1}>${option.option}</div>
    `;
      })
      .join("");
    markup += `<div data-question-number = ${this._currQuesNumber} class="options">${options}</div>`;
    return markup;
  }

  //to render the currQuestin and render it on the screen
  renderQuiz(data, currQuestionNumber = 0) {
    if (!this._parentElement) return;
    this._currQuesNumber = currQuestionNumber;
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
    this._options = document.querySelector(".options");
    return;
  }
  //to show the topic in the header section the topic of the quiz
  renderQuizTopic(name) {
    if (!this._topic) return;
    this._topic.textContent = name;
  }
  //to get the total number of questions
  getTotolQuestions(num) {
    this._questionsLen = num;
  }

  //to render the next button
  renderPagination(currQuestion = 9) {
    this._pagination.classList.remove("hidden");
    this._pagination.innerHTML = "";
    let markup = "";
    markup = `<button class="nextButton" data-page-next=${
      currQuestion + 1
    }>Next</button>`;
    if (currQuestion >= 9) {
      markup = `<button class="finish">See Result</button>`;
    }
    this._pagination.insertAdjacentHTML("afterbegin", markup);
    this._finish = document.querySelector(".finish");
  }
  //to add the click event handler
  //for the next button
  addNextPrevButtonHandler(handler) {
    if (!this._pagination) return;
    this._pagination.addEventListener("click", (e) => {
      handler(e);
    });
  }

  //to add the click handler
  //for the options the user will click in
  //when answering the quiz
  addOptionsClickHandler(handler) {
    //when there is no option just return
    if (!this._options) return;
    this._options.addEventListener("click", (e) => {
      const currQuesNumber = +e.target.parentElement.dataset.questionNumber;
      const optionNumber = +e.target.dataset.optionNum;
      handler(optionNumber, currQuesNumber, e);
    });
  }

  //to show the correct answer
  //when the user chose an option
  showCorrectAnswer(answer) {
    this._answerContainer.classList.remove("hidden");
    this._answerContainer.innerHTML = "";
    this._answerContainer.innerHTML = `
    <p>Answer is : ${answer}</p>
    `;
  }

  //to hide the correct Answer Container
  hideAnswerContainer() {
    this._answerContainer.classList.add("hidden");
  }

  //to know the user is clicking the correct Button to go
  //to next Question
  correctButtonClicked(e) {
    return e.target.parentElement.classList.contains("pagination");
  }

  //to know the user clicks the correct nxt Button
  nextButtonClicked(e) {
    return e.target.classList.contains("nextButton");
  }

  //to show the update Score on the UI
  updateScoreOnUI(score) {
    if (score <= 5) this._score.classList.add("bad-score");
    if (score > 5) this._score.classList.add("good-score");
    this._score.textContent = score;
  }

  //to show the timer on the ui
  showTimerOnUI(minute, second) {
    if (!this._timer) return false;
    this._timer.textContent = `${minute.toString().padStart(2, 0)}:${second
      .toString()
      .padStart(2, 0)}`;
    return true;
  }

  //See my result button click handler
  addFinishHandler(handler) {
    if (!this._finish) return;
    this._finish.addEventListener("click", (e) => {
      e.stopPropagation();
      const res = confirm("Are You Sure You Want to Submit");
      if (res) {
        handler();
      }
    });
  }
  //to hide the next button
  hideNextButton() {
    this._pagination.classList.add("hidden");
  }
}

export default new QuizView();
