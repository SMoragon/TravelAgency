"use strict";

function validate() { // Function to validate the booking form.

  var user_email = document.querySelector("#user-email");
  var user_password = document.querySelector("#user-password");
  var user_password_again = document.querySelector("#user-password-again");

  var any_empty = checkEmptyFields(
    user_email,
    user_password,
    user_password_again
  );

  var passwords_ok = user_password.value == user_password_again.value;

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
    } else if (!passwords_ok) {
      var mail_error = document.querySelector("#password-error");
      mail_error.style.display = "contents";
    }
  }
  return !any_empty && email_ok && passwords_ok;
}

// Returns true if there is any empty field, or false otherwise.
function checkEmptyFields(user_email, user_password, user_password_again) {
  return (
    user_email.value === "" ||
    user_password.value === "" ||
    user_password_again.value === ""
  );
}

// Returns true if mail matches the regex expression for an email, or false otherwise.
function validateEmail(client_email) {
  var email_regex = new RegExp(/\w+@\w+\.\w+/);
  return client_email.value.toLocaleLowerCase().match(email_regex) !== null;
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
