"use strict";

//import * as utils from "./utils";

function validate() {
  var client_full_name = document.querySelector("#client-full-name");
  var client_email = document.querySelector("#client-email");
  var date_from = document.querySelector("#client-res-from-date");
  var date_to = document.querySelector("#client-res-to-date");

  var any_empty = checkEmptyFields(
    client_full_name,
    client_email,
    date_from,
    date_to
  );

  closePopups();

  if (any_empty) {
    var empty_error=document.querySelector("#empty-error")
    console.log(empty_error)
    empty_error.style.display="contents";
  } 
  else {
    var email_ok = validateEmail(client_email);
    var dates_ok =false;
   // var dates_ok = validateDates(date_from, date_to);

    if (!email_ok) {
      var mail_error=document.querySelector("#mail-error")
      mail_error.style.display="contents";
    } 
    else if (!dates_ok) {
      var date_error=document.querySelector("#date-error")
      date_error.style.display="contents";
    }
  }
}

function checkEmptyFields(client_full_name, client_email, date_from, date_to) {
  return client_full_name.value === "" || client_email.value === "" || 
         date_from.value === "" || date_to.value === "";
}

function validateDates(date_from, date_to) {
  return date_from.value <= date_to.value && utils.getCurDate() <= date_from.value;
}

function validateEmail(client_email) {
  var email_regex = new RegExp(/\w+@\w+\.\w+/);
  return client_email.value.toLocaleLowerCase().match(email_regex) !== null;
}

function closePopups(){
  var popups=document.querySelectorAll(".popup-form-error")
  console.log(popups)
  popups.forEach((popup)=>{
    console.log(popup)
    popup.style.display="none";
  })
}