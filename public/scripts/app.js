// Client facing scripts here
$(document).ready(function() {
  let coll = document.getElementsByClassName("collapsible");
  let i;

  for (i = 0; i < coll.length; i++) {
    $(coll[i]).click(function() {
      console.log("Clicked! ");
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      if (content.style.display === "flex") {
        $(content).slideUp().then (() => content.style.display = "none");
      } else {
        $(content).slideDown().then (() => content.style.display = "flex");;
      }
    });
  }
});
