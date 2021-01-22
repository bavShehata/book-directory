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

    // Deleting the book from the database then removing it from the UI
    axios
      .delete(`./${bookID}`)
      .then((book.style.display = "none"))
      .catch((err) => console.log("ERROR: ", err));
  });
});

// Editing books
const editBtns = document.querySelectorAll(".fa-edit");
var finalValues = [];
editBtns.forEach((editBtn) => {
  // The edit button
  editBtn.addEventListener("click", () => {
    editBtn.style.display = "none";
    const book = editBtn.parentElement;
    const bookID = book.dataset.bookid;
    const saveBtn = book.querySelector(".fa-save");
    const prevFields = book.querySelectorAll(".editable");
    var prevValues = [];
    // Show the save button and change all text fields to input with previous values
    saveBtn.style.display = "block";
    prevFields.forEach((prevField) => {
      prevValues.push(prevField.innerHTML);
      prevField.outerHTML = `<input type="text" />`;
    });
    const newFields = book.querySelectorAll("input");
    var i = 0;
    newFields.forEach((newField) => {
      newField.value = prevValues[i++];
    });
    // The save button
    saveBtn.addEventListener("click", () => {
      saveBtn.style.display = "none";
      editBtn.style.display = "inline";
      // Collecting the new data
      var editedFields = book.querySelectorAll("input");
      i = 0;
      editedFields.forEach((editedField) => {
        finalValues[i] = editedField.value;
        i++;
      });
      i = 0;
      prevFields.forEach((finalField) => {
        finalField.innerHTML = finalValues[i++];
        console.log(finalValues[i]);
      });

      for (var i = 0; i < prevFields.length; i++) {
        editedFields[i].outerHTML = prevFields[i].outerHTML;
      }
      const finalObj = Object.assign({}, finalValues);
      // Updating the book for the user
      axios
        .put(`./${bookID}`, {
          data: finalObj,
        })
        .then((data) => {
          if (data.status === 409) {
            alert("This book already exists");
            location.reload();
          }
        })
        .catch((err) => console.log("ERROR: ", err));
    });
  });
});
