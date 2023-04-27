# Описание

Это репозиторий - тестовое задание для компании fundraiseup.

Функционал:

- Скрипт app.ts бесконечно генерирует записи в коллекцию `customers` пачками от 1 до 10 штук каждые 200 мс.
- Скрипт sync.ts слушает изменения (insert/update) в коллекции `customers` и дублирует их в коллекцию `customers_anonymised` преждевременно изменив условленные поля на рандомные строки
- Скрипт sync.ts запущенный с флагом `--full-reindex` не слушает изменения в `customers`, а полностью переносит все записи в коллекцию `customers_anonymised`

---

## Установка зависимостей

Для работы нужны пакеты [node](https://nodejs.org/en/download) и [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) (ссылки на инструкцию по установке)

Для установки необходимых библиотек введите команду: `yarn` или `npm i` (присутствует только yarn.lock файл, что гарантирует работы библиотек, при установке их с помощью yarn менеджера)

## Запуск скрипта app.ts

Запустить можно с помощью команды `yarn start:app` или `ts-node app.ts`

## Запуск скрипта sync.ts

Запустить можно с помощью команды `yarn start:sync` или `ts-node sync.ts`

Добавление флага `--full-reindex` (запуск командой `yarn start:full-sync"`) запустит скрипт по второму сценарию

---

P.S. Обратите внимание, что вы должны быть подключены к набору реплик MongoDB или общему кластеру, чтобы работала функция прослушки ивентов БД. Подробности описаны [здесь.](https://mongoosejs.com/docs/change-streams.html)

Начало работы 26.04.2023 - 14:22 МСК / Конец работы - 27.04.2023 - 12:37 МСК
