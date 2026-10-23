import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/tasks`;

  list(search = ''): Observable<Task[]> {
    let params = new HttpParams().set('_sort', 'createdAt').set('_order', 'desc');
    if (search) {
      params = params.set('q', search);
    }
    return this.http.get<Task[]>(this.url, { params });
  }

  add(title: string): Observable<Task> {
    return this.http.post<Task>(this.url, {
      title,
      done: false,
      createdAt: new Date().toISOString(),
    });
  }

  update(id: string, changes: Partial<Omit<Task, 'id'>>): Observable<Task> {
    return this.http.patch<Task>(`${this.url}/${id}`, changes);
  }

  toggle(task: Task): Observable<Task> {
    return this.update(task.id, { done: !task.done });
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
