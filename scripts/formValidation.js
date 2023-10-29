"use strict";

import * as utils from "./utils";

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

  if (any_empty) {
    alert("Todos los campos deben estar rellenos.");
  } 
  else {
    var email_ok = validateEmail(client_email);
    var dates_ok = validateDates(date_from, date_to);

    if (!email_ok) {
      alert('El email introducido no es correcto. El formato debe ser "abcde@fghi.jkl".');
    } 
    else if (!dates_ok) {
      alert("La fecha actual debe ser anterior o la misma que la de ida; y la fecha de ida debe ser anterior o la misma que la de vuelta.");
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
