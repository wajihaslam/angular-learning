import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { environment } from '../../environments/environment';
import { Task } from '../models/task';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let http: HttpTestingController;
  const url = `${environment.apiUrl}/tasks`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list() sends the search text as ?q=', () => {
    const tasks: Task[] = [{ id: '1', title: 'Learn', done: false, createdAt: '2026-10-01T00:00:00.000Z' }];
    let result: Task[] | undefined;

    service.list('learn').subscribe((res) => (result = res));

    const req = http.expectOne((r) => r.url === url);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('q')).toBe('learn');
    req.flush(tasks);

    expect(result).toEqual(tasks);
  });

  it('toggle() patches the opposite done state', () => {
    const task: Task = { id: '2', title: 'Test', done: false, createdAt: '2026-10-01T00:00:00.000Z' };

    service.toggle(task).subscribe();

    const req = http.expectOne(`${url}/2`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ done: true });
    req.flush({ ...task, done: true });
  });
});
