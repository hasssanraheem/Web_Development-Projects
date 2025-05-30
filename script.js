$(document).ready(function() {
    const taskModal = new bootstrap.Modal('#taskModal');
    const taskDetailModal = new bootstrap.Modal('#taskDetailModal');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentTaskId = null;
    
    // Initialize the dashboard
    function initDashboard() {
        renderTasks();
        setupDragAndDrop();
        updateTaskCounts();
    }
    
    // Render all tasks to their respective columns
    function renderTasks() {
        // Clear all columns
        $('#backlog-tasks, #progress-tasks, #review-tasks, #done-tasks').empty();
        
        // Render each task
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            $(`#${task.status}-tasks`).append(taskElement);
        });
    }
    
    // Create HTML element for a task
    function createTaskElement(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const isOverdue = dueDate && dueDate < today && task.status !== 'done';
        
        return $(`
            <div class="task-card" data-id="${task.id}">
                <div class="task-title">${task.title}</div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div class="task-meta">
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    ${dueDate ? `
                        <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                            <i class="far fa-calendar-alt me-1"></i>
                            ${formatDate(dueDate)}
                        </span>
                    ` : ''}
                </div>
            </div>
        `);
    }
    
    // Format date for display
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    // Set up drag and drop functionality
    function setupDragAndDrop() {
        $('.task-card').draggable({
            revert: 'invalid',
            cursor: 'move',
            zIndex: 1000
        });
        
        $('.board-column .card-body').droppable({
            accept: '.task-card',
            hoverClass: 'bg-light',
            drop: function(event, ui) {
                const taskId = ui.draggable.data('id');
                const newStatus = $(this).parent().find('.card-header h5').text().toLowerCase().replace(' ', '-');
                
                updateTaskStatus(taskId, newStatus);
                ui.draggable.detach().appendTo(this);
            }
        });
    }
    
    // Update task status when moved between columns
    function updateTaskStatus(taskId, newStatus) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].status = newStatus;
            saveTasks();
            updateTaskCounts();
        }
    }
    
    // Update task counts in each column header
    function updateTaskCounts() {
        $('#backlog-count').text(`${tasks.filter(t => t.status === 'backlog').length} tasks`);
        $('#progress-count').text(`${tasks.filter(t => t.status === 'progress').length} tasks`);
        $('#review-count').text(`${tasks.filter(t => t.status === 'review').length} tasks`);
        $('#done-count').text(`${tasks.filter(t => t.status === 'done').length} tasks`);
    }
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        setupDragAndDrop();
    }
    
    // New Task Button Click
    $('#newTaskBtn').on('click', function() {
        currentTaskId = null;
        $('#taskForm')[0].reset();
        $('#taskCategory').val('backlog');
        taskModal.show();
    });
    
    // Save Task Button Click
    $('#saveTaskBtn').on('click', function() {
        const title = $('#taskTitle').val().trim();
        if (!title) {
            alert('Task title is required!');
            return;
        }
        
        const taskData = {
            id: currentTaskId || Date.now(),
            title: title,
            description: $('#taskDescription').val().trim(),
            dueDate: $('#taskDueDate').val(),
            priority: $('#taskPriority').val(),
            status: $('#taskCategory').val(),
            createdAt: currentTaskId ? 
                tasks.find(t => t.id === currentTaskId).createdAt : 
                new Date().toISOString()
        };
        
        if (currentTaskId) {
            // Update existing task
            const taskIndex = tasks.findIndex(t => t.id === currentTaskId);
            tasks[taskIndex] = taskData;
        } else {
            // Add new task
            tasks.push(taskData);
        }
        
        saveTasks();
        taskModal.hide();
    });
    
    // Task Click (View Details)
    $(document).on('click', '.task-card', function() {
        const taskId = $(this).data('id');
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            currentTaskId = taskId;
            $('#detailTaskTitle').text(task.title);
            $('#detailTaskDescription').text(task.description || 'No description available.');
            
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                $('#detailTaskDueDate').text(formatDate(dueDate));
            } else {
                $('#detailTaskDueDate').text('Not set');
            }
            
            $('#detailTaskPriority').text(task.priority);
            $('#detailTaskStatus').text(task.status === 'progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1));
            
            const createdDate = new Date(task.createdAt);
            $('#detailTaskCreated').text(createdDate.toLocaleString());
            
            taskDetailModal.show();
        }
    });
    
    // Delete Task Button Click
    $('#deleteTaskBtn').on('click', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== currentTaskId);
            saveTasks();
            taskDetailModal.hide();
        }
    });
    
    // Edit Task Button Click
    $('#editTaskBtn').on('click', function() {
        const task = tasks.find(t => t.id === currentTaskId);
        
        if (task) {
            $('#taskTitle').val(task.title);
            $('#taskDescription').val(task.description || '');
            $('#taskDueDate').val(task.dueDate || '');
            $('#taskPriority').val(task.priority);
            $('#taskCategory').val(task.status);
            
            taskDetailModal.hide();
            taskModal.show();
        }
    });
    
    // Initialize the dashboard
    initDashboard();
});