import View from "./view.js";

class UserDetailsView extends View {
  _userInputName = document.querySelector('input[type="text"]'); //input field for the name
  _form = document.querySelector("form"); //form to take input
  _getUserInputName() {
    return this._userInputName.value;
  }
  _namePlaceHolder = document.querySelector(".name--placeholder"); //name PlaceHolder to show the name in the home page

  getPlaceHolder() {
    return this._namePlaceHolder;
  }
  addFormHander(handler) {
    //if no form in the page just return
    if (!this._form) return;
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const name = this._getUserInputName().trim();
      //if user didn't enter the name just tell the user that he didn't Enter the name
      if (!name)
        return alert("Please Enter Your Name! You can't leave it empty");
      handler(name);
    });
  }
}

export default new UserDetailsView();
