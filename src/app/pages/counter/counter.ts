import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.html',
})
export class Counter {
  count = signal(0);

  increment() {
    this.count.update((n) => n + 1);
  }
}
