import { Injectable, computed, effect, signal } from '@angular/core';

const STORAGE_KEY = 'angular-learning-platform.completed';

/** Remembers which lessons the learner has marked as done (saved in localStorage). */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly completed = signal<ReadonlySet<string>>(load());
  readonly count = computed(() => this.completed().size);

  constructor() {
    // An effect re-runs whenever a signal it reads changes, so every change is saved.
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.completed()]));
      } catch {
        // Storage can be blocked (private mode); progress then lasts for this visit only.
      }
    });
  }

  isDone(topicId: string): boolean {
    return this.completed().has(topicId);
  }

  toggle(topicId: string) {
    this.completed.update((done) => {
      const next = new Set(done);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  }
}

function load(): ReadonlySet<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}
