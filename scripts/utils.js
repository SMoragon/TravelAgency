"use strict"

function getCurDate() {
    var date = new Date();
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return date;
  }
  
  function parseStrToDate(str){
    var date = str.split("/");
    date = new Date(date[0], date[1] - 1, date[2]); 
    return date
  }

export {getCurDate, parseStrToDate}