import View from "./view.js";

class ResultView extends View {
  _partcipantName = document.querySelector(".participant-name"); //the show the participant name
  _timeTaken = document.querySelector(".time"); //the total time taken
  _totalQuestion = document.querySelector(".totalQuestion"); //the total question number
  _topicName = document.querySelector(".topic-name"); //the topic name the user gave the quiz ON
  _attempted = document.querySelector(".attempted"); //attempted question
  _unattempted = document.querySelector(".unattempted"); //unattempted Question
  _correctlyAnswered = document.querySelector(".correct"); //correctly Answered Question
  _wronglyAnswerd = document.querySelector(".wrong"); //wrong answered Question
  _percentage = document.querySelector(".percentage"); //to show percentage
  _data;
  renderResult(data) {
    this._data = data;
    if (!this._partcipantName) return;
    const result = data;
    this._partcipantName.textContent = result.participantName;
    this._timeTaken.textContent = result.totalTimeTaken;
    this._totalQuestion.textContent = result.totalQuestions;
    this._topicName.textContent = `${result.participantName} you gave quiz on the topic of  ${result.topicName}`;
    this._attempted.textContent = result.attempted;
    this._correctlyAnswered.textContent = result.correctlyAnswered;
    this._wronglyAnswerd.textContent = result.wrongAnswered;
    this._percentage.textContent = `${result.percentage.toFixed(2, 0)}  %`;
    this._unattempted.textContent = Math.abs(result.unattempted);
  }

  //to show the result on the display when load event occurs
  onAddResultHandler(handler) {
    window.addEventListener("load", () => {
      this.renderResult(handler());
    });
  }
}

export default new ResultView();
