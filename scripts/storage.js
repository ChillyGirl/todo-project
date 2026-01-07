// Модуль для работы с локальным хранилищем (localStorage)

const Storage = {
    // Ключ для хранения задач в localStorage
    STORAGE_KEY: 'todo-app-tasks',

    // 1. Получить все задачи из хранилища
    getTasks() {
        try {
            // Получаем JSON-строку из localStorage
            const tasksJson = localStorage.getItem(this.STORAGE_KEY);
            // Парсим JSON в массив, если данные есть, иначе возвращаем пустой массив
            return tasksJson ? JSON.parse(tasksJson) : [];
        } catch (error) {
            // Если произошла ошибка (например, повреждённые данные), возвращаем пустой массив
            console.error('Ошибка при чтении задач из localStorage:', error);
            return [];
        }
    },

    // 2. Сохранить все задачи в хранилище
    saveTasks(tasks) {
        try {
            // Преобразуем массив задач в JSON-строку и сохраняем
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
            return true;
        } catch (error) {
            console.error('Ошибка при сохранении задач в localStorage:', error);
            return false;
        }
    },

    // 3. Получить сохранённую тему оформления
    getTheme() {
        return localStorage.getItem('todo-app-theme') || 'light';
    },

    // 4. Сохранить выбранную тему оформления
    saveTheme(theme) {
        localStorage.setItem('todo-app-theme', theme);
    }
};

// Экспортируем модуль для использования в других файлах
// (В браузере это добавляет Storage в глобальную область видимости)
if (typeof window !== 'undefined') {
    window.Storage = Storage;
}