// SELECTORS 
const body = document.querySelector('body');
const darkMode = document.querySelector('#darkMode');
const todoInput = document.querySelector('form #addTodo');
const addTodoBtn = document.querySelector('form #addTodoBtn');
const todoList = document.querySelector('#todoList');
const selectTodo = document.querySelector('#selectTodo');
const modalDeleteTodo = document.querySelector('#modalDeleteTodo');
const cancelModalDelete = document.querySelector('#cancelModalDelete');
const okModalDelete = document.querySelector('#okModalDelete');
const bg = document.querySelector('.bg');
const controls = document.querySelector('.controls');
const deleteAllBtn = document.querySelector('#deleteAll');
const deleteSelected = document.querySelector('#deleteSelected');
let currentTodoID; 

let data = [];

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', onLoad);
darkMode.addEventListener('click', darkModeHandler);
todoList.addEventListener('click', handlerTodoList);
selectTodo.addEventListener('change', handlerSelect);
cancelModalDelete.addEventListener('click', handlerCancelModal);
okModalDelete.addEventListener('click', deleteTodo);
addTodoBtn.addEventListener('click', addTodoFunc);
deleteAllBtn.addEventListener('click', deleteAllFunc);
deleteSelected.addEventListener('click', deleteSelectedFunc);

// FUNCTIONS
function renderTodoList() {
    todoList.innerHTML = '';

    data.forEach(function (object) {
        const todo = document.createElement('div');

        if (object.completed) {
            todo.className = 'todo active';
        } else {
            todo.className = 'todo';
        }

        const title = document.createElement('span');
        title.classList.add('title');
        title.innerText = object.title;
        todo.appendChild(title);

        todo.setAttribute('id', object.id);

        const icons = document.createElement('div');
        icons.classList.add('icons');
        icons.innerHTML = '<i class="fa-solid fa-check"></i>';
        icons.innerHTML += '<i class="fa-solid fa-trash"></i>';
        todo.appendChild(icons);

        todoList.appendChild(todo);
    })
}

function handlerTodoList(event) {
    const parent = event.target.parentElement.parentElement;

    const index = data.findIndex(function (item) {
        return parent.id == item.id;
    });

    if (event.target.classList[1] === 'fa-check') {
        parent.classList.toggle('active');
        data[index].completed = !data[index].completed;
        deleteSelected.style.display = 'block';
        saveToLocalStorage();

        const filteredTodos = data.filter(function(todo) {
            return todo.completed;
        })

        if (!filteredTodos.length) {
            deleteSelected.style.display = 'none';
        }
    }

    if (event.target.classList[1] === 'fa-trash') {
        modalDeleteTodo.style.display = 'flex';
        currentTodoID = parent.id;
    }
}

function darkModeHandler(event) {
    body.classList.toggle('active');
    event.target.classList.toggle('fa-moon');
    event.target.classList.toggle('fa-sun');

    if (event.target.classList.contains('fa-moon')) {
        localStorage.removeItem('dark_mode');
    } else if (event.target.classList.contains('fa-sun')) {
        localStorage.setItem('dark_mode', true);
    }
}

function handlerSelect(event) {
    const allTodo = document.querySelectorAll('.todo');

    if (event.target.value === 'all') {
        allTodo.forEach(function(todo) {
            todo.style.display = 'flex';
        })
    } 

    if (event.target.value === 'completed') {
        allTodo.forEach(function(todo) {
            if (todo.classList.contains('active')) {
                todo.style.display = 'flex';
            } else {
                todo.style.display = 'none';
            }
        })
    }

    if (event.target.value === 'uncompleted') {
        allTodo.forEach(function(todo) {
            if (!todo.classList.contains('active')) {
                todo.style.display = 'flex';
            } else {
                todo.style.display = 'none';
            }
        })
    }
}

function handlerCancelModal() {
    modalDeleteTodo.style.display = 'none';
}

function deleteTodo() {
    const newTodos = data.filter(function(todo) {
        return todo.id !== Number(currentTodoID);
    })

    data = newTodos;

    renderTodoList();
    handlerCancelModal();
    saveToLocalStorage();

    if (data.length === 0) {
        controls.style.display = 'none';
    }
}

function addTodoFunc(event) {
    event.preventDefault();

    if (!todoInput.value.trim()) {
        return;
    }

    const newTodo = {
        id: Date.now(),
        title: todoInput.value,
        completed: false,
    }

    data.unshift(newTodo);
    renderTodoList();
    todoInput.value = '';
    saveToLocalStorage();
    controls.style.display = 'flex';
}

function deleteAllFunc() {
    todoList.innerHTML = '';
    data = [];
    saveToLocalStorage();
    controls.style.display = 'none';
}

function deleteSelectedFunc() {
    const newData = data.filter(function(todo) {
        return !todo.completed;
    })

    data = newData;
    renderTodoList();
    saveToLocalStorage();
    deleteSelected.style.display = 'none';

    if (data.length === 0) {
        deleteAllBtn.style.display = 'none';
    }
}

// SAVE TO LOCAL STORAGE
function saveToLocalStorage() {
    let localData = JSON.stringify(data); 
    localStorage.setItem('todos', localData);
}

// ON LOAD DOCUMENT
function onLoad() {
    const localData = JSON.parse(localStorage.getItem('todos'));

    if (localData) {
        data = localData;
    }

    if (localStorage.getItem('dark_mode')) {
        body.classList.add('active');
        document.querySelector('#darkMode i').classList.remove('fa-moon');
        document.querySelector('#darkMode i').classList.add('fa-sun');
    }

    if (data.length > 0) {
        controls.style.display = 'flex';
    }

    renderTodoList();
}