function dissapear() {
  const x = document.getElementById("cover");
  const y = document.getElementById("the_right_page")
  const z = document.getElementById("button2")
  if (x.style.display === "none") {
    x.style.display = "flex";
    y.style.display = "none";
    z.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "flex";
    z.style.display = "block";
  }
}
// on click disappears the cover page and appears the right page