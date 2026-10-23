import { Type } from '@angular/core';
import { BindingDemo } from '../../demos/binding-demo/binding-demo';
import { ControlFlowDemo } from '../../demos/control-flow-demo/control-flow-demo';
import { PipesDemo } from '../../demos/pipes-demo/pipes-demo';
import { TailwindDemo } from '../../demos/tailwind-demo/tailwind-demo';
import { About } from '../../pages/about/about';
import { Counter } from '../../pages/counter/counter';
import { Tasks } from '../../pages/tasks/tasks';

export interface CodeFile {
  /** Path from the project root, e.g. 'src/app/pages/tasks/tasks.ts'. */
  path: string;
  /** Lines containing any of these strings are highlighted. */
  focus?: string[];
  note?: string;
}

export interface LessonSection {
  heading: string;
  /** Paragraphs. `code` and **bold** are supported. */
  body: string[];
  points?: string[];
}

export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Category {
  id: string;
  title: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  category: string;
  level: Level;
  summary: string;
  tags: string[];
  sections: LessonSection[];
  demo?: Type<unknown>;
  /** The demo talks to the json-server mock API. */
  requiresApi?: boolean;
  files: CodeFile[];
  tests?: CodeFile[];
  exercises: string[];
}

export const CATEGORIES: Category[] = [
  { id: 'fundamentals', title: 'Fundamentals', description: 'How the app boots, components, providers and signals.' },
  { id: 'templates', title: 'Templates', description: 'Binding, control flow, pipes and component styles.' },
  { id: 'routing', title: 'Routing', description: 'Routes, links, route params and query params.' },
  { id: 'data', title: 'Services & Data', description: 'Dependency injection, HttpClient and the mock REST API.' },
  { id: 'forms-rxjs', title: 'Forms & RxJS', description: 'Reactive forms, validation, RxJS streams and a full CRUD page.' },
  { id: 'styling', title: 'Tailwind CSS', description: 'Tailwind v4 setup, theme tokens and utility classes.' },
  { id: 'testing', title: 'Testing & Tooling', description: 'Vitest, HttpTestingController and debugging in VS Code.' },
];

const TASKS_TS = 'src/app/pages/tasks/tasks.ts';
const TASKS_HTML = 'src/app/pages/tasks/tasks.html';
const TASKS_CSS = 'src/app/pages/tasks/tasks.css';
const TASK_SERVICE = 'src/app/services/task.service.ts';
const TASK_MODEL = 'src/app/models/task.ts';
const TASKS_SPEC = 'src/app/pages/tasks/tasks.spec.ts';
const TASK_SERVICE_SPEC = 'src/app/services/task.service.spec.ts';

