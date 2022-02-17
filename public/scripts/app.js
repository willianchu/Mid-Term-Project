// Client facing scripts here
$(document).ready(function() {
  let collapsibles = document.getElementsByClassName("collapsible");
  let i;

  for (let coll of collapsibles) {
    $(coll).click(function() {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "flex") {
        $(content).slideUp().then(() => content.style.display = "none");
      } else {
        $(content).slideDown().then(() => content.style.display = "flex");
      }
    });
  }

  let shareQuizElements = document.getElementsByClassName("copy-quiz-link");

  for (let shareQuiz of shareQuizElements) {
    $(shareQuiz).click(function() {
      const link = $($(shareQuiz).parent().prev().children()[0]).attr("href");
      navigator.clipboard.writeText(`${window.location.host}${link}`);
    });
  }

  let shareTestElements = document.getElementsByClassName("copy-test-link");

  for (let shareTest of shareTestElements) {
    $(shareTest).click(function() {
      const link = $($(shareTest).parent().prev().children()[0]).attr("href");
      navigator.clipboard.writeText(`${window.location.host}${link}`);
    });
  }
});
