import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-binding-demo',
  templateUrl: './binding-demo.html',
  styleUrl: './binding-demo.css',
})
export class BindingDemo {
  name = signal('Angular');
  highlighted = signal(false);
  clicks = signal(0);

  onNameInput(event: Event) {
    this.name.set((event.target as HTMLInputElement).value);
  }

  toggleHighlight() {
    this.highlighted.update((on) => !on);
  }
}
