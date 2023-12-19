function dissapear() {
    var x = document.getElementById("cover");
    var y = document.getElementById("the_right_page")
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
      y.style.display = "flex";
    }
  }