/* eslint-disable no-undef */
// when document loads, run this function
$(document).ready(function () {
  let quiz = [];
  console.log("I am ready!");
  //retrieve the results from the database question 6
  const url = 'http://localhost:8080/api/questions/6';

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      quiz = data;
      console.log(quiz);
    })
    .catch(function(error) {
      console.log(error);
    });
});
  
  