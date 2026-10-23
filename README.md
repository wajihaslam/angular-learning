# Angular Learning Platform

An Angular 20 app that teaches Angular using its own code. Each lesson has:

- **Learn**: the explanation.
- **Live demo**: the real component, running.
- **Code**: the real source files, loaded from disk, with the relevant lines highlighted.
- **Tests**: the specs that cover the lesson's code.
- **Practice**: exercises to try in this project.

Topics are searchable on the home page (press `/`) and in the lesson sidebar. Progress is saved in your browser.

## Run

Requires Node.js 20.19+ or 22.12+.

```
npm install
npm run dev     # mock API (:3000) + app (:4200)
npm test        # unit tests (Vitest)
```

Open http://localhost:4200. The Tasks demos need the mock API. See [server/README.md](server/README.md).

## How the Code tab stays accurate

`angular.json` copies the project source to `/source` as build assets. The code viewer loads those files at runtime, so the code shown is always the code that runs. After adding a new file, restart `npm start`.

## Structure

```
src/
├── index.html, main.ts, styles.css     # Host page, bootstrap, Tailwind + theme
└── app/
    ├── app.ts / app.html               # Shell: header + router outlet
    ├── app.config.ts, app.routes.ts    # Providers (zoneless, router, http) and routes
    ├── pages/                          # Learning examples used as live demos
    │   ├── counter/                    #   signals
    │   ├── about/                      #   simplest standalone component
    │   └── tasks/                      #   CRUD: forms, RxJS, HttpClient
    ├── services/, models/              # TaskService + Task model
    ├── demos/                          # Focused demos: binding, control flow, pipes, Tailwind
    └── platform/                       # The learning platform itself
        ├── data/topics.ts              #   Curriculum: lessons, files, exercises
        ├── pages/home, pages/lesson    #   Home page with search + lesson page with tabs
        ├── components/code-viewer      #   Loads and highlights real source files
        └── services/progress.service.ts
```

## Adding a lesson

Add an entry to `TOPICS` in `src/app/platform/data/topics.ts`. Point `demo` at a component and list its `files`, using `focus` strings to highlight lines.
