import { getQuiz } from "./helpers.js";
export const state = {
  currParticipant: "",
  Particpants: [],
  activeQuiz: "",
  prevQuizId: null,
  currQuizId: null,
  currQuiz: null,
  currQuesNum: 1,
};

//to get the quizById
export function getQuizId() {
  return [state.prevQuizId, state.currQuizId];
}
export function addParticipant(name) {
  const storage = getLocalStorage();
  console.log(storage);
  if (storage) {
    state.Particpants = storage;
  }

  state.currParticipant = name;
  state.Particpants.push({
    id: crypto.randomUUID(),
    name: name,
    score: 0,
    wrongAnswered: [],
    correctlyAnswered: [],
    timeTaken: null,
  });
  //store the the currParticipant in localStorage
  storeLocalStorage();
  deleteCurrQuizQuestions();
}

//get the quiz By Id
//return the quiz
export function getQuizById(id) {
  const quiz = getQuiz(id);
  state.currQuiz = quiz;
  return quiz;
}

function storeLocalStorage() {
  localStorage.setItem("Particpants", JSON.stringify(state.Particpants));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("Particpants"));
}

export function StoreCurrentQuizId() {
  localStorage.setItem("currQuizId", JSON.stringify(state.currQuizId));
}

export function getCurrentQuizId() {
  state.currQuizId = +localStorage.getItem("currQuizId");
  return state.currQuizId;
}

//to get the specific question my Number
export function getQuestion(quesNumber) {
  if (quesNumber < 0) return state.currQuiz.questions[0];
  if (quesNumber > 9) return state.currQuiz.questions[9];
  console.log(state.currQuiz.questions[quesNumber]);
  return state.currQuiz.questions[quesNumber];
}

//to store the options the user is choosing when answeering the question
export function storeUserOptions(userChose, currQuesNum) {
  //if currParticipant is there then get it
  const storage = getLocalStorage();
  if (storage) {
    state.Particpants = storage;
  }
  //

  //get the correct answer id
  const correctAnswerId = state.currQuiz.questions[currQuesNum]?.answer;
  //get the correct answer from the options
  const answer = getCorrectAnswerForCurrQuesNum(currQuesNum, correctAnswerId);

  //check if the currQuesNumber is already answered if it is then it is alrady answered then just don't do anything
  //and just return
  if (alreadyAnswered(currQuesNum)) return [-1, answer];
  //mark the currQues as answered
  markQuestionAsAnswered(currQuesNum, true);
  //if user chose the correct answer
  if (correctAnswerId === userChose) {
    updateParticipantsArray(currQuesNum, correctAnswerId, true);
    //mark currQuestion as correcty answered by user
    markQuestion(currQuesNum, true);
    //update the score by one
    updateScore();
  }
  //if user chose the wrong answer
  if (correctAnswerId !== userChose) {
    updateParticipantsArray(currQuesNum, correctAnswerId, false);
    //mark currQuestion as wrong answeredby user
    markQuestion(currQuesNum, false);
  }

  //storing the option num userChose
  state.currQuiz.questions[currQuesNum].optionNum = userChose;
  storeLocalStorage();
  storeCurrQuizQuestions();
  if (correctAnswerId === userChose) return [true, answer];
  if (correctAnswerId !== userChose) return [false, answer];
}

//helpers function
function alreadyAnswered(currQuesNum) {
  return state.currQuiz.questions[currQuesNum].isAnswered;
}

function markQuestion(currQuesNum, value) {
  state.currQuiz.questions[currQuesNum].correctlyAnswered = value;
}

function markQuestionAsAnswered(currQuesNum, value) {
  state.currQuiz.questions[currQuesNum].isAnswered = value;
}

function getCorrectAnswerForCurrQuesNum(currQuesNum, correctAnswerId) {
  return state.currQuiz.questions[currQuesNum]?.options.find(
    (option) => option.id === correctAnswerId
  ).option;
}

