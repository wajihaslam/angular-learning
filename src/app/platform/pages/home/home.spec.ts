import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { Home } from './home';

describe('Home', () => {
  it('filters topics as you type and by category tab', async () => {
    TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(Home);
    const text = () => fixture.nativeElement.textContent as string;
    await fixture.whenStable();
    expect(text()).toContain('Learn Angular from');
    expect(text()).toContain('Signals');

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type=search]');
    input.value = 'switchMap';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    expect(text()).toContain('RxJS Streams: Live Search');
    expect(text()).not.toContain('Standalone Components');

    fixture.componentInstance.clearSearch();
    fixture.componentInstance.activeCategory.set('styling');
    await fixture.whenStable();
    expect(text()).toContain('Tailwind CSS v4 Setup');
    expect(text()).not.toContain('Reactive Forms & Validation');
  });
});
