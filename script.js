const todoContainer = document.querySelector(".todo-container");
const inputTodo = document.getElementById("input-todo");
const addTodo = document.getElementById("add-todo");

const modalBG = document.querySelector(".modal-background");
const closeModal = document.querySelector("#close-modal");
const editTodoName = document.getElementById("edit-todo-name");
const editTodoCompleted = document.getElementById("edit-todo-completed");
const saveTodo = document.getElementById("save-todo");
const deleteSelectedButton = document.getElementById("delete-selected");

let todoArray = [];

const URL = "http://localhost:4730/todos";

async function get_Todos() {
  try {
    const resp = await fetch(URL);
    const data = await resp.json();
    return data;
  } catch (err) {
    return err;
  }
}

async function post_todos() {
  try {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: inputTodo.value,
        done: false,
      }),
    };
    const resp = await fetch(URL, options);
    const data = await resp.json();
    return data;
  } catch (err) {
    return err;
  }
}

async function del_Todo(todoElem) {
  try {
    const del_url = URL + "/" + todoElem.id;
    console.log(del_url);
    const resp = await fetch(del_url, {
      method: "DELETE",
    });
    const data = await resp.json();
    return data;
  } catch (err) {
    return err;
  }
}

async function edit_Todo(todoElem) {
  try {
    let edit_url = URL + "/" + todoElem.id;
    let options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: todoElem.id,
        description: editTodoName.value,
        done: editTodoCompleted.checked,
      }),
    };
    const resp = await fetch(edit_url, options);
    const data = await resp.json();
    return data;
  } catch (err) {
    return err;
  }
}

async function deleteSelectedTodos() {
  const selectedTodos = document.querySelectorAll(".todo-completed:checked");

  const deletePromises = Array.from(selectedTodos).map(
    async (todoCompletedCheckbox) => {
      const todoElem = todoCompletedCheckbox.closest(".todo");
      const todoIndex = Array.from(todoContainer.children).indexOf(todoElem);
      const todoToDelete = todoArray[todoIndex];
      return await del_Todo(todoToDelete);
    }
  );

  try {
    const results = await Promise.all(deletePromises);
    console.log(results);

    // After deleting selected todos, you might want to update the UI accordingly
    // For simplicity, let's reload the page
    location.reload();
  } catch (err) {
    console.error(err);
    // Handle error if necessary
  }
}

deleteSelectedButton.addEventListener("click", deleteSelectedTodos);

function open_modal(todoElem) {
  editTodoName.value = todoElem.description;
  editTodoCompleted.checked = todoElem.done;
  modalBG.style.display = "block";
  closeModal.addEventListener("click", () => {
    modalBG.style.display = "none";
  });
  saveTodo.addEventListener("click", () => {
    modalBG.style.display = "none";
    edit_Todo(todoElem);
  });
}

function display_Todos(todoArr) {
  todoArr.forEach((todoElem) => {
    console.log(todoElem);

    // Parent
    let todo = document.createElement("div");
    todo.classList.add("todo");

    // Children
    let todoInfo = document.createElement("div");
    todoInfo.classList.add("todo-info");
    let todoBtn = document.createElement("form");
    todoBtn.classList.add("todo-btn");

    // Grand Children
    let todoCompleted = document.createElement("input");
    todoCompleted.classList.add("todo-completed");
    todoCompleted.setAttribute("type", "checkbox");
    todoCompleted.checked = todoElem.done;
    let todoName = document.createElement("p");
    todoName.classList.add("todo-name");
    todoName.innerHTML = todoElem.description;

    let todoEdit = document.createElement("button");
    todoEdit.classList.add("todo-edit");
    todoEdit.innerHTML = "Edit";
    todoEdit.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Open modal");
      open_modal(todoElem);
    });
    let todoDel = document.createElement("button");
    todoDel.classList.add("todo-delete");
    todoDel.innerHTML = "Delete";
    todoDel.addEventListener("click", (e) => {
      console.log("Delete Todo");
      del_Todo(todoElem);
    });

    todoInfo.appendChild(todoCompleted);
    todoInfo.appendChild(todoName);
    todoBtn.appendChild(todoEdit);
    todoBtn.appendChild(todoDel);

    todo.appendChild(todoInfo);
    todo.appendChild(todoBtn);

    todoContainer.appendChild(todo);
  });
}

get_Todos()
  .then((todoArr) => {
    todoArray = todoArr;
    console.log(todoArray);
    display_Todos(todoArray);
  })
  .catch((err) => console.log(err));

addTodo.addEventListener("click", () => {
  if (inputTodo.value != "") {
    post_todos();
  }
});
