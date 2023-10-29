export default class View {
  _messageBox;
  _startQuiz = document.querySelector(".start-quiz");

  renderErrorMessage(message) {
    this._messageBox.classList.remove("hidden");
    this._messageBox.textContent = message;
  }

  hideErrorMessage() {
    this._messageBox.classList.add("hidden");
  }
}