function updateScore() {
  state.Particpants[getCurrentParticipant()].score++;
}

function updateParticipantsArray(
  currQuesNum,
  correctAnswerId,
  correctlyAnswered
) {
  if (correctlyAnswered) {
    state.Particpants[getCurrentParticipant()]?.correctlyAnswered.push({
      question: state.currQuiz.questions[currQuesNum]?.question,
      answer: state.currQuiz.questions[currQuesNum].options.find(
        (option) => option.id == correctAnswerId
      ),
    });
  }
  if (!correctlyAnswered) {
    state.Particpants[getCurrentParticipant()]?.wrongAnswered.push({
      question: state.currQuiz.questions[currQuesNum]?.question,
      answer: state.currQuiz.questions[currQuesNum]?.options.find(
        (option) => option.id == correctAnswerId
      ),
    });
  }
}

export function getCurrScore() {
  return state.Particpants[getCurrentParticipant()]?.score;
}

//to store the total time taken to complete the quiz
export function storeTimeTaken(time) {
  const storage = getLocalStorage();
  if (storage) {
    state.Particpants = storage;
  }
  state.Particpants[getCurrentParticipant()].timeTaken = time;
  storeLocalStorage();
}

//to go to result page when the user is clicking the See my result Button
export function goToResultPage() {
  window.location.assign("result.html");
}

//to return the final result to the user
//after user select to see my result
export function getFinalResult() {
  const storage = getLocalStorage();
  if (storage) {
    state.Particpants = storage;
  }
  const participant = state.Particpants[getCurrentParticipant()];
  const participantName = participant?.name;

  const totalQuestions = getQuiz(participant?.currQuizParticipated)?.questions
    .length;
  const topicName = getQuiz(participant?.currQuizParticipated)?.topic;
  const attempted =
    participant?.wrongAnswered?.length + participant?.correctlyAnswered?.length;
  const unattempted = totalQuestions - attempted;
  const correctlyAnswered = participant?.correctlyAnswered?.length;
  const wrongAnswered = participant?.wrongAnswered?.length;
  const totalTimeTaken = participant?.timeTaken;
  const percentage = (correctlyAnswered / totalQuestions) * 100;

  return {
    participantName: participantName,
    topicName: topicName,
    totalQuestions: totalQuestions,
    attempted: attempted,
    unattempted: unattempted,
    correctlyAnswered: correctlyAnswered,
    wrongAnswered: wrongAnswered,
    totalTimeTaken: totalTimeTaken,
    percentage: percentage,
  };
}

//to get the current participant
function getCurrentParticipant() {
  return state.Particpants.length - 1;
}

//to store the currQuizId to current Participant Array
export function addCurrQuizIdToCurrParticipant() {
  //store the currQuizId to the currParticpant
  state.Particpants[getCurrentParticipant()].currQuizParticipated =
    state.currQuizId;
  storeLocalStorage();
}

export function storeCurrQuizQuestions() {
  localStorage.setItem("currQuizQuestions", JSON.stringify(state.currQuiz));
}

export function deleteCurrQuizQuestions() {
  localStorage.removeItem("currQuizQuestions");
}

export function getCurrQuizQuestions() {
  return JSON.parse(localStorage.getItem("currQuizQuestions"));
}

export function getCurrQuestionNumber() {
  return state.currQuesNum;
}

export function setCurrQuestionNumber(num) {
  state.currQuesNum = num;
}

export function resetCurrParticipantObj() {
  const storage = getLocalStorage();
  if (storage) {
    state.Particpants = storage;
  }
  state.Particpants[getCurrentParticipant()].score = 0;
  state.Particpants[getCurrentParticipant()].wrongAnswered = [];
  state.Particpants[getCurrentParticipant()].correctlyAnswered = [];
  state.Particpants[getCurrentParticipant()].timeTaken = null;
  storeLocalStorage();
}
