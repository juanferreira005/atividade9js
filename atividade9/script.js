document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('filter-status').addEventListener('click', filterTasksByStatus);
document.getElementById('filter-priority').addEventListener('click', filterTasksByPriority);

let tasks = [];
let currentFilter = 'all';

function addTask(event) {
    event.preventDefault();

    const name = document.getElementById('task-name').value;
    const deadline = document.getElementById('task-deadline').value;
    const priority = document.getElementById('task-priority').value;

    const task = {
        id: Date.now(),
        name,
        deadline,
        priority,
        completed: false,
    };

    tasks.push(task);
    saveTasks();
    displayTasks();
    event.target.reset();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks();
    showNotifications();
}

function displayTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'pending') return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.name} - ${task.deadline} - ${task.priority}`;
        li.className = task.completed ? 'task-completed' : '';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Marcar como Pendente' : 'Marcar como Concluída';
        completeBtn.addEventListener('click', () => toggleTaskCompletion(task.id));
        li.appendChild(completeBtn);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => editTask(task.id));
        li.appendChild(editBtn);

        taskList.appendChild(li);
    });
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    saveTasks();
    displayTasks();
}

function filterTasksByStatus() {
    currentFilter = currentFilter === 'all' ? 'completed' : currentFilter === 'completed' ? 'pending' : 'all';
    displayTasks();
}

function filterTasksByPriority() {
    tasks.sort((a, b) => {
        const priorityOrder = { alta: 1, media: 2, baixa: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    displayTasks();
}

function showNotifications() {
    const notifications = document.getElementById('notifications');
    notifications.innerHTML = '';
    const now = new Date();

    tasks.forEach(task => {
        const taskDeadline = new Date(task.deadline);
        const timeDiff = taskDeadline - now;

        if (timeDiff <= 2 * 24 * 60 * 60 * 1000 && timeDiff > 0) { // 2 dias
            notifications.innerHTML += `<p>A tarefa "${task.name}" está próxima do prazo de conclusão!</p>`;
        }
    });
}

function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-deadline').value = task.deadline;
    document.getElementById('task-priority').value = task.priority;

    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    displayTasks();
}
