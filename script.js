// selectors
const input = document.querySelector('form .input');
const submit = document.querySelector('form .submit');
const todoList = document.querySelector('.todo-list');

// events
submit.addEventListener('click', addTodoFunc);
todoList.addEventListener('click', handlerTodoList);

// functions
function addTodoFunc(event) {
    event.preventDefault();

    if (!input.value.trim()) {
        return;
    }

    const todo = document.createElement('div');
    todo.className = 'todo';

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'check';
    todo.appendChild(check);

    const todoText = document.createElement('span');
    todoText.innerText = input.value;
    todo.appendChild(todoText);

    const deleteTodo = document.createElement('i');
    deleteTodo.className = 'fa-solid fa-trash';
    todo.appendChild(deleteTodo);

    todoList.appendChild(todo);
    input.value = '';
}

function handlerTodoList(event) {
    if (event.target.classList[1] === 'fa-trash') {
        let question = confirm('confirm delete?');

        if (question) {
            event.target.parentElement.remove();
        }
    }

    if (event.target.classList[0] === 'check') {
        event.target.parentElement.classList.toggle('active');
    }
}