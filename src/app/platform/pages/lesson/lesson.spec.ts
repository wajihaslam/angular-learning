import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Lesson } from './lesson';

describe('Lesson', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn(); // jsdom does not implement scrolling
    TestBed.configureTestingModule({
      imports: [Lesson],
      providers: [provideZonelessChangeDetection(), provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  function render(topicId: string, tab?: string) {
    const fixture = TestBed.createComponent(Lesson);
    fixture.componentRef.setInput('topicId', topicId);
    fixture.componentRef.setInput('tab', tab);
    fixture.detectChanges();
    return { fixture, text: () => fixture.nativeElement.textContent as string };
  }

  it('renders the lesson text and its tabs', () => {
    const { text } = render('signals');
    expect(text()).toContain('Signals');
    expect(text()).toContain('Live demo');
    expect(text()).toContain('Practice');
  });

  it('runs the real Counter component in the demo tab', async () => {
    const { fixture, text } = render('signals', 'demo');
    expect(text()).toContain('Count: 0');

    fixture.nativeElement.querySelector('.demo-surface button').click();
    await fixture.whenStable();
    expect(text()).toContain('Count: 1');
  });

  it('loads the first source file in the code tab', async () => {
    const { fixture, text } = render('signals', 'code');
    const http = TestBed.inject(HttpTestingController);

    http.expectOne('source/src/app/pages/counter/counter.ts').flush('count = signal(0);\n');
    await fixture.whenStable();

    expect(text()).toContain('count = signal(0);');
    http.verify();
  });

  it('shows a not-found message for an unknown topic', () => {
    const { text } = render('nope');
    expect(text()).toContain('Lesson "nope" not found');
  });
});
