import { CurrencyPipe, DatePipe, JsonPipe, PercentPipe, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-pipes-demo',
  imports: [DatePipe, UpperCasePipe, CurrencyPipe, PercentPipe, JsonPipe],
  templateUrl: './pipes-demo.html',
})
export class PipesDemo {
  // Same ISO string format the mock API stores in createdAt.
  createdAt = '2026-10-02T10:30:00.000Z';
  price = 1234.5;
  progress = 0.42;
  task = { id: '2', title: 'Build the tasks page', done: false };
}
