import * as model from "./model.js";
import userDetailsView from "./view/userdetailsView.js";
import quizCategoryView from "./view/quizCategoryView.js";
import quizView from "./view/quizView.js";
import resultView from "./view/resultView.js";

const TIME = 100; //time in seconds for timer//10 seconds for every question //10*10//==100 seconds in total
let currTime = performance.now();
let elapsedTime = performance.now();
//timer
function startTimer() {
  let time = TIME;
  let tick = function () {
    let minute = Math.trunc(time / 60);
    let second = Math.trunc(time % 60);
    elapsedTime = performance.now();
    //if there is timer on the scrren show it
    if (quizView.showTimerOnUI(minute, second)) {
      //store timetaken
      model.storeTimeTaken(TIME - time);
      //for each questionm there is only 10 seconds
      if (Math.trunc(((elapsedTime - currTime) / 1000) % 10) === 0) {
        const currQuestionNum = model.getCurrQuestionNumber();
        quizView.renderQuiz(
          model.getQuestion(currQuestionNum),
          currQuestionNum
        );

        //hideAnswerContainer
        quizView.hideAnswerContainer();
        quizView.addOptionsClickHandler(onClickQuizOptions);
        quizView.addNextPrevButtonHandler(controlPagination);
        model.setCurrQuestionNumber(currQuestionNum + 1);
      }
      if (time === 0) {
        quizView.renderPagination();
        quizView.addFinishHandler(model.goToResultPage);
      }
    }
    if (time === 0) {
      clearInterval(timer);
    }

    time--;
  };
  tick();
  let timer = setInterval(tick, 1000);
  return timer;
}
function onAddFormSubmission(name) {
  //add the name
  model.addParticipant(name);
  //hide anyErrorMessage
  //hide error message like
  //you haven't enter your name
  quizCategoryView.hideErrorMessage();
  //View the Name of the in the UI
  userDetailsView.getPlaceHolder().textContent = name;
}

function onSelectQuiz(id, e) {
  //if no participant Name Enter  render error message
  if (!model.state.currParticipant)
    return quizCategoryView.renderErrorMessage("You Didn't enter your name");
  //else
  //if prevQuizId is null
  //means the application
  //is running for the first time
  if (!model.state.prevQuizId) {
    model.state.prevQuizId = id;
    model.state.currQuizId = id;
  }
  model.state.prevQuizId = model.state.currQuizId;
  model.state.currQuizId = id;
  //store the currQuizId in the local Storage
  model.StoreCurrentQuizId();
  //if the user is toggle over the categories
  const [prevQuizId, currQuizId] = model.getQuizId();
  quizCategoryView.toggleSelectCategoryQuiz(prevQuizId, currQuizId);
  //show start quiz button
  quizCategoryView.showQuizButton(id);
}

//when the user is in quiz.html page
//get the currQuizId
//render the first Question and its option
function onStartQuiz() {
  //get the current quiz id
  model.getCurrentQuizId();
  //if no quiz id found return early
  if (!model.state.currQuizId) return;
  //get the current quiz question by the id
  const quiz = model.getQuizById(model.state.currQuizId);
  //store the quiz id to currParticipant array
  model.addCurrQuizIdToCurrParticipant();
  //show the topic name on the UI
  quizView.renderQuizTopic(quiz.topic);
  //get the total number of question
  quizView.getTotolQuestions(model.state.currQuiz.questions.length);
  //start the timer
  const timer = startTimer();
  //load the first questions
  quizView.renderQuiz(model.getQuestion(0), 0);
  //if we are in quiz.html just reset the state
  //logic for start over again
  if (window.location.href.includes("quiz.html"))
    model.resetCurrParticipantObj();
  //add the click event handler functions to make
  //options clickable
  quizView.addOptionsClickHandler(onClickQuizOptions);
}

//for the next button logic
function controlPagination(e) {
  //if correct button is clicked
  //on the pagination
  //guard clause
  //if not correct button then return
  if (!quizView.correctButtonClicked(e)) return;

  //for the next button
  //if clicked correct just do this
  if (quizView.nextButtonClicked(e)) {
    //get the value from the element
    const nextQues = +e.target.dataset.pageNext;
    // render the next Ques on click the next button
    quizView.renderQuiz(model.getQuestion(nextQues), nextQues);
    //set the currQuestion number
    model.setCurrQuestionNumber(nextQues);
  }
  // //hide the answer container whenever user clicks  next
  quizView.hideAnswerContainer();
  quizView.addOptionsClickHandler(onClickQuizOptions);
  quizView.hideNextButton();
  currTime = performance.now();
}

function onClickQuizOptions(optionNumber, currQuestionNumber, e) {
  //when the user clicks on options
  const [res, answer] = model.storeUserOptions(
    optionNumber,
    currQuestionNumber
  );

  ///show the answer in answer div on the quiz.html page
  if (res == -1) return alert("You already attemped that question");
  if (res) e.target.classList.add("correct-answer");
  if (!res) e.target.classList.add("wrong-answer");

  //to update the score
  quizView.updateScoreOnUI(model.getCurrScore());
  //to show the answer
  quizView.showCorrectAnswer(answer);
  //the next button
  quizView.renderPagination(currQuestionNumber);
  //to add a click event handler on the next button
  quizView.addNextPrevButtonHandler(controlPagination);
  //if the quiz is finish to go to result page
  quizView.addFinishHandler(model.goToResultPage);
  //to set the current question number
  model.setCurrQuestionNumber(currQuestionNumber);
}

//to show the result in the UI when the user is in
//result.html
resultView.onAddResultHandler(model.getFinalResult);
function init() {
  // all the handler that needs to pass when the page loads
  userDetailsView.addFormHander(onAddFormSubmission);
  quizCategoryView.addSelectQuizHandler(onSelectQuiz);
  quizView.addStartQuizHandler(onStartQuiz);
}
window.addEventListener("load", init);

init();