export const TOPICS: Topic[] = [
  // ───────────────────────────── Fundamentals ─────────────────────────────
  {
    id: 'project-structure',
    title: 'Project Structure & Bootstrap',
    category: 'fundamentals',
    level: 'Beginner',
    summary: 'How index.html, main.ts and angular.json work together to start the app.',
    tags: ['bootstrapApplication', 'main.ts', 'index.html', 'angular.json', 'npm scripts', 'cli'],
    sections: [
      {
        heading: 'How an Angular app starts',
        body: [
          'The browser loads `src/index.html`. It only contains an empty `<app-root>` element. Angular has not run yet.',
          'Next, `src/main.ts` runs and calls `bootstrapApplication(App, appConfig)`. Angular creates the root component `App`, finds the element that matches its selector `app-root`, and renders the template inside it.',
          'Everything you see on this page, including the header and these lessons, is rendered inside that one element.',
        ],
      },
      {
        heading: 'angular.json: the build recipe',
        body: [
          'The `build` target uses `@angular/build:application` (esbuild and Vite). `browser` is the entry file, `styles` lists global CSS (Tailwind is loaded there) and `assets` lists files copied as-is.',
          'This platform uses `assets` to copy the project source into `/source`. That is how the **Code** tab shows the real files from disk instead of a copy that could drift.',
        ],
      },
      {
        heading: 'npm scripts',
        body: ['`package.json` defines the commands you run every day:'],
        points: [
          '`npm start` runs `ng serve`, the dev server on http://localhost:4200 with live reload.',
          '`npm run api` starts the json-server mock API on port 3000.',
          '`npm run dev` uses `concurrently` to run both at once.',
          '`npm test` runs the unit tests with Vitest.',
        ],
      },
    ],
    files: [
      { path: 'src/main.ts', focus: ['bootstrapApplication'] },
      { path: 'src/index.html', focus: ['<app-root>'] },
      { path: 'angular.json', focus: ['"builder"', '"browser"', '"styles"', '"assets"'] },
      { path: 'package.json', focus: ['"start"', '"api"', '"dev"', '"test"'] },
      { path: 'tsconfig.json', focus: ['strict'] },
    ],
    exercises: [
      'Change the `<title>` in `src/index.html` and watch the browser tab update.',
      'Add an npm script `"build:dev": "ng build --configuration development"` and run it.',
      'In `angular.json`, find the asset entry that copies `server/README.md`. Where does it end up in the build output?',
    ],
  },
  {
    id: 'standalone-components',
    title: 'Standalone Components',
    category: 'fundamentals',
    level: 'Beginner',
    summary: 'The building block of every Angular UI: a class, a template and optional styles.',
    tags: ['@Component', 'selector', 'templateUrl', 'styleUrl', 'imports', 'standalone'],
    sections: [
      {
        heading: 'Anatomy of a component',
        body: [
          '`About` is the smallest component in this project: a class decorated with `@Component` plus an HTML template. The live demo renders it.',
        ],
        points: [
          '`selector` is the custom HTML tag, e.g. `<app-about />`.',
          '`templateUrl` points to the HTML file. (`template` would hold inline HTML.)',
          '`styleUrl` adds CSS that only applies to this component.',
          '`imports` lists everything the template uses: other components, directives like `RouterLink`, and pipes like `DatePipe`.',
        ],
      },
      {
        heading: 'Standalone by default',
        body: [
          'Since Angular 19 every component is standalone, so there is no `NgModule`. Each component declares its own dependencies in `imports`. Look at `App`: it imports `RouterOutlet`, `RouterLink` and `RouterLinkActive` because `app.html` uses them.',
          'Angular 20 naming drops the `.component` suffix: the file is `about.ts` and the class is `About`.',
        ],
      },
    ],
    demo: About,
    files: [
      { path: 'src/app/pages/about/about.ts', focus: ['@Component', 'selector', 'templateUrl'] },
      { path: 'src/app/pages/about/about.html' },
      { path: 'src/app/app.ts', focus: ['imports', 'selector'] },
      { path: 'src/app/pages/counter/counter.ts', focus: ['@Component'] },
    ],
    exercises: [
      'Create `src/app/pages/contact/contact.ts` and `contact.html` by hand, following `About`.',
      'Use the new component inside `about.html` with its selector. What error appears if you forget to add it to `imports`?',
      'Convert `About` to an inline `template` and compare the two styles.',
    ],
  },
  {
    id: 'app-config',
    title: 'Providers & Zoneless Change Detection',
    category: 'fundamentals',
    level: 'Intermediate',
    summary: 'app.config.ts wires up app-wide services: router, HttpClient and zoneless change detection.',
    tags: ['ApplicationConfig', 'providers', 'provideZonelessChangeDetection', 'provideRouter', 'provideHttpClient', 'zone.js'],
    sections: [
      {
        heading: 'ApplicationConfig',
        body: [
          '`appConfig` is passed to `bootstrapApplication` in `main.ts`. Its `providers` array registers services for the whole app. Each `provideX()` function sets up one feature.',
        ],
        points: [
          '`provideRouter(routes, withComponentInputBinding())` enables routing and passes route params to component inputs.',
          '`provideHttpClient()` makes `HttpClient` injectable. `TaskService` and the code viewer use it.',
          '`provideZonelessChangeDetection()` turns off zone.js.',
        ],
      },
      {
        heading: 'What “zoneless” means',
        body: [
          'Older Angular apps used zone.js to patch every browser API and re-check the whole component tree after any async event. This app does not include zone.js at all.',
          'Angular now re-renders only when it is told something changed: a **signal** a template reads is updated, a template event like `(click)` fires, or the `async` pipe receives a value. That is why this project keeps UI state in signals such as `tasks`, `loading` and `count`.',
        ],
      },
    ],
    files: [
      { path: 'src/app/app.config.ts', focus: ['provide'] },
      { path: 'src/main.ts', focus: ['appConfig'] },
    ],
    exercises: [
      'Temporarily remove `provideHttpClient()` and open the Tasks demo. Read the `NullInjectorError` in the console.',
      'Search `package.json` for `zone.js`. Why is it not there?',
      'Add `withViewTransitions()` to `provideRouter` and navigate between lessons.',
    ],
  },
  {
    id: 'signals',
    title: 'Signals',
    category: 'fundamentals',
    level: 'Beginner',
    summary: 'Reactive values with signal(), set(), update(), computed() and effect().',
    tags: ['signal', 'set', 'update', 'computed', 'effect', 'reactivity', 'state'],
    sections: [
      {
        heading: 'Create and read a signal',
        body: [
          '`count = signal(0)` creates a signal that holds `0`. Read it by **calling** it: `{{ count() }}`. When a template reads a signal, Angular knows to re-render that spot when the value changes.',
        ],
      },
      {
        heading: 'set() vs update()',
        body: ['The counter uses `update`, which computes the new value from the old one.'],
        points: [
          '`count.update((n) => n + 1)` uses the previous value.',
          '`loading.set(true)` replaces the value. `Tasks` uses this for `loading`, `error` and `editingId`.',
          '`tasks.update((list) => [created, ...list])` creates a **new** array instead of mutating, so Angular sees the change.',
        ],
      },
      {
        heading: 'computed() and effect()',
        body: [
          '`computed()` derives a value from other signals and caches it. On the home page, `results` is computed from `query` and `activeCategory`, so typing in the search box filters the topics.',
          '`effect()` runs side effects when signals change. `ProgressService` uses one to save your completed lessons to `localStorage` whenever `completed` changes.',
        ],
      },
    ],
    demo: Counter,
    files: [
      { path: 'src/app/pages/counter/counter.ts', focus: ['signal', 'update'] },
      { path: 'src/app/pages/counter/counter.html', focus: ['count()'] },
      { path: TASKS_TS, focus: ['signal', '.set(', '.update('], note: 'Real-world signals: page state for loading, errors, the list and edit mode.' },
      { path: 'src/app/platform/pages/home/home.ts', focus: ['computed', 'signal'], note: 'computed() powers the topic search on the home page.' },
      { path: 'src/app/platform/services/progress.service.ts', focus: ['effect', 'computed', 'signal'] },
    ],
    exercises: [
      'Add a `decrement()` button and a `reset()` button to the counter.',
      'Add `double = computed(() => this.count() * 2)` and show it in the template.',
      'Add an `effect` that logs the count to the console. When does it run?',
    ],
  },

  // ───────────────────────────── Templates ─────────────────────────────
  {
    id: 'data-binding',
    title: 'Templates & Data Binding',
    category: 'templates',
    level: 'Beginner',
    summary: 'Interpolation, property binding, event binding and class binding.',
    tags: ['interpolation', '{{ }}', 'property binding', 'event binding', '$event', '[class]', 'template'],
    sections: [
      {
        heading: 'The four bindings you use every day',
        body: ['Every binding below appears in the demo and in the real Tasks template.'],
        points: [
          '**Interpolation** `{{ task.title }}` prints a value as text.',
          '**Property binding** `[checked]="task.done"` sets a DOM property from an expression.',
          '**Event binding** `(click)="remove(task)"` calls a method when the event fires. `$event` is the DOM event object.',
          '**Class binding** `[class.done]="task.done"` adds the class only while the expression is true.',
        ],
      },
      {
        heading: 'Data flows one way',
        body: [
          'Brackets `[ ]` carry data from the class to the template. Parentheses `( )` carry events from the template to the class. The demo combines both on one input: `[value]="name()"` and `(input)="onNameInput($event)"`.',
          'For forms, this project uses reactive forms (`formControlName`) instead of two-way `[(ngModel)]`. See the Reactive Forms lesson.',
        ],
      },
    ],
    demo: BindingDemo,
    files: [
      { path: 'src/app/demos/binding-demo/binding-demo.html', focus: ['{{', '[value]', '(input)', '(click)', '[class.on]', '[disabled]'] },
      { path: 'src/app/demos/binding-demo/binding-demo.ts', focus: ['onNameInput', 'signal'] },
      { path: TASKS_HTML, focus: ['[checked]', '(change)', '(click)', '[class.done]', '{{ task'], note: 'The same bindings in the Tasks page.' },
    ],
    exercises: [
      'Bind `[style.color]` to a signal and add buttons that change it.',
      'Show the mouse position with `(mousemove)` and `$event.clientX`.',
      'Disable the Tasks "Add" button while the form is invalid using `[disabled]`.',
    ],
  },
  {
    id: 'control-flow',
    title: 'Control Flow: @if, @for, @switch',
    category: 'templates',
    level: 'Beginner',
    summary: 'Built-in template blocks for conditions, loops and switches.',
    tags: ['@if', '@else', '@for', 'track', '@empty', '@switch', '$index', 'ngIf', 'ngFor'],
    sections: [
      {
        heading: '@if / @else if / @else',
        body: [
          'The Tasks page chains conditions to show exactly one state: `@if (loading())` shows "Loading...", `@else if (tasks().length === 0 && !error())` shows the empty state, and `@else` renders the list.',
        ],
      },
      {
        heading: '@for with track',
        body: [
          '`@for (task of tasks(); track task.id)` loops over the list. `track` is required: it tells Angular how to identify each item, so it moves DOM rows instead of recreating them.',
        ],
        points: [
          'Implicit variables: `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`.',
          '`@empty` renders when the list is empty.',
        ],
      },
      {
        heading: '@switch',
        body: [
          'Pick one block by value with `@case`, falling back to `@default`. These blocks replace the older `*ngIf`, `*ngFor` and `[ngSwitch]` directives and need no imports.',
        ],
      },
    ],
    demo: ControlFlowDemo,
    files: [
      { path: 'src/app/demos/control-flow-demo/control-flow-demo.html', focus: ['@if', '@for', '@empty', '@else', '@switch', '@case', '@default'] },
      { path: 'src/app/demos/control-flow-demo/control-flow-demo.ts' },
      { path: TASKS_HTML, focus: ['@if', '@for', '@else'], note: 'Loading, empty and list states in the real Tasks page.' },
    ],
    exercises: [
      'Use `$even` to stripe every other fruit row.',
      'Add a "Clear all" button so you can see the `@empty` block.',
      'In Tasks, show "(n done)" next to the heading using a loop or a computed signal.',
    ],
  },
  {
    id: 'pipes',
    title: 'Pipes',
    category: 'templates',
    level: 'Beginner',
    summary: 'Format values in templates with pipes like date, currency and json.',
    tags: ['pipe', 'DatePipe', 'date', 'currency', 'uppercase', 'json', 'percent', 'formatting'],
    sections: [
      {
        heading: 'Syntax',
        body: [
          'A pipe transforms a value for display: `{{ task.createdAt | date: "medium" }}`. Arguments come after a colon. Pipes can be chained: `{{ value | date | uppercase }}`.',
          'The API stores `createdAt` as an ISO string like `2026-10-02T10:30:00.000Z`. `DatePipe` turns it into readable text in the user\'s locale.',
        ],
      },
      {
        heading: 'Pipes must be imported',
        body: [
          'Built-in pipes are standalone, so add them to the component\'s `imports`. `Tasks` imports `DatePipe`. The pipes demo imports `DatePipe`, `UpperCasePipe`, `CurrencyPipe`, `PercentPipe` and `JsonPipe`.',
          'Built-in pipes are **pure**: Angular reruns them only when the input value changes, so they are cheap to use.',
        ],
      },
    ],
    demo: PipesDemo,
    files: [
      { path: 'src/app/demos/pipes-demo/pipes-demo.html', focus: ['|'] },
      { path: 'src/app/demos/pipes-demo/pipes-demo.ts', focus: ['imports', 'Pipe'] },
      { path: TASKS_HTML, focus: ['| date'] },
      { path: TASKS_TS, focus: ['DatePipe'] },
    ],
    exercises: [
      'Show each task\'s date as `"MMM d, h:mm a"`.',
      'Write a custom `relativeTime` pipe that prints "2 days ago" and use it in Tasks.',
      'Try `{{ task.title | slice: 0 : 10 }}`. What do you need to import?',
    ],
  },
  {
    id: 'component-styles',
    title: 'Component Styles',
    category: 'templates',
    level: 'Beginner',
    summary: 'Scoped component CSS with styleUrl versus global styles.',
    tags: ['styleUrl', 'css', 'view encapsulation', 'scoped styles', 'global styles', '_ngcontent'],
    sections: [
      {
        heading: 'Styles are scoped to the component',
        body: [
          '`styleUrl: \'./tasks.css\'` attaches CSS to the Tasks component. `tasks.css` styles bare `ul` and `li` selectors, yet they do not leak into this platform\'s lists.',
          'Angular rewrites each selector with a unique attribute (emulated encapsulation). Inspect a task row in DevTools and look for `_ngcontent-...` attributes.',
        ],
      },
      {
        heading: 'Global styles',
        body: [
          '`src/styles.css` is listed in `angular.json` and applies everywhere. It loads Tailwind and defines the `.demo-surface` base styles that give the plain-HTML examples simple buttons and inputs.',
        ],
        points: [
          'Use component CSS for state-based rules like `.done .title`, toggled by `[class.done]`.',
          'Use Tailwind utilities for layout and visual styling. See the Tailwind lessons.',
        ],
      },
    ],
    demo: BindingDemo,
    files: [
      { path: TASKS_CSS, focus: ['.done', 'ul', 'li'] },
      { path: TASKS_TS, focus: ['styleUrl'] },
      { path: 'src/app/demos/binding-demo/binding-demo.css', focus: ['.card'] },
      { path: 'src/styles.css', focus: ['.demo-surface'] },
    ],
    exercises: [
      'Make done tasks fade with `opacity: 0.6` in `tasks.css`.',
      'Add `:host { display: block; }` to `binding-demo.css`. What does `:host` select?',
      'Try `encapsulation: ViewEncapsulation.None` on a demo and watch its styles leak.',
    ],
  },

  // ───────────────────────────── Routing ─────────────────────────────
  {
    id: 'routing',
    title: 'Routing & Navigation',
    category: 'routing',
    level: 'Intermediate',
    summary: 'Map URLs to components, link between pages and read route and query params as inputs.',
    tags: ['Routes', 'router-outlet', 'routerLink', 'routerLinkActive', 'route params', 'query params', 'withComponentInputBinding', 'Router.navigate'],
    sections: [
      {
        heading: 'You are using it right now',
        body: [
          'The URL in your address bar is `/learn/routing`. The route `learn/:topicId` matched, so the `Lesson` component rendered inside `<router-outlet />` in `app.html`.',
        ],
        points: [
          '`{ path: \'\', component: Home, title: ... }` is the home page. `title` sets the browser tab text.',
          '`{ path: \'learn\', redirectTo: ... }` sends `/learn` to the first lesson.',
          '`{ path: \'**\', redirectTo: \'\' }` catches unknown URLs. It must be last.',
        ],
      },
      {
        heading: 'Links',
        body: [
          '`routerLink="/"` navigates without a full page reload. `[routerLink]="[\'/learn\', topic.id]"` builds the URL from an array. `routerLinkActive` adds classes while the link matches the current URL. That is how the header highlights "Lessons".',
        ],
      },
      {
        heading: 'Params as inputs',
        body: [
          '`withComponentInputBinding()` in `app.config.ts` lets the router fill component inputs. `Lesson` declares `topicId = input.required<string>()` for `:topicId` and `tab = input<string>()` for `?tab=code`.',
          'Switching tabs calls `router.navigate([], { queryParams: { tab } })`, so every tab has a shareable URL. Try it with the tabs above.',
        ],
      },
    ],
    files: [
      { path: 'src/app/app.routes.ts', focus: ['path'] },
      { path: 'src/app/app.html', focus: ['routerLink', 'router-outlet'] },
      { path: 'src/app/app.config.ts', focus: ['withComponentInputBinding'] },
      { path: 'src/app/platform/pages/lesson/lesson.ts', focus: ['input', 'navigate'] },
      { path: 'src/app/platform/pages/home/home.html', focus: ['routerLink'] },
    ],
    exercises: [
      'Add an `about` route that renders the `About` component, and a header link to it.',
      'Lazy-load the lesson page with `loadComponent: () => import(...)` and check the network tab.',
      'Add a `canActivate` guard that blocks `/learn/debugging` until the testing lessons are completed.',
    ],
  },

  // ───────────────────────────── Services & Data ─────────────────────────────
  {
    id: 'dependency-injection',
    title: 'Services & Dependency Injection',
    category: 'data',
    level: 'Intermediate',
    summary: 'Share logic in @Injectable services and get them with inject().',
    tags: ['@Injectable', 'providedIn root', 'inject', 'service', 'DI', 'singleton', 'DestroyRef'],
    sections: [
      {
        heading: 'A service is a class Angular creates for you',
        body: [
          '`TaskService` holds all API calls, so the component only deals with UI. `@Injectable({ providedIn: \'root\' })` registers a single shared instance for the whole app. It is created the first time something asks for it.',
        ],
      },
      {
        heading: 'inject()',
        body: [
          'Components ask for dependencies with `inject()`: `private taskService = inject(TaskService)`. Angular looks the type up in its injector tree. The same function provides `HttpClient` inside the service and `DestroyRef` inside the component.',
          '`ProgressService`, which stores your completed lessons, is another root service. The home page and the lesson page both inject it and share the same state.',
        ],
      },
      {
        heading: 'Why DI matters for testing',
        body: [
          'Because nothing is created with `new`, tests can swap implementations. The specs call `provideHttpClientTesting()` so `HttpClient` talks to a fake backend instead of the network.',
        ],
      },
    ],
    demo: Tasks,
    requiresApi: true,
    files: [
      { path: TASK_SERVICE, focus: ['@Injectable', 'inject('] },
      { path: TASKS_TS, focus: ['inject('] },
      { path: 'src/app/platform/services/progress.service.ts', focus: ['@Injectable'] },
    ],
    tests: [{ path: TASK_SERVICE_SPEC, focus: ['providers', 'TestBed.inject'] }],
    exercises: [
      'Create a `NotificationService` with a `message` signal and show it in the header.',
      'Remove `providedIn: \'root\'` from `TaskService` and read the error. Then add it to the `Tasks` component\'s `providers` instead.',
      'Rewrite `private taskService = inject(TaskService)` as constructor injection and compare.',
    ],
  },
  {
    id: 'http-client',
    title: 'HttpClient & REST APIs',
    category: 'data',
    level: 'Intermediate',
    summary: 'Typed GET, POST, PATCH and DELETE requests with HttpClient and HttpParams.',
    tags: ['HttpClient', 'HttpParams', 'get', 'post', 'patch', 'delete', 'Observable', 'environment', 'httpResource', 'REST'],
    sections: [
      {
        heading: 'CRUD in TaskService',
        body: ['Each method returns a typed `Observable` that maps to one REST call:'],
        points: [
          '`list(search)` → `GET /tasks?_sort=createdAt&_order=desc&q=...`, built with `HttpParams`.',
          '`add(title)` → `POST /tasks` with the new task in the body.',
          '`update(id, changes)` → `PATCH /tasks/:id`. `Partial<Omit<Task, \'id\'>>` lets you send any subset of fields except `id`.',
          '`toggle(task)` reuses `update` to flip `done`.',
          '`remove(id)` → `DELETE /tasks/:id`.',
        ],
      },
      {
        heading: 'Observables are lazy',
        body: [
          'Calling `taskService.add(...)` sends **nothing**. The request starts when someone subscribes. In `Tasks`, the private `run()` helper subscribes and handles success and error in one place.',
          'The API base URL lives in `src/environments/environment.ts`, so it is defined in one place. The `Task` interface types every response.',
        ],
      },
      {
        heading: 'Bonus: httpResource',
        body: [
          'Angular 20 adds `httpResource`, which returns signals instead of an Observable. This platform\'s code viewer uses `httpResource.text(() => url)` to load files. It re-fetches automatically when the URL signal changes and exposes `isLoading()`, `error()` and `value()`.',
        ],
      },
    ],
    demo: Tasks,
    requiresApi: true,
    files: [
      { path: TASK_SERVICE, focus: ['this.http.', 'HttpParams', 'Observable<'] },
      { path: TASK_MODEL },
      { path: 'src/environments/environment.ts', focus: ['apiUrl'] },
      { path: 'src/app/platform/components/code-viewer/code-viewer.ts', focus: ['httpResource'], note: 'Signal-based fetching with httpResource.' },
    ],
    tests: [{ path: TASK_SERVICE_SPEC, focus: ['expectOne', 'flush', 'method'] }],
    exercises: [
      'Add a `get(id)` method that fetches a single task.',
      'Open DevTools → Network, add a task, and inspect the POST request body and response.',
      'Stop the API (Ctrl+C on `npm run api`) and watch the error message in the demo.',
    ],
  },
  {
    id: 'mock-api',
    title: 'Mock REST API with json-server',
    category: 'data',
    level: 'Beginner',
    summary: 'A fake backend from a JSON file, so you can build the frontend first.',
    tags: ['json-server', 'mock api', 'db.json', 'concurrently', 'backend', 'REST'],
    sections: [
      {
        heading: 'A backend with zero code',
        body: [
          '`json-server` reads `server/db.json` and serves every top-level key as a REST resource. `"tasks": [...]` becomes `/tasks` with full CRUD. Changes from the app are written back to the file.',
        ],
        points: [
          '`--delay 300` slows every response so you can see loading states.',
          '`q`, `_sort` and `_order` give free search and sorting. `TaskService.list()` uses all three.',
          '`npm run api:reset` copies `db.seed.json` over `db.json` to restore the original 5 tasks.',
        ],
      },
      {
        heading: 'Running everything',
        body: [
          'Run `npm run dev`. `concurrently` starts the API (blue logs) and Angular (green logs) in one terminal. Then open any lesson with a Tasks demo.',
        ],
      },
    ],
    demo: Tasks,
    requiresApi: true,
    files: [
      { path: 'server/README.md' },
      { path: 'server/db.seed.json' },
      { path: 'package.json', focus: ['"api', '"dev"', 'json-server', 'concurrently'] },
    ],
    exercises: [
      'Visit http://localhost:3000/tasks?q=forms in the browser.',
      'Add a `"notes"` collection to `db.json` and fetch it from a new service.',
      'Change `--delay` to 2000 and watch the loading state in the demo.',
    ],
  },

  // ───────────────────────────── Forms & RxJS ─────────────────────────────
  {
    id: 'reactive-forms',
    title: 'Reactive Forms & Validation',
    category: 'forms-rxjs',
    level: 'Intermediate',
    summary: 'Typed FormGroup and FormControl, validators, error messages and edit mode.',
    tags: ['FormGroup', 'FormControl', 'Validators', 'ReactiveFormsModule', 'formControlName', 'ngSubmit', 'validation', 'nonNullable'],
    sections: [
      {
        heading: 'Define the form in the class',
        body: [
          'Reactive forms describe the form in TypeScript. The Tasks form has one control, `title`, with `Validators.required` and `Validators.minLength(3)`. `nonNullable: true` makes its type `string` instead of `string | null`, and `reset()` returns it to `\'\'`.',
          '`search` is a standalone `FormControl` outside any group. It is bound with `[formControl]` and drives the search stream.',
        ],
      },
      {
        heading: 'Bind it in the template',
        body: [],
        points: [
          '`[formGroup]="form"` connects the `<form>` element. Import `ReactiveFormsModule`.',
          '`formControlName="title"` connects the input to the control.',
          '`(ngSubmit)="save()"` runs on Enter or when the submit button is clicked.',
          'Errors show only when `title.invalid && title.touched`, and `hasError(\'required\')` chooses the message.',
        ],
      },
      {
        heading: 'Edit mode',
        body: [
          '`startEdit(task)` stores the id in `editingId` and fills the form with `setValue`. `save()` checks `editingId()` to decide between PATCH and POST. If the form is invalid, `markAllAsTouched()` reveals the errors.',
        ],
      },
    ],
    demo: Tasks,
    requiresApi: true,
    files: [
      { path: TASKS_TS, focus: ['Form', 'Validators', 'markAllAsTouched', 'setValue', 'reset()', 'editingId'] },
      { path: TASKS_HTML, focus: ['form', 'title.', 'formControl', 'editingId'] },
    ],
    tests: [{ path: TASKS_SPEC }],
    exercises: [
      'Add `Validators.maxLength(60)` and show a message for it.',
      'Add a `priority` select (low, medium, high) to the form and the `Task` model.',
      'Disable the submit button while the form is invalid.',
    ],
  },
  {
    id: 'rxjs',
    title: 'RxJS Streams: Live Search',
    category: 'forms-rxjs',
    level: 'Advanced',
    summary: 'debounceTime, switchMap and friends turn keystrokes into efficient API calls.',
    tags: ['RxJS', 'Observable', 'pipe', 'debounceTime', 'switchMap', 'distinctUntilChanged', 'catchError', 'takeUntilDestroyed', 'startWith', 'tap'],
    sections: [
      {
        heading: 'From keystrokes to requests',
        body: [
          '`search.valueChanges` is an Observable that emits on every keystroke. The `pipe` in the `Tasks` constructor turns that noisy stream into a few API calls. Read the operators top to bottom:',
        ],
        points: [
          '`debounceTime(300)` waits until typing pauses for 300 ms.',
          '`map((text) => text.trim())` ignores leading and trailing spaces.',
          '`startWith(\'\')` emits once immediately, so the full list loads on page open.',
          '`distinctUntilChanged()` skips the request if the text did not actually change.',
          '`tap(...)` is for side effects only: it sets `loading` and clears `error`.',
          '`switchMap(...)` calls the API and **cancels the previous request** if a new search starts.',
          '`catchError(...)` inside switchMap shows an error and returns `of([])`, so the outer stream keeps working.',
          '`takeUntilDestroyed()` unsubscribes when the component is destroyed.',
        ],
      },
      {
        heading: 'Cleanup outside the constructor',
        body: [
          '`takeUntilDestroyed()` with no argument only works in an injection context such as the constructor. The `run()` helper is called later from click handlers, so it passes the injected `DestroyRef`: `takeUntilDestroyed(this.destroyRef)`.',
        ],
      },
    ],
    demo: Tasks,
    requiresApi: true,
    files: [
      {
        path: TASKS_TS,
        focus: ['valueChanges', 'debounceTime', 'map((text)', 'startWith', 'distinctUntilChanged', 'tap(', 'switchMap', 'catchError', 'takeUntilDestroyed', 'subscribe', 'from \'rxjs\''],
      },
      { path: TASK_SERVICE, focus: ['Observable'] },
    ],
    tests: [{ path: TASKS_SPEC }],
    exercises: [
      'Type quickly in the demo search with DevTools → Network open. Count the requests.',
      'Replace `switchMap` with `mergeMap` and type fast. What can go wrong with the order of results?',
      'Add `filter((text) => text.length !== 1)` so single characters do not trigger a search.',
    ],
  },
  {
    id: 'tasks-crud',
    title: 'Putting It Together: Tasks CRUD',
    category: 'forms-rxjs',
    level: 'Advanced',
    summary: 'The complete Tasks page: signals, forms, RxJS, HttpClient and loading, empty and error states.',
    tags: ['CRUD', 'create', 'read', 'update', 'delete', 'loading state', 'error handling', 'Tasks', 'full example'],
    sections: [
      {
        heading: 'How the pieces connect',
        body: [
          'This page combines every earlier lesson. The component owns UI state in signals. `TaskService` owns HTTP. The template only reads signals and calls methods.',
        ],
        points: [
          '**Read**: the search stream calls `list()` and puts the result in `tasks`.',
          '**Create**: `save()` calls `add()`, then prepends the new task with `tasks.update`.',
          '**Update**: `toggle()` and edit mode call `update()`, then `replace()` swaps the item in the list.',
          '**Delete**: `remove()` asks `confirm()`, calls `remove()`, then filters the item out.',
        ],
      },
      {
        heading: 'Server first, then UI',
        body: [
          'The list changes only after the API succeeds, so the screen never shows data the server rejected. Every mutation goes through `run()`, which clears old errors, subscribes with cleanup and shows one friendly message on failure.',
          'The template covers every state: loading, error, empty and the list.',
        ],
      },
    ],
    demo: Tasks,
    requiresApi: true,
    files: [
      { path: TASKS_TS, focus: ['save()', 'toggle(', 'remove(', 'replace(', 'run<T>'] },
      { path: TASKS_HTML },
      { path: TASKS_CSS },
      { path: TASK_SERVICE },
      { path: TASK_MODEL },
    ],
    tests: [{ path: TASKS_SPEC }, { path: TASK_SERVICE_SPEC }],
    exercises: [
      'Add a "Clear completed" button that deletes all done tasks.',
      'Add filter tabs (All / Active / Done) using a `computed` signal.',
      'Make toggle optimistic: update the UI first and roll back if the request fails.',
    ],
  },

  // ───────────────────────────── Tailwind CSS ─────────────────────────────
  {
    id: 'tailwind-setup',
    title: 'Tailwind CSS v4 Setup',
    category: 'styling',
    level: 'Beginner',
    summary: 'Install with PostCSS, import in one line, add brand tokens with @theme and base styles with @layer.',
    tags: ['tailwind', 'tailwindcss', 'postcss', '@import', '@theme', '@layer', '@apply', 'preflight', 'design tokens'],
    sections: [
      {
        heading: 'Three pieces',
        body: [],
        points: [
          '`tailwindcss` and `@tailwindcss/postcss` are dev dependencies in `package.json`.',
          '`.postcssrc.json` registers the PostCSS plugin. The Angular build picks this file up automatically, so no `angular.json` change is needed.',
          '`@import "tailwindcss";` at the top of `src/styles.css` loads everything.',
        ],
      },
      {
        heading: 'No content config',
        body: [
          'Tailwind v4 scans your project files (`.html` and `.ts`) for class names and generates only the CSS you use. There is no `tailwind.config.js`. It even finds classes in TypeScript strings, like the token colors in this platform\'s syntax highlighter.',
        ],
      },
      {
        heading: '@theme and @layer',
        body: [
          'Inside `@theme`, `--color-brand-600: #c2187f` creates utilities such as `bg-brand-600`, `text-brand-600` and `ring-brand-100`. The demo\'s primary buttons use them.',
          'Tailwind\'s reset (Preflight) removes default button and input styles. `@layer base` with `@apply` gives the plain-HTML examples in `.demo-surface` a simple look. Utilities always override the base layer.',
        ],
      },
    ],
    demo: TailwindDemo,
    files: [
      { path: 'src/styles.css', focus: ['@import', '@theme', '--color-brand', '@layer', '@apply'] },
      { path: '.postcssrc.json' },
      { path: 'package.json', focus: ['tailwind', 'postcss'] },
    ],
    exercises: [
      'Add `--color-accent-500` to `@theme` and use `bg-accent-500` in the demo.',
      'Change `--font-sans` and watch the whole platform update.',
      'Remove the `@layer base` block and look at the Tasks demo. What did Preflight reset?',
    ],
  },
  {
    id: 'tailwind-utilities',
    title: 'Tailwind Utility Classes in Practice',
    category: 'styling',
    level: 'Intermediate',
    summary: 'Spacing, color, layout, responsive prefixes, state variants and binding classes from Angular.',
    tags: ['utility classes', 'responsive', 'md:', 'hover:', 'focus:', 'flex', 'grid', 'spacing', '[class]', 'tailwind'],
    sections: [
      {
        heading: 'Reading utility classes',
        body: ['Each class does one thing. Learn the patterns, not every class:'],
        points: [
          'Spacing: `p-5` (padding), `mt-2` (margin-top), `gap-3`. The scale is 0.25rem per step.',
          'Color: `bg-slate-50`, `text-brand-600`, `border-slate-200`. The shade goes from 50 (light) to 950 (dark).',
          'Layout: `flex items-center justify-between`, `grid grid-cols-3`.',
          'Shape: `rounded-xl`, `shadow-sm`, `border`.',
        ],
      },
      {
        heading: 'Responsive and state prefixes',
        body: [
          'Tailwind is mobile-first. `grid-cols-1 md:grid-cols-3` means one column by default and three from 768px up. This platform\'s sidebar uses `lg:block` to appear only on large screens.',
          'State variants apply on interaction: `hover:bg-brand-700`, `focus:ring-4`, `active:scale-95`, `disabled:cursor-not-allowed`.',
        ],
      },
      {
        heading: 'Tailwind + Angular bindings',
        body: [
          'Toggle single classes with `[class.bg-white]="selected() === variant"`, or switch whole sets with `[class]="active ? \'bg-slate-950 text-white\' : \'text-slate-400\'"`. Both are used in this platform.',
          'Always write complete class names. Tailwind scans text, so `\'text-\' + color` builds a class it never sees, and that class gets no CSS.',
        ],
      },
    ],
    demo: TailwindDemo,
    files: [
      { path: 'src/app/demos/tailwind-demo/tailwind-demo.html', focus: ['md:', 'hover:', '[class.'] },
      { path: 'src/app/app.html', note: 'The platform header: sticky, blurred, responsive.' },
      { path: 'src/app/platform/pages/home/home.html', focus: ['sm:', 'md:', 'lg:'] },
      { path: 'src/app/platform/components/code-viewer/code-viewer.html', focus: ['[class]'] },
    ],
    exercises: [
      'Make the demo card full width on phones and `max-w-sm` from `sm:` up.',
      'Add a `dark:` variant to the card and switch your OS to dark mode.',
      'Rebuild the Tasks list rows with Tailwind classes instead of `tasks.css`.',
    ],
  },

  // ───────────────────────────── Testing & Tooling ─────────────────────────────
  {
    id: 'testing-services',
    title: 'Testing Services with HttpTestingController',
    category: 'testing',
    level: 'Intermediate',
    summary: 'Unit-test HTTP code with Vitest, TestBed and a fake backend.',
    tags: ['testing', 'Vitest', 'TestBed', 'HttpTestingController', 'expectOne', 'flush', 'verify', 'unit test', 'ng test'],
    sections: [
      {
        heading: 'The test setup',
        body: [
          '`npm test` runs `ng test`. In `angular.json` the `test` target uses the `@angular/build:unit-test` builder with `"runner": "vitest"`. `tsconfig.spec.json` includes every `*.spec.ts` file.',
          'The test build uses `build:development,test`. The extra `test` configuration sets `"assets": []`, so the copies of the source files this platform shows are not picked up as duplicate specs.',
        ],
      },
      {
        heading: 'Fake the backend',
        body: [
          '`provideHttpClientTesting()` replaces the real network. Requests wait in `HttpTestingController` until the test answers them:',
        ],
        points: [
          '`http.expectOne(url)` asserts that exactly one matching request was made and returns it.',
          '`req.request.method`, `.params` and `.body` let you check what was sent.',
          '`req.flush(data)` sends a fake response back to the subscriber.',
          '`http.verify()` in `afterEach` fails the test if any request was not handled.',
        ],
      },
    ],
    files: [
      { path: TASK_SERVICE_SPEC, focus: ['expectOne', 'flush', 'verify', 'expect(', 'provideHttpClientTesting'] },
      { path: 'angular.json', focus: ['"test"', 'unit-test', '"runner"', 'development,test'] },
      { path: 'tsconfig.spec.json' },
    ],
    exercises: [
      'Write a test for `add()` that checks the POST body has `done: false`.',
      'Write a test for `remove()` that expects a DELETE to `/tasks/3`.',
      'Make a test fail on purpose by not flushing a request. Read the `verify()` message.',
    ],
  },
  {
    id: 'testing-components',
    title: 'Testing Components',
    category: 'testing',
    level: 'Advanced',
    summary: 'Render a component, flush HTTP and assert on the DOM in a zoneless app.',
    tags: ['component test', 'TestBed.createComponent', 'fixture', 'detectChanges', 'whenStable', 'zoneless', 'Vitest', 'testing'],
    sections: [
      {
        heading: 'Render, act, assert',
        body: ['`tasks.spec.ts` tests the loading → empty flow:'],
        points: [
          '`TestBed.createComponent(Tasks)` creates the component and its DOM.',
          '`fixture.detectChanges()` renders it once, showing "Loading...".',
          '`http.expectOne(...).flush([])` answers the list request with no tasks.',
          '`await fixture.whenStable()` waits for zoneless change detection to finish.',
          'Assertions read `fixture.nativeElement.textContent`, so they check what the user sees.',
        ],
      },
      {
        heading: 'Pure functions are the easiest to test',
        body: [
          'This platform\'s topic search is a plain function, `searchTopics()`, so its test needs no TestBed at all. Keep logic in small functions when you can.',
        ],
      },
    ],
    files: [
      { path: TASKS_SPEC, focus: ['createComponent', 'detectChanges', 'whenStable', 'flush', 'expect('] },
      { path: 'src/app/platform/pages/lesson/lesson.spec.ts', focus: ['setInput', 'click()', 'expectOne'], note: 'Tests the lesson page you are reading: tabs, the live Counter demo and the code viewer.' },
      { path: 'src/app/platform/pages/home/home.spec.ts', focus: ['dispatchEvent', 'activeCategory'] },
      { path: 'src/app/platform/data/topics.spec.ts' },
    ],
    exercises: [
      'Add a test that flushes two tasks and checks both titles render.',
      'Test the error state: respond with `{ status: 500, statusText: \'Error\' }` and assert the message.',
      'Write a test for the Counter that clicks the button and checks "Count: 1".',
    ],
  },
  {
    id: 'debugging',
    title: 'Debugging in VS Code',
    category: 'testing',
    level: 'Beginner',
    summary: 'Launch configs, breakpoints, source maps and the debugger statement.',
    tags: ['debugging', 'launch.json', 'breakpoints', 'debugger', 'source maps', 'VS Code', 'Chrome', 'Edge', 'DevTools'],
    sections: [
      {
        heading: 'Launch configurations',
        body: [
          '`.vscode/launch.json` defines "Debug app (Chrome)" and "Debug app (Edge)". Start `npm run dev`, then press F5 in VS Code. A browser opens on the Tasks demo, and breakpoints you set in `.ts` files will pause there.',
          'This works because the development build has `"sourceMap": true` in `angular.json`, which maps the bundled JavaScript back to your TypeScript.',
        ],
      },
      {
        heading: 'The debugger statement',
        body: [
          '`cancelEdit()` in `tasks.ts` contains a `debugger;` line. When DevTools or the VS Code debugger is attached, execution pauses there. Try it: click **Edit** on a task in the demo, then **Cancel**.',
          'Remove `debugger` statements before committing. They are for learning and quick investigations only.',
        ],
      },
    ],
    demo: Tasks,
    requiresApi: true,
    files: [
      { path: '.vscode/launch.json', focus: ['"type"', '"url"'] },
      { path: TASKS_TS, focus: ['debugger'] },
      { path: 'angular.json', focus: ['"sourceMap"'] },
    ],
    exercises: [
      'Set a breakpoint inside `save()` and inspect `this.form.value` when you add a task.',
      'Add a conditional breakpoint in `toggle()` that only pauses when `task.done` is true.',
      'Install Angular DevTools and inspect the signals of the Tasks component.',
    ],
  },
];

export function findTopic(id: string): Topic | undefined {
  return TOPICS.find((topic) => topic.id === id);
}

export function categoryOf(topic: Topic): Category {
  return CATEGORIES.find((c) => c.id === topic.category) ?? CATEGORIES[0];
}

/** Every word in the query must appear somewhere in the topic. Title matches rank first. */
export function searchTopics(query: string, topics: Topic[] = TOPICS): Topic[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return topics;

  return topics
    .map((topic) => {
      const title = topic.title.toLowerCase();
      const tags = topic.tags.join(' ').toLowerCase();
      const text = [
        title,
        tags,
        topic.summary,
        categoryOf(topic).title,
        ...topic.sections.flatMap((s) => [s.heading, ...s.body, ...(s.points ?? [])]),
        ...topic.files.map((f) => f.path),
      ]
        .join(' ')
        .toLowerCase();

      if (!words.every((word) => text.includes(word))) return null;
      const score = words.reduce((sum, word) => sum + (title.includes(word) ? 2 : 0) + (tags.includes(word) ? 1 : 0), 0);
      return { topic, score };
    })
    .filter((result) => result !== null)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.topic);
}
