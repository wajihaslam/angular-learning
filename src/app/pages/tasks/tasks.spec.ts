import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { Tasks } from './tasks';

describe('Tasks', () => {
  it('shows loading, then the empty state when the API returns no tasks', async () => {
    TestBed.configureTestingModule({
      imports: [Tasks],
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(Tasks);
    const http = TestBed.inject(HttpTestingController);
    const text = () => fixture.nativeElement.textContent as string;

    fixture.detectChanges();
    expect(text()).toContain('Loading...');

    http.expectOne((r) => r.url.endsWith('/tasks')).flush([]);
    await fixture.whenStable();

    expect(text()).not.toContain('Loading...');
    expect(text()).toContain('No tasks found.');
    http.verify();
  });
});
