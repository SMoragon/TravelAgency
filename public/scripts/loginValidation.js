"use strict";

function validate() { // Function to validate the booking form.
  var user_email = document.querySelector("#user-email");
  var user_password = document.querySelector("#user-password");

  var any_empty = checkEmptyFields(user_email, user_password);

  
  // Before showing anything, we close the popups just in case there were any visible.
  closePopups();

   // We check the possible errors, so that popups that match with them are showed.
  if (any_empty) {
    var empty_error = document.querySelector("#empty-error");
    empty_error.style.display = "contents";
  } else {
    var email_ok = validateEmail(user_email);

    if (!email_ok) {
      var mail_error = document.querySelector("#mail-error");
      mail_error.style.display = "contents";
    }
  }
  
  return !any_empty && email_ok;
}

// Returns true if there is any empty field, or false otherwise.
function checkEmptyFields(user_email, user_password) {
  return user_email.value === "" || user_password.value === "";
}

// Returns true if mail matches the regex expression for an email, or false otherwise.
function validateEmail(user_email) {
  var email_regex = new RegExp(/\w+@\w+\.\w+/);
  return user_email.value.toLocaleLowerCase().match(email_regex) !== null;
}

// Changes the popups to not be visible.
function closePopups() {
  var popups = document.querySelectorAll(".popup-form-error");
  popups.forEach((popup) => {
    popup.style.display = "none";
  });
}

// Hids all popups and redirect the user to the given page.
function closeAndRedirect(newSite) {
  var popups = document.querySelectorAll(".popup-form-error");
  popups.forEach((popup) => {
    popup.style.display = "none";
  });
  window.location.href = newSite;
}
