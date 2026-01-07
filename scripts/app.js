// Главный модуль приложения - связывает Storage и UI

class TodoApp {
    constructor() {
        // Текущее состояние приложения
        this.tasks = []; // Массив задач
        this.currentFilter = 'all'; // Активный фильтр ('all', 'active', 'completed')
        this.currentTheme = 'light'; // Текущая тема
        
        // Инициализация
        this.init();
    }

    // 1. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
    init() {
        console.log('Инициализация To-Do приложения...');
        
        // Загружаем данные из хранилища
        this.loadData();
        
        // Настраиваем обработчики событий
        this.setupEventListeners();
        
        // Первоначальная отрисовка интерфейса
        this.render();
        
        // Показываем уведомление о загрузке
        UI.showNotification('Приложение загружено!', 'success');
    }

    // 2. ЗАГРУЗКА ДАННЫХ ИЗ ХРАНИЛИЩА
    loadData() {
        try {
            // Интеграция с модулем Storage
            this.tasks = Storage.getTasks();
            this.currentTheme = Storage.getTheme();
            
            console.log(`Загружено ${this.tasks.length} задач, тема: ${this.currentTheme}`);
            
            // Применяем сохранённую тему
            document.body.className = `${this.currentTheme}-theme`;
            this.updateActiveThemeButton();
            
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            UI.showNotification('Ошибка загрузки данных', 'error');
        }
    }

    // 3. НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ
    setupEventListeners() {
        // Добавление новой задачи
        document.getElementById('addBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Очистка завершённых задач
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());

        // Фильтрация задач
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });

        // Переключение тем
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setTheme(theme);
            });
        });
    }

    // 4. ДОБАВЛЕНИЕ НОВОЙ ЗАДАЧИ
    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        
        if (!text) {
            UI.showNotification('Введите текст задачи!', 'error');
            input.focus();
            return;
        }
        
        // Создаём новую задачу
        const newTask = {
            id: Date.now(), // Уникальный ID на основе времени
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        // Добавляем в массив задач
        this.tasks.push(newTask);
        
        // Сохраняем и обновляем интерфейс
        this.saveAndRender();
        
        // Очищаем поле ввода
        UI.clearInput();
        
        // Показываем уведомление
        UI.showNotification(`Задача "${text}" добавлена`, 'success');
    }

    // 5. УДАЛЕНИЕ ЗАДАЧИ (будет вызываться из UI)
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveAndRender();
        UI.showNotification('Задача удалена', 'info');
    }

    // 6. ПЕРЕКЛЮЧЕНИЕ СТАТУСА ЗАДАЧИ (будет вызываться из UI)
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveAndRender();
        }
    }

    // 7. ОЧИСТКА ЗАВЕРШЁННЫХ ЗАДАЧ
    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveAndRender();
        UI.showNotification(`Удалено ${completedCount} завершённых задач`, 'info');
    }

    // 8. УСТАНОВКА ФИЛЬТРА
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Обновляем активную кнопку фильтра
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        // Перерисовываем задачи
        this.renderTasks();
    }

    // 9. УСТАНОВКА ТЕМЫ
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = `${theme}-theme`;
        
        // Обновляем активную кнопку темы
        this.updateActiveThemeButton();
        
        // Сохраняем тему в хранилище
        Storage.saveTheme(theme);
        
        UI.showNotification(`Тема "${this.getThemeName(theme)}" применена`, 'info');
    }

    // 10. СОХРАНЕНИЕ И ОБНОВЛЕНИЕ ИНТЕРФЕЙСА
    saveAndRender() {
        // Интеграция с модулем Storage
        Storage.saveTasks(this.tasks);
        this.render();
    }

    // 11. ОБНОВЛЕНИЕ ВСЕГО ИНТЕРФЕЙСА
    render() {
        this.renderTasks();
        this.renderCounter();
        
        // Назначаем обработчики для динамически созданных элементов
        this.setupDynamicEventListeners();
    }

    // 12. ОТРИСОВКА СПИСКА ЗАДАЧ
    renderTasks() {
        // Интеграция с модулем UI
        UI.updateTaskList(this.tasks, this.currentFilter);
    }

    // 13. ОБНОВЛЕНИЕ СЧЁТЧИКА
    renderCounter() {
        // Интеграция с модулем UI
        UI.updateCounter(this.tasks);
    }

    // 14. ОБРАБОТЧИКИ ДЛЯ ДИНАМИЧЕСКИХ ЭЛЕМЕНТОВ
    setupDynamicEventListeners() {
        // Обработчики для чекбоксов
        document.querySelectorAll('.task-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.toggleTask(taskId);
            });
        });

        // Обработчики для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.deleteTask(taskId);
            });
        });
    }

    // 15. ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    updateActiveThemeButton() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === this.currentTheme);
        });
    }

    getThemeName(theme) {
        const themes = {
            'light': 'Светлая',
            'dark': 'Тёмная', 
            'blue': 'Синяя'
        };
        return themes[theme] || theme;
    }
}

// 16. ЗАПУСК ПРИЛОЖЕНИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
    console.log('Приложение запущено. Управление через window.todoApp');
});