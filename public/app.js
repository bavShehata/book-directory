// Show/hide navigation on mobile
const hamMenu = document.querySelector("header i");
hamMenu.addEventListener("click", () => {
  const nav = document.querySelector("header ul");
  if (nav.style.display == "block") nav.style.display = "none";
  else nav.style.display = "block";
});

// Deleting books
const trashCans = document.querySelectorAll(".fa-trash");
trashCans.forEach((trashCan) => {
  trashCan.addEventListener("click", () => {
    const book = trashCan.parentElement;
    const bookID = book.dataset.bookid;

    // Hiding the book from the UI

    // Deleting the book from the database
    fetch(`./${bookID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((book.style.display = "none"))
      .catch((err) => console.log("ERROR: ", err));
  });
});
