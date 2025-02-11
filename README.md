# Node.JS_FinalProject

Проект: "Гильдия авантюристов"
Админ (гильдмастер) управляет заданиями, создаёт их и может удалять персонажей.
Пользователь (член гильдии) регистрируется, создаёт персонажа, берёт задания с доски объявлений и выполняет их.
Основной функционал:

Модели:
User: роль (admin/member), email, пароль.
Character: имя, класс, уровень, опыт, золото, связь с пользователем.
Quest: название, описание, сложность, награда, статус (open, in-progress, completed), текущий исполнитель.
CRUD:
Админ может управлять заданиями и удалять персонажей.
Пользователь может создавать персонажа, выбирать задания и выполнять их.
Дополнительно:
Ресурсы (золото, опыт).
Система достижений.
Социальные элементы (отзывы о заданиях).
Рейтинг пользователей/персонажей.
Технические детали:

Backend: Node.js, Express, MongoDB (Mongoose), bcrypt, JWT, helmet, xss-clean.
Frontend: EJS (server-side) для минимального UI, React/Vue (опционально) для более сложного интерфейса.
Развёртывание: Render.com, использование .env для безопасности.
Схема проекта:

Пользователь регистрируется, становится членом гильдии.
Админ пишет описание заданий на доске и управляет гильдией.
Пользователь создаёт персонажа, берёт задания с доски, завершает их, получает награды и повышает уровень.
План работы:

Реализовать базовую структуру проекта.
Создать модели User, Character, Quest.
Добавить регистрацию, авторизацию и CRUD для заданий и персонажей.
Постепенно добавить достижения, рейтинг, прогрессию и социальные элементы.

Критерии проекта от школы программирования:
Обязательные элементы:
Node/Express приложение с MongoDB:

Минимум две модели Mongoose: одна обязательно User, вторая на выбор.
Полный CRUD для моделей (кроме User, для которой регистрация и логин обязательны).
Валидация полей, защита от создания недопустимых записей.
Авторизация и аутентификация:

Server-side рендеринг: использовать Passport.
Full-stack проект: использовать JWT.
Хранение паролей в хешированном виде (например, bcrypt).
Middleware для доступа к CRUD-операциям, требующим авторизации.
Интерфейс:

Регистрация, логин, выход.
Полный CRUD для всех моделей (кроме User).
Удобная навигация (ссылки или кнопки).
Простое, но оформленное UI (минимальный стиль до выполнения всех функций).
Уведомления:

Сообщения для пользователей (например, через connect-flash или API-ответы).
Безопасность:

Использовать пакеты, такие как xss-clean, helmet.
Исключить утечку MongoDB URI, использовать .env для конфиденциальных данных.
Добавить middleware для обработки ошибок.
Развёртывание:

Приложение должно быть развернуто на Render.com.
Код:

Использовать eslint и prettier для чистоты кода.
Логика доступа к данным в контроллерах (один пользователь не может изменять данные другого).
Дополнительные (необязательные) элементы:
Нестандартные операции (поиск, сортировка, пагинация).
Интеграция сторонних API или сложные модели данных.
Написание тестов (Mocha, Chai, Puppeteer).
Использование Swagger для документирования API (для full-stack).
Уникальный функционал, демонстрирующий креативность.
Финальная подача:
Ссылки:
На репозиторий GitHub.
На развернутое приложение в Render.com.
Презентация: Короткая запись 3-5 минут, демонстрирующая работу приложения.

структура для фронта и бэка : при запуске - пользователь видит страницу входа, где есть кнопка регистрация, логин с полями ввода email и password. после того как пользователь залогинился - он попадает на основую страницу, где он видит список своих персонажей, может создать новых , редактировать пероснажей, может взять задание. так же после регистрации пользователь попадает на эту страницу. далее есть страница, где отображается отдельный рэйтинг пользователь и отдельный рэйтинг персонажей.
при заходе в качестве администратора - отображается список пользователей, которых администратор может выгнать из гильдии, так же есть возможность сделать задание. (это будет вторая его обязанность).
