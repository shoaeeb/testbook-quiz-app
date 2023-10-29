import * as model from "./model.js";
import userDetailsView from "./userdetailsView.js";
import quizCategoryView from "./quizCategoryView.js";
import quizView from "./quizView.js";
import resultView from "./resultView.js";
const TIME = 100; //time in seconds for timer//10 seconds for every question //10*10//==100 seconds in total

//timer
function startTimer() {
  let time = TIME;
  let tick = function () {
    let minute = Math.trunc(time / 60);
    let second = Math.trunc(time % 60);
    //if there is timer on the scrren show it
    if (quizView.showTimerOnUI(minute, second)) {
      //store timetaken
      model.storeTimeTaken(TIME - time);
      //for each questionm there is only 10 seconds
      if ((TIME - time) % 10 == 0 && time != 120) {
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

      //stop the quiz and go to result page
    }

    time--;
  };
  tick();
  let timer = setInterval(tick, 1000);
  return timer;
}
function onAddFormSubmission(name) {
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
  const [prevQuizId, currQuizId] = model.getQuizId();
  quizCategoryView.toggleSelectCategoryQuiz(prevQuizId, currQuizId);
  //show start quiz button
  quizCategoryView.showQuizButton(id);
}

//when the user is in quiz.html page
//get the currQuizId
//render the first Question and its option
function onStartQuiz() {
  model.getCurrentQuizId();
  if (!model.state.currQuizId) return;
  const quiz = model.getQuizById(model.state.currQuizId);
  model.addCurrQuizIdToCurrParticipant();
  quizView.renderQuizTopic(quiz.topic);
  quizView.getTotolQuestions(model.state.currQuiz.questions.length);
  //initial
  //start the timer
  const timer = startTimer();
  //load the first questions
  quizView.renderQuiz(model.getQuestion(0), 0);
  //if we are in quiz.html just reset the state
  //logic for start over again
  if (window.location.href.includes("quiz.html"))
    model.resetCurrParticipantObj();
  quizView.addOptionsClickHandler(onClickQuizOptions);
}

//for the next button logic
function controlPagination(e) {
  if (!quizView.correctButtonClicked(e)) return;
  if (quizView.nextButtonClicked(e)) {
    const nextQues = +e.target.dataset.pageNext;
    console.log(nextQues);
    quizView.renderQuiz(model.getQuestion(nextQues), nextQues);
    model.setCurrQuestionNumber(nextQues);
  }
  // //hide the answer container whenever user clicks  next
  quizView.hideAnswerContainer();
  quizView.addOptionsClickHandler(onClickQuizOptions);
  quizView.hideNextButton();
}

function onClickQuizOptions(optionNumber, currQuestionNumber, e) {
  console.log(currQuestionNumber);
  const [res, answer] = model.storeUserOptions(
    optionNumber,
    currQuestionNumber
  );
  //quizView.hideAnswerContainer(res);
  if (res == -1) return alert("You already attemped that question");
  if (res) e.target.classList.add("correct-answer");
  if (!res) e.target.classList.add("wrong-answer");
  quizView.updateScoreOnUI(model.getCurrScore());
  quizView.showCorrectAnswer(answer);
  quizView.renderPagination(currQuestionNumber);
  quizView.addNextPrevButtonHandler(controlPagination);
  quizView.addFinishHandler(model.goToResultPage);
  model.setCurrQuestionNumber(currQuestionNumber);
}

//to show the result in the UI when the user is in
//result.html
resultView.onAddResultHandler(model.getFinalResult);
function init() {
  userDetailsView.addFormHander(onAddFormSubmission);
  quizCategoryView.addSelectQuizHandler(onSelectQuiz);
  quizView.addStartQuizHandler(onStartQuiz);
}
window.addEventListener("load", init);

init();
