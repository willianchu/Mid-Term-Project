// Client facing scripts here
$(document).ready(function() {
  let collapsibles = [document.getElementById("create-a-new-quiz"), document.getElementById("show-quizzes"),document.getElementById("show-results")];
  let i;

  for (let coll of collapsibles) {
    $(coll).click(function() {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === 'flex') {
        $(content).slideUp();
      } else {
        $(content).slideDown();
        $(content).css('display', 'flex');
      }
    });
  }

  let shareQuizElements = document.getElementsByClassName('copy-quiz-link');

  for (let shareQuiz of shareQuizElements) {
    $(shareQuiz).click(function() {
      const link = $($(shareQuiz).parent().prev().children()[0]).attr('href');
      navigator.clipboard.writeText(`${window.location.host}${link}`);
    });
  }

  let shareTestElements = document.getElementsByClassName('copy-test-link');

  for (let shareTest of shareTestElements) {
    $(shareTest).click(function() {
      const link = $($(shareTest).parent().prev().children()[0]).attr('href');
      navigator.clipboard.writeText(`${window.location.host}${link}`);
    });
  }

  // <div class="question-block">
  //   <input type="text" id="question-1-title" placeholder="Question 1"><br>
  //   <div>
  //     <input type="text" id="question-1-option-1" placeholder="Option 1">
  //     <input type="radio" id="question-1-answer-1">
  //   </div>
  //   <div>
  //     <input type="text" id="question-1-option-2" placeholder="Option 2">
  //     <input type="radio" id="question-1-answer-2">
  //   </div>
  //   <div>
  //     <input type="text" id="question-1-option-3" placeholder="Option 3">
  //     <input type="radio" id="question-1-answer-3">
  //   </div>
  //   <div>
  //     <input type="text" id="question-1-option-4" placeholder="Option 4">
  //     <input type="radio" id="question-1-answer-4">
  //   </div>
  //   <div>
  //     <input type="text" id="question-1-option-5" placeholder="Option 5">
  //     <input type="radio" id="question-1-answer-5">
  //   </div>
  // </div>

  const createQuestionBlock = () => {
    console.log("We are here! ");

    const questionNumber = Number($('.question-block').last().children()[0].name.split("-")[1]) + 1;

    const qb = document.createElement("div");
    $(qb).addClass("question-block");
    $(qb).append(`<input type="text" name="question-${questionNumber}-title" placeholder="Question ${questionNumber}"><br>`);
    for (let i = 1; i <= 5; i ++) {
      const op = document.createElement("div");
      $(op).append(`<input type="text" name="question-${questionNumber}-option-${i}" placeholder="Option ${i}">
      <input type="radio" id="question-${questionNumber}-answer-${i}">`);
      $(qb).append(op);
    }
    $(qb).insertBefore('#more-questions-button');
  }

  $('#more-questions-button').click(function() {
    createQuestionBlock();
  });
});
