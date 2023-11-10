"use strict";

function validate() {  // Function to validate the booking form.
  var client_full_name = document.querySelector("#client-full-name");
  var date_from = document.querySelector("#client-res-from-date");
  var date_to = document.querySelector("#client-res-to-date");

  // Variable that checks if there is any empty field in the form.
  var any_empty = checkEmptyFields(
    client_full_name,
    date_from,
    date_to
  );

  // Before showing anything, we close the popups just in case there were any visible.
  closePopups();

  // We check the possible errors, so that popups that match with them are showed.
  if (any_empty) {
    var empty_error=document.querySelector("#empty-error")
    empty_error.style.display="contents";
  }
  else {
    var dates_ok = validateDates(date_from, date_to);

  if (!dates_ok) {
      var date_error=document.querySelector("#date-error")
      date_error.style.display="contents";
    }
  }
  return !any_empty && dates_ok;
}

// Returns true if there is any empty field, or false otherwise.
function checkEmptyFields(client_full_name, date_from, date_to) {
  return client_full_name.value === "" ||
         date_from.value === "" || date_to.value === "";
}

// Returns true if from and to dates are earlier or equal than current date, and from date is eralier or equal than to date; or false otherwise.
function validateDates(date_from, date_to) {
  return date_from.value <= date_to.value && getCurDate() <= date_from.value;
}

// Changes the popups to not be visible.
function closePopups(){
  var popups=document.querySelectorAll(".popup-form-error")
  popups.forEach((popup)=>{
    popup.style.display="none";
  })
}

function getCurDate() {
  var date = new Date();
  date = `${date.getFullYear()}-${parseNumberToString(date.getMonth() + 1)}-${parseNumberToString(date.getDate())}`;
  return date;
}

function parseNumberToString(number){
  var formattedNumber = ("0" + number).slice(-2);
  return formattedNumber;
}