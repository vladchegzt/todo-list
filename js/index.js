window.addEventListener("load", function() {
 
    const form = document.querySelector('.create-task-form')
    const taskInput = document.querySelector('.task-input')
    const filterInput = document.querySelector('.filter-input')
    const taskList = document.querySelector('.collection')
    const clearBtn = document.querySelector('.clear-tasks')

    form.addEventListener('submit', addtask)
    taskList.addEventListener('click', actionsTask)
    clearBtn.addEventListener('click', deleteAllTasks)
    filterInput.addEventListener('keyup', filterTasks)

    function showTasks() {
        if(localStorage.getItem('tasks') !== null) {
            const tasks = JSON.parse(localStorage.getItem('tasks'))
            console.log(tasks)
            for (item of tasks) {
                const li = document.createElement('li')
                li.innerHTML = item.content
                li.setAttribute('data-task-id', item.id)

                const button = document.createElement('button');
                button.classList.add('btn-delete')
                const btnEdit = document.createElement('button')
                btnEdit.classList.add('btn-edit')
                li.append(button, btnEdit)

                taskList.append(li)
            }
        } 
    }

    showTasks()

    function addtask(event) {
        event.preventDefault()
        const value = taskInput.value

        const taskId = generateId()
        const li = document.createElement('li')
        li.innerHTML = value
        li.setAttribute('data-task-id', taskId)

        if(value === '') {
            return
        }

        const button = document.createElement('button')
        button.classList.add('btn-delete')
        const btnEdit = document.createElement('button')
        btnEdit.classList.add('btn-edit')
        li.append(button, btnEdit)
        
        taskList.append(li)
        storeTaskInLocaleStorage(taskId, value)
        taskInput.value = ''
    }

    function generateId() {
        return Date.now().toString(); 
      }
      

    function storeTaskInLocaleStorage(taskId, task) {
        let tasks;
        if(localStorage.getItem('tasks') !== null) {
            tasks = JSON.parse(localStorage.getItem('tasks'))
        }else {
            tasks = []
        }

        tasks.push({ id: taskId, content: task })

        console.log(tasks)

        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

    function actionsTask(event) {
        //delete
        if(event.target.classList.contains('btn-delete')) {
            if(confirm('Are you sure?')) {
                const li = event.target.closest('li')
                const taskId = li.getAttribute('data-task-id')
                li.remove()
                updateTaskFromLocalStorage(taskId)
            }
        } 
        //edit
        else if (event.target.classList.contains('btn-edit')) {
            const li = event.target.closest('li')
            const taskId = li.getAttribute('data-task-id')
            const buttonElements = li.querySelectorAll('button')
            let updatedText = prompt('Set new text for this item', li.textContent)

            li.textContent = updatedText
            buttonElements.forEach(button => li.appendChild(button));
            updateTaskFromLocalStorage(taskId, 'edit', updatedText)
        }
    }

    function updateTaskFromLocalStorage(taskId, action = 'delete', updatedText = null) {
        const tasks = JSON.parse(localStorage.getItem('tasks'))
        if (action === 'edit') {
            const taskToUpdate = tasks.find(task => task.id === taskId);
            if (taskToUpdate && updatedText !== null) {
              taskToUpdate.content = updatedText; 
            }
            localStorage.setItem('tasks', JSON.stringify(tasks))
        } else {
            const filteredTasks = tasks.filter(task => {
                return task.id !== taskId
            })
            localStorage.setItem('tasks', JSON.stringify(filteredTasks))
        }
        console.log(JSON.parse(localStorage.getItem('tasks')))
      }
      

    function deleteAllTasks() {
        if(confirm('Are you sure total delete?')) {
            taskList.innerHTML = ''
            removeAllFromLocalStorage()
        }
    }

    function removeAllFromLocalStorage() {
        localStorage.clear()
    }

    function filterTasks(event) {
        const tasks = taskList.querySelectorAll('li')
        const searchQuery = event.target.value.toLowerCase()
        // console.log(tasks)

        tasks.forEach(task => {
            const taskValue = task.firstChild.textContent.toLowerCase()
            if(taskValue.includes(searchQuery)){
                task.style.display = 'flex'
            } else {
                task.style.display = 'none'
            }
        })
    }
});
