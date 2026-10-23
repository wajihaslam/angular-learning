# Mock API

A fake REST API built with [json-server](https://github.com/typicode/json-server/tree/v0.17.4) (v0.17).
It reads and writes `db.json`, so no backend code is needed.

## Run

```
npm run api     # API only, at http://localhost:3000
npm run dev     # API and Angular dev server together
```

Every response is delayed by 300 ms (`--delay 300`) so you can see loading states.

## Endpoints

| Method | URL                 | Does                                 |
|--------|---------------------|--------------------------------------|
| GET    | `/tasks`            | List all tasks                       |
| GET    | `/tasks?q=forms`    | Full-text search                     |
| GET    | `/tasks?_sort=createdAt&_order=desc` | Sorted list         |
| GET    | `/tasks/1`          | Get one task                         |
| POST   | `/tasks`            | Create (id is generated if missing)  |
| PATCH  | `/tasks/1`          | Update some fields                   |
| PUT    | `/tasks/1`          | Replace the whole task               |
| DELETE | `/tasks/1`          | Delete                               |

## Reset the data

Every change you make in the app is saved to `db.json`. To restore the original
5 tasks from `db.seed.json`:

```
npm run api:reset
```
