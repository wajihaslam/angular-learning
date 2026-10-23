import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-tailwind-demo',
  templateUrl: './tailwind-demo.html',
})
export class TailwindDemo {
  selected = signal<'primary' | 'outline' | 'ghost'>('primary');
  variants = ['primary', 'outline', 'ghost'] as const;
}
