const insert = document.getElementById('insert');
const insertIcon = document.getElementById('insert-icon');
let todos = document.getElementById('todos')
let isEdit = false;
let EditedItem = [];
let todoList =  [];
let videos = [];


window.onload = () => {
    insert.focus();
}

function getList() {
    todos.innerHTML = `
        <div>
            ${
                JSON.parse(localStorage.getItem('todos')).map((item, idx) => {
                    return `
                            <div class="todo-item">
                                <div class="todo-item-left">
                                    <input type="checkbox" name="check">
                                    <div class="todo-item-titles">
                                        <div class="todo-title">${item.title}</div>
                                        <div class="created-at">${item.createAt}</div>
                                    </div>
                                </div>
                                <div class="todo-item-right">
                                    <div class="todo-icons">
                                        <button id="delete" onclick="openModal(${idx})"><img src="images/gray-trash.png" width="20px" alt=""></button>
                                        <button id="edit" onclick="editAction(${idx})"><img src="images/gray-edit.png" width="20px" alt=""></button>
                                    </div>
                                </div>
                            </div>
                        `
                }).join('')
            }
        </div>
    `
}

if(!localStorage.getItem('todos')) {
    localStorage.setItem("todos", JSON.stringify(todoList));
}

getList();

if(localStorage.getItem('todos')) {
    todoList = JSON.parse(localStorage.getItem('todos'))
}

const addTodo = () => {
    if(insert.value.length > 0 && !isEdit) {
        todoList.push({
            title: insert.value,
            createAt: 'Today'
        })
        localStorage.setItem("todos", JSON.stringify(todoList));
        getList();
    } else {
        todoList.splice(todoList.indexOf(EditedItem), 1, {title: insert.value, createAt: 'now'});
        localStorage.setItem('todos', JSON.stringify(todoList))
        window.location.reload();
    }

    insert.value = ''
}


const openVideoRule = () => {
    if(todoList.length % 5 === 0 && todoList.length !== 0) {
        openVideo();
        addTodo()
    } else {
        addTodo()
    }
}

insertIcon.addEventListener('click', () => {
    openVideoRule()
})

insert.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        openVideoRule()
      }
})

const editButton = document.getElementById('edit');

const editAction = (id) => {
    insert.focus();
    let clickedItem = todoList.find((x, idx) => idx === id)
    insert.value = clickedItem.title
    EditedItem = todoList.find(item => {
        return item.title === insert.value
    })
    isEdit = true
    if(isEdit) {
        insertIcon.setAttribute('src', 'images/white-edit.png')
    } else {
        insertIcon.setAttribute('src', 'images/white-plus.jpg')
    }
}

const getUsers = () => {
    axios.get('http://api.aparat.com/fa/v1/video/video/mostViewedVideos').then(response => {
     videos = response.data.data
     console.log(videos)
   }).catch(error => console.error(error));
};

getUsers();

let modalIndex = ''

const openModal = (idx) => {
    let item = todoList.find((item, index) => {
        return index === idx
    })
    modalIndex = idx;
    document.getElementById('overlay').style.display = 'block'
    document.getElementById('msg').innerHTML = `Are you sure you want to delete <span style="font-weight: bold">\"${item.title}"\</span> Task`;
    document.getElementById('modalContent').innerHTML = `
        <div class="buttons">
            <button class="btn delete" onclick="deleteItem()">Yes, Delete</button>
            <button class="btn cancel" onclick="closeModal()">No, Cancel</button>
        </div>
    `
}


const openVideo = () => {
    let finded = [];
    function getVisits() {
        return videos.map(item => {
            return +item.attributes.visit_cnt
        })
    }

    let maximum_visit_number = Math.max.apply(Math, getVisits())
    finded = videos.find(item => {
        return item.attributes.visit_cnt === maximum_visit_number.toString()
    })

    document.getElementById('overlay').style.display = 'block'
    document.getElementById('modalContent').innerHTML = `
        <video width="100%" height="100%" controls class="modalVideo">
            <source src="${finded.attributes.preview_src}" type="video/mp4">
        </video>
    `

}

const closeModal = () => {
    document.getElementById('overlay').style.display = 'none'
}

const deleteItem = () => {
    todoList.splice(modalIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todoList))
    window.location.reload();
}   