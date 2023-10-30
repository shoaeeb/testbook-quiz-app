import View from "./view.js";

class QuizCategoryView extends View {
  _parentElement = document.querySelector(".categories"); //the categories main container
  _messageBox = document.querySelector(".message"); //the messageBox to show any error
  _startQuiz = document.querySelector(".start-quiz"); //the startQuiz Button
  addSelectQuizHandler(handler) {
    //if there is no categories on the screen just return
    if (!this._parentElement) return;
    this._parentElement.addEventListener("click", (e) => {
      if (!e.target.parentElement.classList.contains("categories")) return;
      const quizId = +e.target.dataset.quizId;
      handler(quizId, e);
    });
  }

  //to toggle between the categories
  //when choosing
  toggleSelectCategoryQuiz(prevQuizId, currQuizId) {
    document
      .querySelector(`[data-quiz-id="${prevQuizId}"]`)
      .classList.remove("selected-quiz");
    document
      .querySelector(`[data-quiz-id="${currQuizId}"]`)
      .classList.add("selected-quiz");
  }

  //show the Start Quiz button when user chose
  //a category
  showQuizButton(quizId) {
    this._startQuiz.classList.remove("hidden");
    this._startQuiz.setAttribute("data-quiz-id", quizId);
  }
}

export default new QuizCategoryView();
