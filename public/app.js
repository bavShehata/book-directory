// TODO: Customized delete confirmation
// TODO: Customized alerts
// TODO: Styling the #noBooks section
// TODO: refreshing after updating a book takes a long time
// TODO: confirmation message after successful update
// TODO: understand custom sorting
// TODO: better author sub-document
// TODO: a function to check repitive books
// TODO: Opening in mozilla dev
// TODO: Sanitizing user input
// TODO: speed performance of browse page
// TODO: forgot password/username
// TODO: account creation alert
// TODO: email confirmation
// TODO: confirm email and password
// TODO: hiding navigation bar when scrolling down, and showing a button to scroll up
// TODO: a flag to show whether it is a manual book or google's???
// TODO: Make sure you understand merging quite well, then merge the two branches

// User
const loginForm = document.querySelector("#login form");
if (loginForm) {
  loginForm.addEventListener("submit", () => {});
}

// Book
// Show/hide navigation on mobile
const hamMenu = document.querySelector("header i");
hamMenu.addEventListener("click", () => {
  const nav = document.querySelector("header ul");
  if (nav.style.display == "block") nav.style.display = "none";
  else nav.style.display = "block";
});

// Collapse sections of book info
const sections = document.querySelectorAll("#listPage dt");

sections.forEach((section) => {
  const content = section.nextElementSibling;
  // add the collapse button
  section.innerHTML += `  <i class="fas fa-plus-circle"></i>`;
  const buttonP = section.querySelector(".fa-plus-circle");
  section.addEventListener("click", function () {
    // collapse content
    // if it is already collapsed
    if (content.style.display === "block") {
      buttonP.classList.remove("fa-minus-circle");
      buttonP.classList.add("fa-plus-circle");
      content.style.display = "none";
      // if it isn't already collapsed
    } else {
      buttonP.classList.remove("fa-plus-circle");
      buttonP.classList.add("fa-minus-circle");
      content.style.display = "block";
    }
  });
});
// Sorting books
const sortBtn = document.querySelector("#sort .btn");
if (sortBtn != undefined) {
  sortBtn.addEventListener("click", async () => {
    try {
      // Collect sorting data
      var sortOrder;
      const sortBy = document.querySelector("#sort select").value;
      const sortOrderOptions = document.querySelectorAll(
        `#sort input[type="radio"]`
      );
      sortOrderOptions.forEach((sortOrderOption) => {
        if (sortOrderOption.checked) sortOrder = sortOrderOption.value;
      });
      // Replace the first list with the new one
      const bookSection = document.querySelector("#allBooks");
      // Simulate a mouse click:
      window.location.href = `/book/?sortBy=${sortBy}&order=${sortOrder}&p=1`;
    } catch (e) {
      console.log("Couldn't order books\n", e);
    }
  });
}
// Delete all books
const deleteBtn = document.querySelector("#delete .btn");
if (deleteBtn != undefined) {
  deleteBtn.addEventListener("click", async () => {
    try {
      if (confirm("All books will be deleted!")) {
        await axios.delete("/book");
        alert("All books deleted successfully");
        location.reload();
      }
    } catch (e) {
      console.log("Couldn't delete books\n", e);
    }
  });
}

// Deleting a specific book
const trashCans = document.querySelectorAll(".fa-trash");
trashCans.forEach((trashCan) => {
  trashCan.addEventListener("click", async () => {
    try {
      const book = trashCan.parentElement;
      const bookID = book.dataset.bookid;
      // Deleting a book from the database and removing it from the UI
      if (confirm("The book will be permanentally deleted from your books!")) {
        await axios.delete(`./${bookID}`);
        alert("Book deleted Successfully");
        document.location = "/book/?sortBy=_id&order=-1&p=1";
      }
    } catch {
      console.log("Book did not get deleted");
    }
  });
});

// Add a book from the browse page
const browsingBooks = document.querySelectorAll("#browse .book");
browsingBooks.forEach((book) => {
  const title = book.querySelector(".title").innerHTML;
  const year = book.querySelector(".year").innerHTML;
  const author = book.querySelector(".author").innerHTML;
  const description = book.querySelector(".description").innerHTML;
  const addBtn = book.querySelector(".btn,.checked");
  addBtn.addEventListener("click", async () => {
    try {
      const response = await axios.post("/book/add", {
        title,
        year,
        author,
        description,
      });
      console.log(response.data.id);
      if (!response.data.id) {
        addBtn.classList.add("checked");
        addBtn.innerHTML = `<i class="fas fa-check"></i>`;
      } else {
        await axios.delete(`/book/${response.data.id}`);
        addBtn.innerHTML = "Add";
        addBtn.classList.remove("checked");
      }
    } catch (e) {
      console.log(e);
      addBtn.classList.toggle("checked");
      addBtn.innerHTML = "Add";
    }
  });
});
// Search the browsed books
const searchBtn = document.querySelector("#search i");
var bookQuery = document.querySelector("#search input");

if (bookQuery) {
  bookQuery.addEventListener("keydown", (e) => {
    console.log("EVENT: ", e);
    console.log("EVENT key: ", e.keyCode);
    if (e.keyCode == 13) {
      bookQuery = document.querySelector("#search input").value;
      window.location.replace(`/book/browse?q=${bookQuery}&p=1`);
    }
  });
  searchBtn.addEventListener("click", () => {
    bookQuery = document.querySelector("#search input").value;
    window.location.replace(`/book/browse?q=${bookQuery}&p=1`);
  });
}
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
      prevField.outerHTML = `<textarea
      ></textarea>`;
    });
    const newFields = book.querySelectorAll("textarea");
    var i = 0;
    newFields.forEach((newField) => {
      if (i < 3) newField.classList.add("editingMinor");
      else newField.classList.add("editingMajor");
      newField.value = prevValues[i++];
    });
    // The save button
    saveBtn.addEventListener("click", async () => {
      saveBtn.style.display = "none";
      editBtn.style.display = "inline";
      // Collecting the new data
      var editedFields = book.querySelectorAll("textarea");
      i = 0;
      editedFields.forEach((editedField) => {
        finalValues[i] = editedField.value;
        i++;
      });
      i = 0;
      prevFields.forEach((finalField) => {
        finalField.innerHTML = finalValues[i++];
      });

      for (var i = 0; i < prevFields.length; i++) {
        editedFields[i].outerHTML = prevFields[i].outerHTML;
      }
      const finalObj = Object.assign({}, finalValues);
      // Updating the book for the user
      await axios
        .put(`./${bookID}`, {
          data: finalObj,
        })
        .catch((err) => {
          const errorCode = err.response.status;
          if (errorCode === 409) {
            alert("This book already exists");
            location.reload();
          } else if (errorCode === 400) {
            alert("The year must be a number");
            location.reload();
          } else if (errorCode === 408) {
            alert("The book must have a name, an author and a year");
            location.reload();
          }
        });
    });
  });
});
