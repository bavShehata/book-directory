// TODO: Add pagination to search and index pages.
// TODO: Add a delete all books in index page. DONE!!!
// TODO: A customizable confirmation for delete
// TODO: Add responsivity for mobile and remove the hovers

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
      var sortedBooks = await axios.get(
        `/book/sort/?sortBy=${sortBy}&order=${sortOrder}`
      );
      sortedBooks = sortedBooks.data;
      bookSection.innerHTML = "";
      sortedBooks.forEach((book) => {
        bookSection.innerHTML += `<div class="book" data-bookID="${book._id}">
          <a href="/book/${
            book._id
          }" class="bookLink"><h3>Title: <span class="editable title">${
          book.title
        }</span></h3></a>
          <br />
          <h4>Year: <span class="editable year">${
            book.year != 0 ? book.year : "Unknown"
          }</span></h4>
          <br />
          <h4>Author: <span class="editable author">${book.author}</span></h4>
          <br />
          <dl>
            <dt>Description</dt>
            <dd class="editable description">${book.description}</dd>
            <dt>Notes</dt>
            <dd class="editable notes">${
              book.notes != "" ? book.notes : "None"
            }</dd>
            <dt>Favorite quotes</dt>
            <dd class="editable quotes">${
              book.quotes != "" ? book.quotes : "None"
            }</dd>
          </dl>
        </div>`;
      });
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
    const book = trashCan.parentElement;
    const bookID = book.dataset.bookid;

    // Deleting the book from the database and removing it from the UI
    console.log("objs");

    await axios.delete(`./${bookID}`);
    try {
      alert("Book deleted Successfully");
      document.location = "/book/";
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
  const addBtn = book.querySelector(".btn");
  addBtn.addEventListener("click", async () => {
    try {
      await axios.post("/book/add", { title, year, author, description });
      alert("New book added");
    } catch {
      alert("Book already exists");
    }
  });
});
// Search the browsed books
const searchBtn = document.querySelector("#browse #search i");
var bookQuery = document.querySelector("#browse #search input");

if (bookQuery) {
  bookQuery.addEventListener("keydown", (e) => {
    console.log("EVENT: ", e);
    console.log("EVENT key: ", e.keyCode);
    if (e.keyCode == 13) {
      bookQuery = document.querySelector("#browse #search input").value;
      window.location.replace(`/book/browse/${bookQuery}`);
    }
  });
  searchBtn.addEventListener("click", () => {
    bookQuery = document.querySelector("#browse #search input").value;
    window.location.replace(`/book/browse/${bookQuery}`);
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
