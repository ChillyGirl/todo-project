// Модуль для обновления пользовательского интерфейса

const UI = {
    // 1. Обновить список задач на экране
    updateTaskList(tasks, filter = 'all') {
        const taskList = document.getElementById('taskList');
        if (!taskList) return;

        // Очищаем текущий список
        taskList.innerHTML = '';

        // Фильтруем задачи в зависимости от выбранного фильтра
        const filteredTasks = tasks.filter(task => {
            if (filter === 'active') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true; // 'all' - все задачи
        });

        // Если задач нет, показываем сообщение
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'Задач нет. Добавьте первую задачу!';
            taskList.appendChild(emptyMessage);
            return;
        }

        // Создаём элементы для каждой задачи
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <label class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </label>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <button class="delete-btn" title="Удалить задачу">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            taskList.appendChild(li);
        });
    },

    // 2. Обновить счётчик оставшихся задач
    updateCounter(tasks) {
        const counterElement = document.getElementById('counter');
        if (!counterElement) return;

        const activeTasks = tasks.filter(task => !task.completed).length;
        counterElement.textContent = activeTasks;

        // Меняем цвет счётчика, если задач много
        if (activeTasks > 5) {
            counterElement.style.color = '#e74c3c';
        } else if (activeTasks > 0) {
            counterElement.style.color = '#3498db';
        } else {
            counterElement.style.color = '#2ecc71';
        }
    },

    // 3. Очистить поле ввода
    clearInput() {
        const input = document.getElementById('taskInput');
        if (input) {
            input.value = '';
            input.focus();
        }
    },

    // 4. Показать уведомление (опционально, для улучшения UX)
    showNotification(message, type = 'info') {
        // Создаём элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Добавляем на страницу
        document.body.appendChild(notification);

        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    // 5. Вспомогательная функция для безопасного вывода текста
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Экспортируем модуль
if (typeof window !== 'undefined') {
    window.UI = UI;
}