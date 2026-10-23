import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap, tap } from 'rxjs';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  private taskService = inject(TaskService);
  private destroyRef = inject(DestroyRef);

  tasks = signal<Task[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  editingId = signal<string | null>(null);

  form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });
  title = this.form.controls.title;
  search = new FormControl('', { nonNullable: true });

  constructor() {
    // Re-query the API whenever the search text settles for 300 ms.
    this.search.valueChanges
      .pipe(
        debounceTime(300),
        map((text) => text.trim()),
        startWith(''),
        distinctUntilChanged(),
        tap(() => {
          this.loading.set(true);
          this.error.set(null);
        }),
        switchMap((text) =>
          this.taskService.list(text).pipe(
            catchError(() => {
              this.error.set('Could not load tasks. Is the API running (npm run api)?');
              return of([]);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const title = this.title.value.trim();
    const id = this.editingId();

    if (id) {
      this.run(this.taskService.update(id, { title }), (updated) => {
        this.replace(updated);
        this.cancelEdit();
      });
    } else {
      this.run(this.taskService.add(title), (created) => {
        this.tasks.update((list) => [created, ...list]);
        this.form.reset();
      });
    }
  }

  startEdit(task: Task) {
    this.editingId.set(task.id);
    this.form.setValue({ title: task.title });
  }

  cancelEdit() {
    debugger;
    this.editingId.set(null);
    this.form.reset();
  }

  toggle(task: Task) {
    this.run(this.taskService.toggle(task), (updated) => this.replace(updated));
  }

  remove(task: Task) {
    if (!confirm(`Delete "${task.title}"?`)) {
      return;
    }
    this.run(this.taskService.remove(task.id), () => {
      this.tasks.update((list) => list.filter((t) => t.id !== task.id));
      if (this.editingId() === task.id) {
        this.cancelEdit();
      }
    });
  }

  private replace(updated: Task) {
    this.tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
  }

  private run<T>(request: Observable<T>, onSuccess: (result: T) => void) {
    this.error.set(null);
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: onSuccess,
      error: () => this.error.set('Something went wrong. Please try again.'),
    });
  }
}
